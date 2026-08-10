"use client";

import type { ReactNode } from "react";
import { MetaStrip } from "@/components/project/MetaStrip";
import { ContentGrid } from "@/components/project/ContentGrid";
import { ProjectCarousel } from "@/components/project/ProjectCarousel";
import type { ProjectFrontmatter } from "@/types/project";

export function ProjectDetailContent({
  project,
  children,
}: {
  project: ProjectFrontmatter;
  children?: ReactNode;
}) {
  const slides =
    project.gallery && project.gallery.length > 0
      ? project.gallery
      : project.hero
        ? [{ src: project.hero.src, alt: project.hero.alt }]
        : [];
  const hasMeta =
    (project.team && project.team.length > 0) ||
    project.date ||
    project.releaseNotes?.href;

  return (
    <article className="project-detail">
      {slides.length > 0 && <ProjectCarousel slides={slides} />}
      <h1 className="project-detail-h1 pb-3 tablet:pb-4">
        {project.title}
      </h1>
      <div className="flex flex-col gap-8 tablet:gap-12 pb-8 tablet:pb-12">
        <p className="text-caption" style={{ color: "var(--color-muted)" }}>
          {project.description}
        </p>
        {hasMeta && (
          <MetaStrip
            team={project.team}
            date={project.date}
            releaseNotes={project.releaseNotes}
          />
        )}
      </div>
      {children && <ContentGrid>{children}</ContentGrid>}
    </article>
  );
}
