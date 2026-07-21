import { ReactNode } from "react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Navbar from "@/components/layout/Navbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-100">
        <Navbar />

        {children}
      </div>
    </ProtectedRoute>
  );
}