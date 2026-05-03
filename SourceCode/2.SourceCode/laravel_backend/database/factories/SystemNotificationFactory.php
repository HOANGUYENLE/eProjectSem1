<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SystemNotification>
 */
class SystemNotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "author_id" => fake()->numberBetween(1,10),
            "title"     => fake()->title(),
            "content"   => fake()->sentence(30),
            "status"    => fake()->randomElement(['published']),
            "created_at"=> now(),
            "expired_at"=> now()->addDays(fake()->numberBetween(3, 8)),
            "type"      => "system"
        ];
    }
}
