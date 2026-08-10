"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { galleryTiles } from "@/data/gallery";
import type { ProjectFrontmatter } from "@/types/project";
import { getGalleryProjectDetail } from "./actions";
import { ProjectOverlay } from "./ProjectOverlay";
import { GalleryCard } from "./GalleryCard";

const HERO_HEADLINE = "Making complex workflows feel simple";
const WALL_EASE = [0.16, 1, 0.3, 1] as const;
const HERO_INTRO_DURATION_MS = 1080;
const HERO_LINES = [
  [
    { text: "Making", index: 0 },
    { text: "complex", index: 1 },
  ],
  [
    { text: "workflows", index: 2 },
    { text: "feel", index: 3 },
    { text: "simple", index: 4 },
  ],
] as const;
const heroWord = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.72,
      delay: 0.08 + index * 0.045,
      ease: WALL_EASE,
    },
  }),
} as const;
const cardToWall = {
  floating: (index: number) => ({
    opacity: 0,
    y: 88,
    z: 160,
    scale: 1.16,
    rotateX: -7,
    rotateZ: index % 2 === 0 ? -1.8 : 1.8,
    filter: "blur(10px)",
  }),
  stuck: (index: number) => ({
    opacity: 1,
    y: 0,
    z: 0,
    scale: 1,
    rotateX: 0,
    rotateZ: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.72,
      delay: Math.min(index % 3, 2) * 0.06,
      ease: WALL_EASE,
    },
  }),
} as const;

export function GalleryWall({
  bioProject,
}: {
  bioProject: ProjectFrontmatter | null;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [isHeroIntroComplete, setIsHeroIntroComplete] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, ProjectFrontmatter | null>>({});
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [errorSlug, setErrorSlug] = useState<string | null>(null);

  useEffect(() => {
    if (shouldReduceMotion) {
      setIsHeroIntroComplete(true);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsHeroIntroComplete(true);
    }, HERO_INTRO_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!selected || Object.prototype.hasOwnProperty.call(details, selected)) {
      return;
    }

    let cancelled = false;
    setLoadingSlug(selected);
    setErrorSlug(null);

    getGalleryProjectDetail(selected)
      .then((project) => {
        if (cancelled) return;
        setDetails((current) => ({ ...current, [selected]: project }));
      })
      .catch(() => {
        if (cancelled) return;
        setErrorSlug(selected);
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingSlug(null);
      });

    return () => {
      cancelled = true;
    };
  }, [details, selected]);

  return (
    <section className="px-5 tablet:px-10 pt-24 tablet:pt-[160px] pb-24 tablet:pb-40">
      {/* hero headline */}
      <motion.h1
        className="hero-h1 pb-6 tablet:pb-8 text-center"
        style={{ fontSize: "clamp(40px, 9vw, 120px)", letterSpacing: "-0.055em" }}
        aria-label={HERO_HEADLINE}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="visible"
      >
        {HERO_LINES.map((line, lineIndex) => (
          <span key={lineIndex} className="block" aria-hidden="true">
            {line.map((word, wordIndex) => (
              <span key={word.text}>
                <motion.span
                  className="inline-block"
                  custom={word.index}
                  variants={heroWord}
                >
                  {word.text}
                </motion.span>
                {wordIndex < line.length - 1 ? " " : null}
              </span>
            ))}
          </span>
        ))}
      </motion.h1>
      <motion.h2
        className="pb-36 tablet:pb-72 text-center font-normal"
        style={{ color: "var(--color-muted)" }}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.52, delay: 0.36, ease: WALL_EASE }}
      >
        Building AI products at Salesforce, used by 90% of the Fortune 500.
      </motion.h2>

      {/* masonry via CSS columns */}
      <div
        className="columns-1 tablet:columns-2 desktop:columns-3 gap-4 tablet:gap-5"
        style={{ perspective: "1200px" }}
      >
        {galleryTiles.map((tile, i) => {
          const card = <GalleryCard tile={tile} bioProject={bioProject} />;

          return (
            <motion.div
              key={tile.id}
              className="break-inside-avoid"
              custom={i}
              variants={cardToWall}
              initial={shouldReduceMotion ? false : "floating"}
              whileInView={shouldReduceMotion || isHeroIntroComplete ? "stuck" : "floating"}
              viewport={{ once: true, amount: 0.08, margin: "0px 0px 16% 0px" }}
              style={{
                transformOrigin: "50% 42%",
                transformStyle: "preserve-3d",
              }}
            >
              {tile.component === "bio" ? (
                card
              ) : (
                <button
                  type="button"
                  onClick={() => setSelected(tile.project)}
                  className="block w-full text-left"
                  aria-label={`Open ${tile.alt}`}
                >
                  {card}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      <ProjectOverlay
        projectSlug={selected}
        project={selected ? details[selected] : null}
        isLoading={!!selected && loadingSlug === selected}
        hasError={!!selected && errorSlug === selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
