import { type Variants } from "framer-motion";

export const spring = {
  gentle: { type: "spring" as const, stiffness: 120, damping: 14 },
  snappy: { type: "spring" as const, stiffness: 300, damping: 30 },
  bouncy: { type: "spring" as const, stiffness: 400, damping: 10 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: spring.gentle,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: spring.snappy,
  },
};

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.3, ease: "easeIn" as const },
  },
};

export const hoverScale = {
  scale: 1.02,
  transition: spring.snappy,
};

export const tapScale = {
  scale: 0.98,
  transition: spring.snappy,
};
