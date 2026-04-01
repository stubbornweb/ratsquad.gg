"use client"

import { type JSX } from "react"
import { motion } from "framer-motion"
import { clipReveal, fadeUp } from "@/hooks/useAnimations"

export default function RosterHeader(): JSX.Element {
  return (
    <header className="roster-page-header">
      <div className="section-container">
        <motion.div
          className="section-tag"
          variants={clipReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <span className="tag-line" /> КОМАНДА
        </motion.div>
        <motion.h1
          className="section-headline"
          variants={clipReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          АКТИВНИЙ СКЛАД
        </motion.h1>
        <motion.p
          className="section-sub"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          Готові до викликів.
        </motion.p>
      </div>
    </header>
  )
}
