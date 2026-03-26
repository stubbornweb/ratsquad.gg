"use client"

import { type JSX } from "react"
import { motion } from "framer-motion"
import { clipReveal } from "@/hooks/useAnimations"

interface SectionDividerProps {
  label?: string
}

export function SectionDivider({ label }: SectionDividerProps): JSX.Element {
  return (
    <motion.div
      className="section-divider"
      variants={clipReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      <span className="section-divider-line" />
      {label && <span className="section-divider-label">{label}</span>}
      <span className="section-divider-line" />
    </motion.div>
  )
}
