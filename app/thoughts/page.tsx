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
        <ul className="flex flex-col gap-5 tablet:gap-6 max-w-[720px]">
          {thoughts.map((t) => (
            <li key={t.slug}>
              <FadeIn>
                <Link
                  href={`/thoughts/${t.slug}`}
                  className="group flex flex-col gap-2 -mx-4 px-4 py-4 tablet:-mx-6 tablet:px-6 tablet:py-6 block-radius transition-colors duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[var(--color-background-alt)]"
                >
                  <h3>{t.title}</h3>
                  {t.description && (
                    <p
                      className="text-body"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {t.description}
                    </p>
                  )}
                  <span
                    className="font-mono text-caption uppercase tracking-[-0.03em]"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {t.date}
                  </span>
                </Link>
              </FadeIn>
            </li>
          ))}
        </ul>
      </article>
    </PageWrapper>
  );
}
