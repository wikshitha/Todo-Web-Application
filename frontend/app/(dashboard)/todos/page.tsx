"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

import TodoCard from "@/components/todos/TodoCard";
import TodoForm from "@/components/todos/TodoForm";
import TodoStatCard from "@/components/todos/TodoStatCard";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Modal from "@/components/ui/Modal";
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
  Todo,
  TodoFormData,
  TodoStatus,
} from "@/types/todo";

const todoListParams = {
  page: 1,
  per_page: 10,
  sort_by: "created_at" as const,
  sort_direction: "desc" as const,
};

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

  const todoListQuery = useQuery({
    queryKey: todoQueryKeys.list(todoListParams),
    queryFn: () => getTodos(todoListParams),
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

    await updateTodoMutation.mutateAsync({
      todoId: editingTodo.id,
      data,
    });

    setEditingTodo(null);

    toast.success("Todo updated successfully.");
  };

  const handleStatusChange = (
    todo: Todo,
    status: TodoStatus
  ): void => {
    updateTodoMutation.mutate(
      {
        todoId: todo.id,
        data: {
          status,
        },
      },
      {
        onSuccess: () => {
          const message =
            status === "PENDING"
              ? "Todo started successfully."
              : status === "COMPLETED"
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

  const stats =
    todoStatsQuery.data ?? emptyStats;

  const todos =
    todoListQuery.data?.data ?? [];

  const meta =
    todoListQuery.data?.meta;

  const isLoading =
    todoListQuery.isPending ||
    todoStatsQuery.isPending;

  const isRefreshing =
    todoListQuery.isFetching ||
    todoStatsQuery.isFetching;

  const queryError =
    todoListQuery.error ??
    todoStatsQuery.error;

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

        <section className="mt-10">
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
                in total
              </p>
            </div>

            {isRefreshing && !isLoading && (
              <p className="text-sm text-slate-500">
                Refreshing...
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading your todos...
              </p>
            </div>
          ) : todos.length === 0 &&
            !errorMessage ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <h3 className="text-lg font-semibold text-slate-900">
                No todos yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create your first todo to start
                organizing your work.
              </p>

              <button
                type="button"
                onClick={() =>
                  setIsCreateModalOpen(true)
                }
                className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Create first todo
              </button>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {todos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  isUpdating={
                    updateTodoMutation.isPending &&
                    updateTodoMutation.variables
                      ?.todoId === todo.id
                  }
                  onEdit={setEditingTodo}
                  onDelete={setDeletingTodo}
                  onStatusChange={
                    handleStatusChange
                  }
                />
              ))}
            </div>
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
              if (
                !updateTodoMutation.isPending
              ) {
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