export default function TodoCardSkeleton() {
  return (
    <article
      aria-hidden="true"
      className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="h-5 w-3/5 rounded bg-slate-200" />

          <div className="mt-3 h-4 w-full rounded bg-slate-100" />

          <div className="mt-2 h-4 w-4/5 rounded bg-slate-100" />
        </div>

        <div className="h-7 w-20 rounded-full bg-slate-200" />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <div className="h-4 w-24 rounded bg-slate-100" />

        <div className="h-4 w-28 rounded bg-slate-100" />
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <div className="h-9 w-20 rounded-lg bg-slate-200" />

        <div className="h-9 w-24 rounded-lg bg-slate-200" />

        <div className="h-9 w-20 rounded-lg bg-slate-200" />
      </div>
    </article>
  );
}