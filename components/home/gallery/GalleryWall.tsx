"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { fadeInUp } from "@/lib/motion";
import { galleryTiles } from "@/data/gallery";
import type { ProjectFrontmatter } from "@/types/project";
import { getGalleryProjectDetail } from "./actions";
import { ProjectOverlay } from "./ProjectOverlay";
import { GalleryCard } from "./GalleryCard";

export function GalleryWall({
  bioProject,
}: {
  bioProject: ProjectFrontmatter | null;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, ProjectFrontmatter | null>>({});
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [errorSlug, setErrorSlug] = useState<string | null>(null);

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
      <h1
        className="hero-h1 pb-6 tablet:pb-8 text-center"
        style={{ fontSize: "clamp(40px, 9vw, 120px)", letterSpacing: "-0.055em" }}
      >
        Making complex<br />workflows feel simple
      </h1>
      <h2 className="pb-36 tablet:pb-72 text-center font-normal" style={{ color: "var(--color-muted)" }}>
        Building AI products at Salesforce, used by 90% of the Fortune 500.
      </h2>

      {/* masonry via CSS columns */}
      <div className="columns-1 tablet:columns-2 desktop:columns-3 gap-4 tablet:gap-5">
        {galleryTiles.map((tile, i) => {
          const card = <GalleryCard tile={tile} bioProject={bioProject} />;

          return (
            <motion.div
              key={tile.id}
              className="break-inside-avoid"
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: (i % 3) * 0.08 }}
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
