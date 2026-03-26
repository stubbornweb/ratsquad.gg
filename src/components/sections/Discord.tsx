"use client"

import { type JSX } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { DiscordIcon } from "@/components/DiscordIcon"

const scrollFade = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
})

export default function Discord(): JSX.Element {
  return (
    <section className="discord-banner" id="discord">
      <div className="noise-overlay"></div>
      <div className="section-border-top"></div>
      <div className="section-container text-center">
        <motion.div className="section-tag center-tag" {...scrollFade()}>
          <span className="tag-line"></span> COMMUNITY{" "}
          <span className="tag-line"></span>
        </motion.div>
        <motion.h2 className="section-headline" {...scrollFade(0.1)}>
          THE MISSION CONTINUES IN DISCORD.
        </motion.h2>
        <motion.p className="section-sub mx-auto" {...scrollFade(0.2)}>
          Ops planning, scrims, clan news, and the RATS community — all in
          one place.
        </motion.p>

        <motion.div className="social-links" {...scrollFade(0.3)}>
          <a
            href="https://discord.gg/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
            className="social-icon"
          >
            <DiscordIcon size={24} strokeWidth={2} />
          </a>
        </motion.div>

        <motion.div {...scrollFade(0.4)}>
          <Link
            href="https://discord.gg/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-large discord-btn"
          >
            JOIN DISCORD
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
