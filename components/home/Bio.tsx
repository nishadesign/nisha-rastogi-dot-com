import Image from "next/image";
import { FadeIn } from "@/components/ui/FadeIn";
import { profile } from "@/data/profile";

export function Bio() {
  return (
    <section className="px-5 tablet:px-10 py-16 tablet:py-20 desktop:py-32">
      <FadeIn className="grid grid-cols-1 desktop:grid-cols-[800px_1fr] gap-8 tablet:gap-12 desktop:gap-20 items-start">
        <div className="relative w-full max-w-[800px] overflow-hidden block-radius aspect-[4/5]">
          <Image
            src="/images/profile/profile-image.jpg"
            alt="Nisha Rastogi"
            fill
            sizes="800px"
            className="object-cover"
            priority={false}
          />
        </div>
        <div className="flex flex-col gap-6">
          <h2>I love the messy, ambiguous early stages of building</h2>
          <p
            className="text-body-large"
            style={{ color: "var(--color-muted)" }}
          >
            Currently, I'm building AI-native products at Salesforce with some
            really smart folks. I've always been fond of building — it started
            as a childhood obsession with puzzles, grew into a deep-rooted
            passion for building cars, and now I build software experiences.
          </p>
          <p
            className="text-body-large"
            style={{ color: "var(--color-muted)" }}
          >
            Outside of work, I'm deeply into CrossFit, cooking, and yapping
            with friends — which lately has mostly turned into vibe-coding
            hangs. Not complaining ;)
          </p>
          <p
            className="text-body-large"
            style={{ color: "var(--color-muted)" }}
          >
            {profile.connect.paragraph}
          </p>
          <div
            className="flex flex-wrap gap-6 text-body"
            style={{ color: "var(--color-content)" }}
          >
            <a
              href={`mailto:${profile.email}`}
              className="underline underline-offset-[3px] transition-opacity duration-150 ease-out hover:opacity-60"
            >
              Email
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-[3px] transition-opacity duration-150 ease-out hover:opacity-60"
            >
              LinkedIn
            </a>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-[3px] transition-opacity duration-150 ease-out hover:opacity-60"
            >
              GitHub
            </a>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
