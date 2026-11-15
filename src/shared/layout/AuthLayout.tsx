"use client";

import type { ReactNode } from "react";
import { AuthRouteTabs } from "@/features/auth/components/AuthRouteTabs";

import { Card } from "@/shared/components/ui/card";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10">
      <div className="w-full max-w-lg space-y-5">
        <Card className="gap-0 rounded-2xl border-blue-200 bg-white p-6 shadow-lg shadow-blue-950/5 sm:p-8">
          <AuthRouteTabs />

          <div className="mt-6">{children}</div>
        </Card>
      </div>
    </main>
  );
}
