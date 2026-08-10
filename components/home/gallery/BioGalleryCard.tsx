"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Pin } from "lucide-react";
import { profile } from "@/data/profile";
import type { ProjectFrontmatter } from "@/types/project";

type BioSlide = {
  src: string;
  alt: string;
  position?: string;
};

function getBioSlides(project: ProjectFrontmatter | null): BioSlide[] {
  if (project?.gallery && project.gallery.length > 0) {
    return project.gallery.map((slide) => ({
      src: slide.src,
      alt: slide.alt,
      position: slide.position,
    }));
  }

  if (project?.hero) {
    return [{ src: project.hero.src, alt: project.hero.alt }];
  }

  return [{ src: profile.bio.image, alt: profile.name }];
}

export function BioGalleryCard({
  project,
}: {
  project: ProjectFrontmatter | null;
}) {
  const slides = getBioSlides(project);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <div
      className="relative block w-full mb-4 tablet:mb-5 overflow-hidden block-radius p-2"
      style={{ backgroundColor: "#fff" }}
    >
      <div className="relative w-full overflow-hidden block-radius aspect-[4/5]">
        <div
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.88)",
            color: "var(--color-content)",
          }}
          aria-hidden="true"
        >
          <Pin className="h-4 w-4 -rotate-12" strokeWidth={2} />
        </div>
        {slides.map((slide, i) => (
          <Image
            key={`${slide.src}-${i}`}
            src={slide.src}
            alt={i === active ? slide.alt : ""}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 810px) 50vw, 100vw"
            className="object-cover transition-opacity duration-700 ease-out"
            style={{
              opacity: i === active ? 1 : 0,
              objectPosition: slide.position,
            }}
          />
        ))}
        {slides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
            {slides.map((_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-all duration-200"
                style={{
                  width: i === active ? 18 : 6,
                  backgroundColor:
                    i === active
                      ? "rgba(255, 255, 255, 0.95)"
                      : "rgba(255, 255, 255, 0.55)",
                }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="pt-4">
        <p className="text-body-large" style={{ color: "var(--color-muted)" }}>
          {project?.description ?? profile.bio.paragraph}
        </p>
      </div>
    </div>
  );
}
