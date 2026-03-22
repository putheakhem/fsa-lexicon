<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Lexicon\Reference;
use App\Models\Lexicon\Sector;
use App\Models\Lexicon\Term;
use App\Models\Lexicon\TermDefinition;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $now = Carbon::now();

        $totalTerms = Term::query()->count();
        $termsThisMonth = Term::query()
            ->where('created_at', '>=', $now->copy()->startOfMonth())
            ->count();
        $termsLastMonth = Term::query()
            ->whereBetween('created_at', [
                $now->copy()->subMonth()->startOfMonth(),
                $now->copy()->subMonth()->endOfMonth(),
            ])
            ->count();
        $termGrowth = $termsLastMonth > 0
            ? round((($termsThisMonth - $termsLastMonth) / $termsLastMonth) * 100)
            : null;

        $totalDefinitions = TermDefinition::query()->count();
        $definitionsThisMonth = TermDefinition::query()
            ->where('created_at', '>=', $now->copy()->startOfMonth())
            ->count();
        $definitionsLastMonth = TermDefinition::query()
            ->whereBetween('created_at', [
                $now->copy()->subMonth()->startOfMonth(),
                $now->copy()->subMonth()->endOfMonth(),
            ])
            ->count();
        $definitionGrowth = $definitionsLastMonth > 0
            ? round((($definitionsThisMonth - $definitionsLastMonth) / $definitionsLastMonth) * 100)
            : null;

        $totalReferences = Reference::query()->count();
        $pendingReferences = Term::query()->where('is_approved', false)->count();

        $totalSectors = Sector::query()->count();
        $sectorDomains = Sector::query()->whereNull('parent_id')->count();

        $telegramPosts = Term::query()->where('was_sent_to_telegram', true)->count();

        $recentTerms = Term::query()
            ->orderByDesc('created_at')
            ->limit(5)
            ->get(['id', 'term_kh', 'term_en', 'is_approved', 'created_at']);

        // Monthly term counts for the last 7 months
        $months = collect(range(6, 0))->map(function (int $offset) use ($now): array {
            $month = $now->copy()->subMonths($offset);

            return [
                'label' => $month->format('M'),
                'count' => Term::query()
                    ->whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->count(),
            ];
        });

        return Inertia::render('dashboard', [
            'stats' => [
                'totalTerms' => $totalTerms,
                'termGrowthPercent' => $termGrowth,
                'totalDefinitions' => $totalDefinitions,
                'definitionGrowthPercent' => $definitionGrowth,
                'totalReferences' => $totalReferences,
                'pendingReferences' => $pendingReferences,
                'totalSectors' => $totalSectors,
                'sectorDomains' => $sectorDomains,
                'telegramPosts' => $telegramPosts,
            ],
            'recentTerms' => $recentTerms,
            'monthlyGrowth' => $months,
        ]);
    }
}
