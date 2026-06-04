import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="container-shell pt-20 pb-32 tablet:pb-40">
      <div
        className="flex flex-col tablet:flex-row tablet:items-baseline tablet:justify-between gap-3 text-caption"
        style={{ color: "var(--color-muted)" }}
      >
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span className="font-mono uppercase tracking-[-0.03em]" style={{ fontSize: "13px" }}>
          Built with Next.js · SF Pro · Inter Display
        </span>
      </div>
    </footer>
  );
}
