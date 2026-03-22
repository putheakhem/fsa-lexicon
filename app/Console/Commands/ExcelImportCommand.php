<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

final class ExcelImportCommand extends Command
{
    /**
     * mode:
     *  - fresh  : TRUNCATE table then insert (original behavior)
     *  - append : keep existing data, insert new rows only
     *  - upsert : update or insert based on `id` column from Excel
     *  - ignore : insert new rows, skip any that violate unique constraints
     *
     * folder:
     *  - subfolder under storage/app/import
     *    e.g. --folder=regulations → storage/app/import/regulations/
     */
    protected $signature = 'excel:import {filename?} {--folder=} {--mode=fresh}';

    protected $description = 'Import Excel files into corresponding tables';

    public function handle(): void
    {
        ini_set('memory_limit', '-1');
        set_time_limit(0);

        $filename = $this->argument('filename');

        if ($filename) {
            $this->importFileFromPath($filename);
        } else {
            $this->importAllFiles();
        }
    }

    private function getBaseFolder(): string
    {
        $folderOption = $this->option('folder');

        if ($folderOption) {
            return 'import/'.mb_trim((string) $folderOption, '/');
        }

        return 'import';
    }

    private function importFileFromPath(string $filename): void
    {
        $baseFolder = $this->getBaseFolder();
        $filePath = Storage::disk('local')->path("{$baseFolder}/{$filename}.xlsx");

        if (! file_exists($filePath)) {
            $this->error("File not found: {$filePath}");

            return;
        }

        try {
            $spreadsheet = IOFactory::load($filePath);
            $this->info("Processing file: {$filePath}");
            $this->importFile($spreadsheet, $filename);
        } catch (Exception $e) {
            $this->error("Error loading file: {$e->getMessage()}");
        }
    }

    private function importAllFiles(): void
    {
        $baseFolder = $this->getBaseFolder();
        $this->info("Importing from folder: {$baseFolder}");

        /** @var array<int, string> $files */
        $files = Storage::disk('local')->files($baseFolder);

        if ($files === []) {
            $this->warn("No files found in folder: {$baseFolder}");

            return;
        }

        foreach ($files as $file) {
            $filePath = Storage::disk('local')->path($file);
            $filename = pathinfo($file, PATHINFO_FILENAME);
            $extension = pathinfo($file, PATHINFO_EXTENSION);

            if (! in_array($extension, ['xlsx', 'xls'], true)) {
                $this->warn("Skipping non-Excel file: {$filePath}");

                continue;
            }

            try {
                $spreadsheet = IOFactory::load($filePath);
                $this->info("Processing file: {$filePath}");
                $this->importFile($spreadsheet, $filename);
            } catch (Exception $e) {
                $this->error("Failed to process {$filename}: {$e->getMessage()}");
            }
        }
    }

    private function isDateColumn(string $columnName): bool
    {
        $dateColumns = [
            'released_date',
            'published_at',
            'posted_date',
            'start_date',
            'end_date',
            'created_at',
            'updated_at',
            'response_date',
        ];

        return in_array(mb_strtolower($columnName), $dateColumns, true);
    }

    private function importFile(Spreadsheet $spreadsheet, string $filename): void
    {
        $mode = (string) $this->option('mode'); // fresh | append | upsert

        if (! in_array($mode, ['fresh', 'append', 'upsert', 'ignore'], true)) {
            $this->error("Invalid mode '{$mode}'. Allowed: fresh, append, upsert, ignore");

            return;
        }

        $worksheet = $spreadsheet->getActiveSheet();
        $rows = $worksheet->toArray();

        if ($rows === []) {
            $this->error("No data found in {$filename}");

            return;
        }

        // First row: column names
        $columns = array_map('strtolower', $rows[0]);
        array_shift($rows); // Remove header row

        $totalRows = count($rows);
        $this->info("Total Rows: {$totalRows} (mode: {$mode})");

        $bar = $this->output->createProgressBar($totalRows);
        $bar->start();

        $data = [];

        foreach ($rows as $row) {
            $rowData = [];

            foreach ($row as $index => $value) {
                $columnName = $columns[$index] ?? null;

                if (! $columnName) {
                    continue;
                }

                // In fresh/append mode, ignore `id` and let DB handle auto-increment.
                // In upsert mode, keep `id` for updateOrInsert.
                if ($columnName === 'id' && $mode !== 'upsert') {
                    continue;
                }

                if ($this->isDateColumn($columnName)) {
                    try {
                        $value = empty($value) ? null : Carbon::parse((string) $value)->format('Y-m-d');
                    } catch (Exception) {
                        $value = null;
                    }
                }

                $rowData[$columnName] = $value;
            }

            // Timestamps
            $rowData['created_at'] = $rowData['created_at'] ?? now();
            $rowData['updated_at'] = now();

            $data[] = $rowData;

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();

        if ($data === []) {
            $this->error("No valid data to import for {$filename}");

            return;
        }

        if ($mode === 'fresh') {
            $this->truncateTable($filename);
            $this->insertDataInChunks($filename, $data);
        } elseif ($mode === 'append') {
            $this->insertDataInChunks($filename, $data);
        } elseif ($mode === 'ignore') {
            $this->insertOrIgnoreInChunks($filename, $data);
        } else { // upsert
            $this->upsertData($filename, $data, 'id');
        }
    }

    private function truncateTable(string $table): void
    {
        try {
            $driver = DB::getDriverName();

            if ($driver === 'pgsql') {
                DB::statement("TRUNCATE TABLE \"{$table}\" RESTART IDENTITY CASCADE");
            } else {
                DB::statement('SET FOREIGN_KEY_CHECKS=0');
                DB::table($table)->truncate();
                DB::statement('SET FOREIGN_KEY_CHECKS=1');
            }
        } catch (Exception $e) {
            $this->error("Failed to truncate table {$table}: {$e->getMessage()}");
        }
    }

    /**
     * Insert data in chunks to avoid memory issues.
     *
     * @param  array<int, array<string, mixed>>  $data
     */
    private function insertDataInChunks(string $table, array $data, int $chunkSize = 500): void
    {
        try {
            if ($chunkSize < 1) {
                throw new InvalidArgumentException('Chunk size must be greater than 0');
            }

            $chunks = array_chunk($data, $chunkSize);
            $totalChunks = count($chunks);
            $this->info("Inserting data in {$totalChunks} chunks into {$table}...");

            $bar = $this->output->createProgressBar($totalChunks);
            $bar->start();

            foreach ($chunks as $chunk) {
                DB::table($table)->insert($chunk);
                $bar->advance();
            }

            $bar->finish();
            $this->newLine();
            $this->info("Successfully imported {$table}.");
        } catch (Exception $e) {
            $this->error("Error inserting data into {$table}: {$e->getMessage()}");
        }
    }

    /**
     * Insert data in chunks, skipping rows that violate unique constraints.
     *
     * @param  array<int, array<string, mixed>>  $data
     */
    private function insertOrIgnoreInChunks(string $table, array $data, int $chunkSize = 500): void
    {
        try {
            if ($chunkSize < 1) {
                throw new InvalidArgumentException('Chunk size must be greater than 0');
            }

            $chunks = array_chunk($data, $chunkSize);
            $totalChunks = count($chunks);
            $this->info("Inserting (ignore duplicates) in {$totalChunks} chunks into {$table}...");

            $bar = $this->output->createProgressBar($totalChunks);
            $bar->start();

            foreach ($chunks as $chunk) {
                DB::table($table)->insertOrIgnore($chunk);
                $bar->advance();
            }

            $bar->finish();
            $this->newLine();
            $this->info("Successfully imported {$table} (duplicates skipped).");
        } catch (Exception $e) {
            $this->error("Error inserting data into {$table}: {$e->getMessage()}");
        }
    }

    /**
     * Upsert data row by row (for when you don't want to drop existing records).
     *
     * Uses `id` as the key. Excel must contain an `id` column for updates.
     *
     * @param  array<int, array<string, mixed>>  $data
     */
    private function upsertData(string $table, array $data, string $keyColumn = 'id'): void
    {
        $this->info("Upserting data into {$table} using key column '{$keyColumn}'...");

        $total = count($data);
        $bar = $this->output->createProgressBar($total);
        $bar->start();

        foreach ($data as $row) {
            // If key column is missing or null, just insert a new row
            if (! array_key_exists($keyColumn, $row) || $row[$keyColumn] === null || $row[$keyColumn] === '') {
                DB::table($table)->insert($row);
                $bar->advance();

                continue;
            }

            $keyValue = $row[$keyColumn];
            $attributes = $row;
            unset($attributes[$keyColumn]);

            DB::table($table)->updateOrInsert(
                [$keyColumn => $keyValue],
                $attributes,
            );

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Upsert completed for {$table}.");
    }
}
