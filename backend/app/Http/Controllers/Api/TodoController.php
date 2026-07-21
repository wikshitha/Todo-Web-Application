<?php

namespace App\Http\Controllers\Api;

use App\Enums\TodoStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Todo\ListTodoRequest;
use App\Http\Requests\Todo\StoreTodoRequest;
use App\Http\Requests\Todo\UpdateTodoRequest;
use App\Http\Resources\TodoResource;
use App\Models\Todo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class TodoController extends Controller
{
    /**
     * Display the authenticated user's todos.
     */
    public function index(
        ListTodoRequest $request
    ): AnonymousResourceCollection {
        $validated = $request->validated();

        $search = $validated['search'] ?? null;
        $status = $validated['status'] ?? null;
        $sortBy = $validated['sort_by'] ?? 'created_at';
        $sortDirection = $validated['sort_direction'] ?? 'desc';
        $perPage = $validated['per_page'] ?? 10;

        /*
         * PostgreSQL supports ILIKE for case-insensitive search.
         * SQLite, which is used by the tests, does not support ILIKE.
         */
        $searchOperator = DB::connection()->getDriverName() === 'pgsql'
            ? 'ilike'
            : 'like';

        $query = $request->user()
            ->todos()
            ->when(
                $search,
                function ($query, string $search) use ($searchOperator) {
                    $query->where(
                        function ($query) use ($search, $searchOperator) {
                            $query
                                ->where(
                                    'title',
                                    $searchOperator,
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'description',
                                    $searchOperator,
                                    "%{$search}%"
                                );
                        }
                    );
                }
            )
            ->when($status, function ($query, string $status) {
                $query->where('status', $status);
            });

        if ($sortBy === 'due_date') {
            /*
             * PostgreSQL supports NULLS LAST.
             * SQLite does not support this syntax in the same way.
             */
            if (DB::connection()->getDriverName() === 'pgsql') {
                $query->orderByRaw(
                    "due_date {$sortDirection} nulls last"
                );
            } else {
                $query
                    ->orderByRaw('due_date is null')
                    ->orderBy('due_date', $sortDirection);
            }
        } else {
            $query->orderBy($sortBy, $sortDirection);
        }

        $todos = $query
            ->paginate($perPage)
            ->withQueryString();

        return TodoResource::collection($todos);
    }

    /**
     * Display statistics for the authenticated user's todos.
     */
    public function stats(Request $request): JsonResponse
    {
        $baseQuery = $request->user()->todos();

        return response()->json([
            'data' => [
                'total' => (clone $baseQuery)->count(),

                'todo' => (clone $baseQuery)
                    ->where('status', TodoStatus::TODO)
                    ->count(),

                'pending' => (clone $baseQuery)
                    ->where('status', TodoStatus::PENDING)
                    ->count(),

                'completed' => (clone $baseQuery)
                    ->where('status', TodoStatus::COMPLETED)
                    ->count(),

                'overdue' => (clone $baseQuery)
                    ->whereNotNull('due_date')
                    ->where('due_date', '<', now())
                    ->where('status', '!=', TodoStatus::COMPLETED)
                    ->count(),
            ],
        ]);
    }

    /**
     * Create a new todo.
     */
    public function store(StoreTodoRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $todo = $request->user()
            ->todos()
            ->create([
                ...$validated,
                'status' => $validated['status'] ?? TodoStatus::TODO,
            ]);

        return (new TodoResource($todo))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display one todo.
     */
    public function show(
        Request $request,
        Todo $todo
    ): TodoResource {
        $this->authorize('view', $todo);

        return new TodoResource($todo);
    }

    /**
     * Update one todo.
     */
    public function update(
        UpdateTodoRequest $request,
        Todo $todo
    ): TodoResource {
        $this->authorize('update', $todo);

        $todo->update($request->validated());

        return new TodoResource($todo->refresh());
    }

    /**
     * Delete one todo.
     */
    public function destroy(
        Request $request,
        Todo $todo
    ): JsonResponse {
        $this->authorize('delete', $todo);

        $todo->delete();

        return response()->json([
            'message' => 'Todo deleted successfully.',
        ]);
    }
}
