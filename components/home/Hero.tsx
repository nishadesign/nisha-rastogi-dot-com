"use client";

import { Fragment } from "react";
import { motion } from "motion/react";

const ease = [0.23, 1, 0.32, 1] as const;

const headline = "Turning ambiguous ideas into products";
const words = headline.split(" ");

const GREY = "rgba(0, 0, 0, 0.6)";
const BLACK = "rgb(0, 0, 0)";

const BASE_DELAY = 0.1;
const STEP = 0.025;
const FILL_DURATION = 0.45;

const totalLetters = headline.replace(/\s/g, "").length;
const subtitleDelay = BASE_DELAY + totalLetters * STEP + 0.2;

export function Hero() {
  let letterIndex = 0;

  return (
    <section className="px-5 tablet:px-10 py-12 tablet:py-20">
      <div className="flex flex-col gap-4 tablet:gap-6">
        <h1 className="hero-h1" aria-label={headline}>
          {words.map((w, wi) => (
            <Fragment key={`${w}-${wi}`}>
              <span aria-hidden className="inline-block whitespace-nowrap">
                {w.split("").map((char, ci) => {
                  const delay = BASE_DELAY + letterIndex * STEP;
                  letterIndex += 1;
                  return (
                    <motion.span
                      key={ci}
                      className="inline-block"
                      initial={{ color: GREY }}
                      animate={{ color: BLACK }}
                      transition={{ duration: FILL_DURATION, ease, delay }}
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </span>
              {wi < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </h1>
        <motion.p
          className="text-body-large max-w-[640px]"
          style={{ color: "var(--color-muted)" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: subtitleDelay }}
        >
          Currently building Agentforce Platform at Salesforce
        </motion.p>
      </div>
    </section>
  );
}
