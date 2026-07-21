import type { TodoStatus } from "@/types/todo";

interface TodoStatusBadgeProps {
  status: TodoStatus;
}

const statusStyles: Record<TodoStatus, string> = {
  TODO: "border-slate-200 bg-slate-100 text-slate-700",
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  COMPLETED:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const statusLabels: Record<TodoStatus, string> = {
  TODO: "To do",
  PENDING: "Pending",
  COMPLETED: "Completed",
};

export default function TodoStatusBadge({
  status,
}: TodoStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}