"use client"

import { type JSX } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { DISCORD_URL } from "@/consts/router"
import { fadeUp, staggerContainer } from "@/hooks/useAnimations"
import { GlitchText } from "@/components/ui/GlitchText"

export default function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="section-border-top footer-border" />
      <div className="footer-container">
        <motion.div
          className="footer-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <motion.div className="footer-brand" variants={fadeUp}>
            <div className="footer-logo">RATS</div>
            <div className="footer-tagline">EU COMPETITIVE SQUAD CLAN</div>
            <div className="footer-copy">
              RATS &copy; {currentYear} &mdash; ALL RIGHTS RESERVED
            </div>
          </motion.div>

          <motion.div className="footer-col" variants={fadeUp}>
            <h4 className="footer-col-title">NAVIGATE</h4>
            <Link href="/#about" className="footer-link">About</Link>
            <Link href="/roster" className="footer-link">Roster</Link>
            <Link href="/#faq" className="footer-link">FAQ</Link>
            <Link href="/#join" className="footer-link">How to Join</Link>
          </motion.div>

          <motion.div className="footer-col" variants={fadeUp}>
            <h4 className="footer-col-title">COMMUNITY</h4>
            <Link href={DISCORD_URL} className="footer-link" target="_blank" rel="noopener noreferrer">
              Discord
            </Link>
          </motion.div>

          <motion.div className="footer-col" variants={fadeUp}>
            <h4 className="footer-col-title">CONTACT / INFO</h4>
            <p className="footer-text">
              For recruitment enquiries, open a ticket in Discord.
            </p>
            <p className="footer-text mt-2">Region: EU — Europe</p>
            <p className="footer-text">Game: Squad</p>
          </motion.div>
        </motion.div>

      </div>

      {/* Giant brand mark — glitch + Ukrainian flag on scroll to bottom */}
      <div className="footer-brand-mark">
        <GlitchText className="brand-mark-text" as="div">
          RATS
        </GlitchText>
      </div>
    </footer>
  )
}
