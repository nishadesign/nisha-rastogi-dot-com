"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navItems } from "@/data/nav";
import { profile } from "@/data/profile";

const SCROLL_THRESHOLD = 80;

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Hide global nav on bento exploration (it has its own bottom nav)
  if (pathname === "/lab/bento") return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const activeItem = navItems.find((i) => isActive(i.href)) ?? navItems[0];
  const inactiveItems = navItems.filter((i) => i.href !== activeItem.href);
  const orderedItems = [activeItem, ...inactiveItems];

  const expanded = !scrolled || hovered;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-5 tablet:px-10 pt-6 tablet:pt-8">
      <div className="flex items-center justify-between gap-6">
        <Link
          href="/"
          className="text-body-large transition-opacity duration-150 inline-block"
          style={{
            color: "var(--color-muted)",
            opacity: scrolled && !mobileOpen ? 0 : 1,
            pointerEvents: scrolled && !mobileOpen ? "none" : "auto",
          }}
          onMouseEnter={(e) => {
            if (!scrolled) e.currentTarget.style.opacity = "0.6";
          }}
          onMouseLeave={(e) => {
            if (!scrolled) e.currentTarget.style.opacity = "1";
          }}
        >
          {profile.name}
        </Link>

        {/* Desktop / tablet pill nav */}
        <nav className="hidden tablet:block">
          <div
            className="flex items-center gap-6 px-5 py-3 rounded-full backdrop-blur-2xl transition-all duration-150"
            style={{ backgroundColor: "var(--color-floating)" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {orderedItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-body transition-all duration-150 overflow-hidden whitespace-nowrap"
                  style={{
                    color: "var(--color-content)",
                    opacity: active ? 1 : expanded ? 0.3 : 0,
                    maxWidth: active || expanded ? "200px" : "0px",
                    marginLeft: active ? 0 : expanded ? undefined : "-1.5rem",
                    pointerEvents: active || expanded ? "auto" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!active && expanded)
                      e.currentTarget.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    if (!active && expanded)
                      e.currentTarget.style.opacity = "0.3";
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="tablet:hidden relative z-50 flex items-center justify-center size-10 rounded-full backdrop-blur-2xl transition-transform duration-150 ease-out active:scale-[0.97]"
          style={{
            backgroundColor: "var(--color-floating)",
            color: "var(--color-content)",
          }}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`tablet:hidden fixed inset-0 z-40 transition-opacity duration-150 ${
          mobileOpen ? "ease-out" : "ease-in"
        }`}
        style={{
          backgroundColor: "var(--color-background)",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
      >
        <nav className="flex flex-col gap-6 px-5 pt-28">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="transition-opacity"
                style={{
                  color: "var(--color-content)",
                  opacity: active ? 1 : 0.5,
                  fontSize: "32px",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
