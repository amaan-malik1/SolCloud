import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { filesApi } from '../api/files.api'

export function useFileList(prefix: string) {
    return useQuery({
        queryKey: ['files', prefix],
        queryFn: () => filesApi.list(prefix),
        staleTime: 10_000,
    })
}

export function usePublicStatus() {
    return useQuery({
        queryKey: ['files-public-status'],
        queryFn: () => filesApi.getPublicStatus(),
    })
}

export function useFileMutations(currentPrefix: string) {
    const queryClient = useQueryClient()

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['files', currentPrefix] })

    const deleteFile = useMutation({
        mutationFn: (key: string) => filesApi.deleteFile(key),
        onSuccess: () => {
            toast.success('File deleted')
            invalidate()
        },
        onError: (err: Error) => toast.error(err.message),
    })

    const deleteFolder = useMutation({
        mutationFn: (prefix: string) => filesApi.deleteFolder(prefix),
        onSuccess: (result) => {
            toast.success(`Deleted ${result.deletedCount} file(s)`)
            invalidate()
        },
        onError: (err: Error) => toast.error(err.message),
    })

    const renameFile = useMutation({
        mutationFn: ({ oldKey, newKey }: { oldKey: string; newKey: string }) => filesApi.renameFile(oldKey, newKey),
        onSuccess: () => {
            toast.success('Renamed')
            invalidate()
        },
        onError: (err: Error) => toast.error(err.message),
    })

    const renameFolder = useMutation({
        mutationFn: ({ oldPrefix, newPrefix }: { oldPrefix: string; newPrefix: string }) => filesApi.renameFolder(oldPrefix, newPrefix),
        onSuccess: (result) => {
            toast.success(`Moved ${result.movedCount} file(s)`)
            invalidate()
        },
        onError: (err: Error) => toast.error(err.message),
    })

    const setFileVisibility = useMutation({
        mutationFn: ({ key, isPublic }: { key: string; isPublic: boolean }) => filesApi.setFilePublicOverride(key, isPublic),
        onSuccess: () => {
            toast.success('Visibility updated')
            invalidate()
        },
        onError: (err: Error) => toast.error(err.message),
    })

    return { deleteFile, deleteFolder, renameFile, renameFolder, setFileVisibility }
}

export function useFileUpload(currentPrefix: string) {
    const queryClient = useQueryClient()
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)

    async function upload(file: File) {
        setUploading(true)
        setProgress(0)
        try {
            await filesApi.upload(file, currentPrefix, setProgress)
            toast.success(`Uploaded ${file.name}`)
            queryClient.invalidateQueries({ queryKey: ['files', currentPrefix] })
        } catch (err: any) {
            toast.error(err.message || 'Upload failed')
        } finally {
            setUploading(false)
            setProgress(0)
        }
    }

    return { upload, uploading, progress }
}