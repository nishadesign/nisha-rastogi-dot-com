import type { ReactNode } from "react";

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <main
      className="page-transition mx-auto w-full pt-24 tablet:pt-32 desktop:pt-40"
      style={{ maxWidth: "var(--container-max)" }}
    >
      {children}
    </main>
  );
}
