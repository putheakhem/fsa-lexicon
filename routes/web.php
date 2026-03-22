<?php

declare(strict_types=1);

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Lexicon\ReferenceController;
use App\Http\Controllers\Lexicon\TermController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::prefix('lexicon')->name('lexicon.')->group(function () {
        Route::get('terms', [TermController::class, 'index'])->name('terms.index');
        Route::get('terms/create', [TermController::class, 'create'])->name('terms.create');
        Route::post('terms', [TermController::class, 'store'])->name('terms.store');
        Route::get('terms/{term}/edit', [TermController::class, 'edit'])->name('terms.edit');
        Route::put('terms/{term}', [TermController::class, 'update'])->name('terms.update');

        Route::resource('references', ReferenceController::class)->except(['show'])->names([
            'index' => 'references.index',
            'create' => 'references.create',
            'store' => 'references.store',
            'edit' => 'references.edit',
            'update' => 'references.update',
            'destroy' => 'references.destroy',
        ]);
    });
});

require __DIR__.'/settings.php';
