<?php

declare(strict_types=1);

namespace App\Models\Lexicon;

use App\Enums\Lexicon\Language;
use App\Models\User;
use Database\Factories\Lexicon\TermDefinitionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class TermDefinition extends Model
{
    /** @use HasFactory<TermDefinitionFactory> */
    use HasFactory;

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

    protected function casts(): array
    {
        return [
            'language' => Language::class,
        ];
    }
}
