import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { MetaStrip } from "@/components/project/MetaStrip";
import { ContentGrid } from "@/components/project/ContentGrid";
import { Media } from "@/components/project/Media";
import { getAllProjectSlugs, getProjectFrontmatter } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectFrontmatter(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.hero?.src ? [{ url: project.hero.src }] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectFrontmatter(slug);
  if (!project) notFound();

  // Dynamic MDX import
  let MDXContent;
  try {
    const mod = await import(`@/content/projects/${slug}.mdx`);
    MDXContent = mod.default;
  } catch {
    notFound();
  }

  return (
    <PageWrapper>
      <article className="pb-20 max-w-[1400px] mx-auto px-5 tablet:px-10">
        <h1 className="pt-12 tablet:pt-20 pb-20 tablet:pb-32">{project.title}</h1>
        <div className="grid grid-cols-1 desktop:grid-cols-2 gap-8 tablet:gap-12 desktop:gap-20 items-start pb-8 tablet:pb-12">
          <p
            className="text-body"
            style={{ color: "var(--color-muted)" }}
          >
            {project.description}
          </p>
          <MetaStrip
            team={project.team}
            date={project.date}
            releaseNotes={project.releaseNotes}
          />
        </div>
        {project.hero?.src && (
          <div className="relative w-full overflow-hidden block-radius mb-8 tablet:mb-12 desktop:mb-20 aspect-[16/10]">
            <Media
              src={project.hero.src}
              alt={project.hero.alt}
              priority
            />
          </div>
        )}
        <ContentGrid>
          <MDXContent />
        </ContentGrid>
      </article>
    </PageWrapper>
  );
}
