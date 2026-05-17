import type { ReactNode } from "react";

export function ContentGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 desktop:grid-cols-6 desktop:grid-flow-dense gap-5 tablet:gap-10">
      {children}
    </div>
  );
}
