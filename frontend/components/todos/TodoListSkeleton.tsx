import TodoCardSkeleton from "@/components/todos/TodoCardSkeleton";

interface TodoListSkeletonProps {
  count?: number;
}

export default function TodoListSkeleton({
  count = 6,
}: TodoListSkeletonProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading todos"
    >
      <span className="sr-only">
        Loading your todos...
      </span>

      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: count }).map(
          (_, index) => (
            <TodoCardSkeleton key={index} />
          )
        )}
      </div>
    </div>
  );
}