<?php

declare(strict_types=1);

use App\Models\Lexicon\Reference;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
    Storage::fake('public');
});

it('renders the references index page', function () {
    Reference::factory()->count(3)->create();

    $this->get(route('lexicon.references.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('lexicon/references/index')
            ->has('references.data', 3)
        );
});

it('filters references by search query', function () {
    Reference::factory()->create(['title' => 'NBC FinTech Policy']);
    Reference::factory()->create(['title' => 'Unrelated Document']);

    $this->get(route('lexicon.references.index', ['search' => 'NBC']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('references.data', 1)
            ->where('references.data.0.title', 'NBC FinTech Policy')
        );
});

it('renders the create form', function () {
    $this->get(route('lexicon.references.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('lexicon/references/create'));
});

it('stores a new reference without a file', function () {
    $this->post(route('lexicon.references.store'), [
        'title' => 'NBC FinTech Policy 2025',
        'code' => 'REF-001',
    ])->assertRedirect(route('lexicon.references.index'));

    $this->assertDatabaseHas('references', [
        'title' => 'NBC FinTech Policy 2025',
        'code' => 'REF-001',
        'user_id' => $this->user->id,
    ]);
});

it('stores a new reference with a file', function () {
    $file = UploadedFile::fake()->create('policy.pdf', 512, 'application/pdf');

    $this->post(route('lexicon.references.store'), [
        'title' => 'Digital Asset Regulations',
        'code' => 'REF-002',
        'file' => $file,
    ])->assertRedirect(route('lexicon.references.index'));

    $reference = Reference::where('code', 'REF-002')->first();
    expect($reference)->not->toBeNull();
    Storage::disk('public')->assertExists((string) $reference->file);
});

it('validates required title on store', function () {
    $this->post(route('lexicon.references.store'), ['title' => ''])
        ->assertSessionHasErrors('title');
});

it('validates unique code on store', function () {
    Reference::factory()->create(['code' => 'REF-DUP']);

    $this->post(route('lexicon.references.store'), [
        'title' => 'Another Reference',
        'code' => 'REF-DUP',
    ])->assertSessionHasErrors('code');
});

it('renders the edit form', function () {
    $reference = Reference::factory()->create();

    $this->get(route('lexicon.references.edit', $reference))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('lexicon/references/edit')
            ->where('reference.id', $reference->id)
        );
});

it('updates a reference', function () {
    $reference = Reference::factory()->create(['title' => 'Old Title']);

    $this->put(route('lexicon.references.update', $reference), [
        'title' => 'New Title',
        'code' => 'REF-UPD',
    ])->assertRedirect(route('lexicon.references.index'));

    expect($reference->fresh()->title)->toBe('New Title');
});

it('replaces file on update', function () {
    $old = UploadedFile::fake()->create('old.pdf', 100, 'application/pdf');
    $oldPath = $old->store('references', 'public');
    $reference = Reference::factory()->create(['file' => $oldPath]);

    $newFile = UploadedFile::fake()->create('new.pdf', 200, 'application/pdf');
    $this->put(route('lexicon.references.update', $reference), [
        'title' => $reference->title,
        'file' => $newFile,
    ])->assertRedirect(route('lexicon.references.index'));

    Storage::disk('public')->assertMissing($oldPath);
    Storage::disk('public')->assertExists((string) $reference->fresh()->file);
});

it('deletes a reference and removes its file', function () {
    $file = UploadedFile::fake()->create('delete_me.pdf', 100, 'application/pdf');
    $path = $file->store('references', 'public');
    $reference = Reference::factory()->create(['file' => $path]);

    $this->delete(route('lexicon.references.destroy', $reference))
        ->assertRedirect(route('lexicon.references.index'));

    $this->assertModelMissing($reference);
    Storage::disk('public')->assertMissing($path);
});

it('requires authentication', function () {
    auth()->logout();

    $this->get(route('lexicon.references.index'))->assertRedirect(route('login'));
});
