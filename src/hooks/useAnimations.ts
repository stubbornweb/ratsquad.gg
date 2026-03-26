import { type Variants, type Transition } from "framer-motion";

/* ── Spring presets ── */
export const spring = {
  gentle: { type: "spring" as const, stiffness: 120, damping: 14 },
  snappy: { type: "spring" as const, stiffness: 300, damping: 30 },
  bouncy: { type: "spring" as const, stiffness: 400, damping: 10 },
  smooth: { type: "spring" as const, stiffness: 100, damping: 20 },
} satisfies Record<string, Transition>;

/* ── Easing curves ── */
export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  sharp: [0.4, 0, 0.2, 1] as const,
};

/* ── Stagger container ── */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

/* ── Fade variants ── */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: ease.out },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/* ── Clip-path text reveal (wipe from left) ── */
export const clipReveal: Variants = {
  hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.9, ease: ease.out },
  },
};

/* ── Slide-in from left ── */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: ease.out },
  },
};

/* ── Slide-in from right ── */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: ease.out },
  },
};

/* ── Scale-in ── */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: spring.snappy,
  },
};

/* ── Page transition ── */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

/* ── Hover/tap presets ── */
export const hoverScale = {
  scale: 1.02,
  transition: spring.snappy,
};

export const tapScale = {
  scale: 0.98,
  transition: spring.snappy,
};

/* ── Hero boot sequence (staggered with clip-path) ── */
export const heroUp = (delay: number) => ({
  initial: { opacity: 0, y: 20, clipPath: "inset(0 100% 0 0)" },
  animate: { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" },
  transition: { duration: 0.8, ease: ease.out, delay },
});

/* ── Scroll-triggered section helper ── */
export const scrollReveal = (delay = 0): {
  initial: string;
  whileInView: string;
  viewport: { once: boolean; amount: number };
  transition: { delay: number };
} => ({
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, amount: 0.15 },
  transition: { delay },
});
