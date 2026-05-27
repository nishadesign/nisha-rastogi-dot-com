"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { fadeInUp } from "@/lib/motion";

type BlockProps = {
  children: ReactNode;
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6;
  rowSpan?: 1 | 2 | 3 | 4;
  variant?: "text" | "media";
  aspectRatio?: number;
};

const COL_CLASSES: Record<number, string> = {
  1: "desktop:col-span-1",
  2: "desktop:col-span-2",
  3: "desktop:col-span-3",
  4: "desktop:col-span-4",
  5: "desktop:col-span-5",
  6: "desktop:col-span-6",
};

const ROW_CLASSES: Record<number, string> = {
  1: "desktop:row-span-1",
  2: "desktop:row-span-2",
  3: "desktop:row-span-3",
  4: "desktop:row-span-4",
};

export function Block({
  children,
  colSpan = 6,
  rowSpan = 3,
  variant = "text",
  aspectRatio,
}: BlockProps) {
  const colClass = COL_CLASSES[colSpan];
  const rowClass = ROW_CLASSES[rowSpan];

  if (variant === "media") {
    return (
      <motion.div className={`${colClass} ${rowClass}`} {...fadeInUp}>
        <div
          className="relative w-full overflow-hidden block-radius"
          style={{
            backgroundColor: "var(--color-background-alt)",
            aspectRatio: aspectRatio ?? undefined,
          }}
        >
          {children}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className={`${colClass} ${rowClass}`} {...fadeInUp}>
      <div className="flex flex-col gap-4">{children}</div>
    </motion.div>
  );
}
