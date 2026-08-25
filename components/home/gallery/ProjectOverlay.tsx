"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { ProjectFrontmatter } from "@/types/project";
import { ProjectDetailContent } from "./ProjectDetailContent";
import { ProjectDetailStencil } from "./ProjectDetailStencil";

const ease = [0.23, 1, 0.32, 1] as const;

export function ProjectOverlay({
  projectSlug,
  project,
  isLoading,
  hasError,
  onClose,
}: {
  projectSlug: string | null;
  project: ProjectFrontmatter | null;
  isLoading: boolean;
  hasError: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Lock body scroll + close on Escape while open. Reset the panel to the top.
  useEffect(() => {
    if (!projectSlug) return;
    if (panelRef.current) panelRef.current.scrollTop = 0;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [projectSlug, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {projectSlug && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 tablet:p-12 desktop:p-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease }}
        >
          {/* scrim */}
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 cursor-default"
            style={{ backgroundColor: "rgba(20, 18, 30, 0.45)" }}
          />

          {/* floating panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-[820px] max-h-full overflow-y-auto block-radius hide-scrollbar"
            style={{ backgroundColor: "var(--color-background)" }}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.34, ease }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 tablet:top-6 right-4 tablet:right-6 z-10 flex items-center justify-center w-10 h-10 rounded-full text-white transition-opacity duration-150 hover:opacity-90"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(12px)",
              }}
            >
              <X size={18} />
            </button>

            {/* The stencil fades in rather than appearing outright. A project
                that resolves in under ~100ms would otherwise flash a
                placeholder on screen and rip it away again; at this duration
                a fast load simply never reaches full opacity. */}
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.18, ease }}
              >
                <ProjectDetailStencil />
                <span className="sr-only" role="status">
                  Loading project
                </span>
              </motion.div>
            ) : hasError ? (
              <ProjectOverlayMessage>
                Could not load this project. Please try again.
              </ProjectOverlayMessage>
            ) : project ? (
              <ProjectDetailContent project={project} />
            ) : (
              <ProjectOverlayMessage>Project unavailable.</ProjectOverlayMessage>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function ProjectOverlayMessage({ children }: { children: ReactNode }) {
  return (
    <div className="project-detail min-h-[260px] flex items-center justify-center">
      <p className="text-caption" style={{ color: "var(--color-muted)" }}>
        {children}
      </p>
    </div>
  );
}
