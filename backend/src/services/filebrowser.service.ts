import {
    S3Client,
    ListObjectsV2Command,
    PutObjectCommand,
    DeleteObjectCommand,
    DeleteObjectsCommand,
    CopyObjectCommand,
    HeadObjectCommand,
    GetObjectCommand,
    type _Object,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import axios from 'axios'
import { config } from '../config'
import { prisma } from '../db/client'
import { getBucket } from '../db/queries'
import { decrypt } from '../utils/encryption'

const PRESIGNED_URL_TTL_SECONDS = 3600 // 1 hour
const CF_API_BASE = 'https://api.cloudflare.com/client/v4'

// ── S3 client scoped to a user's bucket using their own credentials ────────
async function getUserS3Client(userId: string): Promise<{ s3: S3Client; bucketName: string } | null> {
    const bucket = await getBucket(userId)
    if (!bucket || bucket.status !== 'ACTIVE') return null
    if (!bucket.cfAccessKey || !bucket.cfSecretKey) return null

    const accessKeyId = decrypt(bucket.cfAccessKey)
    const secretAccessKey = decrypt(bucket.cfSecretKey)

    const s3 = new S3Client({
        region: 'auto',
        endpoint: `https://${config.cloudflare.accountId}.r2.cloudflarestorage.com`,
        credentials: { accessKeyId, secretAccessKey },
    })

    return { s3, bucketName: bucket.bucketName }
}

function cfApi() {
    return axios.create({
        baseURL: CF_API_BASE,
        headers: {
            Authorization: `Bearer ${config.cloudflare.apiToken}`,
            'Content-Type': 'application/json',
        },
        timeout: 15_000,
    })
}

// ═══════════════════════════════════════════════════════════════════════════
// BUCKET-LEVEL PUBLIC ACCESS — toggles R2's "Public Development URL"
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Enables or disables R2's public development URL for a bucket.
 * When enabled, files are accessible at https://pub-{hash}.r2.dev/{key}
 * with no auth required — anyone with the URL can view the file.
 */
export async function setBucketPublicAccess(userId: string, enabled: boolean): Promise<{ isPublic: boolean; publicDomain: string | null }> {
    const bucket = await getBucket(userId)
    if (!bucket) throw new Error('NO_BUCKET')

    const api = cfApi()

    try {
        const res = await api.put(
            `/accounts/${config.cloudflare.accountId}/r2/buckets/${bucket.bucketName}/domains/managed`,
            { enabled }
        )

        const publicDomain = enabled
            ? (res.data?.result?.domain ?? `pub-${bucket.bucketName}.r2.dev`)
            : null

        await prisma.bucket.update({
            where: { userId },
            data: { isPublic: enabled, publicDomain },
        })

        console.log(`[filebrowser] Bucket ${bucket.bucketName} public access: ${enabled}`)
        return { isPublic: enabled, publicDomain }
    } catch (err: any) {
        console.error('[filebrowser] Failed to toggle public access:', err.response?.data ?? err.message)
        throw new Error('PUBLIC_ACCESS_TOGGLE_FAILED')
    }
}

export async function getBucketPublicStatus(userId: string): Promise<{ isPublic: boolean; publicDomain: string | null }> {
    const bucket = await getBucket(userId)
    if (!bucket) throw new Error('NO_BUCKET')
    return { isPublic: bucket.isPublic ?? false, publicDomain: bucket.publicDomain ?? null }
}

// ═══════════════════════════════════════════════════════════════════════════
// PER-FILE PUBLIC OVERRIDE — for when bucket is private but one file isn't
// ═══════════════════════════════════════════════════════════════════════════

export async function setFilePublicOverride(userId: string, fileKey: string, isPublic: boolean): Promise<void> {
    await prisma.filePublicOverride.upsert({
        where: { userId_fileKey: { userId, fileKey } },
        create: { userId, fileKey, isPublic },
        update: { isPublic },
    })
}

async function getFilePublicOverrides(userId: string, keys: string[]): Promise<Map<string, boolean>> {
    if (keys.length === 0) return new Map()
    const rows = await prisma.filePublicOverride.findMany({
        where: { userId, fileKey: { in: keys } },
    })
    return new Map(rows.map(r => [r.fileKey, r.isPublic]))
}

// ═══════════════════════════════════════════════════════════════════════════
// LIST — files and folders within a given prefix
// ═══════════════════════════════════════════════════════════════════════════

export interface FileEntry {
    key: string
    name: string
    size: number
    lastModified: string | null
    isPublic: boolean
}

export interface FolderEntry {
    prefix: string
    name: string
}

export interface ListResult {
    currentPrefix: string
    folders: FolderEntry[]
    files: FileEntry[]
    bucketIsPublic: boolean
}

export async function listFiles(userId: string, prefix: string = ''): Promise<ListResult> {
    const client = await getUserS3Client(userId)
    if (!client) throw new Error('NO_BUCKET')

    const bucket = await getBucket(userId)
    const bucketIsPublic = bucket?.isPublic ?? false

    const { s3, bucketName } = client
    const normalizedPrefix = prefix && !prefix.endsWith('/') ? `${prefix}/` : prefix

    const res = await s3.send(new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: normalizedPrefix,
        Delimiter: '/',
    }))

    const folders: FolderEntry[] = (res.CommonPrefixes ?? []).map(cp => {
        const fullPrefix = cp.Prefix ?? ''
        const trimmed = fullPrefix.replace(normalizedPrefix, '').replace(/\/$/, '')
        return { prefix: fullPrefix, name: trimmed }
    })

    const rawFiles = (res.Contents ?? []).filter((obj: _Object) => obj.Key !== normalizedPrefix)
    const keys = rawFiles.map(f => f.Key ?? '')
    const overrides = await getFilePublicOverrides(userId, keys)

    const files: FileEntry[] = rawFiles.map((obj: _Object) => {
        const key = obj.Key ?? ''
        // A file is publicly viewable if: bucket is public AND no override says private,
        // OR bucket is private but this specific file has an override saying public
        const override = overrides.get(key)
        const isPublic = override !== undefined ? override : bucketIsPublic

        return {
            key,
            name: key.replace(normalizedPrefix, ''),
            size: obj.Size ?? 0,
            lastModified: obj.LastModified ? obj.LastModified.toISOString() : null,
            isPublic,
        }
    })

    return { currentPrefix: normalizedPrefix, folders, files, bucketIsPublic }
}

// ═══════════════════════════════════════════════════════════════════════════
// UPLOAD
// ═══════════════════════════════════════════════════════════════════════════

export async function uploadFile(
    userId: string,
    key: string,
    buffer: Buffer,
    contentType: string
): Promise<void> {
    const client = await getUserS3Client(userId)
    if (!client) throw new Error('NO_BUCKET')

    const { s3, bucketName } = client

    await s3.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
    }))
}

// ═══════════════════════════════════════════════════════════════════════════
// DELETE
// ═══════════════════════════════════════════════════════════════════════════

export async function deleteFile(userId: string, key: string): Promise<void> {
    const client = await getUserS3Client(userId)
    if (!client) throw new Error('NO_BUCKET')

    const { s3, bucketName } = client
    await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }))

    // Clean up any public override row for this file
    await prisma.filePublicOverride.deleteMany({ where: { userId, fileKey: key } }).catch(() => { })
}

export async function deleteFolder(userId: string, prefix: string): Promise<{ deletedCount: number }> {
    const client = await getUserS3Client(userId)
    if (!client) throw new Error('NO_BUCKET')

    const { s3, bucketName } = client
    const normalizedPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`

    let deletedCount = 0
    let continuationToken: string | undefined

    do {
        const listRes = await s3.send(new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: normalizedPrefix,
            ContinuationToken: continuationToken,
            MaxKeys: 1000,
        }))

        const objects = (listRes.Contents ?? []).map(o => ({ Key: o.Key! }))

        if (objects.length > 0) {
            await s3.send(new DeleteObjectsCommand({
                Bucket: bucketName,
                Delete: { Objects: objects },
            }))
            deletedCount += objects.length

            // Clean up overrides for all deleted keys
            await prisma.filePublicOverride.deleteMany({
                where: { userId, fileKey: { in: objects.map(o => o.Key) } },
            }).catch(() => { })
        }

        continuationToken = listRes.NextContinuationToken
    } while (continuationToken)

    return { deletedCount }
}

// ═══════════════════════════════════════════════════════════════════════════
// RENAME / MOVE
// ═══════════════════════════════════════════════════════════════════════════

export async function renameFile(userId: string, oldKey: string, newKey: string): Promise<void> {
    const client = await getUserS3Client(userId)
    if (!client) throw new Error('NO_BUCKET')

    const { s3, bucketName } = client

    await s3.send(new CopyObjectCommand({
        Bucket: bucketName,
        CopySource: `${bucketName}/${encodeURIComponent(oldKey)}`,
        Key: newKey,
    }))

    await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: oldKey }))

    // Migrate public override if one existed
    const existing = await prisma.filePublicOverride.findUnique({
        where: { userId_fileKey: { userId, fileKey: oldKey } },
    })
    if (existing) {
        await prisma.filePublicOverride.create({
            data: { userId, fileKey: newKey, isPublic: existing.isPublic },
        }).catch(() => { })
        await prisma.filePublicOverride.delete({ where: { id: existing.id } }).catch(() => { })
    }
}

export async function renameFolder(userId: string, oldPrefix: string, newPrefix: string): Promise<{ movedCount: number }> {
    const client = await getUserS3Client(userId)
    if (!client) throw new Error('NO_BUCKET')

    const { s3, bucketName } = client
    const normOld = oldPrefix.endsWith('/') ? oldPrefix : `${oldPrefix}/`
    const normNew = newPrefix.endsWith('/') ? newPrefix : `${newPrefix}/`

    let movedCount = 0
    let continuationToken: string | undefined

    do {
        const listRes = await s3.send(new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: normOld,
            ContinuationToken: continuationToken,
            MaxKeys: 1000,
        }))

        for (const obj of listRes.Contents ?? []) {
            const oldKey = obj.Key!
            const newKey = oldKey.replace(normOld, normNew)

            await s3.send(new CopyObjectCommand({
                Bucket: bucketName,
                CopySource: `${bucketName}/${encodeURIComponent(oldKey)}`,
                Key: newKey,
            }))
            await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: oldKey }))
            movedCount++
        }

        continuationToken = listRes.NextContinuationToken
    } while (continuationToken)

    return { movedCount }
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEW URLs
// ═══════════════════════════════════════════════════════════════════════════

export async function getPresignedViewUrl(userId: string, key: string): Promise<string> {
    const client = await getUserS3Client(userId)
    if (!client) throw new Error('NO_BUCKET')

    const { s3, bucketName } = client
    const command = new GetObjectCommand({ Bucket: bucketName, Key: key })

    return getSignedUrl(s3, command, { expiresIn: PRESIGNED_URL_TTL_SECONDS })
}

export function buildPublicUrl(publicDomain: string, key: string): string {
    return `https://${publicDomain}/${key}`
}

/**
 * Returns the appropriate view URL based on requested mode.
 * 'auto' picks public URL if the bucket/file is public, otherwise presigned.
 */
export async function getViewUrl(
    userId: string,
    key: string,
    mode: 'public' | 'presigned' | 'auto' = 'auto'
): Promise<{ url: string; isPublic: boolean; expiresAt: string | null }> {
    const bucket = await getBucket(userId)
    if (!bucket) throw new Error('NO_BUCKET')

    const override = await prisma.filePublicOverride.findUnique({
        where: { userId_fileKey: { userId, fileKey: key } },
    })
    const fileIsPublic = override !== null ? override.isPublic : (bucket.isPublic ?? false)

    const wantsPublic = mode === 'public' || (mode === 'auto' && fileIsPublic)

    if (wantsPublic) {
        if (!bucket.publicDomain) {
            throw new Error('BUCKET_NOT_PUBLIC')
        }
        return { url: buildPublicUrl(bucket.publicDomain, key), isPublic: true, expiresAt: null }
    }

    const url = await getPresignedViewUrl(userId, key)
    const expiresAt = new Date(Date.now() + PRESIGNED_URL_TTL_SECONDS * 1000).toISOString()
    return { url, isPublic: false, expiresAt }
}

// ═══════════════════════════════════════════════════════════════════════════
// FILE METADATA
// ═══════════════════════════════════════════════════════════════════════════

export async function getFileMetadata(userId: string, key: string) {
    const client = await getUserS3Client(userId)
    if (!client) throw new Error('NO_BUCKET')

    const { s3, bucketName } = client
    const res = await s3.send(new HeadObjectCommand({ Bucket: bucketName, Key: key }))

    return {
        key,
        size: res.ContentLength ?? 0,
        contentType: res.ContentType ?? 'application/octet-stream',
        lastModified: res.LastModified?.toISOString() ?? null,
        etag: res.ETag,
    }
}