"use client";

import { useEffect, useRef } from "react";
import { animate } from "motion";
import { photos, type Photo } from "@/data/photos";
import "./photo-wall.css";

const ROW_COUNT = 3;
// How fast each row moves relative to the scroll. All equal = the rows
// glide together in lockstep; vary them (e.g. [1, 0.8, 1.15]) for a
// layered parallax feel.
const PARALLAX = [1, 1, 1];

// Spring physics for the zoom. Springs start from the element's current
// value and inherit its velocity, so a close that interrupts an open
// reverses fluidly instead of hard-cutting. The open carries a whisper of
// overshoot (the photo "arrives" with momentum); the close is critically
// damped so it lands exactly on the tile without bouncing into the wall.
const SPRING_OPEN = { type: "spring", visualDuration: 0.32, bounce: 0.12 } as const;
const SPRING_CLOSE = { type: "spring", visualDuration: 0.24, bounce: 0 } as const;
const SPRING_PART = { type: "spring", visualDuration: 0.38, bounce: 0.14 } as const;
const SPRING_HOME = { type: "spring", visualDuration: 0.3, bounce: 0 } as const;

// Radii for the corner morph: tiles sit at 10px, the zoomed view at 16px.
// The lightbox image's computed radius is rendered multiplied by its scale
// transform, so the start value is divided by the start scale to visually
// match the tile at the moment of handoff.
const TILE_RADIUS = 10;
const ZOOM_RADIUS = 16;

// The wall draws from small copies (max 800px, public/photos/thumb) so it
// doesn't pay for full-size files at tile size; the lightbox upgrades to the
// 1600px original (public/photos/web) once it has loaded.
const thumbSrc = (src: string) => src.replace("/photos/web/", "/photos/thumb/");

// Row layout: the real rows, a full second copy for the vertical wrap,
// plus one extra row so the seam's trailing gap is always covered.
const ROW_SPECS = [
  ...Array.from({ length: ROW_COUNT }, (_, src) => ({ src, cloneRow: false })),
  ...Array.from({ length: ROW_COUNT }, (_, src) => ({ src, cloneRow: true })),
  { src: 0, cloneRow: true },
];

function rowPhotos(src: number) {
  return photos
    .map((photo, index) => ({ photo, index }))
    .filter(({ index }) => index % ROW_COUNT === src);
}

export function PhotoWall() {
  const galleryRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const lightboxImgRef = useRef<HTMLImageElement>(null);
  const lightboxCaptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const gallery = galleryRef.current;
    const canvas = canvasRef.current;
    const lightbox = lightboxRef.current;
    const lightboxImg = lightboxImgRef.current;
    const lightboxCaption = lightboxCaptionRef.current;
    if (!gallery || !canvas || !lightbox || !lightboxImg || !lightboxCaption) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Horizontal loop period: distance from a row's first photo to its clone.
    // Vertical loop period: distance from the first row to its vertical clone.
    const rows = Array.from(canvas.children).map((rowEl) => ({
      rowEl: rowEl as HTMLElement,
      track: rowEl.firstElementChild as HTMLElement,
      parallax: PARALLAX[Number((rowEl as HTMLElement).dataset.src)] ?? 1,
      period: 0,
      firstClone: rowEl.querySelector<HTMLElement>("[data-loop-clone]"),
    }));

    let vPeriod = 0;
    function measure() {
      rows.forEach((row) => {
        row.period = row.firstClone ? row.firstClone.offsetLeft : 0;
      });
      vPeriod = rows[ROW_COUNT].rowEl.offsetTop - rows[0].rowEl.offsetTop;
    }

    // --- Infinite 2D scroll, user-driven ---
    // Wheel/touch input pans the wall on both axes — horizontal deltas move
    // the rows sideways, vertical deltas move the whole canvas up/down, and
    // diagonal input moves both at once. `current*` eases toward `target*`
    // for a touch of inertia; each axis wraps modulo its loop period.
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let lastTime: number | null = null;
    let rafId = 0;

    const wrap = (v: number, period: number) => ((v % period) + period) % period;

    function render() {
      rows.forEach((row) => {
        if (!row.period) return;
        const shift = currentX * row.parallax;
        row.track.style.transform = `translate3d(${-wrap(shift, row.period)}px, 0, 0)`;
      });
      if (vPeriod) {
        canvas!.style.transform = `translate3d(0, ${-wrap(currentY, vPeriod)}px, 0)`;
      }
    }

    function tick(now: number) {
      if (lastTime === null) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const ease = Math.min(dt * 7.5, 1);
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      render();
      rafId = requestAnimationFrame(tick);
    }

    function nudge(dx: number, dy: number) {
      targetX += dx;
      targetY += dy;
    }

    // --- Lightbox ---
    // Opening uses a FLIP animation: the big image is laid out at its final
    // centered position, instantly transformed back onto the clicked thumbnail,
    // then eased to rest — so it appears to grow out of the wall. Closing
    // reverses the trip.
    let activeFig: HTMLElement | null = null; // the thumbnail the open image came from
    let openRect: { left: number; top: number; width: number; height: number } | null = null;
    // Bumped on every open/close so a stale close's cleanup can tell it was
    // superseded (springs have no fixed end time to clearTimeout against)
    let zoomGen = 0;

    // The thumbnail's rect at rest — without the hover zoom or press scale
    // that may be mid-flight at click time. Both effects scale about the
    // center, so the resting rect is the measured center ± the untransformed
    // layout size. Measuring the raw rect instead makes the zoom start from
    // a slightly inflated, misaligned box, which reads as distortion.
    function thumbRestingRect(fig: HTMLElement | null) {
      const img = fig && fig.querySelector("img");
      if (!img) return null;
      const r = img.getBoundingClientRect();
      const w = img.offsetWidth;
      const h = img.offsetHeight;
      return {
        left: r.left + r.width / 2 - w / 2,
        top: r.top + r.height / 2 - h / 2,
        width: w,
        height: h,
      };
    }

    // As one photo zooms up, the others get nudged radially away from it —
    // strongest for near neighbors, fading out with distance. Passing
    // away=false sends everyone gliding home.
    function partWall(cx: number, cy: number, away: boolean) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      gallery!.querySelectorAll<HTMLElement>(".pw-photo").forEach((el) => {
        if (el === activeFig) return;
        if (!away) {
          if (el.style.transform) animate(el, { x: 0, y: 0 }, SPRING_HOME);
          return;
        }
        const r = el.getBoundingClientRect();
        if (r.right < -150 || r.left > vw + 150 || r.bottom < -150 || r.top > vh + 150) return;
        const dx = r.left + r.width / 2 - cx;
        const dy = r.top + r.height / 2 - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const amt = 110 * Math.exp(-dist / 420);
        if (amt < 0.5) return;
        animate(el, { x: (dx / dist) * amt, y: (dy / dist) * amt }, SPRING_PART);
      });
    }

    function openLightbox(photo: Photo, fig: HTMLElement | null) {
      zoomGen++; // supersede any in-flight close cleanup
      activeFig = fig;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Open from the thumbnail — it's already fetched and decoded, so the
      // zoom starts instantly; the full-size file swaps in when it arrives
      lightboxImg!.src = thumbSrc(photo.src);
      lightboxImg!.alt = photo.caption || "Photograph";
      lightboxCaption!.textContent = photo.caption || "";

      // Final size, computed from the photo's known dimensions — before its
      // data arrives an <img> lays out at 0×0, so measuring is not an option
      const w = photo.w || 1600;
      const h = photo.h || 1200;
      const fit = Math.min(Math.min(vw * 0.92, 1100) / w, (vh * 0.8) / h, 1);
      const finalW = Math.round(w * fit);
      const finalH = Math.round(h * fit);

      // Final position: centered on screen — the zoom still launches from the
      // clicked thumbnail, but the preview comes to rest in the middle
      const left = (vw - finalW) / 2;
      const top = (vh - finalH) / 2;

      lightboxImg!.style.width = `${finalW}px`;
      lightboxImg!.style.height = `${finalH}px`;
      lightboxImg!.style.left = `${Math.round(left)}px`;
      lightboxImg!.style.top = `${Math.round(top)}px`;
      openRect = { left: Math.round(left), top: Math.round(top), width: finalW, height: finalH };

      // caption sits centered just below the enlarged photo
      lightboxCaption!.style.left = `${Math.round(left + finalW / 2)}px`;
      lightboxCaption!.style.top = `${Math.round(Math.min(top + finalH + 12, vh - 36))}px`;

      const reveal = () => {
        lightbox!.hidden = false;
        document.body.style.overflow = "hidden";

        const from = !reducedMotion ? thumbRestingRect(activeFig) : null;
        if (from && openRect) {
          const scale = from.width / finalW;
          lightboxImg!.style.transformOrigin = "top left";
          // Write the starting pose synchronously so the first painted frame
          // is already on the thumbnail — the spring takes over next frame
          lightboxImg!.style.transform = `translate(${from.left - openRect.left}px, ${from.top - openRect.top}px) scale(${scale})`;
          lightboxImg!.style.borderRadius = `${TILE_RADIUS / scale}px`;
          animate(
            lightboxImg!,
            {
              x: [from.left - openRect.left, 0],
              y: [from.top - openRect.top, 0],
              scale: [scale, 1],
              borderRadius: [`${TILE_RADIUS / scale}px`, `${ZOOM_RADIUS}px`],
            },
            SPRING_OPEN
          );
          partWall(from.left + from.width / 2, from.top + from.height / 2, true);
        } else {
          lightboxImg!.style.transform = "none";
          lightboxImg!.style.borderRadius = "";
        }
        requestAnimationFrame(() => lightbox!.classList.add("is-open"));
      };

      // Decode before animating so no decode work lands mid-spring; the
      // thumbnail is cached from the wall, so this settles in a frame or two.
      lightboxImg!.decode().then(reveal, reveal);

      // Upgrade to the full-resolution file off-thread; swap only if this
      // photo is still the one on screen when it finishes decoding.
      const gen = zoomGen;
      const full = new Image();
      full.src = photo.src;
      full
        .decode()
        .then(() => {
          if (gen === zoomGen && !lightbox!.hidden) lightboxImg!.src = photo.src;
        })
        .catch(() => {});
    }

    function closeLightbox() {
      if (lightbox!.hidden) return;
      const gen = ++zoomGen;
      lightbox!.classList.remove("is-open");

      const to = !reducedMotion ? thumbRestingRect(activeFig) : null;
      let landing: Promise<unknown> = Promise.resolve();
      if (to && openRect && openRect.width > 0) {
        const scale = to.width / openRect.width;
        // Re-targeting the in-flight springs — motion picks up the current
        // position and velocity, so closing mid-open bends the motion back
        // instead of snapping to a new animation.
        landing = animate(
          lightboxImg!,
          {
            x: to.left - openRect.left,
            y: to.top - openRect.top,
            scale,
            borderRadius: `${TILE_RADIUS / scale}px`,
          },
          SPRING_CLOSE
        ).finished;
      }
      partWall(0, 0, false); // neighbors glide back to their places

      landing.then(() => {
        if (gen !== zoomGen) return; // superseded by a newer open/close
        lightbox!.hidden = true;
        lightboxImg!.src = "";
        lightboxImg!.style.transform = "none";
        lightboxImg!.style.removeProperty("border-radius");
        document.body.style.overflow = "";
        activeFig = null;
        openRect = null;
        // tidy up the parting transforms once everyone is home
        gallery!.querySelectorAll<HTMLElement>(".pw-photo").forEach((el) => {
          el.style.removeProperty("transform");
        });
      });
    }

    // Clicking any tile (clones included) zooms it up from where it sits
    const onGalleryClick = (e: MouseEvent) => {
      const fig = (e.target as HTMLElement).closest<HTMLElement>(".pw-photo");
      if (!fig || !gallery.contains(fig)) return;
      const photo = photos[Number(fig.dataset.index)];
      if (photo) openLightbox(photo, fig);
    };
    gallery.addEventListener("click", onGalleryClick);

    const onLightboxClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target === lightbox ||
        target.classList.contains("pw-lightbox-backdrop") ||
        target.closest(".pw-lightbox-close")
      )
        closeLightbox();
    };
    lightbox.addEventListener("click", onLightboxClick);

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    };
    document.addEventListener("keydown", onKeydown);

    // --- Motion wiring (skipped entirely under prefers-reduced-motion:
    // the CSS fallback shows a static, normally-scrollable grid) ---
    let ro: ResizeObserver | null = null;
    if (!reducedMotion) {
      ro = new ResizeObserver(() => {
        measure();
        render();
      });
      rows.forEach((row) => ro!.observe(row.track));
      measure();
      rafId = requestAnimationFrame(tick);

      // Scrolling pans the wall in the direction of the gesture — vertical,
      // horizontal, or diagonal.
      gallery.addEventListener(
        "wheel",
        (e) => {
          e.preventDefault();
          nudge(e.deltaX, e.deltaY);
        },
        { passive: false }
      );

      let lastTouch: { x: number; y: number } | null = null;
      gallery.addEventListener(
        "touchstart",
        (e) => {
          lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        },
        { passive: true }
      );
      gallery.addEventListener(
        "touchmove",
        (e) => {
          if (!lastTouch) return;
          e.preventDefault();
          const t = e.touches[0];
          nudge(lastTouch.x - t.clientX, lastTouch.y - t.clientY);
          lastTouch = { x: t.clientX, y: t.clientY };
        },
        { passive: false }
      );
      gallery.addEventListener("touchend", () => {
        lastTouch = null;
      });

      // Keyboard support: arrow keys pan the wall when it's focused
      gallery.addEventListener("keydown", (e) => {
        const steps: Record<string, [number, number]> = {
          ArrowRight: [80, 0],
          ArrowLeft: [-80, 0],
          ArrowDown: [0, 80],
          ArrowUp: [0, -80],
          PageDown: [0, 400],
          PageUp: [0, -400],
        };
        if (e.key in steps) {
          e.preventDefault();
          nudge(steps[e.key][0], steps[e.key][1]);
        }
      });
    }

    return () => {
      cancelAnimationFrame(rafId);
      zoomGen++; // invalidate any pending close cleanup
      ro?.disconnect();
      gallery.removeEventListener("click", onGalleryClick);
      lightbox.removeEventListener("click", onLightboxClick);
      document.removeEventListener("keydown", onKeydown);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <main
        ref={galleryRef}
        className="photo-wall"
        aria-label="Photo gallery"
        tabIndex={0}
      >
        <div ref={canvasRef} className="pw-canvas">
          {ROW_SPECS.map(({ src, cloneRow }, rowIdx) => (
            <div
              key={rowIdx}
              className={"pw-row" + (cloneRow ? " is-clone-row" : "")}
              data-src={src}
              aria-hidden={cloneRow || undefined}
            >
              <div className="pw-track">
                {/* two copies per row so it can wrap horizontally; the first
                    element of the second copy marks the loop period */}
                {[false, true].map((loopCopy) =>
                  rowPhotos(src).map(({ photo, index }, i) => {
                    const isClone = cloneRow || loopCopy;
                    return (
                      <figure
                        key={`${loopCopy}-${photo.src}`}
                        className={"pw-photo" + (isClone ? " is-clone" : "")}
                        data-index={index}
                        data-loop-clone={loopCopy && i === 0 ? "" : undefined}
                        aria-hidden={isClone || undefined}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={thumbSrc(photo.src)}
                          alt={photo.caption || "Photograph"}
                          loading="lazy"
                          decoding="async"
                          width={photo.w}
                          height={photo.h}
                        />
                        {photo.caption && <figcaption>{photo.caption}</figcaption>}
                      </figure>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <div ref={lightboxRef} className="pw-lightbox" hidden>
        <div className="pw-lightbox-backdrop" />
        <button className="pw-lightbox-close" aria-label="Close">
          &times;
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={lightboxImgRef} alt="" />
        <p ref={lightboxCaptionRef} className="pw-lightbox-caption"></p>
      </div>
    </>
  );
}
