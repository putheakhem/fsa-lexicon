import { Head, useForm } from '@inertiajs/react';
import { FileText, Loader2, Upload } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import {
    edit as referencesEdit,
    index as referencesIndex,
    update as referencesUpdate,
} from '@/actions/App/Http/Controllers/Lexicon/ReferenceController';
import type { BreadcrumbItem } from '@/types';

interface ReferenceData {
    id: number;
    title: string;
    code: string | null;
    file_name: string | null;
    file_url: string | null;
}

interface Props {
    reference: ReferenceData;
}

interface FormData {
    title: string;
    code: string;
    file: File | null;
    _method: string;
    [key: string]: string | File | null;
}

export default function ReferenceEdit({ reference }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'References', href: referencesIndex() },
        { title: reference.title, href: referencesEdit(reference.id) },
    ];

    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: reference.title,
        code: reference.code ?? '',
        file: null,
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(referencesUpdate(reference.id).url, { forceFormData: true });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('file', file);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit — ${reference.title}`} />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Edit Reference</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update document details or replace the uploaded file.
                    </p>
                </div>

                <div className="max-w-2xl rounded-xl border bg-card p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Title */}
                        <div className="space-y-1.5">
                            <Label htmlFor="title">
                                Title <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                autoFocus
                            />
                            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                        </div>

                        {/* Code */}
                        <div className="space-y-1.5">
                            <Label htmlFor="code">Reference Code</Label>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                className="font-mono"
                            />
                            {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                        </div>

                        {/* File upload */}
                        <div className="space-y-1.5">
                            <Label>Document File</Label>

                            {/* Current file */}
                            {reference.file_url && reference.file_name && !data.file && (
                                <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2">
                                    <FileText className="size-4 shrink-0 text-primary" />
                                    <a
                                        href={reference.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 truncate text-sm text-primary hover:underline"
                                    >
                                        {reference.file_name}
                                    </a>
                                    <span className="text-xs text-muted-foreground">Current file</span>
                                </div>
                            )}

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 text-center transition-colors hover:border-primary/40 hover:bg-muted/30"
                            >
                                {data.file ? (
                                    <>
                                        <FileText className="size-8 text-primary" />
                                        <div>
                                            <p className="text-sm font-medium">{data.file.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {(data.file.size / 1024).toFixed(0)} KB — will replace current file
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setData('file', null);
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                            className="text-xs text-destructive hover:underline"
                                        >
                                            Remove selection
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="size-7 text-muted-foreground/50" />
                                        <p className="text-sm text-muted-foreground">
                                            {reference.file_name ? 'Click to replace the current file' : 'Click to upload a file'}
                                        </p>
                                    </>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg"
                                onChange={handleFileChange}
                            />
                            {errors.file && <p className="text-sm text-destructive">{errors.file}</p>}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2">
                            <Button type="submit" disabled={processing} className="gap-2">
                                {processing && <Loader2 className="size-4 animate-spin" />}
                                Save Changes
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
