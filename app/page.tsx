import { PageWrapper } from "@/components/layout/PageWrapper";
import { GalleryWall } from "@/components/home/gallery/GalleryWall";
import { JsonLd } from "@/components/seo/JsonLd";
import { profile } from "@/data/profile";
import { getProjectFrontmatter } from "@/lib/projects";

const SITE_URL = "https://nisha-rastogi.com";

export default async function HomePage() {
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
      <GalleryWall bioProject={bioProject} />
    </PageWrapper>
  );
}
