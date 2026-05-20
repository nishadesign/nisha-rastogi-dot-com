"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const VIDEO_EXT = /\.(mp4|webm|mov)$/i;

export function Media({
  src,
  alt = "",
  poster,
  priority,
  fit = "cover",
  eager = false,
}: {
  src: string;
  alt?: string;
  poster?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
  eager?: boolean;
}) {
  const isVideo = VIDEO_EXT.test(src);
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(eager);

  useEffect(() => {
    if (!isVideo) return;
    const el = videoRef.current;
    if (!el) return;

    if (eager) {
      el.play().catch(() => {});
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.25, rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVideo, eager]);

  if (isVideo) {
    return (
      <video
        ref={videoRef}
        className={`absolute inset-0 block w-full h-full ${fitClass}`}
        src={shouldLoad ? src : undefined}
        poster={poster}
        loop
        muted
        playsInline
        preload={eager ? "auto" : "metadata"}
        autoPlay={eager}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 1280px) 1320px, 100vw"
      className={fitClass}
      priority={priority}
    />
  );
}
