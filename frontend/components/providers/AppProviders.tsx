"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";

import { AuthProvider } from "@/context/AuthContext";

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <AuthProvider>
      {children}

      <Toaster
        position="top-right"
        richColors
        closeButton
      />
    </AuthProvider>
  );
}