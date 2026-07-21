"use client";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  lastPage,
  isLoading = false,
  onPageChange,
}: PaginationProps) {
  if (lastPage <= 1) {
    return null;
  }

  const pages = Array.from(
    { length: lastPage },
    (_, index) => index + 1
  );

  return (
    <nav
      aria-label="Todo pagination"
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() =>
          onPageChange(currentPage - 1)
        }
        disabled={
          currentPage === 1 || isLoading
        }
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() =>
            onPageChange(page)
          }
          disabled={isLoading}
          aria-current={
            page === currentPage
              ? "page"
              : undefined
          }
          className={`min-w-10 rounded-lg px-3 py-2 text-sm font-semibold transition ${
            page === currentPage
              ? "bg-slate-900 text-white"
              : "border border-slate-300 text-slate-700 hover:bg-slate-100"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() =>
          onPageChange(currentPage + 1)
        }
        disabled={
          currentPage === lastPage ||
          isLoading
        }
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
}