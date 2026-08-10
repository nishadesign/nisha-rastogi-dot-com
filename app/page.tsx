import type { ReactNode } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { GalleryWall } from "@/components/home/gallery/GalleryWall";
import { ProjectDetailBody } from "@/components/home/gallery/ProjectDetailBody";
import { JsonLd } from "@/components/seo/JsonLd";
import { profile } from "@/data/profile";
import { galleryTiles } from "@/data/gallery";
import { getProjectFrontmatter } from "@/lib/projects";

const SITE_URL = "https://nisha-rastogi.com";

export default async function HomePage() {
  // Render the case-study body for each unique project referenced by a tile,
  // keyed by slug. The client overlay mounts the matching one when opened.
  const slugs = [
    ...new Set(galleryTiles.map((t) => t.project).filter((slug) => slug !== "bio")),
  ];
  const details: Record<string, ReactNode> = {};
  for (const slug of slugs) {
    details[slug] = <ProjectDetailBody slug={slug} />;
  }
  const bioProject = getProjectFrontmatter("bio");
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.intro,
    url: SITE_URL,
    image: `${SITE_URL}/og-image.png`,
    email: `mailto:${profile.email}`,
    sameAs: [
      profile.links.linkedin,
      profile.links.github,
      profile.links.substack,
    ],
  };
  return (
    <PageWrapper>
      <JsonLd data={personSchema} />
      <GalleryWall details={details} bioProject={bioProject} />
    </PageWrapper>
  );
}
