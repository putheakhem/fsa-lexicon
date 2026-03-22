<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Lexicon\Reference;
use App\Models\Lexicon\Sector;
use App\Models\Lexicon\Term;
use Inertia\Inertia;
use Inertia\Response;

final class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $stats = [
            'totalTerms' => Term::where('is_approved', true)->count(),
            'totalLanguages' => 3, // Khmer, English, French
            'totalSectors' => Sector::count(),
            'totalReferences' => Reference::count(),
        ];

        return Inertia::render('welcome', [
            'stats' => $stats,
        ]);
    }
}
