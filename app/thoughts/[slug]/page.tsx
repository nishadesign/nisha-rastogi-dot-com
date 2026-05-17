import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { TableOfContents } from "@/components/thoughts/TableOfContents";
import { getAllThoughtSlugs, getThoughtFrontmatter } from "@/lib/thoughts";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllThoughtSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const thought = getThoughtFrontmatter(slug);
  if (!thought) return {};
  return {
    title: thought.title,
    description: thought.description,
    openGraph: {
      title: thought.title,
      description: thought.description,
    },
  };
}

export default async function ThoughtDetailPage({ params }: Props) {
  const { slug } = await params;
  const thought = getThoughtFrontmatter(slug);
  if (!thought) notFound();

  let MDXContent;
  try {
    const mod = await import(`@/content/thoughts/${slug}.mdx`);
    MDXContent = mod.default;
  } catch {
    notFound();
  }

  return (
    <PageWrapper>
      <article className="pb-20 max-w-[1400px] mx-auto px-5 tablet:px-10">
        <div
          className="font-mono text-caption uppercase tracking-[-0.03em] pt-12 tablet:pt-20 pb-4"
          style={{ color: "var(--color-muted)" }}
        >
          {thought.date}
        </div>
        <h1 className="pb-10 tablet:pb-16">{thought.title}</h1>
        <div className="grid grid-cols-1 desktop:grid-cols-[200px_1fr] gap-12 desktop:gap-20 items-start">
          <TableOfContents />
          <div className="prose-thoughts flex flex-col gap-8 tablet:gap-10 max-w-[800px]">
            <MDXContent />
          </div>
        </div>
      </article>
    </PageWrapper>
  );
}
