"use client"

import { type JSX } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { clipReveal, fadeUp, spring, staggerContainer } from "@/hooks/useAnimations"
export default function Discord(): JSX.Element {
  return (
    <section className="discord-banner" id="discord">
      <div className="noise-overlay" />
      <div className="section-border-top" />

      {/* Ambient glow */}
      <div className="discord-glow" />

      <motion.div
        className="section-container text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div className="section-tag center-tag" variants={clipReveal}>
          <span className="tag-line" /> COMMUNITY <span className="tag-line" />
        </motion.div>
        <motion.h2 className="section-headline" variants={clipReveal}>
          THE MISSION CONTINUES IN DISCORD.
        </motion.h2>
        <motion.p className="section-sub mx-auto" variants={fadeUp}>
          Ops planning, scrims, clan news, and the RATS community — all in one
          place.
        </motion.p>

        <motion.div variants={fadeUp}>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.snappy}
            style={{ display: "inline-block" }}
          >
            <Link
              href="https://discord.gg/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-large discord-btn"
            >
              JOIN DISCORD
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
