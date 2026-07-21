export default function TodoStatsSkeleton() {
  return (
    <section
      role="status"
      aria-live="polite"
      aria-label="Loading todo statistics"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      <span className="sr-only">
        Loading todo statistics...
      </span>

      {Array.from({ length: 5 }).map(
        (_, index) => (
          <article
            key={index}
            aria-hidden="true"
            className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="h-4 w-20 rounded bg-slate-200" />

            <div className="mt-4 h-9 w-14 rounded bg-slate-200" />

            <div className="mt-3 h-4 w-28 rounded bg-slate-100" />
          </article>
        )
      )}
    </section>
  );
}