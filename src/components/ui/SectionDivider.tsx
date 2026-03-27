"use client"

import { type JSX } from "react"
import { motion } from "framer-motion"

interface SectionDividerProps {
  label?: string
}

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: easeOut, staggerChildren: 0.1 },
  },
}

const lineExpand = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.9, ease: easeOut },
  },
}

const labelReveal = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
}

export function SectionDivider({ label }: SectionDividerProps): JSX.Element {
  return (
    <motion.div
      className="section-divider"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
    >
      <motion.span
        className="section-divider-line"
        variants={lineExpand}
        style={{ transformOrigin: "right center" }}
      />
      {label && (
        <motion.span className="section-divider-label" variants={labelReveal}>
          {label}
        </motion.span>
      )}
      <motion.span
        className="section-divider-line"
        variants={lineExpand}
        style={{ transformOrigin: "left center" }}
      />
    </motion.div>
  )
}
