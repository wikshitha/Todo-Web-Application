"use client";

import { useAuth } from "@/context/AuthContext";

export default function TodosPage() {
  const { user } = useAuth();

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Todo dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Welcome, {user?.name}
          </h1>

          <p className="mt-3 text-slate-600">
            Your Todo management interface will be
            added in the next lesson.
          </p>
        </section>
      </div>
    </main>
  );
}