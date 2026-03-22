<?php

declare(strict_types=1);

namespace Database\Factories\Lexicon;

use App\Models\Lexicon\Reference;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reference>
 */
final class ReferenceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'code' => 'REF-'.fake()->unique()->numberBetween(1, 999),
            'file' => null,
            'file_cover' => null,
            'user_id' => null,
        ];
    }
}
