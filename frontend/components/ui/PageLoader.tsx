export default function PageLoader() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />

        <p className="mt-4 text-sm font-medium text-slate-600">
          Loading...
        </p>
      </div>
    </main>
  );
}