<?php

declare(strict_types=1);

namespace App\Models\Lexicon;

use App\Enums\Lexicon\Language;
use Illuminate\Database\Eloquent\Relations\Pivot;

final class ReferenceTerm extends Pivot
{
    public $incrementing = true;

    public $timestamps = true;

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
