"use client";

import { useRouter } from "next/navigation";
import {
  ReactNode,
  useEffect,
} from "react";

import PageLoader from "@/components/ui/PageLoader";
import { useAuth } from "@/context/AuthContext";

interface GuestRouteProps {
  children: ReactNode;
}

export default function GuestRoute({
  children,
}: GuestRouteProps) {
  const router = useRouter();

  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/todos");
    }
  }, [
    isAuthenticated,
    isLoading,
    router,
  ]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return <PageLoader />;
  }

  return <>{children}</>;
}