import { Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    BookOpen,
    FileText,
    LayoutList,
    Layers,
    Send,
    TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { index as termsIndex } from '@/actions/App/Http/Controllers/Lexicon/TermController';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

interface Stat {
    totalTerms: number;
    termGrowthPercent: number | null;
    totalDefinitions: number;
    definitionGrowthPercent: number | null;
    totalReferences: number;
    pendingReferences: number;
    totalSectors: number;
    sectorDomains: number;
    telegramPosts: number;
}

interface RecentTerm {
    id: number;
    term_kh: string;
    term_en: string | null;
    is_approved: boolean;
    created_at: string;
}

interface MonthlyPoint {
    label: string;
    count: number;
}

interface Props {
    stats: Stat;
    recentTerms: RecentTerm[];
    monthlyGrowth: MonthlyPoint[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: dashboard() }];

function StatCard({
    label,
    value,
    sub,
    subPositive,
    icon: Icon,
    iconColor,
}: {
    label: string;
    value: number;
    sub: string;
    subPositive?: boolean;
    icon: React.ElementType;
    iconColor: string;
}) {
    return (
        <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-start justify-between">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <div className={`rounded-lg p-2 ${iconColor}`}>
                    <Icon className="size-4" />
                </div>
            </div>
            <p className="text-3xl font-bold tracking-tight">{value.toLocaleString()}</p>
            <p
                className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${
                    subPositive === true
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : subPositive === false
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-muted-foreground'
                }`}
            >
                {subPositive === true && <TrendingUp className="size-3" />}
                {sub}
            </p>
        </div>
    );
}

// Minimal SVG line chart — no external dep required
function LineChart({ data }: { data: MonthlyPoint[] }) {
    const max = Math.max(...data.map((d) => d.count), 1);
    const w = 460;
    const h = 160;
    const padX = 8;
    const padY = 16;
    const innerW = w - padX * 2;
    const innerH = h - padY * 2;

    const points = data.map((d, i) => ({
        x: padX + (i / (data.length - 1)) * innerW,
        y: padY + innerH - (d.count / max) * innerH,
        ...d,
    }));

    const pathD = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
        .join(' ');

    const areaD =
        pathD +
        ` L ${points[points.length - 1].x.toFixed(1)} ${(padY + innerH).toFixed(1)}` +
        ` L ${points[0].x.toFixed(1)} ${(padY + innerH).toFixed(1)} Z`;

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={areaD} fill="url(#chartGrad)" />
            <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p) => (
                <circle key={p.label} cx={p.x} cy={p.y} r="4" fill="#3b82f6" />
            ))}
        </svg>
    );
}

export default function Dashboard({ stats, recentTerms, monthlyGrowth }: Props) {
    const now = new Date();
    const lastUpdated = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Last updated: Today, {lastUpdated}
                    </p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <StatCard
                        label="Total Terms"
                        value={stats.totalTerms}
                        sub={
                            stats.termGrowthPercent !== null
                                ? `+${stats.termGrowthPercent}% this month`
                                : 'No data yet'
                        }
                        subPositive={stats.termGrowthPercent !== null ? stats.termGrowthPercent > 0 : undefined}
                        icon={BookOpen}
                        iconColor="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                    />
                    <StatCard
                        label="Definitions"
                        value={stats.totalDefinitions}
                        sub={
                            stats.definitionGrowthPercent !== null
                                ? `+${stats.definitionGrowthPercent}% this month`
                                : 'No data yet'
                        }
                        subPositive={stats.definitionGrowthPercent !== null ? stats.definitionGrowthPercent > 0 : undefined}
                        icon={FileText}
                        iconColor="bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                    />
                    <StatCard
                        label="References"
                        value={stats.totalReferences}
                        sub={
                            stats.pendingReferences > 0
                                ? `${stats.pendingReferences} pending review`
                                : 'All reviewed'
                        }
                        icon={LayoutList}
                        iconColor="bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400"
                    />
                    <StatCard
                        label="Sectors"
                        value={stats.totalSectors}
                        sub={`Across ${stats.sectorDomains} domains`}
                        icon={Layers}
                        iconColor="bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
                    />
                    <StatCard
                        label="Telegram Posts"
                        value={stats.telegramPosts}
                        sub="Active channel"
                        subPositive={true}
                        icon={Send}
                        iconColor="bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400"
                    />
                </div>

                {/* Bottom grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
                    {/* Recent Terms */}
                    <section className="rounded-xl border bg-card shadow-sm">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <h2 className="font-semibold">Recent Terms</h2>
                            <Link
                                href={termsIndex()}
                                className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                                View all <ArrowUpRight className="size-3.5" />
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/40">
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Khmer Term
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            English Term
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {recentTerms.map((term) => (
                                        <tr key={term.id} className="transition-colors hover:bg-muted/30">
                                            <td className="px-6 py-3.5 font-medium">{term.term_kh}</td>
                                            <td className="px-6 py-3.5 text-muted-foreground">
                                                {term.term_en ?? '—'}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                {term.is_approved ? (
                                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400">
                                                        Approved
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="border-amber-300 text-amber-600 dark:text-amber-400">
                                                        Draft
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-3.5 text-muted-foreground">
                                                {new Date(term.created_at).toLocaleDateString('en-CA')}
                                            </td>
                                        </tr>
                                    ))}
                                    {recentTerms.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                                                No terms yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Growth chart */}
                    <section className="rounded-xl border bg-card shadow-sm">
                        <div className="border-b px-6 py-4">
                            <h2 className="font-semibold">Growth Activity</h2>
                            <p className="mt-0.5 text-xs text-muted-foreground">New terms per month</p>
                        </div>
                        <div className="px-4 py-5">
                            <LineChart data={monthlyGrowth} />
                            {/* X-axis labels */}
                            <div className="mt-1 flex justify-between px-2">
                                {monthlyGrowth.map((m) => (
                                    <span key={m.label} className="text-xs text-muted-foreground">
                                        {m.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}

