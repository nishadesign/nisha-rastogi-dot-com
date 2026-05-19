import Link from "next/link";
import { Media } from "@/components/project/Media";
import { FadeIn } from "@/components/ui/FadeIn";
import type { ProjectFrontmatter } from "@/types/project";

export function ProjectCard({
  project,
  animate = true,
}: {
  project: ProjectFrontmatter;
  animate?: boolean;
}) {
  const hasExternal = !!project.externalUrl && project.externalUrl.length > 0;
  const href = hasExternal ? project.externalUrl! : `/work/${project.slug}`;
  const isExternal = hasExternal;

  const Wrapper = isExternal
    ? ({ children }: { children: React.ReactNode }) => (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="group block"
        >
          {children}
        </a>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <Link href={href} className="group block">
          {children}
        </Link>
      );

  const Container = animate
    ? ({ children }: { children: React.ReactNode }) => (
        <FadeIn className="w-full">{children}</FadeIn>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div className="w-full">{children}</div>
      );

  return (
    <Container>
      <Wrapper>
        <div
          className="relative w-full overflow-hidden block-radius transition-transform duration-150 ease-out group-hover:scale-[1.01] group-active:scale-[0.97]"
          style={{
            backgroundColor: "var(--color-background-alt)",
            aspectRatio: 1.2,
          }}
        >
          {(() => {
            const cardMedia = project.cardHero ?? project.hero;
            if (!cardMedia) return null;
            const fit = project.cardHero?.fit ?? "contain";
            return (
              <Media
                src={cardMedia.src}
                alt={cardMedia.alt}
                poster={project.cardHero?.poster}
                fit={fit}
              />
            );
          })()}
          <div
            className="absolute inset-0 z-10 ring-1 ring-inset pointer-events-none block-radius"
            style={{ "--tw-ring-color": "var(--color-border)" } as React.CSSProperties}
          />
        </div>
        <div className="pt-4 flex flex-col gap-1">
          <h3 className="transition-opacity duration-150 ease-out group-hover:opacity-60">
            {project.title}
          </h3>
          {project.tagline && (
            <p
              className="text-caption"
              style={{ color: "var(--color-muted)" }}
            >
              {project.tagline}
            </p>
          )}
        </div>
      </Wrapper>
    </Container>
  );
}
