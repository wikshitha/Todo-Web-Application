<?php

namespace Database\Factories;

use App\Enums\TodoStatus;
use App\Models\Todo;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Todo>
 */
class TodoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(4),
            'description' => fake()->optional()->paragraph(),
            'status' => fake()->randomElement(TodoStatus::cases()),
            'due_date' => fake()
                ->optional()
                ->dateTimeBetween('now', '+1 month'),
        ];
    }

    /**
     * Create a todo with TODO status.
     */
    public function todo(): static
    {
        return $this->state(fn () => [
            'status' => TodoStatus::TODO,
        ]);
    }

    /**
     * Create a pending todo.
     */
    public function pending(): static
    {
        return $this->state(fn () => [
            'status' => TodoStatus::PENDING,
        ]);
    }

    /**
     * Create a completed todo.
     */
    public function completed(): static
    {
        return $this->state(fn () => [
            'status' => TodoStatus::COMPLETED,
        ]);
    }
}
