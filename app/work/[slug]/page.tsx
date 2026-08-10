import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProjectDetailBody } from "@/components/home/gallery/ProjectDetailBody";
import { getAllProjectSlugs, getProjectFrontmatter } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectFrontmatter(slug);
  if (!project) return {};
  const heroIsImage =
    project.hero?.src && /\.(png|jpe?g|webp|avif)$/i.test(project.hero.src);
  const ogImage = heroIsImage ? project.hero!.src : "/og-image.png";
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: [ogImage],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectFrontmatter(slug);
  if (!project) notFound();

  return (
    <PageWrapper>
      <div className="max-w-[1400px] mx-auto">
        <ProjectDetailBody slug={slug} />
      </div>
    </PageWrapper>
  );
}
