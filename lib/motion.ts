const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -10% 0px" },
  transition: { duration: 0.4, ease: EASE_OUT },
} as const;
