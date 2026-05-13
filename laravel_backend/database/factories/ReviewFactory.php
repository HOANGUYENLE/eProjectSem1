<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
   public function definition(): array
    {
        $comments = [
            "Very professional and helpful.",
            "Quick response and clear advice.",
            "Satisfied with the consultation.",
            "Could improve communication.",
            "Excellent service, highly recommend.",
            "Knowledgeable and trustworthy.",
            "Friendly and approachable.",
            "Clear and concise guidance."
        ];

        return [
            'user_id'    => $this->faker->randomElement([1,3,9,12,15,16,19,20,23,42]),
            'lawyer_id'  => $this->faker->randomElement([10,14,11,22,18,21,42,4,12,16]),
            'rating'     => $this->faker->numberBetween(1, 5),
            'comment'    => $this->faker->randomElement($comments),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
