/**
 * PROTOTYPE — THROWAWAY. Motion local to /prototype/assessment.
 *
 * The shared presets in `useAnimations.ts` are tuned for scroll reveals on the
 * homepage — `fadeUp` travels 30px over 700ms. That is right for the result
 * screen, which IS a scroll, and wrong for the eighteen, where the player taps
 * every three seconds and a 700ms transition is eighteen seconds of waiting.
 *
 * So the result reuses the shared variants directly and the journey gets these:
 * the same shapes, inside the project's 150–200ms rule. `ease.out` is the same
 * curve as the `--ease-out` token, so CSS and Framer transitions land together.
 */

import type { Variants } from "framer-motion";
import { ease } from "@/hooks/useAnimations";

/**
 * One question replacing another. Direction-aware so going back reads as going
 * back — the misclick recovery #55 asks about is worth nothing if the player
 * cannot tell they moved.
 */
export const swap = {
  initial: (back: boolean) => ({ opacity: 0, x: back ? -24 : 24 }),
  animate: { opacity: 1, x: 0, transition: { duration: 0.18, ease: ease.out } },
  exit: (back: boolean) => ({
    opacity: 0,
    x: back ? 24 : -24,
    transition: { duration: 0.14, ease: ease.out },
  }),
};

/** The options inside one question, arriving after the situation. */
export const optionGroup: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035, delayChildren: 0.04 } },
};

export const option: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.16, ease: ease.out } },
};

/** A block of the result scroll arriving. Slower — nobody is tapping here. */
export const resultBlock: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: ease.out } },
};

/** A bar filling to its displayed length. */
export const barFill = (displayed: number) => ({
  initial: { width: 0 },
  whileInView: { width: `${displayed}%` },
  viewport: { once: true, amount: 0.6 },
  transition: { duration: 0.55, ease: ease.out },
});
