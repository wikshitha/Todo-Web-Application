"use client";

import type {
  SortDirection,
  TodoSortBy,
  TodoStatus,
} from "@/types/todo";

interface TodoFiltersProps {
  search: string;
  status: TodoStatus | "";
  sortBy: TodoSortBy;
  sortDirection: SortDirection;
  onSearchChange: (value: string) => void;
  onStatusChange: (
    value: TodoStatus | ""
  ) => void;
  onSortByChange: (
    value: TodoSortBy
  ) => void;
  onSortDirectionChange: (
    value: SortDirection
  ) => void;
  onClear: () => void;
}

export default function TodoFilters({
  search,
  status,
  sortBy,
  sortDirection,
  onSearchChange,
  onStatusChange,
  onSortByChange,
  onSortDirectionChange,
  onClear,
}: TodoFiltersProps) {
  const hasFilters =
    search !== "" ||
    status !== "" ||
    sortBy !== "created_at" ||
    sortDirection !== "desc";

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <label
            htmlFor="todo-search"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Search
          </label>

          <input
            id="todo-search"
            type="search"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search todos..."
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div>
          <label
            htmlFor="todo-status-filter"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Status
          </label>

          <select
            id="todo-status-filter"
            value={status}
            onChange={(event) =>
              onStatusChange(
                event.target.value as
                  | TodoStatus
                  | ""
              )
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          >
            <option value="">
              All statuses
            </option>

            <option value="TODO">
              To do
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="COMPLETED">
              Completed
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="todo-sort"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Sort by
          </label>

          <select
            id="todo-sort"
            value={sortBy}
            onChange={(event) =>
              onSortByChange(
                event.target.value as TodoSortBy
              )
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          >
            <option value="created_at">
              Created date
            </option>

            <option value="due_date">
              Due date
            </option>

            <option value="title">
              Title
            </option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label
            htmlFor="todo-sort-direction"
            className="sr-only"
          >
            Sort direction
          </label>

          <select
            id="todo-sort-direction"
            value={sortDirection}
            onChange={(event) =>
              onSortDirectionChange(
                event.target
                  .value as SortDirection
              )
            }
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          >
            <option value="desc">
              Descending
            </option>

            <option value="asc">
              Ascending
            </option>
          </select>
        </div>

        <button
          type="button"
          onClick={onClear}
          disabled={!hasFilters}
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear filters
        </button>
      </div>
    </section>
  );
}