"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

import TodoCard from "@/components/todos/TodoCard";
import TodoFilters from "@/components/todos/TodoFilters";
import TodoForm from "@/components/todos/TodoForm";
import TodoListSkeleton from "@/components/todos/TodoListSkeleton";
import TodoStatCard from "@/components/todos/TodoStatCard";
import TodoStatsSkeleton from "@/components/todos/TodoStatsSkeleton";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import { useAuth } from "@/context/AuthContext";
import { todoQueryKeys } from "@/lib/queryKeys";

import {
  createTodo,
  deleteTodo,
  getTodos,
  getTodoStats,
  updateTodo,
} from "@/services/todo.service";

import type {
  SortDirection,
  Todo,
  TodoFormData,
  TodoListParams,
  TodoSortBy,
  TodoStatus,
} from "@/types/todo";

const emptyStats = {
  total: 0,
  todo: 0,
  pending: 0,
  completed: 0,
  overdue: 0,
};

export default function TodosPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  const [editingTodo, setEditingTodo] =
    useState<Todo | null>(null);

  const [deletingTodo, setDeletingTodo] =
    useState<Todo | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [status, setStatus] =
    useState<TodoStatus | "">("");

  const [sortBy, setSortBy] =
    useState<TodoSortBy>("created_at");

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("desc");

  const todoListParams: TodoListParams = {
    page,
    per_page: 10,
    search: search.trim() || undefined,
    status: status || undefined,
    sort_by: sortBy,
    sort_direction: sortDirection,
  };

  const todoListQuery = useQuery({
    queryKey: todoQueryKeys.list(todoListParams),
    queryFn: () => getTodos(todoListParams),
    placeholderData: keepPreviousData,
  });

  const todoStatsQuery = useQuery({
    queryKey: todoQueryKeys.stats(),
    queryFn: getTodoStats,
  });

  const refreshTodoData = async (): Promise<void> => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: todoQueryKeys.lists(),
      }),
      queryClient.invalidateQueries({
        queryKey: todoQueryKeys.stats(),
      }),
    ]);
  };

  const createTodoMutation = useMutation({
    mutationFn: createTodo,

    onSuccess: async () => {
      setIsCreateModalOpen(false);

      toast.success("Todo created successfully.");

      await refreshTodoData();
    },

    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
          "Unable to create the todo."
        );

        return;
      }

      toast.error(
        "An unexpected error occurred while creating the todo."
      );
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: ({
      todoId,
      data,
    }: {
      todoId: number;
      data: Partial<TodoFormData>;
    }) => updateTodo(todoId, data),

    onSuccess: async () => {
      await refreshTodoData();
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,

    onSuccess: async () => {
      setDeletingTodo(null);

      toast.success("Todo deleted successfully.");

      await refreshTodoData();
    },

    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
          "Unable to delete the todo."
        );

        return;
      }

      toast.error(
        "An unexpected error occurred while deleting the todo."
      );
    },
  });

  const handleCreateTodo = async (
    data: TodoFormData
  ): Promise<void> => {
    await createTodoMutation.mutateAsync(data);
  };

  const handleUpdateTodo = async (
    data: TodoFormData
  ): Promise<void> => {
    if (!editingTodo) {
      return;
    }

    try {
      await updateTodoMutation.mutateAsync({
        todoId: editingTodo.id,
        data,
      });

      setEditingTodo(null);

      toast.success("Todo updated successfully.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
          "Unable to update the todo."
        );

        return;
      }

      toast.error(
        "An unexpected error occurred while updating the todo."
      );
    }
  };

  const handleStatusChange = (
    todo: Todo,
    newStatus: TodoStatus
  ): void => {
    updateTodoMutation.mutate(
      {
        todoId: todo.id,
        data: {
          status: newStatus,
        },
      },
      {
        onSuccess: () => {
          const message =
            newStatus === "PENDING"
              ? "Todo started successfully."
              : newStatus === "COMPLETED"
                ? "Todo completed successfully."
                : "Todo reopened successfully.";

          toast.success(message);
        },

        onError: (error: unknown) => {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message ??
              "Unable to update the todo status."
            );

            return;
          }

          toast.error(
            "An unexpected error occurred while updating the status."
          );
        },
      }
    );
  };

  const handleDeleteTodo = (): void => {
    if (!deletingTodo) {
      return;
    }

    deleteTodoMutation.mutate(deletingTodo.id);
  };

  const handleRetry = async (): Promise<void> => {
    await Promise.all([
      todoListQuery.refetch(),
      todoStatsQuery.refetch(),
    ]);
  };

  const handleSearchChange = (
    value: string
  ): void => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilterChange = (
    value: TodoStatus | ""
  ): void => {
    setStatus(value);
    setPage(1);
  };

  const handleSortByChange = (
    value: TodoSortBy
  ): void => {
    setSortBy(value);
    setPage(1);
  };

  const handleSortDirectionChange = (
    value: SortDirection
  ): void => {
    setSortDirection(value);
    setPage(1);
  };

  const handleClearFilters = (): void => {
    setSearch("");
    setStatus("");
    setSortBy("created_at");
    setSortDirection("desc");
    setPage(1);
  };

  const handlePageChange = (
    newPage: number
  ): void => {
    const lastPage =
      todoListQuery.data?.meta.last_page ?? 1;

    if (
      newPage < 1 ||
      newPage > lastPage ||
      newPage === page
    ) {
      return;
    }

    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const stats =
    todoStatsQuery.data ?? emptyStats;

  const todos =
    todoListQuery.data?.data ?? [];

  const meta =
    todoListQuery.data?.meta;

  const isTodoListLoading =
    todoListQuery.isPending;

  const isStatsLoading =
    todoStatsQuery.isPending;

  const isInitialLoading =
    isTodoListLoading || isStatsLoading;

  const isRefreshing =
    todoListQuery.isFetching ||
    todoStatsQuery.isFetching;

  const queryError =
    todoListQuery.error ??
    todoStatsQuery.error;

  const hasActiveFilters =
    search.trim() !== "" ||
    status !== "" ||
    sortBy !== "created_at" ||
    sortDirection !== "desc";

  let errorMessage = "";

  if (queryError) {
    if (axios.isAxiosError(queryError)) {
      errorMessage =
        queryError.response?.data?.message ??
        "Unable to load your todos.";
    } else {
      errorMessage =
        "An unexpected error occurred while loading your todos.";
    }
  }

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Todo dashboard
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome, {user?.name}
              </h1>

              <p className="mt-2 text-slate-600">
                View and manage your personal tasks.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setIsCreateModalOpen(true)
              }
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Add todo
            </button>
          </div>
        </section>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>{errorMessage}</p>

              <button
                type="button"
                onClick={() =>
                  void handleRetry()
                }
                disabled={isRefreshing}
                className="font-semibold underline disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRefreshing
                  ? "Retrying..."
                  : "Try again"}
              </button>
            </div>
          </div>
        )}

        {isStatsLoading ? (
          <TodoStatsSkeleton />
        ) : (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <TodoStatCard
              label="Total"
              value={stats.total}
              description="All your todos"
            />

            <TodoStatCard
              label="To do"
              value={stats.todo}
              description="Not started"
            />

            <TodoStatCard
              label="Pending"
              value={stats.pending}
              description="Currently in progress"
            />

            <TodoStatCard
              label="Completed"
              value={stats.completed}
              description="Finished tasks"
            />

            <TodoStatCard
              label="Overdue"
              value={stats.overdue}
              description="Past their due date"
            />
          </section>
        )}

        <section className="mt-10">
          <TodoFilters
            search={search}
            status={status}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSearchChange={handleSearchChange}
            onStatusChange={
              handleStatusFilterChange
            }
            onSortByChange={handleSortByChange}
            onSortDirectionChange={
              handleSortDirectionChange
            }
            onClear={handleClearFilters}
          />

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Your todos
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {meta?.total ?? 0}{" "}
                {(meta?.total ?? 0) === 1
                  ? "todo"
                  : "todos"}{" "}
                found
              </p>
            </div>

            {isRefreshing && !isInitialLoading && (
              <p
                role="status"
                aria-live="polite"
                className="text-sm text-slate-500"
              >
                Refreshing...
              </p>
            )}
          </div>

          {isTodoListLoading ? (
            <TodoListSkeleton count={6} />
          ) : todos.length === 0 &&
            !errorMessage ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <h3 className="text-lg font-semibold text-slate-900">
                {hasActiveFilters
                  ? "No matching todos"
                  : "No todos yet"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {hasActiveFilters
                  ? "Try changing your search, status, or sorting options."
                  : "Create your first todo to start organizing your work."}
              </p>

              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-6 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Clear filters
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setIsCreateModalOpen(true)
                  }
                  className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Create first todo
                </button>
              )}
            </div>
          ) : (
            <>
              <div
                className={`transition-opacity duration-200 ${todoListQuery.isFetching
                  ? "opacity-60"
                  : "opacity-100"
                  }`}
              >
                <div className="grid gap-4 lg:grid-cols-2">
                  {todos.map((todo) => (
                    <TodoCard
                      key={todo.id}
                      todo={todo}
                      isUpdating={
                        updateTodoMutation.isPending &&
                        updateTodoMutation.variables?.todoId ===
                        todo.id
                      }
                      onEdit={setEditingTodo}
                      onDelete={setDeletingTodo}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={meta?.current_page ?? 1}
                  lastPage={meta?.last_page ?? 1}
                  isLoading={todoListQuery.isFetching}
                  onPageChange={handlePageChange}
                />
              </div>

              {meta &&
                meta.from !== null &&
                meta.to !== null && (
                  <p className="mt-4 text-center text-sm text-slate-500">
                    Showing {meta.from} to {meta.to} of {meta.total}{" "}
                    {meta.total === 1 ? "todo" : "todos"}
                  </p>
                )}
            </>
          )}
        </section>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        title="Create new todo"
        onClose={() => {
          if (!createTodoMutation.isPending) {
            setIsCreateModalOpen(false);
          }
        }}
      >
        <TodoForm
          onSubmit={handleCreateTodo}
          onCancel={() => {
            if (!createTodoMutation.isPending) {
              setIsCreateModalOpen(false);
            }
          }}
        />
      </Modal>

      <Modal
        isOpen={editingTodo !== null}
        title="Edit todo"
        onClose={() => {
          if (!updateTodoMutation.isPending) {
            setEditingTodo(null);
          }
        }}
      >
        {editingTodo && (
          <TodoForm
            key={editingTodo.id}
            initialData={{
              title: editingTodo.title,
              description:
                editingTodo.description,
              status: editingTodo.status,
              due_date: editingTodo.due_date,
            }}
            submitLabel="Save changes"
            submittingLabel="Saving..."
            onSubmit={handleUpdateTodo}
            onCancel={() => {
              if (!updateTodoMutation.isPending) {
                setEditingTodo(null);
              }
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deletingTodo !== null}
        title="Delete todo"
        message={
          deletingTodo
            ? `Are you sure you want to delete "${deletingTodo.title}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete todo"
        isConfirming={
          deleteTodoMutation.isPending
        }
        onConfirm={handleDeleteTodo}
        onCancel={() => {
          if (!deleteTodoMutation.isPending) {
            setDeletingTodo(null);
          }
        }}
      />
    </main>
  );
}