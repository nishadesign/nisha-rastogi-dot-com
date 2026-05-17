import type { ReactNode } from "react";

export function PageWrapper({ children }: { children: ReactNode }) {
  return <main className="page-transition">{children}</main>;
}
