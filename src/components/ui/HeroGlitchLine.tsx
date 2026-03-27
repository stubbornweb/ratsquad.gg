"use client"

import { type JSX, useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

/**
 * A single hero headline line with periodic clip-path glitch effect.
 * Uses Framer Motion + inline styles — no CSS keyframes needed.
 *
 * The glitch fires a short burst every `interval` ms (default 7s),
 * async from other instances via the `delay` prop.
 */
interface HeroGlitchLineProps {
  children: string
  /** Boot entrance delay (passed to parent motion.span) */
  bootDelay: number
  /** Glitch cycle interval in ms (default 7000) */
  interval?: number
  /** Initial delay before first glitch in ms (default 2500) */
  delay?: number
}

// Glitch burst: sequence of rapid frames
const GLITCH_FRAMES = [
  { x: -3, y: 1,  shadow: "3px 0 #0057B8, -3px 0 #FFD700", topX: 5,  botX: -4, topClip: "inset(0 0 62% 0)",  botClip: "inset(58% 0 0 0)" },
  { x: 2,  y: -1, shadow: "-2px 0 #FFD700, 2px 0 #0057B8",  topX: -4, botX: 3,  topClip: "inset(5% 0 55% 0)",  botClip: "inset(52% 0 0 0)" },
  { x: -1, y: 0,  shadow: "1px 0 #0057B8, -1px 0 #FFD700",  topX: 3,  botX: -2, topClip: "inset(0 0 68% 0)",  botClip: "inset(65% 0 0 0)" },
  { x: 1,  y: 1,  shadow: "-2px 0 #FFD700, 2px 0 #0057B8",  topX: -2, botX: 4,  topClip: "inset(8% 0 60% 0)",  botClip: "inset(55% 0 0 0)" },
  { x: 0,  y: 0,  shadow: "none",                             topX: 0,  botX: 0,  topClip: "inset(0 0 65% 0)",  botClip: "inset(60% 0 0 0)" },
] as const

const FRAME_DURATION = 60 // ms per glitch frame

export function HeroGlitchLine({
  children,
  bootDelay,
  interval = 7000,
  delay = 2500,
}: HeroGlitchLineProps): JSX.Element {
  const [frameIdx, setFrameIdx] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) return

    const runBurst = () => {
      let i = 0
      const step = () => {
        if (i < GLITCH_FRAMES.length) {
          setFrameIdx(i)
          i++
          timerRef.current = setTimeout(step, FRAME_DURATION)
        } else {
          setFrameIdx(null)
        }
      }
      step()
    }

    // Initial delay, then repeat
    const initialTimer = setTimeout(() => {
      runBurst()
      const loop = setInterval(runBurst, interval)
      timerRef.current = loop as unknown as ReturnType<typeof setTimeout>
      return () => clearInterval(loop)
    }, delay)

    return () => {
      clearTimeout(initialTimer)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [delay, interval, prefersReduced])

  const frame = frameIdx !== null ? GLITCH_FRAMES[frameIdx] : null
  const isGlitching = frame !== null

  const baseStyle = frame
    ? { textShadow: frame.shadow, transform: `translate(${frame.x}px, ${frame.y}px)` }
    : {}

  return (
    <motion.span
      className="block"
      style={{ position: "relative", display: "block", ...baseStyle }}
      initial={{ opacity: 0, y: 24, clipPath: "inset(0 100% 0 0)" }}
      animate={{ opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: bootDelay }}
    >
      {children}

      {/* Upper glitch slice */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          clipPath: isGlitching ? frame.topClip : "inset(0 0 65% 0)",
          transform: isGlitching ? `translateX(${frame.topX}px)` : "none",
          textShadow: isGlitching ? `-3px 0 #0057B8` : "none",
          opacity: isGlitching ? 1 : 0,
          willChange: "transform, clip-path, opacity",
        }}
      >
        {children}
      </span>

      {/* Lower glitch slice */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          clipPath: isGlitching ? frame.botClip : "inset(60% 0 0 0)",
          transform: isGlitching ? `translateX(${frame.botX}px)` : "none",
          textShadow: isGlitching ? `3px 0 #FFD700` : "none",
          opacity: isGlitching ? 1 : 0,
          willChange: "transform, clip-path, opacity",
        }}
      >
        {children}
      </span>
    </motion.span>
  )
}
