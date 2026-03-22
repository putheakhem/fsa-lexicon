import { Head, Link, router, usePage } from '@inertiajs/react';
import { BookOpen, ChevronRight, ExternalLink, Filter, Globe, MessageSquare, Navigation, Search, Share2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import HomeController from '@/actions/App/Http/Controllers/HomeController';
import { dashboard, login } from '@/routes';

interface Sector {
    id: number;
    title_en: string;
    title_kh: string;
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

export default function Welcome({ terms, selectedTerm, sectors, termGroups, totalCount, filters }: Props) {
    const { auth } = usePage().props as { auth: { user: { name: string } | null } };
    const [search, setSearch] = useState(filters.search ?? '');
    const [semanticSearch, setSemanticSearch] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
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
        router.get(HomeController.url(), params as Record<string, string>, {
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

    const activeGroupId = filters.group_id ? parseInt(filters.group_id) : null;

    return (
        <>
            <Head title="National Lexicon — ពាក្យគន្លឹះហិរញ្ញវត្ថុ" />
            <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">

                {/* ─── Navbar ─────────────────────────────────────────────── */}
                <header className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-2.5 sm:px-6">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <div className="leading-tight">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">National Lexicon</p>
                                <p className="text-[10px] font-medium tracking-widest text-gray-400 uppercase">Public Portal</p>
                            </div>
                        </div>

                        {/* Nav */}
                        <nav className="hidden items-center gap-1 md:flex">
                            <span className="flex cursor-pointer items-center gap-1 rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                                <Globe className="h-3.5 w-3.5" />
                                <span>KH</span>
                            </span>
                            <span className="mx-1 h-4 w-px bg-gray-300 dark:bg-gray-600" />
                            <a href="#terms" className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                                Browse Terms
                            </a>
                            <a href="#sectors" className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                                Sectors
                            </a>
                        </nav>

                        {/* CTA */}
                        {auth?.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Admin Login
                            </Link>
                        )}
                    </div>
                </header>

                {/* ─── Search Bar ─────────────────────────────────────────── */}
                <div className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
                    <div className="mx-auto max-w-screen-xl">
                        <div className="flex items-center gap-3">
                            {/* Search input */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="ស្វែងរកពាក្យបច្ចេកទេសសំខាន់..."
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
                                />
                                {isNavigating && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                                    </div>
                                )}
                            </div>

                            {/* Action buttons */}
                            <button className="flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400">
                                <MessageSquare className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">ផ្នែកគតិយុត្ត</span>
                            </button>
                            <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                <Navigation className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">ចាក្យតាក</span>
                            </button>
                            <button className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700">
                                <Share2 className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">ចែករំលែក</span>
                            </button>
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
                <div id="terms" className="mx-auto flex w-full max-w-screen-xl flex-1 gap-0 px-4 py-5 sm:px-6">
                    {/* LEFT PANEL */}
                    <div className="mr-4 flex w-72 shrink-0 flex-col">
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                            {/* Filter chips */}
                            <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
                                <div className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <Filter className="h-3.5 w-3.5" />
                                    ប្រភេទពាក្យ
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    <button
                                        onClick={() => handleGroup(null)}
                                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                            activeGroupId === null
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        ទាំងអស់
                                    </button>
                                    {termGroups.map((group) => (
                                        <button
                                            key={group.id}
                                            onClick={() => handleGroup(group.id)}
                                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                                activeGroupId === group.id
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            {group.title_kh}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Term list */}
                            {terms.length === 0 ? (
                                <div className="flex flex-col items-center py-10 text-center">
                                    <Search className="mb-2 h-7 w-7 text-gray-300" />
                                    <p className="text-xs text-gray-400">រកមិនឃើញពាក្យ</p>
                                    {(filters.search || activeGroupId) && (
                                        <button
                                            onClick={() => { setSearch(''); navigate({}); }}
                                            className="mt-2 text-xs text-blue-500 hover:underline"
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
                                                        ? 'bg-gradient-to-br from-blue-50 to-purple-50 shadow-sm ring-1 ring-blue-200 dark:from-blue-950/50 dark:to-purple-950/30 dark:ring-blue-800'
                                                        : 'bg-white hover:bg-gray-50 hover:shadow-sm dark:bg-gray-800/50 dark:hover:bg-gray-800'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <p
                                                            className={`mb-1.5 text-base font-bold leading-snug ${
                                                                isSelected
                                                                    ? 'text-blue-700 dark:text-blue-400'
                                                                    : 'text-gray-900 dark:text-white'
                                                            }`}
                                                        >
                                                            {term.term_kh}
                                                        </p>
                                                        <div className="space-y-0.5">
                                                            {term.term_en && (
                                                                <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                                                    <span className="text-sm">🇬🇧</span>
                                                                    <span>{term.term_en}</span>
                                                                </p>
                                                            )}
                                                            {term.term_fr && (
                                                                <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                                                    <span className="text-sm">🇫🇷</span>
                                                                    <span>{term.term_fr}</span>
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-blue-500" />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="flex-1 min-w-0">
                        {selectedTerm ? (
                            <div 
                                key={selectedTerm.id}
                                className="animate-in fade-in duration-300 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
                            >
                                {/* Term header */}
                                <div className="space-y-4 px-6 py-6">
                                    {/* Sector tags at top */}
                                    {selectedTerm.sectors.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedTerm.sectors.map((s) => (
                                                <span
                                                    key={s.id}
                                                    className="inline-flex items-center gap-1 rounded-md border border-blue-300 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                                                >
                                                    <span className="text-[10px]">🏷️</span>
                                                    {s.title_kh}
                                                </span>
                                            ))}
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
                            </div>
                        ) : (
                            <div className="flex h-80 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white text-center dark:border-gray-700 dark:bg-gray-900">
                                <BookOpen className="mb-3 h-9 w-9 text-gray-300" />
                                <p className="text-sm font-medium text-gray-400">
                                    ជ្រើសយកពាក្យមួយដើម្បីមើលន័យ
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ─── Sectors section ────────────────────────────────────── */}
                {sectors.length > 0 && (
                    <div id="sectors" className="border-t border-gray-200 bg-white px-4 py-8 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
                        <div className="mx-auto max-w-screen-xl">
                            <h2 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                វិស័យ (Sectors)
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {sectors.map((sector) => (
                                    <button
                                        key={sector.id}
                                        onClick={() =>
                                            navigate(
                                                {
                                                    search: filters.search,
                                                    sector_id: String(sector.id),
                                                    group_id: filters.group_id,
                                                },
                                                { preserveScroll: false }
                                            )
                                        }
                                        className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-600 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm dark:border-gray-700 dark:text-gray-400 dark:hover:border-blue-700 dark:hover:bg-blue-950 dark:hover:text-blue-400"
                                    >
                                        {sector.title_kh}
                                        <span className="ml-1.5 text-xs text-gray-400">{sector.title_kh}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Footer ─────────────────────────────────────────────── */}
                <footer className="border-t border-gray-200 bg-white py-4 text-center dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-xs text-gray-400">
                        Financial Supervisory Authority of Cambodia · Lexicon &copy; {new Date().getFullYear()}
                        {!auth?.user && (
                            <>
                                {' · '}
                                <Link href={login()} className="text-blue-500 hover:underline">
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
