import type { ReactNode } from "react";

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <main className="page-transition pt-24 tablet:pt-32 desktop:pt-40">
      {children}
    </main>
  );
}
