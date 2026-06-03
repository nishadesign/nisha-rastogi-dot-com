"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/data/nav";

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="fixed bottom-5 tablet:bottom-8 left-1/2 -translate-x-1/2 z-50">
      <nav>
        <div
          className="flex items-center gap-2 tablet:gap-3 px-3 py-2 tablet:px-4 tablet:py-2.5 rounded-full backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          style={{ backgroundColor: "var(--color-floating)" }}
        >
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-body whitespace-nowrap rounded-full px-4 py-1.5 tablet:px-5 tablet:py-2 transition-opacity duration-150"
                style={{
                  color: active
                    ? "var(--color-inverse)"
                    : "var(--color-content)",
                  backgroundColor: active
                    ? "var(--color-content)"
                    : "transparent",
                  opacity: active ? 1 : 0.6,
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.opacity = "0.6";
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
