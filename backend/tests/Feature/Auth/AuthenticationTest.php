<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('a user can register', function () {
    $response = $this->postJson('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'Password123',
        'password_confirmation' => 'Password123',
    ]);

    $response
        ->assertCreated()
        ->assertJson([
            'message' => 'Registration successful.',
            'user' => [
                'name' => 'Test User',
                'email' => 'test@example.com',
            ],
        ]);

    $this->assertDatabaseHas('users', [
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);

    $this->assertAuthenticated();
});

test('registration requires valid data', function () {
    $response = $this->postJson('/register', [
        'name' => '',
        'email' => 'invalid-email',
        'password' => 'short',
        'password_confirmation' => 'different',
    ]);

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'name',
            'email',
            'password',
        ]);

    $this->assertGuest();
});

test('a user can log in with valid credentials', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => 'Password123',
    ]);

    $response = $this->postJson('/login', [
        'email' => 'test@example.com',
        'password' => 'Password123',
    ]);

    $response
        ->assertOk()
        ->assertJson([
            'message' => 'Login successful.',
            'user' => [
                'id' => $user->id,
                'email' => 'test@example.com',
            ],
        ]);

    $this->assertAuthenticatedAs($user);
});

test('a user cannot log in with invalid credentials', function () {
    User::factory()->create([
        'email' => 'test@example.com',
        'password' => 'Password123',
    ]);

    $response = $this->postJson('/login', [
        'email' => 'test@example.com',
        'password' => 'WrongPassword',
    ]);

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'email',
        ]);

    $this->assertGuest();
});

test('an authenticated user can access the current user endpoint', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->getJson('/api/user');

    $response
        ->assertOk()
        ->assertJson([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
});

test('a guest cannot access the current user endpoint', function () {
    $response = $this->getJson('/api/user');

    $response
        ->assertUnauthorized()
        ->assertJson([
            'message' => 'Unauthenticated.',
        ]);
});

test('an authenticated user can log out', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->postJson('/logout');

    $response
        ->assertOk()
        ->assertJson([
            'message' => 'Logout successful.',
        ]);

    $this->assertGuest();
});
