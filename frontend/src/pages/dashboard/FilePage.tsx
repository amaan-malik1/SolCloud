import { useState, useRef, useCallback } from 'react'
import {
    Folder, File, Image, Upload, Trash2, Edit2, Copy, ExternalLink,
    Globe, Lock, ChevronRight, Home, X, Loader2, FolderPlus,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useFileList, usePublicStatus, useFileMutations, useFileUpload } from '../../hooks/useFiles'
import { filesApi, type FileEntry, type FolderEntry } from '../../api/files.api'

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B'
    const units = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
}

function isImageFile(name: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(name)
}

export default function FilesPage() {
    const [currentPrefix, setCurrentPrefix] = useState('')
    const [renameTarget, setRenameTarget] = useState<{ key: string; name: string; isFolder: boolean } | null>(null)
    const [renameValue, setRenameValue] = useState('')
    const [deleteTarget, setDeleteTarget] = useState<{ key: string; name: string; isFolder: boolean } | null>(null)
    const [viewModalFile, setViewModalFile] = useState<FileEntry | null>(null)
    const [dragOver, setDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { data, isLoading, error } = useFileList(currentPrefix)
    const { data: publicStatus } = usePublicStatus()
    const { deleteFile, deleteFolder, renameFile, renameFolder, setFileVisibility } = useFileMutations(currentPrefix)
    const { upload, uploading, progress } = useFileUpload(currentPrefix)

    const breadcrumbs = currentPrefix
        ? currentPrefix.replace(/\/$/, '').split('/').filter(Boolean)
        : []

    function navigateToPrefix(parts: string[]) {
        setCurrentPrefix(parts.length ? parts.join('/') + '/' : '')
    }

    function openFolder(folder: FolderEntry) {
        setCurrentPrefix(folder.prefix)
    }

    // ── Drag and drop upload ──────────────────────────────────────────────
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const files = Array.from(e.dataTransfer.files)
        files.forEach(f => upload(f))
    }, [upload])

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? [])
        files.forEach(f => upload(f))
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    // ── View / get URL ──────────────────────────────────────────────────────
    async function handleView(file: FileEntry) {
        setViewModalFile(file)
    }

    async function handleCopyUrl(file: FileEntry, mode: 'auto' | 'public' | 'presigned') {
        try {
            const result = await filesApi.getViewUrl(file.key, mode)
            await navigator.clipboard.writeText(result.url)
            toast.success(result.isPublic ? 'Public URL copied' : 'Temporary URL copied (expires in 1hr)')
        } catch (err: any) {
            toast.error(err.message || 'Failed to get URL')
        }
    }

    // ── Rename ──────────────────────────────────────────────────────────────
    function openRename(key: string, name: string, isFolder: boolean) {
        setRenameTarget({ key, name, isFolder })
        setRenameValue(name)
    }

    function submitRename() {
        if (!renameTarget || !renameValue.trim()) return

        if (renameTarget.isFolder) {
            const oldPrefix = renameTarget.key
            const parentPath = currentPrefix
            const newPrefix = `${parentPath}${renameValue.trim()}/`
            renameFolder.mutate({ oldPrefix, newPrefix })
        } else {
            const newKey = `${currentPrefix}${renameValue.trim()}`
            renameFile.mutate({ oldKey: renameTarget.key, newKey })
        }
        setRenameTarget(null)
    }

    // ── Delete ──────────────────────────────────────────────────────────────
    function confirmDelete() {
        if (!deleteTarget) return
        if (deleteTarget.isFolder) {
            deleteFolder.mutate(deleteTarget.key)
        } else {
            deleteFile.mutate(deleteTarget.key)
        }
        setDeleteTarget(null)
    }

    const isEmpty = !isLoading && data && data.folders.length === 0 && data.files.length === 0

    return (
        <div style={{ padding: '0 0 40px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 700, color: '#fff', margin: 0 }}>
                        Files
                    </h1>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '4px 0 0', fontFamily: 'DM Sans, sans-serif' }}>
                        Browse, upload, and manage your R2 storage
                    </p>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {/* Bucket public toggle */}
                    <PublicToggle isPublic={publicStatus?.isPublic ?? false} />

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '9px 16px', borderRadius: 10,
                            background: 'linear-gradient(135deg,#9945FF,#7233cc)',
                            color: '#fff', border: 'none', fontSize: 13, fontWeight: 600,
                            cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1,
                            fontFamily: 'DM Sans, sans-serif',
                        }}
                    >
                        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        {uploading ? `Uploading ${progress}%` : 'Upload'}
                    </button>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 20, fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>
                <button
                    onClick={() => navigateToPrefix([])}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none',
                        color: currentPrefix ? 'rgba(255,255,255,0.5)' : '#fff', cursor: 'pointer', padding: '4px 6px',
                    }}
                >
                    <Home size={13} /> Root
                </button>
                {breadcrumbs.map((part, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.2)' }} />
                        <button
                            onClick={() => navigateToPrefix(breadcrumbs.slice(0, i + 1))}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px',
                                color: i === breadcrumbs.length - 1 ? '#fff' : 'rgba(255,255,255,0.5)',
                            }}
                        >
                            {part}
                        </button>
                    </span>
                ))}
            </div>

            {/* Drop zone wrapper */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{
                    border: dragOver ? '2px dashed #9945FF' : '2px dashed transparent',
                    borderRadius: 16, transition: 'border-color 0.15s', minHeight: 300,
                    background: dragOver ? 'rgba(153,69,255,0.04)' : 'transparent',
                }}
            >
                {isLoading && (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.3)' }}>
                        <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto' }} />
                    </div>
                )}

                {error && (
                    <div style={{
                        textAlign: 'center', padding: '60px 24px', borderRadius: 16,
                        background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)',
                    }}>
                        <p style={{ color: '#f87171', fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>
                            {(error as Error).message === 'No storage provisioned yet'
                                ? 'No storage provisioned yet. Send SOL to get started.'
                                : 'Failed to load files'}
                        </p>
                    </div>
                )}

                {isEmpty && !error && (
                    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                        <Folder size={40} style={{ color: 'rgba(255,255,255,0.15)', margin: '0 auto 16px' }} />
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif', marginBottom: 4 }}>
                            This folder is empty
                        </p>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', fontFamily: 'DM Sans, sans-serif' }}>
                            Drag files here or click Upload
                        </p>
                    </div>
                )}

                {data && (data.folders.length > 0 || data.files.length > 0) && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                        gap: 12,
                    }}>
                        {data.folders.map(folder => (
                            <FolderCard key={folder.prefix} folder={folder}
                                onOpen={() => openFolder(folder)}
                                onRename={() => openRename(folder.prefix, folder.name, true)}
                                onDelete={() => setDeleteTarget({ key: folder.prefix, name: folder.name, isFolder: true })}
                            />
                        ))}
                        {data.files.map(file => (
                            <FileCard key={file.key} file={file}
                                onView={() => handleView(file)}
                                onCopyUrl={() => handleCopyUrl(file, 'auto')}
                                onRename={() => openRename(file.key, file.name, false)}
                                onDelete={() => setDeleteTarget({ key: file.key, name: file.name, isFolder: false })}
                                onTogglePublic={(isPublic) => setFileVisibility.mutate({ key: file.key, isPublic })}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Rename modal */}
            {renameTarget && (
                <Modal onClose={() => setRenameTarget(null)} title={`Rename ${renameTarget.isFolder ? 'folder' : 'file'}`}>
                    <input
                        autoFocus
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && submitRename()}
                        style={{
                            width: '100%', padding: '10px 14px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff', fontSize: 14, marginBottom: 16, fontFamily: 'DM Sans, sans-serif',
                        }}
                    />
                    <ModalActions onCancel={() => setRenameTarget(null)} onConfirm={submitRename} confirmLabel="Rename" />
                </Modal>
            )}

            {/* Delete confirm modal */}
            {deleteTarget && (
                <Modal onClose={() => setDeleteTarget(null)} title={`Delete ${deleteTarget.isFolder ? 'folder' : 'file'}?`}>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 20, fontFamily: 'DM Sans, sans-serif' }}>
                        {deleteTarget.isFolder
                            ? `This will permanently delete "${deleteTarget.name}" and everything inside it. This cannot be undone.`
                            : `"${deleteTarget.name}" will be permanently deleted. This cannot be undone.`}
                    </p>
                    <ModalActions onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} confirmLabel="Delete" danger />
                </Modal>
            )}

            {/* View modal */}
            {viewModalFile && (
                <ViewModal file={viewModalFile} onClose={() => setViewModalFile(null)} onCopyUrl={handleCopyUrl} />
            )}
        </div>
    )
}

// ── Folder card ───────────────────────────────────────────────────────────
function FolderCard({ folder, onOpen, onRename, onDelete }: {
    folder: FolderEntry; onOpen: () => void; onRename: () => void; onDelete: () => void
}) {
    const [hover, setHover] = useState(false)
    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                position: 'relative', padding: '20px 14px', borderRadius: 14,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer', transition: 'background 0.15s',
            }}
            onClick={onOpen}
        >
            <Folder size={28} style={{ color: '#9945FF', marginBottom: 10 }} />
            <p style={{
                fontSize: 12.5, color: '#fff', fontFamily: 'DM Sans, sans-serif', margin: 0,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
                {folder.name}
            </p>

            {hover && (
                <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
                    <IconBtn onClick={(e) => { e.stopPropagation(); onRename() }} icon={<Edit2 size={12} />} />
                    <IconBtn onClick={(e) => { e.stopPropagation(); onDelete() }} icon={<Trash2 size={12} />} danger />
                </div>
            )}
        </div>
    )
}

// ── File card ─────────────────────────────────────────────────────────────
function FileCard({ file, onView, onCopyUrl, onRename, onDelete, onTogglePublic }: {
    file: FileEntry
    onView: () => void
    onCopyUrl: () => void
    onRename: () => void
    onDelete: () => void
    onTogglePublic: (isPublic: boolean) => void
}) {
    const [hover, setHover] = useState(false)
    const isImage = isImageFile(file.name)

    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                position: 'relative', borderRadius: 14, overflow: 'hidden',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
            }}
            onClick={onView}
        >
            <div style={{
                height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.02)',
            }}>
                {isImage ? <Image size={26} style={{ color: '#14F195' }} /> : <File size={26} style={{ color: 'rgba(255,255,255,0.3)' }} />}
            </div>

            <div style={{ padding: '10px 12px' }}>
                <p style={{
                    fontSize: 12.5, color: '#fff', fontFamily: 'DM Sans, sans-serif', margin: '0 0 2px',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                    {file.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Sans, sans-serif' }}>
                        {formatBytes(file.size)}
                    </span>
                    {file.isPublic
                        ? <Globe size={11} style={{ color: '#14F195' }} />
                        : <Lock size={11} style={{ color: 'rgba(255,255,255,0.25)' }} />}
                </div>
            </div>

            {hover && (
                <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
                    <IconBtn onClick={(e) => { e.stopPropagation(); onCopyUrl() }} icon={<Copy size={12} />} />
                    <IconBtn onClick={(e) => { e.stopPropagation(); onTogglePublic(!file.isPublic) }}
                        icon={file.isPublic ? <Lock size={12} /> : <Globe size={12} />} />
                    <IconBtn onClick={(e) => { e.stopPropagation(); onRename() }} icon={<Edit2 size={12} />} />
                    <IconBtn onClick={(e) => { e.stopPropagation(); onDelete() }} icon={<Trash2 size={12} />} danger />
                </div>
            )}
        </div>
    )
}

function IconBtn({ onClick, icon, danger }: { onClick: (e: React.MouseEvent) => void; icon: React.ReactNode; danger?: boolean }) {
    return (
        <button
            onClick={onClick}
            style={{
                width: 22, height: 22, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer',
                color: danger ? '#f87171' : 'rgba(255,255,255,0.7)',
            }}
        >
            {icon}
        </button>
    )
}

// ── Bucket-level public toggle ───────────────────────────────────────────
function PublicToggle({ isPublic }: { isPublic: boolean }) {
    const [loading, setLoading] = useState(false)
    const [enabled, setEnabled] = useState(isPublic)

    async function toggle() {
        setLoading(true)
        try {
            const result = await filesApi.setPublicStatus(!enabled)
            setEnabled(result.isPublic)
            toast.success(result.isPublic ? 'Bucket is now public' : 'Bucket is now private')
        } catch (err: any) {
            toast.error(err.message || 'Failed to update')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={toggle}
            disabled={loading}
            style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '9px 14px', borderRadius: 10,
                background: enabled ? 'rgba(20,241,149,0.08)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${enabled ? 'rgba(20,241,149,0.25)' : 'rgba(255,255,255,0.08)'}`,
                color: enabled ? '#14F195' : 'rgba(255,255,255,0.5)',
                fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
            }}
        >
            {enabled ? <Globe size={13} /> : <Lock size={13} />}
            {enabled ? 'Bucket public' : 'Bucket private'}
        </button>
    )
}

// ── Generic modal shell ───────────────────────────────────────────────────
function Modal({ children, title, onClose }: { children: React.ReactNode; title: string; onClose: () => void }) {
    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24,
            }}
        >
            <div onClick={e => e.stopPropagation()} style={{
                background: '#13131f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18,
                padding: 24, width: '100%', maxWidth: 380,
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0, fontFamily: 'Syne, sans-serif' }}>{title}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                        <X size={18} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

function ModalActions({ onCancel, onConfirm, confirmLabel, danger }: {
    onCancel: () => void; onConfirm: () => void; confirmLabel: string; danger?: boolean
}) {
    return (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={onCancel} style={{
                padding: '9px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)',
                fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
            }}>
                Cancel
            </button>
            <button onClick={onConfirm} style={{
                padding: '9px 16px', borderRadius: 10,
                background: danger ? '#dc2626' : 'linear-gradient(135deg,#9945FF,#7233cc)',
                border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
            }}>
                {confirmLabel}
            </button>
        </div>
    )
}

// ── View file modal ────────────────────────────────────────────────────────
function ViewModal({ file, onClose, onCopyUrl }: {
    file: FileEntry; onClose: () => void; onCopyUrl: (file: FileEntry, mode: 'auto' | 'public' | 'presigned') => void
}) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const isImage = isImageFile(file.name)

    useState(() => {
        if (isImage) {
            filesApi.getViewUrl(file.key, 'auto').then(r => setPreviewUrl(r.url)).catch(() => { })
        }
    })

    return (
        <Modal onClose={onClose} title={file.name}>
            {isImage && previewUrl && (
                <img src={previewUrl} alt={file.name} style={{
                    width: '100%', maxHeight: 280, objectFit: 'contain', borderRadius: 10, marginBottom: 16,
                    background: 'rgba(255,255,255,0.03)',
                }} />
            )}

            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 16, fontFamily: 'DM Sans, sans-serif' }}>
                {formatBytes(file.size)} · {file.isPublic ? 'Public' : 'Private'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={() => onCopyUrl(file, 'auto')} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '10px', borderRadius: 10, background: 'rgba(153,69,255,0.1)',
                    border: '1px solid rgba(153,69,255,0.25)', color: '#9945FF', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                }}>
                    <Copy size={14} /> Copy URL
                </button>
                {previewUrl && (
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 13,
                        textDecoration: 'none', fontFamily: 'DM Sans, sans-serif',
                    }}>
                        <ExternalLink size={14} /> Open in new tab
                    </a>
                )}
            </div>
        </Modal>
    )
}