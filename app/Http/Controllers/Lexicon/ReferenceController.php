<?php

declare(strict_types=1);

namespace App\Http\Controllers\Lexicon;

use App\Http\Controllers\Controller;
use App\Http\Requests\Lexicon\StoreReferenceRequest;
use App\Http\Requests\Lexicon\UpdateReferenceRequest;
use App\Models\Lexicon\Reference;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

final class ReferenceController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $references = Reference::query()
            ->with('user:id,name')
            ->when($search, function ($query, string $search): void {
                $query->where(function ($q) use ($search): void {
                    $q->where('title', 'ilike', "%{$search}%")
                        ->orWhere('code', 'ilike', "%{$search}%")
                        ->orWhere('file', 'ilike', "%{$search}%");
                });
            })
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Reference $ref) => [
                'id' => $ref->id,
                'title' => $ref->title,
                'code' => $ref->code,
                'file_name' => $ref->file ? basename((string) $ref->file) : null,
                'file_url' => $ref->file ? Storage::disk('public')->url((string) $ref->file) : null,
                'user' => $ref->user ? ['id' => $ref->user->id, 'name' => $ref->user->name] : null,
                'created_at' => $ref->created_at?->toDateString(),
            ]);

        return Inertia::render('lexicon/references/index', [
            'references' => $references,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('lexicon/references/create');
    }

    public function store(StoreReferenceRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('file')) {
            $data['file'] = $request->file('file')->store('references', 'public');
        }

        $data['user_id'] = $request->user()->id;

        Reference::create($data);

        return to_route('lexicon.references.index')->with('success', 'Reference created successfully.');
    }

    public function edit(Reference $reference): Response
    {
        return Inertia::render('lexicon/references/edit', [
            'reference' => [
                'id' => $reference->id,
                'title' => $reference->title,
                'code' => $reference->code,
                'file_name' => $reference->file ? basename((string) $reference->file) : null,
                'file_url' => $reference->file ? Storage::disk('public')->url((string) $reference->file) : null,
            ],
        ]);
    }

    public function update(UpdateReferenceRequest $request, Reference $reference): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('file')) {
            if ($reference->file) {
                Storage::disk('public')->delete((string) $reference->file);
            }
            $data['file'] = $request->file('file')->store('references', 'public');
        }

        $reference->update($data);

        return to_route('lexicon.references.index')->with('success', 'Reference updated successfully.');
    }

    public function destroy(Reference $reference): RedirectResponse
    {
        if ($reference->file) {
            Storage::disk('public')->delete((string) $reference->file);
        }

        $reference->delete();

        return to_route('lexicon.references.index')->with('success', 'Reference deleted successfully.');
    }
}
