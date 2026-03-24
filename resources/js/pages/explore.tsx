import { Head, Link, router, usePage } from '@inertiajs/react';
import { BookOpen, ChevronDown, ChevronRight, ExternalLink, Filter, Globe, MessageSquare, Navigation, Search, Share2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import ExploreController from '@/actions/App/Http/Controllers/ExploreController';
import { dashboard, login, home } from '@/routes';

interface Sector {
    id: number;
    title_en: string;
    title_kh: string;
    children?: Sector[];
}

interface TermGroup {
    id: number;
    title_kh: string;
    title_en: string;
}

interface TermListItem {
    id: number;
    term_kh: string;
    term_en: string | null;
    term_fr: string | null;
    sectors: Sector[];
}

interface TermDefinition {
    id: number;
    language: string;
    definition: string;
    source: string | null;
}

interface TermReference {
    id: number;
    title: string;
    code: string | null;
}

interface TermDetail {
    id: number;
    term_kh: string;
    term_en: string | null;
    term_fr: string | null;
    sectors: Sector[];
    definitions: TermDefinition[];
    references: TermReference[];
}

interface Filters {
    search: string | null;
    sector_id: string | null;
    group_id: string | null;
    term_id: string | null;
}

interface Props {
    terms: TermListItem[];
    selectedTerm: TermDetail | null;
    sectors: Sector[];
    termGroups: TermGroup[];
    totalCount: number;
    filters: Filters;
}

const languageMeta: Record<string, { label: string; flag: string }> = {
    khmer: { label: 'ខ្មែរ', flag: '🇰🇭' },
    english: { label: 'English', flag: '🇬🇧' },
    french: { label: 'Français', flag: '🇫🇷' },
};

function toKhmerNumeral(n: number): string {
    const digits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
    return String(n)
        .split('')
        .map((d) => digits[parseInt(d)] ?? d)
        .join('');
}

// Generate color based on ID for consistent coloring
function getColorForId(id: number, type: 'sector' | 'group'): string {
    const sectorColors = [
        '#3b82f6', // blue-500
        '#8b5cf6', // violet-500
        '#ec4899', // pink-500
        '#06b6d4', // cyan-500
        '#10b981', // emerald-500
        '#f59e0b', // amber-500
        '#ef4444', // red-500
        '#6366f1', // indigo-500
    ];
    const groupColors = [
        '#8b5cf6', // violet-500
        '#a855f7', // purple-500
        '#d946ef', // fuchsia-500
        '#6366f1', // indigo-500
    ];
    const colors = type === 'sector' ? sectorColors : groupColors;
    return colors[id % colors.length];
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : { r: 0, g: 0, b: 0 };
}

export default function Welcome({ terms, selectedTerm, sectors, termGroups, totalCount, filters }: Props) {
    const { auth } = usePage().props as { auth: { user: { name: string } | null } };
    const [search, setSearch] = useState(filters.search ?? '');
    const [semanticSearch, setSemanticSearch] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [expandedSector, setExpandedSector] = useState<number | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync search input with filters from server
    useEffect(() => {
        setSearch(filters.search ?? '');
    }, [filters.search]);

    // Keyboard navigation for terms
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedTerm || terms.length === 0) return;
            
            const currentIndex = terms.findIndex(t => t.id === selectedTerm.id);
            
            if (e.key === 'ArrowDown' && currentIndex < terms.length - 1) {
                e.preventDefault();
                handleSelectTerm(terms[currentIndex + 1].id);
            } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                e.preventDefault();
                handleSelectTerm(terms[currentIndex - 1].id);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedTerm, terms]);

    const navigate = (params: Record<string, string | null | undefined>, options: { preserveScroll?: boolean } = {}) => {
        setIsNavigating(true);
        router.get(ExploreController.url(), params as Record<string, string>, {
            preserveState: true,
            replace: true,
            preserveScroll: options.preserveScroll ?? true,
            only: ['terms', 'selectedTerm', 'totalCount', 'filters'],
            onFinish: () => setIsNavigating(false),
        });
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            navigate(
                {
                    search: value || null,
                    sector_id: filters.sector_id,
                    group_id: filters.group_id,
                },
                { preserveScroll: true }
            );
        }, 350);
    };

    const handleSector = (sectorId: number | null) => {
        navigate(
            {
                search: filters.search,
                sector_id: sectorId ? String(sectorId) : null,
                group_id: filters.group_id,
            },
            { preserveScroll: false }
        );
    };

    const handleGroup = (groupId: number | null) => {
        navigate(
            {
                search: filters.search,
                sector_id: filters.sector_id,
                group_id: groupId ? String(groupId) : null,
            },
            { preserveScroll: false }
        );
    };

    const handleSelectTerm = (termId: number) => {
        navigate(
            {
                search: filters.search,
                sector_id: filters.sector_id,
                group_id: filters.group_id,
                term_id: String(termId),
            },
            { preserveScroll: true }
        );
    };

    const activeSectorId = filters.sector_id ? parseInt(filters.sector_id) : null;
    const activeGroupId = filters.group_id ? parseInt(filters.group_id) : null;

    return (
        <>
            <Head title="National Lexicon — ពាក្យគន្លឹះហិរញ្ញវត្ថុ" />
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 antialiased">

                {/* ─── Navbar ─────────────────────────────────────────────── */}
                <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl shadow-sm">
                    <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3 sm:px-6 lg:py-3.5">
                        {/* Logo */}
                        <Link href={home()} className="group flex items-center gap-2.5 transition-opacity hover:opacity-90 sm:gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[brand-primary] to-[oklch(60%_0.15_210)] shadow-sm ring-1 ring-[brand-primary]/20 text-white transition-transform duration-200 group-hover:scale-105 sm:h-10 sm:w-10">
                                <BookOpen className="h-4.5 w-4.5 sm:h-5 sm:w-5" strokeWidth={2.5} />
                            </div>
                            <div className="leading-tight">
                                <p className="text-sm font-bold text-slate-900 sm:text-base">National Lexicon</p>
                                <p className="text-[9px] font-medium tracking-widest text-slate-500 uppercase sm:text-[10px]">Public Portal</p>
                            </div>
                        </Link>

                        {/* Nav */}
                        <nav className="hidden items-center gap-1 lg:flex">
                            <Link
                                href={home()}
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[brand-primary]/50"
                            >
                                Home
                            </Link>
                            <a href="#terms" className="rounded-lg px-3 py-2 text-sm font-semibold text-[brand-primary] transition-colors hover:bg-[brand-primary]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[brand-primary]/50">
                                Explore Terms
                            </a>
                            <a href="#sectors" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[brand-primary]/50">
                                Sectors
                            </a>
                            <button className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[brand-primary]/50">
                                <Globe className="h-3.5 w-3.5" />
                                <span>KH</span>
                            </button>
                        </nav>

                        {/* CTA */}
                        {auth?.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-lg bg-[brand-primary] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(55%_0.14_210)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[brand-primary] focus-visible:ring-offset-2 active:scale-95 sm:px-5"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="rounded-lg bg-[brand-primary] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(55%_0.14_210)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[brand-primary] focus-visible:ring-offset-2 active:scale-95 sm:px-5"
                            >
                                Admin Login
                            </Link>
                        )}
                    </div>
                </header>

                {/* ─── Search Bar ─────────────────────────────────────────── */}
                <div className="border-b border-slate-200/60 bg-white/80 px-4 py-4 backdrop-blur-xl sm:px-6 sm:py-5">
                    <div className="mx-auto max-w-screen-xl">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            {/* Search input */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="ស្វែងរកពាក្យបច្ចេកទេសសំខាន់..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-[brand-primary]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[brand-primary]/20 sm:py-3"
                                />
                                {isNavigating && (
                                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-[brand-primary]" />
                                    </div>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-2">
                                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[brand-primary]/20 bg-[brand-primary]/10 px-3 py-2.5 text-xs font-semibold text-[brand-primary] transition-all hover:bg-[brand-primary]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[brand-primary]/50 active:scale-95 sm:flex-none sm:px-4">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    <span className="sm:inline">ផ្នែកគតិយុត្ត</span>
                                </button>
                                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/50 active:scale-95 sm:flex-none sm:px-4">
                                    <Navigation className="h-3.5 w-3.5" />
                                    <span className="sm:inline">ចាក្យតាក</span>
                                </button>
                                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[brand-primary] bg-[brand-primary] px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[oklch(55%_0.14_210)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[brand-primary] focus-visible:ring-offset-2 active:scale-95 sm:flex-none sm:px-4">
                                    <Share2 className="h-3.5 w-3.5" />
                                    <span className="sm:inline">ចែករំលែក</span>
                                </button>
                            </div>
                        </div>

                        {/* Semantic search + count */}
                        <div className="mt-2 flex items-center justify-between">
                            <button
                                onClick={() => setSemanticSearch(!semanticSearch)}
                                className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                            >
                                <span
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                        semanticSearch ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                                            semanticSearch ? 'translate-x-4' : 'translate-x-1'
                                        }`}
                                    />
                                </span>
                                ការស្វែងរយល់ន័យ (Semantic Search)
                            </button>
                            <span className="text-xs text-gray-400">
                                {totalCount.toLocaleString()} ពាក្យ
                            </span>
                        </div>
                    </div>
                </div>

                {/* ─── Main two-panel layout ───────────────────────────────── */}
                <div id="terms" className="mx-auto flex w-full max-w-screen-xl flex-1 gap-4 px-4 py-5 sm:px-6 lg:gap-6 lg:py-8">
                    {/* LEFT PANEL */}
                    <aside className="flex w-full max-w-xs shrink-0 flex-col lg:w-80">
                        <div className="sticky top-24 rounded-xl border border-slate-200 bg-white shadow-sm">
                            {/* Filter section */}
                            <div className="border-b border-slate-100 px-4 py-4">
                                <div className="flex flex-wrap gap-2">
                                    {/* All button */}
                                    <button
                                        onClick={() => {
                                            handleSector(null);
                                            handleGroup(null);
                                            setExpandedSector(null);
                                        }}
                                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                                            activeSectorId === null && activeGroupId === null
                                                ? 'border-[brand-primary] bg-[brand-primary] text-white shadow-sm'
                                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        ទាំងអស់
                                    </button>

                                    {/* Term Groups */}
                                    {termGroups.slice(0, 2).map((group) => {
                                        const color = getColorForId(group.id, 'group');
                                        const rgb = hexToRgb(color);
                                        return (
                                            <button
                                                key={group.id}
                                                onClick={() => {
                                                    handleGroup(group.id);
                                                    setExpandedSector(null);
                                                }}
                                                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                                                    activeGroupId === group.id
                                                        ? 'text-white shadow-sm'
                                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                                }`}
                                                style={
                                                    activeGroupId === group.id
                                                        ? {
                                                              backgroundColor: color,
                                                              borderColor: color,
                                                          }
                                                        : {}
                                                }
                                            >
                                                {group.title_kh}
                                            </button>
                                        );
                                    })}

                                    {/* Sectors with dropdown */}
                                    {sectors.slice(0, 3).map((sector) => {
                                        const color = getColorForId(sector.id, 'sector');
                                        const isActive = activeSectorId === sector.id || (sector.children && sector.children.some((c) => c.id === activeSectorId));
                                        return (
                                            <div key={sector.id} className="relative">
                                                <button
                                                    onClick={() => {
                                                        if (sector.children && sector.children.length > 0) {
                                                            setExpandedSector(expandedSector === sector.id ? null : sector.id);
                                                        } else {
                                                            handleSector(sector.id);
                                                            setExpandedSector(null);
                                                        }
                                                    }}
                                                    className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                                                        isActive
                                                            ? 'text-white shadow-sm'
                                                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                                    }`}
                                                    style={
                                                        isActive
                                                            ? {
                                                                  backgroundColor: color,
                                                                  borderColor: color,
                                                              }
                                                            : {}
                                                    }
                                                >
                                                    {sector.title_kh}
                                                    {sector.children && sector.children.length > 0 && <ChevronDown className="h-3 w-3" />}
                                                </button>
                                                {/* Dropdown for children */}
                                                {expandedSector === sector.id && sector.children && sector.children.length > 0 && (
                                                    <div className="absolute left-0 top-full z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                                        <button
                                                            onClick={() => {
                                                                handleSector(sector.id);
                                                                setExpandedSector(null);
                                                            }}
                                                            className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        >
                                                            <span className="font-medium text-gray-700 dark:text-gray-300">{sector.title_kh} (All)</span>
                                                        </button>
                                                        <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
                                                        {sector.children.map((child) => {
                                                            const childColor = getColorForId(child.id, 'sector');
                                                            const rgb = hexToRgb(childColor);
                                                            return (
                                                                <button
                                                                    key={child.id}
                                                                    onClick={() => {
                                                                        handleSector(child.id);
                                                                        setExpandedSector(null);
                                                                    }}
                                                                    className={`w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                                                        activeSectorId === child.id ? '' : 'text-gray-600 dark:text-gray-400'
                                                                    }`}
                                                                    style={
                                                                        activeSectorId === child.id
                                                                            ? {
                                                                                  backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`,
                                                                                  color: childColor,
                                                                              }
                                                                            : {}
                                                                    }
                                                                >
                                                                    {child.title_kh}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* More button */}
                                    {(sectors.length > 3 || termGroups.length > 2) && (
                                        <button
                                            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            ផ្សេងៗ
                                        </button>
                                    )}
                                </div>

                                {/* Semantic search toggle */}
                                <div className="mt-3 flex items-center gap-2">
                                    <button
                                        onClick={() => setSemanticSearch(!semanticSearch)}
                                        className="flex items-center gap-2"
                                    >
                                        <span
                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                                semanticSearch ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                                                    semanticSearch ? 'translate-x-4' : 'translate-x-1'
                                                }`}
                                            />
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            បញ្ញាត្តិហ្វាណាដម្លោះចោនហេរ
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Term list */}
                            {terms.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                        <Search className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-900">រកមិនឃើញពាក្យ</p>
                                    <p className="mt-1 text-xs text-slate-500">សូមព្យាយាមស្វែងរកម្តងទៀត</p>
                                    {(filters.search || activeGroupId) && (
                                        <button
                                            onClick={() => { setSearch(''); navigate({}); }}
                                            className="mt-3 text-xs font-medium text-[brand-primary] hover:underline focus-visible:outline-none focus-visible:underline"
                                        >
                                            លុបការស្វែងរក
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div 
                                    className={`space-y-2 overflow-y-auto p-3 transition-opacity duration-200 ${
                                        isNavigating ? 'opacity-50' : 'opacity-100'
                                    }`} 
                                    style={{ maxHeight: 'calc(100vh - 260px)' }}
                                >
                                    {terms.map((term) => {
                                        const isSelected = selectedTerm?.id === term.id;
                                        return (
                                            <button
                                                key={term.id}
                                                onClick={() => handleSelectTerm(term.id)}
                                                className={`group relative w-full rounded-lg px-4 py-3.5 text-left transition-all ${
                                                    isSelected
                                                        ? 'bg-gradient-to-br from-[brand-primary]/5 to-[brand-primary]/10 shadow-sm ring-1 ring-[brand-primary]/30'
                                                        : 'bg-white hover:bg-slate-50 hover:shadow-sm'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <p
                                                            className={`mb-1.5 text-base font-bold leading-snug ${
                                                                isSelected
                                                                    ? 'text-[brand-primary]'
                                                                    : 'text-slate-900'
                                                            }`}
                                                        >
                                                            {term.term_kh}
                                                        </p>
                                                        <div className="space-y-0.5">
                                                            {term.term_en && (
                                                                <p className="flex items-center gap-1.5 text-xs text-slate-600">
                                                                    <span className="text-sm">🇬🇧</span>
                                                                    <span>{term.term_en}</span>
                                                                </p>
                                                            )}
                                                            {term.term_fr && (
                                                                <p className="flex items-center gap-1.5 text-xs text-slate-600">
                                                                    <span className="text-sm">🇫🇷</span>
                                                                    <span>{term.term_fr}</span>
                                                                </p>
                                                            )}
                                                        </div>
                                                        {term.sectors.length > 0 && (
                                                            <div className="mt-2 flex flex-wrap gap-1">
                                                                {term.sectors.slice(0, 2).map((s) => {
                                                                    const color = getColorForId(s.id, 'sector');
                                                                    const rgb = hexToRgb(color);
                                                                    return (
                                                                        <span
                                                                            key={s.id}
                                                                            className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium"
                                                                            style={
                                                                                isSelected
                                                                                    ? {
                                                                                          backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`,
                                                                                          color: color,
                                                                                      }
                                                                                    : {
                                                                                          backgroundColor: 'rgb(243 244 246)',
                                                                                          color: 'rgb(75 85 99)',
                                                                                      }
                                                                            }
                                                                        >
                                                                            <span className="text-[8px]">🏷️</span>
                                                                            {s.title_en}
                                                                        </span>
                                                                    );
                                                                })}
                                                                {term.sectors.length > 2 && (
                                                                    <span
                                                                        className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${
                                                                            isSelected
                                                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                                                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                                                        }`}
                                                                    >
                                                                        +{term.sectors.length - 2}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {isSelected && (
                                                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[brand-primary]" />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* RIGHT PANEL */}
                    <main className="flex-1 min-w-0">
                        {selectedTerm ? (
                            <article 
                                key={selectedTerm.id}
                                className="animate-in fade-in duration-300 rounded-xl border border-slate-200 bg-white shadow-sm"
                            >
                                {/* Term header */}
                                <div className="space-y-4 px-6 py-6">
                                    {/* Sector tags at top */}
                                    {selectedTerm.sectors.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedTerm.sectors.map((s) => {
                                                const color = getColorForId(s.id, 'sector');
                                                const rgb = hexToRgb(color);
                                                return (
                                                    <span
                                                        key={s.id}
                                                        className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium"
                                                        style={{
                                                            backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`,
                                                            borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`,
                                                            color: color,
                                                        }}
                                                    >
                                                        <span className="text-[10px]">🏷️</span>
                                                        {s.title_kh}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Khmer title */}
                                    <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">
                                        {selectedTerm.term_kh}
                                    </h1>

                                    {/* Translation boxes */}
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {selectedTerm.term_en && (
                                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                                                <div className="mb-2 flex items-center gap-1.5">
                                                    <span className="text-base">🇬🇧</span>
                                                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                        English
                                                    </span>
                                                </div>
                                                <p className="text-base font-medium text-gray-900 dark:text-white">
                                                    {selectedTerm.term_en}
                                                </p>
                                            </div>
                                        )}
                                        {selectedTerm.term_fr && (
                                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                                                <div className="mb-2 flex items-center gap-1.5">
                                                    <span className="text-base">🇫🇷</span>
                                                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                        Français
                                                    </span>
                                                </div>
                                                <p className="text-base font-medium text-gray-900 dark:text-white">
                                                    {selectedTerm.term_fr}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Definitions */}
                                {selectedTerm.definitions.length > 0 && (
                                    <div className="border-t border-gray-100 px-6 py-5 dark:border-gray-700">
                                        <div className="mb-4 flex items-center gap-2 text-base font-semibold text-blue-600 dark:text-blue-400">
                                            <BookOpen className="h-4 w-4" />
                                            និយមន័យ (Definitions)
                                        </div>
                                        <div className="space-y-3">
                                            {selectedTerm.definitions.map((def) => {
                                                const meta = languageMeta[def.language] ?? { label: def.language, flag: '🌐' };
                                                return (
                                                    <div 
                                                        key={def.id} 
                                                        className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50"
                                                    >
                                                        <div className="mb-2.5 flex items-center gap-2">
                                                            <span className="text-lg">{meta.flag}</span>
                                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                                {meta.label}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                                            {def.definition}
                                                        </p>
                                                        {def.source && (
                                                            <div className="mt-3 border-t border-gray-200 pt-2.5 dark:border-gray-700">
                                                                <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                                                    <BookOpen className="h-3 w-3" />
                                                                    <span className="font-medium text-gray-600 dark:text-gray-400">
                                                                        {def.source}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {selectedTerm.definitions.length === 0 && (
                                    <div className="border-t border-gray-100 px-6 py-8 text-center dark:border-gray-700">
                                        <p className="text-sm italic text-gray-400">
                                            មិនទាន់មានការពន្យល់ន័យ
                                        </p>
                                    </div>
                                )}

                                {/* References */}
                                {selectedTerm.references.length > 0 && (
                                    <div className="border-t border-gray-100 px-6 pb-6 pt-5 dark:border-gray-700">
                                        <div className="mb-4 flex items-center gap-2 text-base font-semibold text-blue-600 dark:text-blue-400">
                                            <BookOpen className="h-4 w-4" />
                                            អ្នកសារយោង
                                        </div>
                                        <div className="space-y-2.5">
                                            {selectedTerm.references.map((ref, idx) => (
                                                <div
                                                    key={ref.id}
                                                    className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3.5 dark:border-gray-700 dark:bg-gray-800/50"
                                                >
                                                    <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400" />
                                                    <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                                                        <span className="mr-2 font-mono text-xs font-medium text-gray-500 dark:text-gray-400">
                                                            [{toKhmerNumeral(idx + 1)}]
                                                        </span>
                                                        {ref.code && (
                                                            <span className="mr-2 rounded bg-gray-200 px-1.5 py-0.5 font-mono text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                                                {ref.code}
                                                            </span>
                                                        )}
                                                        <span className="font-medium">{ref.title}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </article>
                        ) : (
                            <div className="flex h-80 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white text-center dark:border-gray-700 dark:bg-gray-900">
                                <BookOpen className="mb-3 h-9 w-9 text-gray-300" />
                                <p className="text-sm font-medium text-gray-400">
                                    ជ្រើសយកពាក្យមួយដើម្បីមើលន័យ
                                </p>
                            </div>
                        )}
                    </main>

                    {/* RIGHT PANEL END */}
                </div>

            {/* ─── Footer ─────────────────────────────────────────────── */}
            <footer className="relative border-t border-slate-200/60 bg-gradient-to-b from-white to-slate-50/40 py-5 text-center sm:py-6">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,brand-primary_0%,transparent_60%)] opacity-[0.015]"></div>
                    <p className="relative text-xs text-slate-600 sm:text-sm">
                        Non Bank Financial Service Authority · FSA FinTech Lexicon © {new Date().getFullYear()}
                        {!auth?.user && (
                            <>
                                {' · '}
                                <Link href={login()} className="font-medium text-[brand-primary] transition-colors hover:text-[oklch(55%_0.14_210)] focus-visible:outline-none focus-visible:underline">
                                    Admin Login
                                </Link>
                            </>
                        )}
                    </p>
                </footer>
            </div>
        </>
    );
}
