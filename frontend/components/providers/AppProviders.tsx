"use client";

import { Toaster } from "sonner";

import { AuthProvider } from "@/context/AuthContext";
import QueryProvider from "@/components/providers/QueryProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}

        <Toaster
          position="top-right"
          richColors
          closeButton
        />
      </AuthProvider>
    </QueryProvider>
  );
}