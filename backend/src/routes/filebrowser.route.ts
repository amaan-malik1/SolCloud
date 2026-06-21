import { Router, type Request, type Response } from 'express'
import multer from 'multer'
import { authMiddleware } from '../middleware/auth.middleware'
import {
    listFiles,
    uploadFile,
    deleteFile,
    deleteFolder,
    renameFile,
    renameFolder,
    getViewUrl,
    getFileMetadata,
    setBucketPublicAccess,
    getBucketPublicStatus,
    setFilePublicOverride,
} from '../services/filebrowser.service'

const router = Router()

// In-memory upload, max 100MB per file — adjust as needed
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 },
})

function handleError(err: any, res: Response) {
    const msg = err instanceof Error ? err.message : 'UNKNOWN'
    if (msg === 'NO_BUCKET') {
        res.status(404).json({ error: 'No storage provisioned yet', code: 'NO_BUCKET' })
        return
    }
    if (msg === 'BUCKET_NOT_PUBLIC') {
        res.status(400).json({ error: 'This file/bucket is not public. Enable public access first.', code: 'NOT_PUBLIC' })
        return
    }
    if (msg === 'PUBLIC_ACCESS_TOGGLE_FAILED') {
        res.status(502).json({ error: 'Failed to update public access on Cloudflare', code: 'CF_ERROR' })
        return
    }
    console.error('[filebrowser]', err)
    res.status(500).json({ error: 'File operation failed' })
}

// ── GET /api/files?prefix=folder/ ───────────────────────────────────────────
router.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const prefix = typeof req.query.prefix === 'string' ? req.query.prefix : ''
        const result = await listFiles((req as any).user.userId, prefix)
        res.json(result)
    } catch (err) {
        handleError(err, res)
    }
})

// ── POST /api/files/upload — multipart form upload ─────────────────────────
router.post('/upload', authMiddleware, upload.single('file'), async (req: Request, res: Response) => {
    const file = (req as any).file
    const prefix = typeof req.body.prefix === 'string' ? req.body.prefix : ''

    if (!file) {
        res.status(400).json({ error: 'No file provided' })
        return
    }

    try {
        const key = prefix ? `${prefix}${prefix.endsWith('/') ? '' : '/'}${file.originalname}` : file.originalname
        await uploadFile((req as any).user.userId, key, file.buffer, file.mimetype)
        res.status(201).json({ key, size: file.size, message: 'Uploaded successfully' })
    } catch (err) {
        handleError(err, res)
    }
})

// ── DELETE /api/files — single file ─────────────────────────────────────────
router.delete('/', authMiddleware, async (req: Request, res: Response) => {
    const { key } = req.body
    if (!key) {
        res.status(400).json({ error: 'File key required' })
        return
    }
    try {
        await deleteFile((req as any).user.userId, key)
        res.json({ message: 'Deleted successfully' })
    } catch (err) {
        handleError(err, res)
    }
})

// ── DELETE /api/files/folder — deletes all files under a prefix ────────────
router.delete('/folder', authMiddleware, async (req: Request, res: Response) => {
    const { prefix } = req.body
    if (!prefix) {
        res.status(400).json({ error: 'Folder prefix required' })
        return
    }
    try {
        const result = await deleteFolder((req as any).user.userId, prefix)
        res.json({ message: `Deleted ${result.deletedCount} file(s)`, ...result })
    } catch (err) {
        handleError(err, res)
    }
})

// ── PATCH /api/files/rename — rename a single file ──────────────────────────
router.patch('/rename', authMiddleware, async (req: Request, res: Response) => {
    const { oldKey, newKey } = req.body
    if (!oldKey || !newKey) {
        res.status(400).json({ error: 'oldKey and newKey required' })
        return
    }
    try {
        await renameFile((req as any).user.userId, oldKey, newKey)
        res.json({ message: 'Renamed successfully', newKey })
    } catch (err) {
        handleError(err, res)
    }
})

// ── PATCH /api/files/folder/rename — rename a folder (recursive) ───────────
router.patch('/folder/rename', authMiddleware, async (req: Request, res: Response) => {
    const { oldPrefix, newPrefix } = req.body
    if (!oldPrefix || !newPrefix) {
        res.status(400).json({ error: 'oldPrefix and newPrefix required' })
        return
    }
    try {
        const result = await renameFolder((req as any).user.userId, oldPrefix, newPrefix)
        res.json({ message: `Moved ${result.movedCount} file(s)`, ...result })
    } catch (err) {
        handleError(err, res)
    }
})

// ── GET /api/files/view-url?key=xxx&mode=auto|public|presigned ─────────────
router.get('/view-url', authMiddleware, async (req: Request, res: Response) => {
    const key = req.query.key as string
    const mode = (req.query.mode as 'public' | 'presigned' | 'auto') || 'auto'

    if (!key) {
        res.status(400).json({ error: 'File key required' })
        return
    }
    try {
        const result = await getViewUrl((req as any).user.userId, key, mode)
        res.json(result)
    } catch (err) {
        handleError(err, res)
    }
})

// ── GET /api/files/metadata?key=xxx ─────────────────────────────────────────
router.get('/metadata', authMiddleware, async (req: Request, res: Response) => {
    const key = req.query.key as string
    if (!key) {
        res.status(400).json({ error: 'File key required' })
        return
    }
    try {
        const meta = await getFileMetadata((req as any).user.userId, key)
        res.json(meta)
    } catch (err) {
        handleError(err, res)
    }
})

// ── GET /api/files/public-status — bucket-level public access state ────────
router.get('/public-status', authMiddleware, async (req: Request, res: Response) => {
    try {
        const status = await getBucketPublicStatus((req as any).user.userId)
        res.json(status)
    } catch (err) {
        handleError(err, res)
    }
})

// ── POST /api/files/public-status — toggle bucket public access ───────────
router.post('/public-status', authMiddleware, async (req: Request, res: Response) => {
    const { enabled } = req.body
    if (typeof enabled !== 'boolean') {
        res.status(400).json({ error: 'enabled must be true or false' })
        return
    }
    try {
        const result = await setBucketPublicAccess((req as any).user.userId, enabled)
        res.json(result)
    } catch (err) {
        handleError(err, res)
    }
})

// ── POST /api/files/public-override — per-file public toggle ───────────────
router.post('/public-override', authMiddleware, async (req: Request, res: Response) => {
    const { key, isPublic } = req.body
    if (!key || typeof isPublic !== 'boolean') {
        res.status(400).json({ error: 'key and isPublic required' })
        return
    }
    try {
        await setFilePublicOverride((req as any).user.userId, key, isPublic)
        res.json({ message: 'Updated', key, isPublic })
    } catch (err) {
        handleError(err, res)
    }
})

export default router