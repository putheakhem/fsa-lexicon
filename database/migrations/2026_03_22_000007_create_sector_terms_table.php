<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sector_terms', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('term_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sector_id')->constrained()->cascadeOnDelete();
            $table->string('note')->nullable();
            $table->timestamps();

            $table->unique(['term_id', 'sector_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sector_terms');
    }
};
