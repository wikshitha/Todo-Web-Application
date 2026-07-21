import TodoStatusBadge from "@/components/todos/TodoStatusBadge";
import type { Todo } from "@/types/todo";
import {
  formatDate,
  isTodoOverdue,
} from "@/utils/date";

interface TodoCardProps {
  todo: Todo;
}

export default function TodoCard({
  todo,
}: TodoCardProps) {
  const overdue = isTodoOverdue(
    todo.due_date,
    todo.status
  );

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2
            className={`text-lg font-semibold ${
              todo.status === "COMPLETED"
                ? "text-slate-500 line-through"
                : "text-slate-900"
            }`}
          >
            {todo.title}
          </h2>

          {todo.description ? (
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
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
    </article>
  );
}