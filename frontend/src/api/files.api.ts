import { useAuthStore } from '../store/auth.store'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function authHeaders(): Record<string, string> {
    const token = useAuthStore.getState().token
    return token ? { Authorization: `Bearer ${token}` } : {}
}

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

export interface ListFilesResult {
    currentPrefix: string
    folders: FolderEntry[]
    files: FileEntry[]
    bucketIsPublic: boolean
}

export const filesApi = {
    async list(prefix: string = ''): Promise<ListFilesResult> {
        const params = prefix ? `?prefix=${encodeURIComponent(prefix)}` : ''
        const res = await fetch(`${API_URL}/api/files${params}`, {
            headers: authHeaders(),
        })
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to list files')
        return res.json()
    },

    async upload(file: File, prefix: string = '', onProgress?: (pct: number) => void): Promise<{ key: string }> {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('prefix', prefix)

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open('POST', `${API_URL}/api/files/upload`)
            const token = useAuthStore.getState().token
            if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable && onProgress) {
                    onProgress(Math.round((e.loaded / e.total) * 100))
                }
            }
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(JSON.parse(xhr.responseText))
                } else {
                    reject(new Error(JSON.parse(xhr.responseText)?.error || 'Upload failed'))
                }
            }
            xhr.onerror = () => reject(new Error('Upload failed'))
            xhr.send(formData)
        })
    },

    async deleteFile(key: string): Promise<void> {
        const res = await fetch(`${API_URL}/api/files`, {
            method: 'DELETE',
            headers: { ...authHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ key }),
        })
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete')
    },

    async deleteFolder(prefix: string): Promise<{ deletedCount: number }> {
        const res = await fetch(`${API_URL}/api/files/folder`, {
            method: 'DELETE',
            headers: { ...authHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ prefix }),
        })
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete folder')
        return res.json()
    },

    async renameFile(oldKey: string, newKey: string): Promise<void> {
        const res = await fetch(`${API_URL}/api/files/rename`, {
            method: 'PATCH',
            headers: { ...authHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldKey, newKey }),
        })
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to rename')
    },

    async renameFolder(oldPrefix: string, newPrefix: string): Promise<{ movedCount: number }> {
        const res = await fetch(`${API_URL}/api/files/folder/rename`, {
            method: 'PATCH',
            headers: { ...authHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPrefix, newPrefix }),
        })
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to rename folder')
        return res.json()
    },

    async getViewUrl(key: string, mode: 'public' | 'presigned' | 'auto' = 'auto'): Promise<{ url: string; isPublic: boolean; expiresAt: string | null }> {
        const res = await fetch(`${API_URL}/api/files/view-url?key=${encodeURIComponent(key)}&mode=${mode}`, {
            headers: authHeaders(),
        })
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to get view URL')
        return res.json()
    },

    async getPublicStatus(): Promise<{ isPublic: boolean; publicDomain: string | null }> {
        const res = await fetch(`${API_URL}/api/files/public-status`, { headers: authHeaders() })
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to get status')
        return res.json()
    },

    async setPublicStatus(enabled: boolean): Promise<{ isPublic: boolean; publicDomain: string | null }> {
        const res = await fetch(`${API_URL}/api/files/public-status`, {
            method: 'POST',
            headers: { ...authHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ enabled }),
        })
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to update status')
        return res.json()
    },

    async setFilePublicOverride(key: string, isPublic: boolean): Promise<void> {
        const res = await fetch(`${API_URL}/api/files/public-override`, {
            method: 'POST',
            headers: { ...authHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, isPublic }),
        })
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to update file visibility')
    },
}