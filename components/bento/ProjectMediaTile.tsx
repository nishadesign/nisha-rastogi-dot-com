import Link from "next/link";
import type { ProjectFrontmatter } from "@/types/project";
import { Media } from "@/components/project/Media";

type Span = 1 | 2 | 3 | 4 | 5 | 6;
type MobileSpan = 1 | 2;
type MobileRowSpan = 1 | 2 | 3;

const colSpanClasses: Record<Span, string> = {
  1: "tablet:col-span-1",
  2: "tablet:col-span-2",
  3: "tablet:col-span-3",
  4: "tablet:col-span-4",
  5: "tablet:col-span-5",
  6: "tablet:col-span-6",
};

const rowSpanClasses: Record<Span, string> = {
  1: "tablet:row-span-1",
  2: "tablet:row-span-2",
  3: "tablet:row-span-3",
  4: "tablet:row-span-4",
  5: "tablet:row-span-5",
  6: "tablet:row-span-6",
};

const mobileColSpanClasses: Record<MobileSpan, string> = {
  1: "col-span-1",
  2: "col-span-2",
};

const mobileRowSpanClasses: Record<MobileRowSpan, string> = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
};

export function ProjectMediaTile({
  project,
  colSpan = 4,
  rowSpan = 2,
  mobileColSpan = 2,
  mobileRowSpan = 2,
}: {
  project: ProjectFrontmatter;
  colSpan?: Span;
  rowSpan?: Span;
  mobileColSpan?: MobileSpan;
  mobileRowSpan?: MobileRowSpan;
}) {
  const hasExternal = !!project.externalUrl && project.externalUrl.length > 0;
  const href = hasExternal ? project.externalUrl! : `/work/${project.slug}`;
  const cardMedia = project.cardHero ?? project.hero;
  const fit = project.cardHero?.fit ?? "cover";

  const inner = (
    <div
      className="group relative w-full h-full min-h-[260px] overflow-hidden block-radius transition-transform duration-200 ease-out hover:scale-[1.01] active:scale-[0.99]"
      style={{ backgroundColor: "var(--color-background-alt)" }}
    >
      {cardMedia && (
        <Media
          src={cardMedia.src}
          alt={cardMedia.alt}
          poster={project.cardHero?.poster}
          fit={fit}
          eager={project.cardHero?.eager}
        />
      )}

      {/* Bottom gradient + label */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0))",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 p-5 tablet:p-6 desktop:p-8 flex flex-col gap-1">
        <h3 className="transition-opacity duration-200 ease-out group-hover:opacity-80" style={{ color: "white" }}>
          {project.title}
        </h3>
        {project.tagline && (
          <p
            className="text-body"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            {project.tagline}
          </p>
        )}
      </div>
    </div>
  );

  const wrapperClasses = `block ${mobileColSpanClasses[mobileColSpan]} ${mobileRowSpanClasses[mobileRowSpan]} ${colSpanClasses[colSpan]} ${rowSpanClasses[rowSpan]}`;

  return hasExternal ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={wrapperClasses}
    >
      {inner}
    </a>
  ) : (
    <Link href={href} className={wrapperClasses}>
      {inner}
    </Link>
  );
}
