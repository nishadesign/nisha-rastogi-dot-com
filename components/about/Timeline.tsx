"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plane, Briefcase } from "lucide-react";
import { motion } from "motion/react";
import type { TimelineCategory, TimelineEntry } from "@/data/timeline";

const CATEGORY_ICONS: Record<TimelineCategory, typeof Heart> = {
  life: Heart,
  travel: Plane,
  work: Briefcase,
};

function EntryWrapper({
  entry,
  children,
}: {
  entry: TimelineEntry;
  children: React.ReactNode;
}) {
  if (!entry.href) return <>{children}</>;
  if (entry.external) {
    return (
      <a
        href={entry.href}
        target="_blank"
        rel="noreferrer"
        className="block group"
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={entry.href} className="block group">
      {children}
    </Link>
  );
}

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const scrolledToBottom =
        window.scrollY + viewportH >= docH - 4;
      if (scrolledToBottom) {
        setProgress(1);
        return;
      }
      const fillLine = viewportH * 0.55;
      const start = rect.top - fillLine;
      const total = rect.height;
      const pct = Math.max(0, Math.min(1, -start / total));
      setProgress(pct);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Faint baseline dotted line — always visible */}
      <div
        className="absolute top-3 bottom-3 border-l-2 border-dashed pointer-events-none"
        style={{
          left: "9px",
          borderColor: "var(--color-border-strong)",
          opacity: 0.25,
        }}
        aria-hidden="true"
      />
      {/* Progress dotted line — grows with scroll */}
      <div
        className="absolute top-3 border-l-2 border-dashed pointer-events-none transition-all"
        style={{
          left: "9px",
          height: `calc((100% - 1.5rem) * ${progress})`,
          borderColor: "var(--color-content)",
          transitionDuration: "150ms",
        }}
        aria-hidden="true"
      />

      <div className="flex flex-col gap-12 tablet:gap-16 relative">
        {entries.map((entry, i) => {
          const Icon = CATEGORY_ICONS[entry.category];
          return (
            <motion.div
              key={`${entry.date}-${entry.title}-${i}`}
              className="flex gap-6 tablet:gap-10 items-start"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
            >
              <div
                className="shrink-0 pt-1 relative z-10"
                style={{
                  color: "var(--color-content)",
                  backgroundColor: "var(--color-background)",
                }}
                aria-label={entry.category}
              >
                <Icon size={20} strokeWidth={1.5} />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <span
                  className="font-mono text-caption uppercase tracking-[-0.03em]"
                  style={{ color: "var(--color-muted)" }}
                >
                  {entry.date}
                </span>
                <EntryWrapper entry={entry}>
                  <h3
                    className={
                      entry.href
                        ? "transition-opacity group-hover:opacity-60"
                        : undefined
                    }
                  >
                    {entry.title}
                  </h3>
                  {entry.description && (
                    <p
                      className="text-body mt-2"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {entry.description}
                    </p>
                  )}
                </EntryWrapper>
                {entry.image && (
                  <div className="relative w-full overflow-hidden block-radius aspect-[16/10] mt-2 max-w-[800px]">
                    <Image
                      src={entry.image.src}
                      alt={entry.image.alt}
                      fill
                      sizes="(min-width: 1280px) 800px, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
