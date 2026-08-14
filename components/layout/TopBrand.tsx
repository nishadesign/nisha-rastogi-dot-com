"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { profile } from "@/data/profile";

export function TopBrand() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 80 && y > lastY);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 px-5 tablet:px-10 pt-6 tablet:pt-8 flex items-center justify-between transition-[opacity,transform] duration-300 ease-out"
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? "translateY(-12px)" : "translateY(0)",
        pointerEvents: hidden ? "none" : "auto",
      }}
    >
      <Link
        href="/"
        className="text-body transition-opacity duration-150 ease-out hover:opacity-60"
        style={{ color: "var(--color-muted)" }}
      >
        {profile.name}
      </Link>
      <span
        className="text-body inline-flex items-center gap-1.5"
        style={{ color: "var(--color-muted)" }}
      >
        <span className="relative inline-flex w-1.5 h-1.5">
          <span
            className="absolute inset-0 rounded-full status-ping"
            style={{ backgroundColor: "rgb(34 197 94)" }}
          />
          <span
            className="relative inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "rgb(34 197 94)" }}
          />
        </span>
        <span>Open to Work</span>
      </span>
    </header>
  );
}
