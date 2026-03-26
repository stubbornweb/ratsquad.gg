"use client"

import { type JSX } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

const scrollFade = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
})

export default function Join(): JSX.Element {
  return (
    <section className="section join" id="join">
      <div className="section-border-top"></div>
      <div className="section-container">
        <motion.div className="section-tag" {...scrollFade()}>
          <span className="tag-line"></span> RECRUITMENT
        </motion.div>
        <motion.h2 className="section-headline" {...scrollFade(0.1)}>
          THINK YOU HAVE WHAT IT TAKES?
        </motion.h2>
        <motion.p className="section-sub" {...scrollFade(0.2)}>
          We recruit selectively. We don&apos;t fill seats — we build a unit.
        </motion.p>

        <motion.div className="join-grid" {...scrollFade(0.3)}>
          <div className="join-requirements">
            <ul className="requirements-list">
              <li>
                <span className="check">&check;</span> 100+ hours in Squad
              </li>
              <li>
                <span className="check">&check;</span> Working microphone —
                communication is mandatory
              </li>
              <li>
                <span className="check">&check;</span> Age 18 or older
              </li>
              <li>
                <span className="check">&check;</span> EU based (or able to
                play EU servers with low ping)
              </li>
              <li>
                <span className="check">&check;</span> Willingness to learn,
                adapt, and put the team first
              </li>
            </ul>
          </div>
          <div className="join-steps">
            <div className="step">
              <div className="step-ghost-number">01</div>
              <h3 className="step-title">APPLY ON DISCORD</h3>
              <p className="step-body">
                Join our Discord server and open a recruitment ticket to start
                your application.
              </p>
            </div>
            <div className="step">
              <div className="step-ghost-number">02</div>
              <h3 className="step-title">INTERVIEW</h3>
              <p className="step-body">
                A brief voice interview with clan leadership. We want to know
                how you think and play — not your stats.
              </p>
            </div>
            <div className="step">
              <div className="step-ghost-number">03</div>
              <h3 className="step-title">TRIAL PERIOD</h3>
              <p className="step-body">
                Approved applicants join as Recruit for a trial period playing
                alongside the unit.
              </p>
            </div>
            <div className="step">
              <div className="step-ghost-number">04</div>
              <h3 className="step-title">FULL MEMBER</h3>
              <p className="step-body">
                Pass the trial and you&apos;re in. Welcome to RATS.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div className="join-cta" {...scrollFade(0.4)}>
          <Link
            href="https://discord.gg/"
            target="_blank"
            className="btn btn-primary btn-massive"
          >
            JOIN OUR DISCORD
          </Link>
          <p className="join-cta-sub">
            Already a member? Find us in Discord &rarr; #recruitment
          </p>
        </motion.div>
      </div>
    </section>
  )
}
