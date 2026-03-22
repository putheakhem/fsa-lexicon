<?php

declare(strict_types=1);

namespace App\Models\Lexicon;

use Database\Factories\Lexicon\TelegramAccountFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

final class TelegramAccount extends Model
{
    /** @use HasFactory<TelegramAccountFactory> */
    use HasFactory;

    protected $fillable = [
        'telegram_id',
        'first_name',
        'last_name',
        'username',
        'phone_number',
    ];
}
