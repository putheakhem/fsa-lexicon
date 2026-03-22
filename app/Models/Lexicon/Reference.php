<?php

declare(strict_types=1);

namespace App\Models\Lexicon;

use App\Models\User;
use Database\Factories\Lexicon\ReferenceFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Reference extends Model
{
    /** @use HasFactory<ReferenceFactory> */
    use HasFactory;

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
            ->using(ReferenceTerm::class)
            ->withPivot('language')
            ->withTimestamps();
    }

    public function termDefinitions(): HasMany
    {
        return $this->hasMany(TermDefinition::class);
    }

    public function referenceTerms(): HasMany
    {
        return $this->hasMany(ReferenceTerm::class);
    }
}
