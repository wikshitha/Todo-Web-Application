"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import { getAuthenticatedUser } from "@/services/auth.service";
import type { User } from "@/types/auth";

export default function TodosPage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const authenticatedUser =
          await getAuthenticatedUser();

        setUser(authenticatedUser);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message ??
              "You are not authenticated."
          );
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadUser();
  }, []);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Authentication failed
          </h1>

          <p className="mt-2 text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-slate-900">
          Todo Dashboard
        </h1>

        <p className="mt-3 text-slate-600">
          Welcome, {user?.name}.
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {user?.email}
        </p>
      </div>
    </main>
  );
}