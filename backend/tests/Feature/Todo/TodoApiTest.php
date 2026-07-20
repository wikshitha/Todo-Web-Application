<?php

use App\Enums\TodoStatus;
use App\Models\Todo;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('a guest cannot access todo endpoints', function () {
    $todo = Todo::factory()->create();

    $this->getJson('/api/todos')
        ->assertUnauthorized();

    $this->postJson('/api/todos', [
        'title' => 'Test todo',
    ])->assertUnauthorized();

    $this->getJson("/api/todos/{$todo->id}")
        ->assertUnauthorized();

    $this->patchJson("/api/todos/{$todo->id}", [
        'status' => TodoStatus::COMPLETED->value,
    ])->assertUnauthorized();

    $this->deleteJson("/api/todos/{$todo->id}")
        ->assertUnauthorized();
});

test('an authenticated user can create a todo', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->postJson('/api/todos', [
            'title' => 'Complete Laravel assessment',
            'description' => 'Finish the Todo API.',
            'status' => TodoStatus::PENDING->value,
            'due_date' => '2026-07-30 18:00:00',
        ]);

    $response
        ->assertCreated()
        ->assertJsonPath(
            'data.title',
            'Complete Laravel assessment'
        )
        ->assertJsonPath(
            'data.status',
            TodoStatus::PENDING->value
        );

    $this->assertDatabaseHas('todos', [
        'user_id' => $user->id,
        'title' => 'Complete Laravel assessment',
        'status' => TodoStatus::PENDING->value,
    ]);
});

test('a todo receives TODO as its default status', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->postJson('/api/todos', [
            'title' => 'Learn Laravel factories',
        ]);

    $response
        ->assertCreated()
        ->assertJsonPath(
            'data.status',
            TodoStatus::TODO->value
        );

    $this->assertDatabaseHas('todos', [
        'user_id' => $user->id,
        'title' => 'Learn Laravel factories',
        'status' => TodoStatus::TODO->value,
    ]);
});

test('todo creation validates the request data', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->postJson('/api/todos', [
            'title' => '',
            'status' => 'DONE',
            'due_date' => 'invalid-date',
        ]);

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'title',
            'status',
            'due_date',
        ]);

    $this->assertDatabaseCount('todos', 0);
});

test('a user can list only their own todos', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    Todo::factory()
        ->count(3)
        ->for($user)
        ->create();

    Todo::factory()
        ->count(2)
        ->for($otherUser)
        ->create();

    $response = $this
        ->actingAs($user)
        ->getJson('/api/todos');

    $response
        ->assertOk()
        ->assertJsonCount(3, 'data')
        ->assertJsonPath('meta.total', 3);
});

test('a user can view their own todo', function () {
    $user = User::factory()->create();

    $todo = Todo::factory()
        ->for($user)
        ->create([
            'title' => 'My private todo',
        ]);

    $response = $this
        ->actingAs($user)
        ->getJson("/api/todos/{$todo->id}");

    $response
        ->assertOk()
        ->assertJsonPath('data.id', $todo->id)
        ->assertJsonPath('data.title', 'My private todo');
});

test('a user cannot view another users todo', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();

    $todo = Todo::factory()
        ->for($owner)
        ->create();

    $this
        ->actingAs($otherUser)
        ->getJson("/api/todos/{$todo->id}")
        ->assertForbidden();
});

test('a user can update their own todo', function () {
    $user = User::factory()->create();

    $todo = Todo::factory()
        ->for($user)
        ->todo()
        ->create([
            'title' => 'Old title',
        ]);

    $response = $this
        ->actingAs($user)
        ->patchJson("/api/todos/{$todo->id}", [
            'title' => 'Updated title',
            'status' => TodoStatus::COMPLETED->value,
        ]);

    $response
        ->assertOk()
        ->assertJsonPath('data.title', 'Updated title')
        ->assertJsonPath(
            'data.status',
            TodoStatus::COMPLETED->value
        );

    $this->assertDatabaseHas('todos', [
        'id' => $todo->id,
        'user_id' => $user->id,
        'title' => 'Updated title',
        'status' => TodoStatus::COMPLETED->value,
    ]);
});

test('a user cannot update another users todo', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();

    $todo = Todo::factory()
        ->for($owner)
        ->create([
            'title' => 'Owners todo',
        ]);

    $this
        ->actingAs($otherUser)
        ->patchJson("/api/todos/{$todo->id}", [
            'title' => 'Unauthorized update',
        ])
        ->assertForbidden();

    $this->assertDatabaseHas('todos', [
        'id' => $todo->id,
        'title' => 'Owners todo',
    ]);
});

test('a user can delete their own todo', function () {
    $user = User::factory()->create();

    $todo = Todo::factory()
        ->for($user)
        ->create();

    $response = $this
        ->actingAs($user)
        ->deleteJson("/api/todos/{$todo->id}");

    $response
        ->assertOk()
        ->assertJson([
            'message' => 'Todo deleted successfully.',
        ]);

    $this->assertDatabaseMissing('todos', [
        'id' => $todo->id,
    ]);
});

test('a user cannot delete another users todo', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();

    $todo = Todo::factory()
        ->for($owner)
        ->create();

    $this
        ->actingAs($otherUser)
        ->deleteJson("/api/todos/{$todo->id}")
        ->assertForbidden();

    $this->assertDatabaseHas('todos', [
        'id' => $todo->id,
    ]);
});

test('a user can search todos by title and description', function () {
    $user = User::factory()->create();

    Todo::factory()
        ->for($user)
        ->create([
            'title' => 'Learn Laravel relationships',
            'description' => null,
        ]);

    Todo::factory()
        ->for($user)
        ->create([
            'title' => 'Build backend',
            'description' => 'Complete the Laravel API',
        ]);

    Todo::factory()
        ->for($user)
        ->create([
            'title' => 'Learn Next.js',
            'description' => 'Build the frontend',
        ]);

    $response = $this
        ->actingAs($user)
        ->getJson('/api/todos?search=laravel');

    $response
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('meta.total', 2);
});

test('a user can filter todos by status', function () {
    $user = User::factory()->create();

    Todo::factory()
        ->count(2)
        ->for($user)
        ->pending()
        ->create();

    Todo::factory()
        ->count(3)
        ->for($user)
        ->completed()
        ->create();

    Todo::factory()
        ->for($user)
        ->todo()
        ->create();

    $response = $this
        ->actingAs($user)
        ->getJson(
            '/api/todos?status='.
            TodoStatus::COMPLETED->value
        );

    $response
        ->assertOk()
        ->assertJsonCount(3, 'data')
        ->assertJsonPath('meta.total', 3);

    foreach ($response->json('data') as $todo) {
        expect($todo['status'])
            ->toBe(TodoStatus::COMPLETED->value);
    }
});

test('todo listing is paginated', function () {
    $user = User::factory()->create();

    Todo::factory()
        ->count(12)
        ->for($user)
        ->create();

    $response = $this
        ->actingAs($user)
        ->getJson('/api/todos?per_page=5&page=2');

    $response
        ->assertOk()
        ->assertJsonCount(5, 'data')
        ->assertJsonPath('meta.current_page', 2)
        ->assertJsonPath('meta.per_page', 5)
        ->assertJsonPath('meta.total', 12)
        ->assertJsonPath('meta.last_page', 3);
});

test('todo listing validates query parameters', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->getJson(
            '/api/todos?status=DONE'.
            '&sort_by=password'.
            '&sort_direction=random'.
            '&per_page=500'
        );

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'status',
            'sort_by',
            'sort_direction',
            'per_page',
        ]);
});
