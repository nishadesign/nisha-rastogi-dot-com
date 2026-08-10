"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Media } from "@/components/project/Media";

type Slide = {
  src: string;
  alt: string;
  poster?: string;
  fit?: "cover" | "contain";
  position?: string;
};

export function ProjectCarousel({ slides }: { slides: Slide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  if (slides.length === 0) return null;

  const scrollToIndex = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(i, slides.length - 1));
    track.scrollTo({ left: track.clientWidth * clamped, behavior: "smooth" });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  };

  return (
    <div className="w-full mb-8 tablet:mb-12" aria-label="Project image gallery">
      {/* image area — arrows overlay this only */}
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar block-radius"
          style={{ scrollBehavior: "smooth" }}
        >
          {slides.map((slide, i) => (
            <div
              key={`${slide.src}-${i}`}
              className="relative shrink-0 w-full snap-center overflow-hidden aspect-[16/10]"
              style={{ backgroundColor: "var(--color-background-alt)" }}
            >
              <Media
                src={slide.src}
                alt={slide.alt}
                poster={slide.poster}
                fit={slide.fit ?? "contain"}
                position={slide.position}
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollToIndex(active - 1)}
              disabled={active === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full text-white transition-opacity duration-150 hover:opacity-90 disabled:opacity-0"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(12px)" }}
            >
              <ArrowLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollToIndex(active + 1)}
              disabled={active === slides.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full text-white transition-opacity duration-150 hover:opacity-90 disabled:opacity-0"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(12px)" }}
            >
              <ArrowRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* dots — rectangle (active) + circles */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollToIndex(i)}
              className="h-1.5 rounded-full transition-all duration-200"
              style={{
                width: i === active ? 20 : 6,
                backgroundColor:
                  i === active
                    ? "var(--color-content)"
                    : "var(--color-border-strong)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
