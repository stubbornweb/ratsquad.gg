"use client"

import { type JSX } from "react"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface GlitchTextProps {
  children: string
  className?: string
  as?: "span" | "div" | "h1" | "h2" | "h3"
}

export function GlitchText({
  children,
  className,
  as: Tag = "div",
}: GlitchTextProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  return (
    <div
      ref={ref}
      className={cn("glitch-text-wrapper", isInView && "glitch-active", className)}
    >
      <Tag className="glitch-text" data-text={children}>
        {children}
      </Tag>
    </div>
  )
}
