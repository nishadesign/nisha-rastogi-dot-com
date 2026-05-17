import type { ReactNode } from "react";

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-block px-4 py-2 rounded-full font-mono text-[13px] tablet:text-[14px] uppercase tracking-[-0.03em] whitespace-nowrap"
      style={{
        color: "var(--color-content)",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "var(--color-border-strong)",
      }}
    >
      {children}
    </span>
  );
}
