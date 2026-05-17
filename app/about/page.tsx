import type { Metadata } from "next";
import { Briefcase, FileText, Plane, Heart } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Timeline } from "@/components/about/Timeline";
import { timeline } from "@/data/timeline";

const LEGEND_ITEMS = [
  { Icon: Briefcase, label: "Work-life" },
  { Icon: Plane, label: "Places" },
  { Icon: Heart, label: "Self" },
];

export const metadata: Metadata = {
  title: "About",
  description: "A timeline of writing, projects, and life events.",
};

export default function AboutPage() {
  return (
    <PageWrapper>
      <article className="pb-20 max-w-[1400px] mx-auto px-5 tablet:px-10">
        <h1 className="pt-12 tablet:pt-20 pb-20 tablet:pb-32">About</h1>
        <div className="pb-8 tablet:pb-10">
          <p
            className="text-body"
            style={{ color: "var(--color-muted)" }}
          >
            I was born and raised in India. I moved across the world in my
            early twenties and have been building life through curiosity ever
            since. I&rsquo;m drawn to things that feel raw, intentional, and
            alive, whether that&rsquo;s pushing myself through CrossFit,
            learning something completely new, or obsessing over tiny details.
            I love meeting new people, exploring unfamiliar places, and
            chasing the kind of moments that make life feel bigger than
            routine.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 pb-12 tablet:pb-20">
          {LEGEND_ITEMS.map(({ Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 font-mono text-caption uppercase tracking-[-0.03em]"
              style={{ color: "var(--color-muted)" }}
            >
              <Icon size={16} strokeWidth={1.5} />
              <span>{label}</span>
            </div>
          ))}
        </div>
        <Timeline entries={timeline} />
      </article>
    </PageWrapper>
  );
}
