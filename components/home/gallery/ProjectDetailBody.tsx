import { MetaStrip } from "@/components/project/MetaStrip";
import { ContentGrid } from "@/components/project/ContentGrid";
import { ProjectCarousel } from "@/components/project/ProjectCarousel";
import { getProjectFrontmatter } from "@/lib/projects";

/**
 * Renders a project's full case-study body — the shared content used by both
 * the /work/[slug] detail page and the intercepted home overlay. Loads its
 * own frontmatter + MDX server-side from the slug.
 */
export async function ProjectDetailBody({ slug }: { slug: string }) {
  const project = getProjectFrontmatter(slug);
  if (!project) return null;

  let MDXContent = null;
  try {
    const mod = await import(`@/content/projects/${slug}.mdx`);
    MDXContent = mod.default;
  } catch {
    MDXContent = null;
  }

  // Carousel slides: use `gallery` if provided, else fall back to the hero.
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
      {MDXContent && (
        <ContentGrid>
          <MDXContent />
        </ContentGrid>
      )}
    </article>
  );
}
