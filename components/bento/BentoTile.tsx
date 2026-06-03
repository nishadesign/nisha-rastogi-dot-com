"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { motion } from "motion/react";

type Span = 1 | 2 | 3 | 4 | 5 | 6;

type MobileSpan = 1 | 2;

type BentoTileProps = {
  children: ReactNode;
  colSpan?: Span;
  rowSpan?: Span;
  mobileColSpan?: MobileSpan;
  mobileRowSpan?: 1 | 2 | 3;
  href?: string;
  external?: boolean;
  className?: string;
  style?: CSSProperties;
  padded?: boolean;
  delay?: number;
  ariaLabel?: string;
};

const colSpanClasses: Record<Span, string> = {
  1: "tablet:col-span-1",
  2: "tablet:col-span-2",
  3: "tablet:col-span-3",
  4: "tablet:col-span-4",
  5: "tablet:col-span-5",
  6: "tablet:col-span-6",
};

const rowSpanClasses: Record<Span, string> = {
  1: "tablet:row-span-1",
  2: "tablet:row-span-2",
  3: "tablet:row-span-3",
  4: "tablet:row-span-4",
  5: "tablet:row-span-5",
  6: "tablet:row-span-6",
};

const mobileColSpanClasses: Record<MobileSpan, string> = {
  1: "col-span-1",
  2: "col-span-2",
};

const mobileRowSpanClasses: Record<1 | 2 | 3, string> = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
};

export function BentoTile({
  children,
  colSpan = 2,
  rowSpan = 1,
  mobileColSpan = 2,
  mobileRowSpan = 1,
  href,
  external,
  className = "",
  style,
  padded = true,
  delay = 0,
  ariaLabel,
}: BentoTileProps) {
  const base = `group relative w-full h-full overflow-hidden block-radius transition-transform duration-200 ease-out hover:scale-[1.01] active:scale-[0.99] ${
    padded ? "block-padding" : ""
  } ${className}`;

  const mergedStyle: CSSProperties = {
    backgroundColor: "var(--color-background-alt)",
    ...style,
  };

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
      className={base}
      style={mergedStyle}
    >
      {children}
    </motion.div>
  );

  const wrapperClasses = `block ${mobileColSpanClasses[mobileColSpan]} ${mobileRowSpanClasses[mobileRowSpan]} ${colSpanClasses[colSpan]} ${rowSpanClasses[rowSpan]}`;

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={ariaLabel}
          className={wrapperClasses}
        >
          {card}
        </a>
      );
    }
    return (
      <Link href={href} aria-label={ariaLabel} className={wrapperClasses}>
        {card}
      </Link>
    );
  }

  return (
    <div className={wrapperClasses} aria-label={ariaLabel}>
      {card}
    </div>
  );
}
