import { ProjectCard } from "./ProjectCard";
import type { ProjectFrontmatter } from "@/types/project";

export function FeaturedWork({ projects }: { projects: ProjectFrontmatter[] }) {
  return (
    <section className="py-8 tablet:py-12 desktop:py-20">
      <h6 className="px-5 tablet:px-10 pb-6 tablet:pb-8">
        Selected work
      </h6>
      <div
        className="overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar featured-scroll"
        style={{
          touchAction: "pan-x",
          overscrollBehaviorX: "contain",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="flex gap-5 tablet:gap-10">
          {projects.map((p) => (
            <div
              key={p.slug}
              className="snap-start shrink-0 w-[80vw] tablet:w-[42vw] desktop:w-[42vw] max-w-[640px]"
            >
              <ProjectCard project={p} />
            </div>
          ))}
          <div aria-hidden className="shrink-0 w-5 tablet:w-10" />
        </div>
      </div>
    </section>
  );
}
