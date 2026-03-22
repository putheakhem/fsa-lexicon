<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('term_groups', function (Blueprint $table): void {
            $table->id();
            $table->string('title_kh');
            $table->string('title_en');
            $table->string('slug')->nullable()->unique();
            $table->string('code')->nullable()->unique();
            $table->foreignId('parent_id')->nullable()->constrained('term_groups')->nullOnDelete();
            $table->timestamps();

            $table->index('parent_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('term_groups');
    }
};
