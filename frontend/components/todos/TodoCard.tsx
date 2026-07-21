import TodoStatusBadge from "@/components/todos/TodoStatusBadge";

import type {
  Todo,
  TodoStatus,
} from "@/types/todo";

import {
  formatDate,
  isTodoOverdue,
} from "@/utils/date";

interface TodoCardProps {
  todo: Todo;
  isUpdating?: boolean;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onStatusChange: (
    todo: Todo,
    status: TodoStatus
  ) => void;
}

export default function TodoCard({
  todo,
  isUpdating = false,
  onEdit,
  onDelete,
  onStatusChange,
}: TodoCardProps) {
  const overdue = isTodoOverdue(
    todo.due_date,
    todo.status
  );

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2
            className={`break-words text-lg font-semibold ${
              todo.status === "COMPLETED"
                ? "text-slate-500 line-through"
                : "text-slate-900"
            }`}
          >
            {todo.title}
          </h2>

          {todo.description ? (
            <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-slate-600">
              {todo.description}
            </p>
          ) : (
            <p className="mt-2 text-sm italic text-slate-400">
              No description
            </p>
          )}
        </div>

        <TodoStatusBadge status={todo.status} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        <span
          className={`text-sm font-medium ${
            overdue
              ? "text-red-600"
              : "text-slate-500"
          }`}
        >
          Due: {formatDate(todo.due_date)}
        </span>

        {overdue && (
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
            Overdue
          </span>
        )}
      </div>

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        {todo.status === "TODO" && (
          <button
            type="button"
            onClick={() =>
              onStatusChange(todo, "PENDING")
            }
            disabled={isUpdating}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdating ? "Updating..." : "Start"}
          </button>
        )}

        {todo.status === "PENDING" && (
          <button
            type="button"
            onClick={() =>
              onStatusChange(todo, "COMPLETED")
            }
            disabled={isUpdating}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdating
              ? "Updating..."
              : "Complete"}
          </button>
        )}

        {todo.status === "COMPLETED" && (
          <button
            type="button"
            onClick={() =>
              onStatusChange(todo, "TODO")
            }
            disabled={isUpdating}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdating
              ? "Updating..."
              : "Reopen"}
          </button>
        )}

        <button
          type="button"
          onClick={() => onEdit(todo)}
          disabled={isUpdating}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(todo)}
          disabled={isUpdating}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Delete
        </button>
      </div>
    </article>
  );
}