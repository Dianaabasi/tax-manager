'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { DocumentFile } from '@/utils/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    FileText,
    Image as ImageIcon,
    Trash2,
    File,
    CloudUpload,
    Loader2,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

function getFileIcon(type: string) {
    if (type.startsWith('image/')) return ImageIcon;
    if (type === 'application/pdf') return FileText;
    return File;
}

export default function DocumentVault() {
    const [files, setFiles] = useState<DocumentFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dragActive, setDragActive] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const currentYear = new Date().getFullYear();

    // Load existing files
    const loadFiles = useCallback(async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.storage
            .from('tax_documents')
            .list(`${user.id}/${currentYear}`, {
                sortBy: { column: 'created_at', order: 'desc' },
            });

        if (error) {
            // Bucket may not exist yet — silently show empty state
            setLoading(false);
            return;
        }

        if (data) {
            setFiles(
                data
                    .filter((f) => f.name !== '.emptyFolderPlaceholder')
                    .map((f) => ({
                        name: f.name,
                        size: f.metadata?.size ?? 0,
                        type: f.metadata?.mimetype ?? 'application/octet-stream',
                        path: `${user.id}/${currentYear}/${f.name}`,
                        uploadedAt: f.created_at ?? new Date().toISOString(),
                    }))
            );
        }
        setLoading(false);
    }, [currentYear]);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    const uploadFiles = async (fileList: FileList | File[]) => {
        setUploading(true);
        setUploadStatus(null);

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setUploading(false);
            setUploadStatus({ type: 'error', message: 'You must be logged in to upload files.' });
            return;
        }

        const filesToUpload = Array.from(fileList);
        const maxSize = 10 * 1024 * 1024; // 10 MB

        // Validate file sizes
        const oversized = filesToUpload.filter((f) => f.size > maxSize);
        if (oversized.length > 0) {
            setUploading(false);
            setUploadStatus({ type: 'error', message: `File "${oversized[0].name}" exceeds the 10 MB limit.` });
            return;
        }

        let failedCount = 0;
        for (const file of filesToUpload) {
            const filePath = `${user.id}/${currentYear}/${file.name}`;
            const { error } = await supabase.storage
                .from('tax_documents')
                .upload(filePath, file, { upsert: true });

            if (error) {
                console.error('Upload error for', file.name, ':', error.message);
                failedCount++;
            }
        }

        if (failedCount > 0) {
            setUploadStatus({
                type: 'error',
                message: `${failedCount} file(s) failed to upload. Ensure the "tax_documents" storage bucket exists in Supabase with public/authenticated upload policy.`,
            });
        } else {
            setUploadStatus({ type: 'success', message: `${filesToUpload.length} file(s) uploaded successfully.` });
            setTimeout(() => setUploadStatus(null), 3000);
        }

        await loadFiles();
        setUploading(false);
    };

    const deleteFile = async (path: string) => {
        const supabase = createClient();
        const { error } = await supabase.storage.from('tax_documents').remove([path]);
        if (!error) {
            setFiles((prev) => prev.filter((f) => f.path !== path));
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-40 rounded-2xl bg-zinc-200/50 dark:bg-zinc-800/50 animate-pulse" />
                <div className="space-y-3">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-16 rounded-xl bg-zinc-200/50 dark:bg-zinc-800/50 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
                    <Upload className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Document Vault</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Upload tax-deductible receipts (Rent, NHIS, Pension)</p>
                </div>
            </div>

            {/* Status feedback */}
            <AnimatePresence>
                {uploadStatus && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className={`flex items-start gap-2 p-3 rounded-xl text-sm ${uploadStatus.type === 'success'
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                            }`}
                    >
                        {uploadStatus.type === 'success'
                            ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                            : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        }
                        <span>{uploadStatus.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Drop Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !uploading && inputRef.current?.click()}
                className={`
                    relative flex flex-col items-center justify-center gap-3
                    p-8 rounded-2xl border-2 border-dashed transition-all duration-300
                    ${uploading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
                    ${dragActive
                        ? 'border-violet-500 bg-violet-500/10 scale-[1.01]'
                        : 'border-zinc-300 dark:border-zinc-700 hover:border-violet-400 hover:bg-violet-500/5'
                    }
                `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => e.target.files && uploadFiles(e.target.files)}
                />
                {uploading ? (
                    <>
                        <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
                        <p className="text-sm text-zinc-500">Uploading to vault...</p>
                    </>
                ) : (
                    <>
                        <CloudUpload className={`w-10 h-10 transition-colors ${dragActive ? 'text-violet-500' : 'text-zinc-400'}`} />
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
                            <span className="font-medium text-violet-600 dark:text-violet-400">Click to upload</span> or drag & drop
                            <br />
                            <span className="text-xs text-zinc-500">PDF, PNG, JPG up to 10 MB</span>
                        </p>
                    </>
                )}
            </div>

            {/* File List */}
            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">
                            {files.length} document{files.length !== 1 ? 's' : ''} uploaded
                        </p>
                        {files.map((file) => {
                            const Icon = getFileIcon(file.type);
                            return (
                                <motion.div
                                    key={file.path}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50 group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`p-2 rounded-lg ${file.type.startsWith('image/')
                                            ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-600'
                                            : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600'
                                            }`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{file.name}</p>
                                            <p className="text-xs text-zinc-500">{formatFileSize(file.size)}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteFile(file.path); }}
                                        className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {files.length === 0 && !uploading && (
                <p className="text-center text-sm text-zinc-400 py-2">No documents uploaded yet</p>
            )}
        </div>
    );
}
