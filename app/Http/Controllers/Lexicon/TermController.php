<?php

declare(strict_types=1);

namespace App\Http\Controllers\Lexicon;

use App\Http\Controllers\Controller;
use App\Http\Requests\Lexicon\StoreTermRequest;
use App\Http\Requests\Lexicon\UpdateTermRequest;
use App\Models\Lexicon\Reference;
use App\Models\Lexicon\Sector;
use App\Models\Lexicon\Term;
use App\Models\Lexicon\TermDefinition;
use App\Models\Lexicon\TermGroup;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class TermController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $search = $request->query('search');
        $telegram = $request->query('telegram');
        $sectorId = $request->query('sector_id');
        $termGroupId = $request->query('term_group_id');
        $sort = $request->query('sort', 'newest');

        $terms = Term::query()
            ->when($search, function ($query, string $search): void {
                $query->where(function ($q) use ($search): void {
                    $q->where('term_kh', 'ilike', "%{$search}%")
                        ->orWhere('term_en', 'ilike', "%{$search}%")
                        ->orWhere('term_fr', 'ilike', "%{$search}%");
                });
            })
            ->when($status === 'approved', fn ($q) => $q->where('is_approved', true))
            ->when($status === 'draft', fn ($q) => $q->where('is_approved', false))
            ->when($telegram === 'sent', fn ($q) => $q->where('was_sent_to_telegram', true))
            ->when($telegram === 'pending', fn ($q) => $q->where('was_sent_to_telegram', false))
            ->when($sectorId, fn ($q) => $q->whereHas('sectors', fn ($sq) => $sq->where('sectors.id', (int) $sectorId)))
            ->when($termGroupId, fn ($q) => $q->whereHas('termGroups', fn ($tq) => $tq->where('term_groups.id', (int) $termGroupId)))
            ->when($sort === 'oldest', fn ($q) => $q->orderBy('created_at'))
            ->when($sort === 'az', fn ($q) => $q->orderBy('term_en')->orderBy('term_kh'))
            ->when($sort !== 'oldest' && $sort !== 'az', fn ($q) => $q->orderByDesc('created_at'))
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('lexicon/terms/index', [
            'terms' => $terms,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'telegram' => $telegram,
                'sector_id' => $sectorId,
                'term_group_id' => $termGroupId,
                'sort' => $sort,
            ],
            'sectors' => Sector::query()->orderBy('title_en')->get(['id', 'title_en']),
            'termGroups' => TermGroup::query()->orderBy('title_en')->get(['id', 'title_en']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('lexicon/terms/create', [
            'sectors' => Sector::query()->orderBy('parent_id')->orderBy('title_en')->get(['id', 'title_en', 'title_kh', 'parent_id']),
            'termGroups' => TermGroup::query()->orderBy('parent_id')->orderBy('title_en')->get(['id', 'title_en', 'title_kh', 'parent_id']),
            'references' => Reference::query()->orderBy('title')->limit(100)->get(['id', 'title', 'code']),
        ]);
    }

    public function store(StoreTermRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $term = Term::create([
            'term_kh' => $data['term_kh'],
            'term_en' => $data['term_en'] ?? null,
            'term_fr' => $data['term_fr'] ?? null,
            'is_approved' => (bool) ($data['is_approved'] ?? false),
            'was_sent_to_telegram' => false,
            'user_id' => $request->user()->id,
        ]);

        if (! empty($data['sector_ids'])) {
            $term->sectors()->sync($data['sector_ids']);
        }

        if (! empty($data['term_group_ids'])) {
            $term->termGroups()->sync($data['term_group_ids']);
        }

        $term->references()->detach();
        foreach (['khmer', 'english', 'french'] as $language) {
            $referenceId = $data['reference_ids'][$language] ?? null;
            if ($referenceId !== null) {
                $term->references()->attach((int) $referenceId, ['language' => $language]);
            }
        }

        foreach ($data['definitions'] ?? [] as $def) {
            TermDefinition::create([
                'term_id' => $term->id,
                'language' => $def['language'],
                'definition' => $def['definition'],
                'reference_id' => $def['reference_id'] ?? null,
                'user_id' => $request->user()->id,
            ]);
        }

        return to_route('lexicon.terms.index')->with('success', 'Term created successfully.');
    }

    public function edit(Term $term): Response
    {
        $term->load(['sectors', 'termGroups', 'termDefinitions', 'references']);

        return Inertia::render('lexicon/terms/edit', [
            'term' => $term,
            'sectors' => Sector::query()->orderBy('parent_id')->orderBy('title_en')->get(['id', 'title_en', 'title_kh', 'parent_id']),
            'termGroups' => TermGroup::query()->orderBy('parent_id')->orderBy('title_en')->get(['id', 'title_en', 'title_kh', 'parent_id']),
            'references' => Reference::query()->orderBy('title')->limit(100)->get(['id', 'title', 'code']),
        ]);
    }

    public function update(UpdateTermRequest $request, Term $term): RedirectResponse
    {
        $data = $request->validated();

        $term->update([
            'term_kh' => $data['term_kh'],
            'term_en' => $data['term_en'] ?? null,
            'term_fr' => $data['term_fr'] ?? null,
            'is_approved' => (bool) ($data['is_approved'] ?? false),
        ]);

        $term->sectors()->sync($data['sector_ids'] ?? []);
        $term->termGroups()->sync($data['term_group_ids'] ?? []);

        $term->references()->detach();
        foreach (['khmer', 'english', 'french'] as $language) {
            $referenceId = $data['reference_ids'][$language] ?? null;
            if ($referenceId !== null) {
                $term->references()->attach((int) $referenceId, ['language' => $language]);
            }
        }

        $term->termDefinitions()->delete();
        foreach ($data['definitions'] ?? [] as $def) {
            TermDefinition::create([
                'term_id' => $term->id,
                'language' => $def['language'],
                'definition' => $def['definition'],
                'reference_id' => $def['reference_id'] ?? null,
                'user_id' => $request->user()->id,
            ]);
        }

        return to_route('lexicon.terms.index')->with('success', 'Term updated successfully.');
    }
}
