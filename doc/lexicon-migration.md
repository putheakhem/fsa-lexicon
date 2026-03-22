# Lexicon Feature Migration Guide

## Overview

This document provides a full migration blueprint for moving Lexicon features into a new Laravel project, including:

- Data model and table design
- Eloquent model structure
- Relationships
- Migration code

The schema below reflects the current Lexicon domain as implemented, with consolidated "final state" migrations suitable for a fresh project.

## Domain Entities

Core Lexicon entities:

1. `Term`
2. `TermDefinition`
3. `Reference`
4. `Sector`
5. `TermGroup`
6. `TelegramAccount`

Pivot/bridge entities:

1. `reference_terms`
2. `sector_terms`
3. `group_terms`

Optional cross-module bridge:

1. `document_references` (only if you also migrate the Document module)

## Relationship Map

- `Term` belongs to `User`
- `Term` has many `TermDefinition`
- `Term` belongs to many `Reference` via `reference_terms` (pivot: `language`)
- `Term` belongs to many `Sector` via `sector_terms` (pivot: `note`)
- `Term` belongs to many `TermGroup` via `group_terms` (pivot: `note`)

- `TermDefinition` belongs to `Term`
- `TermDefinition` belongs to `Reference`
- `TermDefinition` belongs to `User` (nullable)

- `Reference` belongs to `User` (nullable)
- `Reference` belongs to many `Term` via `reference_terms`
- `Reference` has many `ReferenceTerm`

- `Sector` belongs to `User` (nullable)
- `Sector` belongs to many `Term` via `sector_terms`
- `Sector` belongs to `Sector` as parent via `parent_id`
- `Sector` has many child `Sector` records via `parent_id`

- `TermGroup` belongs to many `Term` via `group_terms`
- `TermGroup` has nullable `parent_id` column (hierarchy-ready)

## Enum

`App\Enums\Lexicon\Language`:

- `Khmer = khmer`
- `English = english`
- `French = french`

## Final Schema Migration (Fresh Project)

> This is a consolidated migration that represents final table states after all Lexicon updates.

```php
<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('term_groups', function (Blueprint $table): void {
            $table->id();
            $table->string('title_kh');
            $table->string('title_en');
            $table->string('slug')->nullable()->unique();
            $table->string('code')->nullable()->unique();
            $table->foreignId('parent_id')->nullable();
            $table->timestamps();
        });

        Schema::create('terms', function (Blueprint $table): void {
            $table->id();
            $table->text('term_kh');
            $table->text('term_en')->nullable();
            $table->text('term_fr')->nullable();
            $table->string('telegram_image_path')->nullable();
            $table->boolean('was_sent_to_telegram')->default(false);
            $table->boolean('is_approved')->default(false);
            $table->foreignId('user_id')->constrained();
            $table->timestamps();
        });

        Schema::create('sectors', function (Blueprint $table): void {
            $table->id();
            $table->string('title_kh');
            $table->string('title_en');
            $table->string('slug')->nullable()->unique();
            $table->string('code')->nullable()->unique();
            $table->foreignId('parent_id')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('references', function (Blueprint $table): void {
            $table->id();
            $table->text('title');
            $table->string('code')->nullable()->unique();
            $table->string('file_cover')->nullable();
            $table->string('file')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('term_definitions', function (Blueprint $table): void {
            $table->id();
            $table->longText('definition');
            $table->string('language');
            $table->text('note')->nullable();
            $table->foreignId('term_id')->nullable()->constrained();
            $table->foreignId('reference_id')->nullable()->constrained();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('reference_terms', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('reference_id')->constrained();
            $table->foreignId('term_id')->constrained();
            $table->string('language');
            $table->timestamps();
        });

        Schema::create('sector_terms', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('term_id')->constrained();
            $table->foreignId('sector_id')->constrained();
            $table->string('note')->nullable();
            $table->timestamps();
        });

        Schema::create('group_terms', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('term_id')->constrained();
            $table->foreignId('term_group_id')->constrained();
            $table->text('note')->nullable();
            $table->timestamps();
        });

        Schema::create('telegram_accounts', function (Blueprint $table): void {
            $table->id();
            $table->string('telegram_id');
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('username')->nullable();
            $table->string('phone_number')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('telegram_accounts');
        Schema::dropIfExists('group_terms');
        Schema::dropIfExists('sector_terms');
        Schema::dropIfExists('reference_terms');
        Schema::dropIfExists('term_definitions');
        Schema::dropIfExists('references');
        Schema::dropIfExists('sectors');
        Schema::dropIfExists('terms');
        Schema::dropIfExists('term_groups');
    }
};
```

## Eloquent Models

### `Term`

```php
<?php

declare(strict_types=1);

namespace App\Models\Lexicon;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Term extends Model
{
    protected $fillable = [
        'term_kh',
        'term_en',
        'term_fr',
        'telegram_image_path',
        'was_sent_to_telegram',
        'is_approved',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'is_approved' => 'boolean',
            'was_sent_to_telegram' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function termDefinitions(): HasMany
    {
        return $this->hasMany(TermDefinition::class);
    }

    public function references(): BelongsToMany
    {
        return $this->belongsToMany(Reference::class, 'reference_terms')
            ->withPivot('language');
    }

    public function sectors(): BelongsToMany
    {
        return $this->belongsToMany(Sector::class, 'sector_terms');
    }

    public function termGroups(): BelongsToMany
    {
        return $this->belongsToMany(TermGroup::class, 'group_terms');
    }
}
```

### `TermDefinition`

```php
<?php

declare(strict_types=1);

namespace App\Models\Lexicon;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class TermDefinition extends Model
{
    protected $fillable = [
        'definition',
        'language',
        'note',
        'term_id',
        'reference_id',
        'user_id',
    ];

    public function term(): BelongsTo
    {
        return $this->belongsTo(Term::class);
    }

    public function reference(): BelongsTo
    {
        return $this->belongsTo(Reference::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

### `Reference`

```php
<?php

declare(strict_types=1);

namespace App\Models\Lexicon;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Reference extends Model
{
    protected $fillable = [
        'title',
        'code',
        'file_cover',
        'file',
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function terms(): BelongsToMany
    {
        return $this->belongsToMany(Term::class, 'reference_terms')
            ->withPivot('language');
    }

    public function referenceTerms(): HasMany
    {
        return $this->hasMany(ReferenceTerm::class);
    }
}
```

### `Sector`

```php
<?php

declare(strict_types=1);

namespace App\Models\Lexicon;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Sector extends Model
{
    protected $fillable = [
        'title_kh',
        'title_en',
        'slug',
        'code',
        'parent_id',
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function terms(): BelongsToMany
    {
        return $this->belongsToMany(Term::class, 'sector_terms');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }
}
```

### `TermGroup`

```php
<?php

declare(strict_types=1);

namespace App\Models\Lexicon;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final class TermGroup extends Model
{
    protected $fillable = [
        'title_kh',
        'title_en',
        'slug',
        'code',
        'parent_id',
    ];

    public function terms(): BelongsToMany
    {
        return $this->belongsToMany(Term::class, 'group_terms');
    }
}
```

### `ReferenceTerm` (custom pivot model)

```php
<?php

declare(strict_types=1);

namespace App\Models\Lexicon;

use App\Enums\Lexicon\Language;
use Illuminate\Database\Eloquent\Model;

final class ReferenceTerm extends Model
{
    protected $fillable = [
        'reference_id',
        'term_id',
        'language',
    ];

    protected function casts(): array
    {
        return [
            'language' => Language::class,
        ];
    }
}
```

### `TelegramAccount`

```php
<?php

declare(strict_types=1);

namespace App\Models\Lexicon;

use Illuminate\Database\Eloquent\Model;

final class TelegramAccount extends Model
{
    protected $fillable = [
        'telegram_id',
        'first_name',
        'last_name',
        'username',
        'phone_number',
    ];
}
```

### Simple pivot models (optional)

`SectorTerm` and `GroupTerm` can remain empty `Model` classes unless you need custom methods/casts.

## Migration Notes

- `term_en` is nullable in the final schema.
- `terms.is_approved` defaults to `false` in the final schema.
- `term_groups.parent_id` exists in database, but parent/child relationship methods were not implemented in source model. Add them if needed.
- `sectors.parent_id` is plain nullable `foreignId` (no FK constraint in source migrations).
- `user_id` is required in `terms` and nullable in `sectors`, `references`, and `term_definitions`.
- `document_references` is optional and depends on `documents` table availability.

## PostgreSQL Compatibility Notes

- The schema in this guide is PostgreSQL-compatible as written.
- `foreignId(...)->nullable()` is preferred over `unsignedBigInteger(...)` for portable migrations across MySQL and PostgreSQL.
- If you add parent/child FK constraints, use explicit self-referencing constraints:
  - `->constrained('sectors')->nullOnDelete()`
  - `->constrained('term_groups')->nullOnDelete()`
- The "add full-text index" recommendation for term search is engine-specific:
  - PostgreSQL: use `tsvector` + GIN index (or trigram index for partial matching).
  - MySQL: use native FULLTEXT index where supported.

### PostgreSQL Full-Text Example (`terms`)

Use an expression-based GIN index for cross-language term lookup:

```php
<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            CREATE INDEX terms_fts_idx ON terms
            USING GIN (
                to_tsvector(
                    'simple',
                    coalesce(term_kh, '') || ' ' ||
                    coalesce(term_en, '') || ' ' ||
                    coalesce(term_fr, '')
                )
            )
        ");
    }

    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS terms_fts_idx');
    }
};
```

Example search query:

```php
Term::query()
    ->whereRaw(
        "to_tsvector('simple', coalesce(term_kh, '') || ' ' || coalesce(term_en, '') || ' ' || coalesce(term_fr, '')) @@ plainto_tsquery('simple', ?)",
        [$keyword]
    );
```

## Recommended Import Order

1. `term_groups`
2. `terms`
3. `sectors`
4. `references`
5. `term_definitions`
6. `reference_terms`
7. `sector_terms`
8. `group_terms`
9. `telegram_accounts`
10. `document_references` (optional)

## Recommendations Per Point

1. `Term`
- Add unique index on normalized term text if duplicates are not allowed.
- Add full-text index for `term_kh`, `term_en`, `term_fr` for faster search.
- Keep `user_id` required for clear audit ownership.

2. `TermDefinition`
- Consider enum cast for `language` (same style as `ReferenceTerm`) to prevent invalid values.
- Add soft deletes if definitions are updated frequently and history matters.
- Add validation to require either `term_id` or `reference_id` according to your business rule.

3. `Reference`
- Add index on `code` and optionally on `title` for faster lookup.
- If files are mandatory in the new project, make `file` non-nullable.
- Keep `user_id` nullable only if system-generated references are expected.

4. `Sector`
- Add FK for `parent_id` (e.g. `->constrained('sectors')->nullOnDelete()`) for integrity.
- Add index on `parent_id` for hierarchy queries.
- Keep slug uniqueness strategy explicit and consistent.

5. `TermGroup`
- If hierarchy is needed, implement `parent()` and `children()` model relationships.
- Add FK for `parent_id` if you want strict tree consistency.
- Add `sort_order` if admin UI requires deterministic ordering.

6. Pivot tables
- Add composite unique constraints to prevent duplicates:
  - `reference_terms(reference_id, term_id, language)`
  - `sector_terms(term_id, sector_id)`
  - `group_terms(term_id, term_group_id)`
- Keep pivot `note` columns only where your product uses them.

7. `TelegramAccount`
- Add unique index on `telegram_id`.
- Consider encrypting or masking `phone_number` if sensitive data policies apply.

8. `document_references` (optional)
- Migrate only if the Document module exists in the new project.
- Add composite unique index on `(document_id, reference_id)`.

9. Migration strategy
- Prefer fresh consolidated migrations in the new project instead of replaying all historical incremental files.
- Seed a small dataset first to validate relationships before full import.

10. Quality controls
- Add Pest tests for create/list/filter flows of `Term`, `Reference`, and `Sector`.
- Enforce both DB constraints and request validation.
- Benchmark search queries early and add missing indexes before production-scale data.
