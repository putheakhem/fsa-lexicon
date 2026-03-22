import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle2, ChevronDown, Clock, Filter, MoreHorizontal, Plus, Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import {
    create as termsCreate,
    edit as termsEdit,
    index as termsIndex,
} from '@/actions/App/Http/Controllers/Lexicon/TermController';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

interface Term {
    id: number;
    term_kh: string;
    term_en: string | null;
    term_fr: string | null;
    is_approved: boolean;
    was_sent_to_telegram: boolean;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedTerms {
    data: Term[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

interface SimpleOption {
    id: number;
    title_en: string;
}

interface Filters {
    search: string | null;
    status: string | null;
    telegram: string | null;
    sector_id: string | null;
    term_group_id: string | null;
    sort: string | null;
}

interface Props {
    terms: PaginatedTerms;
    filters: Filters;
    sectors: SimpleOption[];
    termGroups: SimpleOption[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Terms', href: termsIndex() },
];

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'az', label: 'A → Z' },
];

function StatusBadge({ isApproved }: { isApproved: boolean }) {
    if (isApproved) {
        return (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4" />
                Approved
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-500 dark:text-amber-400">
            <Clock className="size-4" />
            Draft
        </span>
    );
}

function TelegramBadge({ sent }: { sent: boolean }) {
    return (
        <Badge
            className={cn(
                'rounded-full border-0 text-xs font-medium',
                sent
                    ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                    : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
            )}
        >
            {sent ? 'Sent' : 'Pending'}
        </Badge>
    );
}

function formatDate(dateString: string): string {
    return new Date(dateString).toISOString().slice(0, 10);
}

export default function TermsIndex({ terms, filters, sectors, termGroups }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [showAdvanced, setShowAdvanced] = useState(
        !!(filters.status || filters.telegram || filters.sector_id || filters.term_group_id),
    );
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const applyFilters = useCallback(
        (overrides: Partial<Record<string, string | undefined>>) => {
            router.get(
                termsIndex(),
                {
                    search: search || undefined,
                    status: filters.status || undefined,
                    telegram: filters.telegram || undefined,
                    sector_id: filters.sector_id || undefined,
                    term_group_id: filters.term_group_id || undefined,
                    sort: filters.sort && filters.sort !== 'newest' ? filters.sort : undefined,
                    ...overrides,
                },
                { preserveState: true, replace: true },
            );
        },
        [search, filters],
    );

    // Debounced search
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            applyFilters({ search: search || undefined });
        }, 400);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const clearFilter = (key: string) => applyFilters({ [key]: undefined });

    const clearAll = () => {
        setSearch('');
        router.get(termsIndex(), {}, { preserveState: false, replace: true });
    };

    // Count active (non-search) filters
    const activeCount = [filters.status, filters.telegram, filters.sector_id, filters.term_group_id].filter(Boolean)
        .length;

    const sectorLabel = sectors.find((s) => String(s.id) === filters.sector_id)?.title_en;
    const groupLabel = termGroups.find((g) => String(g.id) === filters.term_group_id)?.title_en;

    const hasAnyFilter = !!(search || filters.status || filters.telegram || filters.sector_id || filters.term_group_id);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Terms Management" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Terms Management</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {terms.total.toLocaleString()} terms across Khmer, English &amp; French.
                        </p>
                    </div>
                    <Button className="gap-2" asChild>
                        <Link href={termsCreate()}>
                            <Plus className="size-4" />
                            Add Term
                        </Link>
                    </Button>
                </div>

                {/* Card */}
                <div className="rounded-xl border bg-card shadow-sm">
                    {/* Primary toolbar */}
                    <div className="flex items-center gap-3 border-b px-4 py-3">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                className="pl-9 pr-8"
                                placeholder="Search Khmer, English, French..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="size-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Sort */}
                        <Select
                            value={filters.sort ?? 'newest'}
                            onValueChange={(v) => applyFilters({ sort: v === 'newest' ? undefined : v })}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {SORT_OPTIONS.map((o) => (
                                    <SelectItem key={o.value} value={o.value}>
                                        {o.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Advanced filters toggle */}
                        <Button
                            variant={activeCount > 0 ? 'default' : 'outline'}
                            className="gap-2"
                            onClick={() => setShowAdvanced((v) => !v)}
                        >
                            <Filter className="size-4" />
                            Filters
                            {activeCount > 0 && (
                                <Badge className="ml-0.5 size-5 rounded-full p-0 text-xs flex items-center justify-center bg-white/20">
                                    {activeCount}
                                </Badge>
                            )}
                            <ChevronDown className={cn('size-4 transition-transform', showAdvanced && 'rotate-180')} />
                        </Button>
                    </div>

                    {/* Advanced filter row */}
                    {showAdvanced && (
                        <div className="flex flex-wrap items-center gap-3 border-b bg-muted/30 px-4 py-3">
                            {/* Status */}
                            <Select
                                value={filters.status ?? 'all'}
                                onValueChange={(v) => applyFilters({ status: v === 'all' ? undefined : v })}
                            >
                                <SelectTrigger className="h-8 w-36 text-xs">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Telegram */}
                            <Select
                                value={filters.telegram ?? 'all'}
                                onValueChange={(v) => applyFilters({ telegram: v === 'all' ? undefined : v })}
                            >
                                <SelectTrigger className="h-8 w-40 text-xs">
                                    <SelectValue placeholder="Telegram" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Telegram</SelectItem>
                                    <SelectItem value="sent">Sent</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Sector */}
                            <Select
                                value={filters.sector_id ?? 'all'}
                                onValueChange={(v) => applyFilters({ sector_id: v === 'all' ? undefined : v })}
                            >
                                <SelectTrigger className="h-8 w-44 text-xs">
                                    <SelectValue placeholder="All Sectors" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sectors</SelectItem>
                                    {sectors.map((s) => (
                                        <SelectItem key={s.id} value={String(s.id)}>
                                            {s.title_en}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Term Group */}
                            <Select
                                value={filters.term_group_id ?? 'all'}
                                onValueChange={(v) => applyFilters({ term_group_id: v === 'all' ? undefined : v })}
                            >
                                <SelectTrigger className="h-8 w-44 text-xs">
                                    <SelectValue placeholder="All Groups" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Groups</SelectItem>
                                    {termGroups.map((g) => (
                                        <SelectItem key={g.id} value={String(g.id)}>
                                            {g.title_en}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {activeCount > 0 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        applyFilters({
                                            status: undefined,
                                            telegram: undefined,
                                            sector_id: undefined,
                                            term_group_id: undefined,
                                        })
                                    }
                                    className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                                >
                                    <X className="size-3" /> Clear filters
                                </button>
                            )}
                        </div>
                    )}

                    {/* Active filter chips */}
                    {hasAnyFilter && (
                        <div className="flex flex-wrap items-center gap-2 border-b px-4 py-2">
                            <span className="text-xs text-muted-foreground">Active:</span>
                            {search && (
                                <Badge variant="secondary" className="gap-1 text-xs">
                                    Search: "{search}"
                                    <button type="button" onClick={() => setSearch('')}><X className="size-3" /></button>
                                </Badge>
                            )}
                            {filters.status && (
                                <Badge variant="secondary" className="gap-1 text-xs capitalize">
                                    Status: {filters.status}
                                    <button type="button" onClick={() => clearFilter('status')}><X className="size-3" /></button>
                                </Badge>
                            )}
                            {filters.telegram && (
                                <Badge variant="secondary" className="gap-1 text-xs capitalize">
                                    Telegram: {filters.telegram}
                                    <button type="button" onClick={() => clearFilter('telegram')}><X className="size-3" /></button>
                                </Badge>
                            )}
                            {filters.sector_id && sectorLabel && (
                                <Badge variant="secondary" className="gap-1 text-xs">
                                    Sector: {sectorLabel}
                                    <button type="button" onClick={() => clearFilter('sector_id')}><X className="size-3" /></button>
                                </Badge>
                            )}
                            {filters.term_group_id && groupLabel && (
                                <Badge variant="secondary" className="gap-1 text-xs">
                                    Group: {groupLabel}
                                    <button type="button" onClick={() => clearFilter('term_group_id')}><X className="size-3" /></button>
                                </Badge>
                            )}
                            <button
                                type="button"
                                onClick={clearAll}
                                className="ml-auto text-xs text-muted-foreground hover:text-destructive"
                            >
                                Clear all
                            </button>
                        </div>
                    )}

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/40">
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                        #
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                        Term (Khmer)
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                        Term (English)
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                        Term (French)
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                        Telegram
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                        Created
                                    </th>
                                    <th className="w-12 px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {terms.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-16 text-center">
                                            <p className="text-sm text-muted-foreground">No terms match your filters.</p>
                                            {hasAnyFilter && (
                                                <button
                                                    type="button"
                                                    onClick={clearAll}
                                                    className="mt-2 text-sm text-primary hover:underline"
                                                >
                                                    Clear all filters
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    terms.data.map((term, i) => (
                                        <tr key={term.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">
                                                {(terms.from ?? 0) + i}
                                            </td>
                                            <td className="px-4 py-3 font-medium">{term.term_kh}</td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {term.term_en ?? <span className="italic opacity-40">—</span>}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {term.term_fr ?? <span className="italic opacity-40">—</span>}
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge isApproved={term.is_approved} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <TelegramBadge sent={term.was_sent_to_telegram} />
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground tabular-nums">
                                                {formatDate(term.created_at)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="size-8">
                                                            <MoreHorizontal className="size-4" />
                                                            <span className="sr-only">Open menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={termsEdit(term.id)}>Edit</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive">
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
                            {terms.total === 0
                                ? 'No results'
                                : `Showing ${terms.from ?? 0}–${terms.to ?? 0} of ${terms.total.toLocaleString()}`}
                        </span>
                        <div className="flex items-center gap-1">
                            {terms.links.map((link, i) => {
                                const isEllipsis = link.label === '...';
                                const isPrev = link.label.includes('Previous') || link.label === '&laquo; Previous';
                                const isNext = link.label.includes('Next') || link.label === 'Next &raquo;';
                                const label = isPrev ? '‹' : isNext ? '›' : link.label;

                                if (isEllipsis) {
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
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
