import { getProjectFrontmatter } from "@/lib/projects";
import { ProjectDetailContent } from "./ProjectDetailContent";

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

  return (
    <ProjectDetailContent project={project}>
      {MDXContent && <MDXContent />}
    </ProjectDetailContent>
  );
}
