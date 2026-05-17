import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProjectCard } from "@/components/home/ProjectCard";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Projects shipped, in progress, and side experiments.",
};

export default function WorkIndexPage() {
  const projects = getAllProjects();
  return (
    <PageWrapper>
      <section className="container-shell pt-12 tablet:pt-20 pb-20">
        <h1 className="pb-20 tablet:pb-32">Work</h1>
        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-5 tablet:gap-10">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
