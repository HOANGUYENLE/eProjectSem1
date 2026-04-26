<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\LawyerFiles;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LawyerFiles>
 */
class LawyerFilesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'lawyer_id' => fake()->unique()->numberBetween(1,10),
            'address' => fake()->streetAddress(),
            'yearExp' => fake()->numberBetween(1,8),
            'cardNumber' =>fake()->unique()->numerify("############"),
            'licenseNumber' => fake()->unique()->text(12),
            'status' => fake()->randomElement(['pending', 'approve', 'reject'])
        ];
    }
}
