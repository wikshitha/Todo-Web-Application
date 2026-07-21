import { ReactNode } from "react";

import GuestRoute from "@/components/auth/GuestRoute";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <GuestRoute>
      {children}
    </GuestRoute>
  );
}