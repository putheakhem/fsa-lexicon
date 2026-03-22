<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            CREATE INDEX terms_fts_idx ON terms
            USING GIN (
                to_tsvector(
                    'simple',
                    coalesce(term_kh, '') || ' ' ||
                    coalesce(term_en, '') || ' ' ||
                    coalesce(term_fr, '')
                )
            )
        ");
    }

    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS terms_fts_idx');
    }
};
