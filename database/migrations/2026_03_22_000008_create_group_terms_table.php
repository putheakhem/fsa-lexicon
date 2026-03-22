<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('group_terms', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('term_id')->constrained()->cascadeOnDelete();
            $table->foreignId('term_group_id')->constrained()->cascadeOnDelete();
            $table->text('note')->nullable();
            $table->timestamps();

            $table->unique(['term_id', 'term_group_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('group_terms');
    }
};
