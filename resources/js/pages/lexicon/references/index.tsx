import { Head, Link, router } from '@inertiajs/react';
import { FileText, Filter, MoreHorizontal, Plus, Search, Upload, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import {
    create as referencesCreate,
    destroy as referencesDestroy,
    edit as referencesEdit,
    index as referencesIndex,
} from '@/actions/App/Http/Controllers/Lexicon/ReferenceController';
import type { BreadcrumbItem } from '@/types';

interface ReferenceItem {
    id: number;
    title: string;
    code: string | null;
    file_name: string | null;
    file_url: string | null;
    user: { id: number; name: string } | null;
    created_at: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedReferences {
    data: ReferenceItem[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

interface Filters {
    search: string | null;
}

interface Props {
    references: PaginatedReferences;
    filters: Filters;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'References', href: referencesIndex() },
];

export default function ReferencesIndex({ references, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const applySearch = useCallback((value: string) => {
        router.get(
            referencesIndex(),
            { search: value || undefined },
            { preserveState: true, replace: true },
        );
    }, []);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => applySearch(value), 400);
    };

    const clearSearch = () => {
        setSearch('');
        applySearch('');
    };

    const handleDelete = (ref: ReferenceItem) => {
        if (!confirm(`Delete "${ref.title}"? This cannot be undone.`)) return;
        setDeletingId(ref.id);
        router.delete(referencesDestroy(ref.id).url, {
            preserveScroll: true,
            onFinish: () => setDeletingId(null),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="References Library" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">References Library</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage source documents and regulatory frameworks.
                        </p>
                    </div>
                    <Button className="gap-2" asChild>
                        <Link href={referencesCreate()}>
                            <Upload className="size-4" />
                            Upload Document
                        </Link>
                    </Button>
                </div>

                {/* Card */}
                <div className="rounded-xl border bg-card shadow-sm">
                    {/* Search toolbar */}
                    <div className="flex items-center gap-3 border-b px-4 py-3">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                className="pl-9 pr-8"
                                placeholder="Search references by title, code or filename..."
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="size-3.5" />
                                </button>
                            )}
                        </div>

                        <Button variant="outline" className="gap-2" disabled>
                            <Filter className="size-4" />
                            Filter
                        </Button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/40">
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                        Title
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                        Code
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                        Uploaded File
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                        Created By
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                        Date
                                    </th>
                                    <th className="w-12 px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {references.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-16 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <FileText className="size-10 text-muted-foreground/40" />
                                                <p className="text-sm text-muted-foreground">No references found.</p>
                                                {search && (
                                                    <button
                                                        type="button"
                                                        onClick={clearSearch}
                                                        className="mt-1 text-sm text-primary hover:underline"
                                                    >
                                                        Clear search
                                                    </button>
                                                )}
                                                {!search && (
                                                    <Button size="sm" className="mt-2 gap-2" asChild>
                                                        <Link href={referencesCreate()}>
                                                            <Plus className="size-4" />
                                                            Upload your first document
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    references.data.map((ref) => (
                                        <tr
                                            key={ref.id}
                                            className="hover:bg-muted/30 transition-colors"
                                            aria-busy={deletingId === ref.id}
                                        >
                                            {/* Title */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-muted/50">
                                                        <FileText className="size-4 text-muted-foreground" />
                                                    </div>
                                                    <span className="font-medium leading-tight">{ref.title}</span>
                                                </div>
                                            </td>

                                            {/* Code */}
                                            <td className="px-4 py-3">
                                                {ref.code ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="font-mono text-xs tracking-wider"
                                                    >
                                                        {ref.code}
                                                    </Badge>
                                                ) : (
                                                    <span className="italic text-muted-foreground opacity-50">—</span>
                                                )}
                                            </td>

                                            {/* Uploaded file */}
                                            <td className="px-4 py-3">
                                                {ref.file_url && ref.file_name ? (
                                                    <a
                                                        href={ref.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-primary hover:underline"
                                                    >
                                                        <FileText className="size-3.5 shrink-0" />
                                                        <span className="max-w-48 truncate text-xs">{ref.file_name}</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-xs italic text-muted-foreground">No file</span>
                                                )}
                                            </td>

                                            {/* Created by */}
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {ref.user?.name ?? <span className="italic opacity-50">—</span>}
                                            </td>

                                            {/* Date */}
                                            <td className="px-4 py-3 tabular-nums text-muted-foreground">
                                                {ref.created_at ?? '—'}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8"
                                                            disabled={deletingId === ref.id}
                                                        >
                                                            <MoreHorizontal className="size-4" />
                                                            <span className="sr-only">Open menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={referencesEdit(ref.id)}>Edit</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => handleDelete(ref)}
                                                        >
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination footer */}
                    <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
                        <span>
                            {references.total === 0
                                ? 'No results'
                                : `Showing ${references.from ?? 0} to ${references.to ?? 0} of ${references.total.toLocaleString()} results`}
                        </span>
                        {references.last_page > 1 && (
                            <div className="flex items-center gap-1">
                                {references.links.map((link, i) => {
                                    const isPrev =
                                        link.label.includes('Previous') || link.label === '&laquo; Previous';
                                    const isNext = link.label.includes('Next') || link.label === 'Next &raquo;';
                                    const label = isPrev ? '‹' : isNext ? '›' : link.label;

                                    if (link.label === '...') {
                                        return (
                                            <span key={i} className="px-2 py-1 text-muted-foreground">
                                                …
                                            </span>
                                        );
                                    }

                                    return (
                                        <Button
                                            key={i}
                                            variant={link.active ? 'default' : 'ghost'}
                                            size="sm"
                                            className="size-8 p-0"
                                            disabled={!link.url}
                                            asChild={!!link.url}
                                        >
                                            {link.url ? (
                                                <Link href={link.url} preserveState>
                                                    <span dangerouslySetInnerHTML={{ __html: label }} />
                                                </Link>
                                            ) : (
                                                <span dangerouslySetInnerHTML={{ __html: label }} />
                                            )}
                                        </Button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
