import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { TableOfContents } from "@/components/thoughts/TableOfContents";
import { JsonLd } from "@/components/seo/JsonLd";
import { profile } from "@/data/profile";
import {
  getAllThoughtSlugs,
  getThoughtFrontmatter,
  thoughtHasHeadings,
} from "@/lib/thoughts";

const SITE_URL = "https://nisha-rastogi.com";

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
      type: "article",
      publishedTime: thought.date,
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: thought.title,
      description: thought.description,
      images: ["/og-image.png"],
    },
  };
}

export default async function ThoughtDetailPage({ params }: Props) {
  const { slug } = await params;
  const thought = getThoughtFrontmatter(slug);
  if (!thought) notFound();
  const hasToc = thoughtHasHeadings(slug);

  let MDXContent;
  try {
    const mod = await import(`@/content/thoughts/${slug}.mdx`);
    MDXContent = mod.default;
  } catch {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: thought.title,
    description: thought.description,
    datePublished: thought.date,
    author: {
      "@type": "Person",
      name: profile.name,
      url: SITE_URL,
    },
    image: `${SITE_URL}/og-image.png`,
    url: `${SITE_URL}/thoughts/${slug}`,
  };

  return (
    <PageWrapper>
      <JsonLd data={articleSchema} />
      <article className="pb-20 max-w-[1400px] mx-auto px-5 tablet:px-10">
        <div
          className="font-mono text-caption uppercase tracking-[-0.03em] pt-12 tablet:pt-20 pb-4"
          style={{ color: "var(--color-muted)" }}
        >
          {thought.date}
        </div>
        <h1 className="pb-10 tablet:pb-16">{thought.title}</h1>
        {hasToc ? (
          <div className="grid grid-cols-1 desktop:grid-cols-[200px_1fr] gap-12 desktop:gap-20 items-start">
            <TableOfContents />
            <div className="prose-thoughts flex flex-col gap-8 tablet:gap-10 max-w-[800px]">
              <MDXContent />
            </div>
          </div>
        ) : (
          <div className="prose-thoughts flex flex-col gap-8 tablet:gap-10 max-w-[800px]">
            <MDXContent />
          </div>
        )}
      </article>
    </PageWrapper>
  );
}
