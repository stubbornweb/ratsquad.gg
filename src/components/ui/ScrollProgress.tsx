"use client"

import { type JSX } from "react"
import { motion, useScroll, useSpring } from "framer-motion"

export function ScrollProgress(): JSX.Element {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="scroll-progress-bar"
      style={{ scaleX }}
    />
  )
}
