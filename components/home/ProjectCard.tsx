import Link from "next/link";
import { Media } from "@/components/project/Media";
import { MultiLanguageCard } from "@/components/home/MultiLanguageCard";
import type { ProjectFrontmatter } from "@/types/project";

export function ProjectCard({ project }: { project: ProjectFrontmatter }) {
  const hasExternal = !!project.externalUrl && project.externalUrl.length > 0;
  const href = hasExternal ? project.externalUrl! : `/work/${project.slug}`;
  const cardMedia = project.cardHero ?? project.hero;
  const fit = project.cardHero?.fit ?? "contain";
  const isMultiLang = project.slug === "multi-language-agents";

  const inner = (
    <>
      <div
        className="relative w-full overflow-hidden block-radius transition-transform duration-150 ease-out group-hover:scale-[1.01] group-active:scale-[0.99]"
        style={{
          backgroundColor: "var(--color-background-alt)",
          aspectRatio: 1.2,
        }}
      >
        {isMultiLang ? (
          <MultiLanguageCard />
        ) : (
          cardMedia && (
            <Media
              src={cardMedia.src}
              alt={cardMedia.alt}
              poster={project.cardHero?.poster}
              fit={fit}
              eager={project.cardHero?.eager}
            />
          )
        )}
      </div>
      <div className="pt-4 flex flex-col gap-1">
        <h3 className="transition-opacity duration-150 ease-out group-hover:opacity-60">
          {project.title}
        </h3>
        {project.tagline && (
          <p
            className="text-body"
            style={{ color: "var(--color-muted)" }}
          >
            {project.tagline}
          </p>
        )}
      </div>
    </>
  );

  return hasExternal ? (
    <a href={href} target="_blank" rel="noreferrer" className="group block">
      {inner}
    </a>
  ) : (
    <Link href={href} className="group block">
      {inner}
    </Link>
  );
}
