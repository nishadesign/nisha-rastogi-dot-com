"use client";

import { useEffect, useRef, useState } from "react";
import {
  useMotionValue,
  useAnimationFrame,
  animate,
  useSpring,
  MotionValue,
} from "motion/react";

type Lang = { flag: string; word: string };

const DEFAULT_LANGUAGES: Lang[] = [
  { flag: "🇺🇸", word: "Hello" },
  { flag: "🇫🇷", word: "Bonjour" },
  { flag: "🇪🇸", word: "Hola" },
  { flag: "🇵🇹", word: "Olá" },
  { flag: "🇮🇹", word: "Ciao" },
  { flag: "🇩🇪", word: "Hallo" },
  { flag: "🇯🇵", word: "こんにちは" },
  { flag: "🇰🇷", word: "안녕하세요" },
  { flag: "🇨🇳", word: "你好" },
  { flag: "🇮🇳", word: "नमस्ते" },
  { flag: "🇦🇪", word: "مرحبا" },
];

export type MultiLanguageCardConfig = {
  arcCenterXRatio: number;
  arcCenterYRatio: number;
  radiusMultiplier: number;
  radiusMin: number;
  angularSpacing: number;
  fadeRangeRatio: number;
  fadeHold: number;
  springStiffness: number;
  springDamping: number;
  springMass: number;
  wheelSensitivity: number;
  dragSensitivity: number;
};

export const DEFAULT_CONFIG: MultiLanguageCardConfig = {
  arcCenterXRatio: 0.94,
  arcCenterYRatio: 0.46,
  radiusMultiplier: 0.85,
  radiusMin: 160,
  angularSpacing: 0.22,
  fadeRangeRatio: 0.42,
  fadeHold: 0.65,
  springStiffness: 150,
  springDamping: 28,
  springMass: 0.45,
  wheelSensitivity: 0.0035,
  dragSensitivity: 0.007,
};

export function MultiLanguageCard({
  config = DEFAULT_CONFIG,
  languages = DEFAULT_LANGUAGES,
}: {
  config?: MultiLanguageCardConfig;
  languages?: Lang[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const offset = useMotionValue(0);
  const smoothOffset = useSpring(offset, {
    stiffness: config.springStiffness,
    damping: config.springDamping,
    mass: config.springMass,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    offset.set(offset.get() + e.deltaY * config.wheelSensitivity);
  };

  const dragStart = useRef<{ y: number; offset: number } | null>(null);
  const didDrag = useRef(false);
  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragStart.current = { y: e.clientY, offset: offset.get() };
    didDrag.current = false;
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStart.current) return;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dy) > 4) didDrag.current = true;
    offset.set(dragStart.current.offset + dy * config.dragSensitivity);
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    if (!dragStart.current) return;
    dragStart.current = null;
    const current = offset.get();
    const snapped =
      Math.round(current / config.angularSpacing) * config.angularSpacing;
    animate(offset, snapped, { type: "spring", stiffness: 80, damping: 18 });
  };
  const handleClick = (e: React.MouseEvent) => {
    if (didDrag.current) {
      e.preventDefault();
      e.stopPropagation();
      didDrag.current = false;
    }
  };

  const cx = size.w * config.arcCenterXRatio;
  const cy = size.h * config.arcCenterYRatio;
  // Scale radius with the card's smaller dimension so the arc shrinks on
  // smaller cards (mobile carousel, narrow viewports). radiusMin is a floor
  // for very tiny cards; once the card is large enough, the multiplier wins.
  const radius = Math.max(
    Math.min(config.radiusMin, Math.min(size.w, size.h) * 0.7),
    Math.min(size.w, size.h) * config.radiusMultiplier
  );

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
      className="relative w-full h-full overflow-hidden block-radius select-none touch-none cursor-grab active:cursor-grabbing"
      style={{ background: "white" }}
    >
      {languages.map((lang, i) => (
        <ArcPill
          key={lang.word}
          lang={lang}
          index={i}
          total={languages.length}
          offset={smoothOffset}
          cx={cx}
          cy={cy}
          radius={radius}
          config={config}
        />
      ))}
    </div>
  );
}

function ArcPill({
  lang,
  index,
  total,
  offset,
  cx,
  cy,
  radius,
  config,
}: {
  lang: Lang;
  index: number;
  total: number;
  offset: MotionValue<number>;
  cx: number;
  cy: number;
  radius: number;
  config: MultiLanguageCardConfig;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useAnimationFrame(() => {
    if (!wrapperRef.current) return;
    if (cx === 0) return;

    const o = offset.get();
    const fullSpan = total * config.angularSpacing;
    const baseAngle = index * config.angularSpacing;
    const raw = baseAngle - o;
    const wrapped = ((raw % fullSpan) + fullSpan) % fullSpan;
    const angle = wrapped > fullSpan / 2 ? wrapped - fullSpan : wrapped;

    const x = cx + Math.cos(Math.PI + angle) * radius;
    const y = cy + Math.sin(Math.PI + angle) * radius;
    const radialDeg = (angle * 180) / Math.PI;

    const fadeRange = Math.PI * config.fadeRangeRatio;
    const distFromCenter = Math.abs(angle) / fadeRange;
    const t = Math.min(1, distFromCenter);
    const visibility =
      t <= config.fadeHold
        ? 1
        : Math.pow(1 - (t - config.fadeHold) / (1 - config.fadeHold), 1.8);

    wrapperRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${radialDeg}deg)`;
    wrapperRef.current.style.opacity = String(visibility);
  });

  return (
    <div
      ref={wrapperRef}
      className="absolute left-0 top-0 will-change-transform"
      style={{ opacity: 0 }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2 tablet:px-4 tablet:py-2.5 rounded-xl whitespace-nowrap transition-colors duration-150"
        style={{
          background: "rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(0, 0, 0, 0.08)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = "white";
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0, 0, 0, 0.06)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = "rgba(0, 0, 0, 0.04)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0, 0, 0, 0.08)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        }}
      >
        <span className="text-xl tablet:text-2xl leading-none">{lang.flag}</span>
        <span
          className="font-heading text-lg tablet:text-xl tracking-tight"
          style={{ color: "var(--color-content)" }}
        >
          {lang.word}
        </span>
      </div>
    </div>
  );
}
