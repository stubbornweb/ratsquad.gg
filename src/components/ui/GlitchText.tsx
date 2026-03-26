"use client"

import { type JSX } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

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
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <motion.div
      ref={ref}
      className={`glitch-text-wrapper ${className ?? ""}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.1 }}
    >
      <Tag className="glitch-text" data-text={children}>
        {children}
      </Tag>
      {isInView && (
        <motion.div
          className="glitch-flash"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}
    </motion.div>
  )
}
