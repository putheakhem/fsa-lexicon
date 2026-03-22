<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Lexicon\Sector;
use App\Models\Lexicon\Term;
use App\Models\Lexicon\TermGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class ExploreController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $search = $request->query('search');
        $sectorId = $request->query('sector_id');
        $groupId = $request->query('group_id');
        $termId = $request->query('term_id');

        $totalCount = Term::where('is_approved', true)->count();

        $terms = Term::query()
            ->where('is_approved', true)
            ->with('sectors:id,title_kh,title_en')
            ->when($search, function ($q) use ($search): void {
                $q->where(function ($q2) use ($search): void {
                    $q2->where('term_kh', 'ilike', "%{$search}%")
                        ->orWhere('term_en', 'ilike', "%{$search}%")
                        ->orWhere('term_fr', 'ilike', "%{$search}%");
                });
            })
            ->when($sectorId, fn ($q) => $q->whereHas('sectors', fn ($sq) => $sq->where('sectors.id', (int) $sectorId)))
            ->when($groupId, fn ($q) => $q->whereHas('termGroups', fn ($gq) => $gq->where('term_groups.id', (int) $groupId)))
            ->orderBy('term_kh')
            ->get(['id', 'term_kh', 'term_en', 'term_fr'])
            ->map(fn (Term $term) => [
                'id' => $term->id,
                'term_kh' => $term->term_kh,
                'term_en' => $term->term_en,
                'term_fr' => $term->term_fr,
                'sectors' => $term->sectors->map(fn ($s) => ['id' => $s->id, 'title_en' => $s->title_en, 'title_kh' => $s->title_kh]),
            ]);

        $selectedTerm = null;
        $selectedId = $termId ? (int) $termId : ($terms->first()['id'] ?? null);

        if ($selectedId !== null) {
            $term = Term::with([
                'sectors:id,title_kh,title_en',
                'termDefinitions.reference:id,title,code',
                'references:id,title,code',
            ])->find($selectedId);

            if ($term !== null) {
                $selectedTerm = [
                    'id' => $term->id,
                    'term_kh' => $term->term_kh,
                    'term_en' => $term->term_en,
                    'term_fr' => $term->term_fr,
                    'sectors' => $term->sectors->map(fn ($s) => ['id' => $s->id, 'title_en' => $s->title_en, 'title_kh' => $s->title_kh]),
                    'definitions' => $term->termDefinitions->map(fn ($d) => [
                        'id' => $d->id,
                        'language' => $d->language->value,
                        'definition' => $d->definition,
                        'source' => $d->reference?->title,
                    ]),
                    'references' => $term->references->map(fn ($r) => [
                        'id' => $r->id,
                        'title' => $r->title,
                        'code' => $r->code,
                    ]),
                ];
            }
        }

        $sectors = Sector::query()
            ->whereNull('parent_id')
            ->with(['children' => fn ($q) => $q->orderBy('title_en')->select('id', 'title_en', 'title_kh', 'parent_id')])
            ->orderBy('title_en')
            ->get(['id', 'title_en', 'title_kh', 'parent_id']);

        $termGroups = TermGroup::query()
            ->whereNull('parent_id')
            ->orderBy('title_kh')
            ->get(['id', 'title_kh']);

        return Inertia::render('explore', [
            'terms' => $terms,
            'selectedTerm' => $selectedTerm,
            'sectors' => $sectors,
            'termGroups' => $termGroups,
            'totalCount' => $totalCount,
            'filters' => [
                'search' => $search,
                'sector_id' => $sectorId,
                'group_id' => $groupId,
                'term_id' => $termId,
            ],
        ]);
    }
}
