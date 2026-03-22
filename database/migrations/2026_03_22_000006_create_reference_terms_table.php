<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reference_terms', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('reference_id')->constrained()->cascadeOnDelete();
            $table->foreignId('term_id')->constrained()->cascadeOnDelete();
            $table->string('language');
            $table->timestamps();

            $table->unique(['reference_id', 'term_id', 'language']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reference_terms');
    }
};
