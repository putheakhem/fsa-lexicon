<?php

declare(strict_types=1);

use App\Http\Controllers\Lexicon\TermController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('lexicon')->name('lexicon.')->group(function () {
        Route::get('terms', [TermController::class, 'index'])->name('terms.index');
        Route::get('terms/create', [TermController::class, 'create'])->name('terms.create');
        Route::post('terms', [TermController::class, 'store'])->name('terms.store');
        Route::get('terms/{term}/edit', [TermController::class, 'edit'])->name('terms.edit');
        Route::put('terms/{term}', [TermController::class, 'update'])->name('terms.update');
    });
});

require __DIR__.'/settings.php';
