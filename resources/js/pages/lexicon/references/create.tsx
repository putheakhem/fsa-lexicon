import { Head, useForm } from '@inertiajs/react';
import { FileText, Loader2, Upload } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import {
    create as referencesCreate,
    index as referencesIndex,
    store as referencesStore,
} from '@/actions/App/Http/Controllers/Lexicon/ReferenceController';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'References', href: referencesIndex() },
    { title: 'Upload Document', href: referencesCreate() },
];

interface FormData {
    title: string;
    code: string;
    file: File | null;
    [key: string]: string | File | null;
}

export default function ReferenceCreate() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        title: '',
        code: '',
        file: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(referencesStore().url, {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('file', file);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Document" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Upload Document</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Add a new reference document to the library.
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
                                placeholder="e.g. NBC FinTech Policy 2025"
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
                                placeholder="e.g. REF-001"
                                className="font-mono"
                            />
                            <p className="text-xs text-muted-foreground">
                                Optional unique identifier for this reference.
                            </p>
                            {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                        </div>

                        {/* File upload */}
                        <div className="space-y-1.5">
                            <Label>Document File</Label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center transition-colors hover:border-primary/40 hover:bg-muted/30"
                            >
                                {data.file ? (
                                    <>
                                        <FileText className="size-8 text-primary" />
                                        <div>
                                            <p className="text-sm font-medium">{data.file.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {(data.file.size / 1024).toFixed(0)} KB
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
                                            Remove file
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="size-8 text-muted-foreground/50" />
                                        <div>
                                            <p className="text-sm font-medium">Click to upload</p>
                                            <p className="text-xs text-muted-foreground">
                                                PDF, DOC, DOCX, XLS, XLSX, TXT up to 50 MB
                                            </p>
                                        </div>
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
                                Upload Document
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
