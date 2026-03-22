import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle2, Clock, MoreHorizontal, Plus, Search, SlidersHorizontal, XCircle } from 'lucide-react';
import { useCallback, useState } from 'react';
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

interface Filters {
    search: string | null;
    status: string | null;
}

interface Props {
    terms: PaginatedTerms;
    filters: Filters;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Terms', href: termsIndex() },
];

function StatusBadge({ isApproved }: { isApproved: boolean }) {
    if (isApproved) {
        return (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
                <CheckCircle2 className="size-4" />
                Approved
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-500">
            <Clock className="size-4" />
            Review
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

export default function TermsIndex({ terms, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const applyFilters = useCallback(
        (overrides: Partial<Filters & { search: string }>) => {
            router.get(
                termsIndex(),
                {
                    search: search || undefined,
                    status: filters.status || undefined,
                    ...overrides,
                },
                { preserveState: true, replace: true },
            );
        },
        [search, filters.status],
    );

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            applyFilters({ search });
        }
    };

    const handleStatusChange = (value: string) => {
        applyFilters({ status: value === 'all' ? undefined : value });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Terms Management" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Terms Management</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage and translate lexicon terms across multiple languages.
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
                    {/* Toolbar */}
                    <div className="flex items-center gap-3 border-b px-4 py-3">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                className="pl-9"
                                placeholder="Search terms..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                            />
                        </div>
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() => applyFilters({ search })}
                        >
                            <SlidersHorizontal className="size-4" />
                            Filter
                        </Button>
                        <Select
                            value={filters.status ?? 'all'}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="review">Review</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/40">
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
                                        Created Date
                                    </th>
                                    <th className="w-12 px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {terms.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                                            No terms found.
                                        </td>
                                    </tr>
                                ) : (
                                    terms.data.map((term) => (
                                        <tr key={term.id} className="hover:bg-muted/30 transition-colors">
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
                            Showing {terms.from ?? 0} to {terms.to ?? 0} of {terms.total.toLocaleString()} results
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
