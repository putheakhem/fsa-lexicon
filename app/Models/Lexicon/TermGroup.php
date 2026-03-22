<?php

declare(strict_types=1);

namespace App\Models\Lexicon;

use Database\Factories\Lexicon\TermGroupFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class TermGroup extends Model
{
    /** @use HasFactory<TermGroupFactory> */
    use HasFactory;

    protected $fillable = [
        'title_kh',
        'title_en',
        'slug',
        'code',
        'parent_id',
    ];

    public function terms(): BelongsToMany
    {
        return $this->belongsToMany(Term::class, 'group_terms')
            ->withPivot('note')
            ->withTimestamps();
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
