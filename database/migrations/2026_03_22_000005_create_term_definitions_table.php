<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('term_definitions', function (Blueprint $table): void {
            $table->id();
            $table->longText('definition');
            $table->string('language');
            $table->text('note')->nullable();
            $table->foreignId('term_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('reference_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();

            $table->index('term_id');
            $table->index('reference_id');
            $table->index('language');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('term_definitions');
    }
};
