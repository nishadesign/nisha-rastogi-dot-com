"use client";

import { motion } from "motion/react";

const ease = [0.23, 1, 0.32, 1] as const;

export function Hero() {
  return (
    <section className="px-5 tablet:px-10 py-12 tablet:py-20">
      <div className="flex flex-col gap-4 tablet:gap-6">
        <motion.h1
          className="hero-h1"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0 }}
        >
          Turning ambiguous ideas into products
        </motion.h1>
        <motion.p
          className="text-body-large max-w-[640px]"
          style={{ color: "var(--color-muted)" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
        >
          Currently building Agentforce Platform at Salesforce
        </motion.p>
      </div>
    </section>
  );
}
