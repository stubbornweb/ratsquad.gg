"use client"

import { type JSX } from "react"
import { motion } from "framer-motion"

const scrollFade = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
})

export default function About(): JSX.Element {
  return (
    <section className="section about" id="about">
      <div className="section-container">
        <div className="about-grid">
          <motion.div className="about-content" {...scrollFade()}>
            <div className="section-tag">
              <span className="tag-line"></span> WHO WE ARE
            </div>
            <h2 className="section-headline">TACTICS OVER EVERYTHING.</h2>
            <p>
              RATS is not your average Squad clan. We are a tight-knit EU unit
              built around one principle: coordinated, disciplined play. No
              lone wolves. No wasted shots. Every move is calculated.
            </p>
            <p>
              We recruit selectively because quality beats quantity. If you&apos;re
              serious about Squad — if you study the map, call out positions,
              and trust your squadmates — you belong here.
            </p>
          </motion.div>
          <motion.div className="about-pillars" {...scrollFade(0.2)}>
            <div className="pillar">
              <div className="ghost-number">01</div>
              <h3 className="pillar-title">DISCIPLINE</h3>
              <p className="pillar-body">
                We train, we coordinate, we execute. Every op is treated as
                the real thing.
              </p>
            </div>
            <div className="pillar">
              <div className="ghost-number">02</div>
              <h3 className="pillar-title">TEAMWORK</h3>
              <p className="pillar-body">
                Six soldiers thinking as one. Communication is not optional —
                it&apos;s the mission.
              </p>
            </div>
            <div className="pillar">
              <div className="ghost-number">03</div>
              <h3 className="pillar-title">IMPROVEMENT</h3>
              <p className="pillar-body">
                We review, we adapt, we get better. Complacency is the enemy.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
