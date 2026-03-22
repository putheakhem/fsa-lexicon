<?php

declare(strict_types=1);

namespace App\Models\Lexicon;

use App\Models\User;
use Database\Factories\Lexicon\SectorFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Sector extends Model
{
    /** @use HasFactory<SectorFactory> */
    use HasFactory;

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
        return $this->belongsToMany(Term::class, 'sector_terms')
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
