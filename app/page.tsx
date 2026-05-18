import { PageWrapper } from "@/components/layout/PageWrapper";
import { Hero } from "@/components/home/Hero";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Bio } from "@/components/home/Bio";
import { JsonLd } from "@/components/seo/JsonLd";
import { profile } from "@/data/profile";
import { getFeaturedProjects } from "@/lib/projects";

const SITE_URL = "https://nisha-rastogi.com";

export default function HomePage() {
  const projects = getFeaturedProjects();
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
      <Hero />
      <FeaturedWork projects={projects} />
      <Bio />
    </PageWrapper>
  );
}
