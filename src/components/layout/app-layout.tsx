
"use client";

import type { ReactNode } from 'react';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
