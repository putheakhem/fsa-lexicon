<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('terms', function (Blueprint $table): void {
            $table->id();
            $table->text('term_kh');
            $table->text('term_en')->nullable();
            $table->text('term_fr')->nullable();
            $table->string('telegram_image_path')->nullable();
            $table->boolean('was_sent_to_telegram')->default(false);
            $table->boolean('is_approved')->default(false);
            $table->foreignId('user_id')->constrained();
            $table->timestamps();

            $table->index('user_id');
            $table->index('is_approved');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('terms');
    }
};
