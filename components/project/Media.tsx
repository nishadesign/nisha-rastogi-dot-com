"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const VIDEO_EXT = /\.(mp4|webm|mov)$/i;

// Muted + playsInline satisfies the usual autoplay policies, but not all of
// them: iOS refuses autoplay outright in Low Power Mode, and some Android
// browsers do the same under data saver. The refusal arrives as a rejected
// promise and nothing else — no event, no retry — so a blocked video sits on
// its poster indefinitely, which looks exactly like a video that failed to
// load. Park the refusals and try them again on the visitor's first
// interaction, which reopens the gesture window playback is permitted in.
const blocked = new Set<HTMLVideoElement>();
const GESTURES = ["pointerdown", "touchend", "keydown", "scroll"] as const;
let listening = false;

function retryBlocked() {
  for (const video of [...blocked]) {
    if (!video.isConnected) {
      blocked.delete(video);
      continue;
    }
    video.play().then(
      () => blocked.delete(video),
      () => {} // still refused; leave it queued for the next gesture
    );
  }
}

function playWhenAllowed(video: HTMLVideoElement) {
  video.play().catch(() => {
    blocked.add(video);
    if (listening) return;
    listening = true;
    // Left attached for the life of the page: a video scrolled to later can be
    // refused too, and these are passive listeners on already-frequent events.
    for (const evt of GESTURES) {
      document.addEventListener(evt, retryBlocked, { passive: true });
    }
  });
}

export function Media({
  src,
  alt = "",
  poster,
  priority,
  fit = "cover",
  position,
  eager = false,
}: {
  src: string;
  alt?: string;
  poster?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
  position?: string;
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
      playWhenAllowed(el);
      return () => {
        blocked.delete(el);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          // If the source is already loaded, play now. Otherwise the
          // onLoadedData handler on the <video> will start playback.
          if (el.readyState >= 2) {
            playWhenAllowed(el);
          }
        } else {
          el.pause();
        }
      },
      { threshold: 0.25, rootMargin: "200px" }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      // Don't leave a detached element queued for a gesture that may never come.
      blocked.delete(el);
    };
  }, [isVideo, eager]);

  if (isVideo) {
    return (
      <video
        ref={videoRef}
        className={`absolute inset-0 block w-full h-full ${fitClass}`}
        style={{ objectPosition: position }}
        src={shouldLoad ? src : undefined}
        poster={poster}
        loop
        muted
        playsInline
        preload={eager ? "auto" : "metadata"}
        autoPlay={eager}
        onLoadedData={(e) => {
          // Once the source is buffered, start playing if the element is
          // still in view (handles the observer-fires-before-load race).
          playWhenAllowed(e.currentTarget);
        }}
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
      style={{ objectPosition: position }}
      priority={priority}
    />
  );
}
