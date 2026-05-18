import type { Metadata } from "next";
import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { FadeIn } from "@/components/ui/FadeIn";
import { getAllThoughts } from "@/lib/thoughts";

export const metadata: Metadata = {
  title: "Thoughts",
  description: "Writing on design, AI, and building products.",
};

export default function ThoughtsIndexPage() {
  const thoughts = getAllThoughts();
  return (
    <PageWrapper>
      <article className="pb-20 max-w-[1400px] mx-auto px-5 tablet:px-10">
        <h1 className="pt-12 tablet:pt-20 pb-20 tablet:pb-32">Thoughts</h1>
        <ul className="grid grid-cols-1 tablet:grid-cols-2 gap-5 tablet:gap-10 auto-rows-fr">
          {thoughts.map((t) => (
            <li key={t.slug} className="h-full">
              <FadeIn className="h-full">
                <Link
                  href={`/thoughts/${t.slug}`}
                  className="block group h-full"
                >
                  <div
                    className="block-radius p-8 tablet:p-10 desktop:p-12 transition-transform duration-150 ease-out group-hover:scale-[1.01] group-active:scale-[0.97] flex flex-col gap-2 h-full"
                    style={{
                      backgroundColor: "var(--color-background-alt)",
                    }}
                  >
                    <span
                      className="font-mono text-caption uppercase tracking-[-0.03em]"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {t.date}
                    </span>
                    <h3 className="transition-opacity group-hover:opacity-60">
                      {t.title}
                    </h3>
                    {t.description && (
                      <p
                        className="text-body line-clamp-2"
                        style={{ color: "var(--color-muted)" }}
                      >
                        {t.description}
                      </p>
                    )}
                  </div>
                </Link>
              </FadeIn>
            </li>
          ))}
        </ul>
      </article>
    </PageWrapper>
  );
}
