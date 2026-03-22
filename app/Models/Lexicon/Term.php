<?php

declare(strict_types=1);

namespace App\Models\Lexicon;

use App\Models\User;
use Database\Factories\Lexicon\TermFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Term extends Model
{
    /** @use HasFactory<TermFactory> */
    use HasFactory;

    protected $fillable = [
        'term_kh',
        'term_en',
        'term_fr',
        'telegram_image_path',
        'was_sent_to_telegram',
        'is_approved',
        'user_id',
    ];

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
            ->using(ReferenceTerm::class)
            ->withPivot('language')
            ->withTimestamps();
    }

    public function sectors(): BelongsToMany
    {
        return $this->belongsToMany(Sector::class, 'sector_terms')
            ->withPivot('note')
            ->withTimestamps();
    }

    public function termGroups(): BelongsToMany
    {
        return $this->belongsToMany(TermGroup::class, 'group_terms')
            ->withPivot('note')
            ->withTimestamps();
    }

    protected function casts(): array
    {
        return [
            'was_sent_to_telegram' => 'boolean',
            'is_approved' => 'boolean',
        ];
    }
}
