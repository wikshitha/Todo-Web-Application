"use client";

import axios from "axios";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import TodoCard from "@/components/todos/TodoCard";
import TodoStatCard from "@/components/todos/TodoStatCard";
import { useAuth } from "@/context/AuthContext";
import {
  getTodos,
  getTodoStats,
} from "@/services/todo.service";

import type {
  PaginationMeta,
  Todo,
  TodoStats,
} from "@/types/todo";

const emptyStats: TodoStats = {
  total: 0,
  todo: 0,
  pending: 0,
  completed: 0,
  overdue: 0,
};

const emptyMeta: PaginationMeta = {
  current_page: 1,
  from: null,
  last_page: 1,
  per_page: 10,
  to: null,
  total: 0,
};

export default function TodosPage() {
  const { user } = useAuth();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [stats, setStats] =
    useState<TodoStats>(emptyStats);
  const [meta, setMeta] =
    useState<PaginationMeta>(emptyMeta);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [todoResponse, todoStats] =
        await Promise.all([
          getTodos({
            page: 1,
            per_page: 10,
            sort_by: "created_at",
            sort_direction: "desc",
          }),
          getTodoStats(),
        ]);

      setTodos(todoResponse.data);
      setMeta(todoResponse.meta);
      setStats(todoStats);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ??
            "Unable to load your todos."
        );
      } else {
        setError(
          "An unexpected error occurred while loading your todos."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

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
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Add todo
            </button>
          </div>
        </section>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>{error}</p>

              <button
                type="button"
                onClick={() => void loadDashboard()}
                className="font-semibold underline"
              >
                Try again
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
                {meta.total}{" "}
                {meta.total === 1 ? "todo" : "todos"} in total
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading your todos...
              </p>
            </div>
          ) : todos.length === 0 && !error ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <h3 className="text-lg font-semibold text-slate-900">
                No todos yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create your first todo to start organizing
                your work.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {todos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}