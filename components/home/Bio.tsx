"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { FadeIn } from "@/components/ui/FadeIn";
import { Experience } from "./Experience";
import { profile } from "@/data/profile";

export function Bio() {
  return (
    <section className="px-5 tablet:px-10 py-16 tablet:py-20 desktop:py-32">
      <FadeIn className="grid grid-cols-1 desktop:grid-cols-[800px_1fr] gap-8 tablet:gap-12 desktop:gap-20 items-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="relative w-full max-w-[800px] overflow-hidden block-radius aspect-[4/5]"
        >
          <Image
            src="/images/profile/profile-image.jpg"
            alt="Nisha Rastogi"
            fill
            sizes="800px"
            className="object-cover"
            priority={false}
          />
        </motion.div>
        <div className="flex flex-col gap-6">
          <h2 className="section-thesis">
            I love the messy, ambiguous early stages of building
          </h2>
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
          <Experience />
          <p
            className="text-body-large pt-6 tablet:pt-8"
            style={{ color: "var(--color-muted)" }}
          >
            {profile.connect.paragraph}
          </p>
          <div className="flex flex-wrap items-center gap-6 text-body pt-2">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center rounded-full px-5 py-3 transition-[opacity,transform] duration-150 ease-out hover:opacity-80 active:scale-[0.97]"
              style={{
                backgroundColor: "var(--color-content)",
                color: "var(--color-inverse)",
              }}
            >
              Get in touch
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-[3px] transition-opacity duration-150 ease-out hover:opacity-60"
              style={{ color: "var(--color-content)" }}
            >
              LinkedIn
            </a>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-[3px] transition-opacity duration-150 ease-out hover:opacity-60"
              style={{ color: "var(--color-content)" }}
            >
              GitHub
            </a>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
