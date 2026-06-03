import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { BentoTile } from "@/components/bento/BentoTile";
import { ProjectMediaTile } from "@/components/bento/ProjectMediaTile";
import { profile } from "@/data/profile";
import { experience } from "@/data/experience";
import { getFeaturedProjects, getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Bento — exploration",
  description: "Bento grid exploration of the home page.",
};

export default function BentoPage() {
  const featured = getFeaturedProjects();
  const allProjects = getAllProjects();
  const featuredProject = featured[0] ?? allProjects[0];
  const secondProject = featured[1] ?? allProjects[1];
  const thirdProject = allProjects[2];
  const currentRole = experience[experience.length - 1];

  return (
    <PageWrapper>
      {/* Headline — sits above the grid, no card */}
      <section className="px-5 tablet:px-10 pt-8 tablet:pt-12 desktop:pt-16 pb-10 tablet:pb-14 desktop:pb-20">
        <div className="flex flex-col gap-5 tablet:gap-7 max-w-[1400px]">
          <h6>Hi, I'm {profile.name.split(" ")[0]}</h6>
          <h1 className="hero-h1">{profile.positioning}</h1>
          <p
            className="text-body max-w-[60ch]"
            style={{ color: "var(--color-muted)" }}
          >
            {profile.intro}
          </p>
        </div>
      </section>

      <section className="px-5 tablet:px-10 pb-32 tablet:pb-40">
        <div
          className="grid grid-cols-2 tablet:grid-cols-6 auto-rows-[140px] tablet:auto-rows-[180px] desktop:auto-rows-[200px] gap-3 tablet:gap-5 desktop:gap-6"
        >
          {/* PORTRAIT — 2 wide × 3 tall */}
          <BentoTile
            colSpan={2}
            rowSpan={3}
            mobileColSpan={2}
            mobileRowSpan={3}
            padded={false}
            delay={0.05}
          >
            <div className="relative w-full h-full min-h-[260px]">
              <Image
                src="/images/profile/profile-image.jpg"
                alt={profile.name}
                fill
                sizes="(min-width: 810px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          </BentoTile>

          {/* FEATURED PROJECT — 4 wide × 3 tall */}
          {featuredProject && (
            <ProjectMediaTile
              project={featuredProject}
              colSpan={4}
              rowSpan={3}
              mobileColSpan={2}
              mobileRowSpan={2}
            />
          )}

          {/* CURRENT ROLE — 3 wide × 1 tall */}
          <BentoTile colSpan={3} rowSpan={1} mobileColSpan={2} mobileRowSpan={1} delay={0.1}>
            <div className="h-full flex flex-col justify-between">
              <h6>Currently</h6>
              <p className="text-body-large" style={{ lineHeight: 1.25 }}>
                {currentRole.role} @ {currentRole.company}
              </p>
            </div>
          </BentoTile>

          {/* QUICK LINKS — 3 wide × 1 tall */}
          <BentoTile colSpan={3} rowSpan={1} mobileColSpan={2} mobileRowSpan={1} delay={0.15}>
            <div className="h-full flex flex-col justify-between gap-3">
              <h6>Connect</h6>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-body">
                <a
                  href={`mailto:${profile.email}`}
                  className="underline underline-offset-[3px] transition-opacity duration-150 hover:opacity-60"
                >
                  Email
                </a>
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-[3px] transition-opacity duration-150 hover:opacity-60"
                >
                  LinkedIn
                </a>
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-[3px] transition-opacity duration-150 hover:opacity-60"
                >
                  GitHub
                </a>
              </div>
            </div>
          </BentoTile>

          {/* SECOND PROJECT — 3 wide × 2 tall */}
          {secondProject && (
            <ProjectMediaTile
              project={secondProject}
              colSpan={3}
              rowSpan={2}
              mobileColSpan={2}
              mobileRowSpan={2}
            />
          )}

          {/* EXPERIENCE — 3 wide × 2 tall */}
          <BentoTile colSpan={3} rowSpan={2} mobileColSpan={2} mobileRowSpan={2} delay={0.2}>
            <div className="h-full flex flex-col gap-4">
              <h6>Experience</h6>
              <ul className="flex flex-col gap-3">
                {experience
                  .slice()
                  .reverse()
                  .map((entry) => (
                    <li
                      key={`${entry.start}-${entry.company}`}
                      className="grid grid-cols-[9rem_1fr] gap-3 items-baseline"
                    >
                      <span
                        className="font-mono text-caption uppercase tracking-[-0.03em] whitespace-nowrap"
                        style={{ color: "var(--color-muted)" }}
                      >
                        {entry.start} — {entry.end}
                      </span>
                      <span
                        className="text-body"
                        style={{ color: "var(--color-content)" }}
                      >
                        {entry.role} · {entry.company}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </BentoTile>

          {/* THIRD PROJECT — 2 wide × 2 tall */}
          {thirdProject && (
            <ProjectMediaTile
              project={thirdProject}
              colSpan={2}
              rowSpan={2}
              mobileColSpan={1}
              mobileRowSpan={2}
            />
          )}

          {/* OUTSIDE OF WORK — 2 wide × 2 tall (accent) */}
          <BentoTile
            colSpan={2}
            rowSpan={2}
            mobileColSpan={1}
            mobileRowSpan={2}
            delay={0.25}
            style={{ backgroundColor: "var(--color-content)" }}
          >
            <div className="h-full flex flex-col justify-between gap-4">
              <h6 style={{ color: "rgba(255,255,255,0.6)" }}>Outside work</h6>
              <p
                className="text-body-large"
                style={{ color: "var(--color-inverse)", lineHeight: 1.3 }}
              >
                CrossFit, cooking, and yapping with friends — which lately has mostly turned into vibe-coding hangs.
              </p>
            </div>
          </BentoTile>

          {/* SUBSTACK — 2 wide × 1 tall */}
          <BentoTile
            colSpan={2}
            rowSpan={1}
            mobileColSpan={2}
            mobileRowSpan={1}
            href={profile.links.substack}
            external
            delay={0.3}
            ariaLabel="Read on Substack"
          >
            <div className="h-full flex items-center justify-between gap-4">
              <span className="text-body">Read my writing</span>
              <ArrowUpRight
                size={20}
                className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
          </BentoTile>

          {/* SEE ALL WORK — 4 wide × 1 tall */}
          <BentoTile
            colSpan={4}
            rowSpan={1}
            mobileColSpan={2}
            mobileRowSpan={1}
            href="/work"
            delay={0.35}
            ariaLabel="See all work"
            style={{ backgroundColor: "var(--color-content)" }}
          >
            <div className="h-full flex items-center justify-between gap-4">
              <span
                className="text-body-large"
                style={{ color: "var(--color-inverse)" }}
              >
                See all work →
              </span>
              <ArrowUpRight
                size={24}
                style={{ color: "var(--color-inverse)" }}
                className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
          </BentoTile>
        </div>
      </section>
    </PageWrapper>
  );
}
