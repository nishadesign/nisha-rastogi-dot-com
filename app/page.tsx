import { PageWrapper } from "@/components/layout/PageWrapper";
import { Hero } from "@/components/home/Hero";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Bio } from "@/components/home/Bio";
import { getFeaturedProjects } from "@/lib/projects";

export default function HomePage() {
  const projects = getFeaturedProjects();
  return (
    <PageWrapper>
      <Hero />
      <FeaturedWork projects={projects} />
      <Bio />
    </PageWrapper>
  );
}
