"use client"

import { type JSX, useEffect, useRef, useState } from "react"
import { useInView, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlitchTextProps {
  children: string
  className?: string
  as?: "span" | "div" | "h1" | "h2" | "h3"
}

const GLITCH_FRAMES = [
  { x: -4, shadow: "4px 0 #0057B8, -4px 0 #FFD700" },
  { x: 3,  shadow: "-3px 0 #FFD700, 3px 0 #0057B8" },
  { x: -2, shadow: "2px 0 #0057B8, -2px 0 #FFD700" },
  { x: 1,  shadow: "-1px 0 #FFD700, 1px 0 #0057B8" },
  { x: 0,  shadow: "none" },
] as const

const FRAME_MS = 55

export function GlitchText({
  children,
  className,
  as: Tag = "div",
}: GlitchTextProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })
  const prefersReduced = useReducedMotion()
  const [frameIdx, setFrameIdx] = useState<number | null>(null)

  // Periodic glitch burst while in view
  useEffect(() => {
    if (!isInView || prefersReduced) return

    // Fire one burst immediately on entering view
    let burstTimer: ReturnType<typeof setTimeout>

    const runBurst = () => {
      let i = 0
      const step = () => {
        if (i < GLITCH_FRAMES.length) {
          setFrameIdx(i)
          i++
          burstTimer = setTimeout(step, FRAME_MS)
        } else {
          setFrameIdx(null)
        }
      }
      step()
    }

    // Immediate burst on scroll-in, then repeat every 5s
    runBurst()
    const loopTimer = setInterval(runBurst, 5000)

    return () => {
      clearTimeout(burstTimer)
      clearInterval(loopTimer)
      setFrameIdx(null)
    }
  }, [isInView, prefersReduced])

  const frame = frameIdx !== null ? GLITCH_FRAMES[frameIdx] : null

  return (
    <div
      ref={ref}
      className={cn("glitch-text-wrapper", isInView && "glitch-active", className)}
    >
      <Tag
        className="glitch-text"
        data-text={children}
        style={frame ? {
          transform: `translateX(${frame.x}px)`,
          textShadow: frame.shadow,
        } : undefined}
      >
        {children}
      </Tag>
    </div>
  )
}
