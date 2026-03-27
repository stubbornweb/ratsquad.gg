"use client"

import { type JSX } from "react"
import { motion } from "framer-motion"
import { fadeUp, clipReveal, staggerSlow, slideInLeft } from "@/hooks/useAnimations"

const pillars = [
  {
    num: "01",
    title: "DISCIPLINE",
    body: "We train, we coordinate, we execute. Every op is treated as the real thing.",
  },
  {
    num: "02",
    title: "TEAMWORK",
    body: "Six soldiers thinking as one. Communication is not optional \u2014 it\u2019s the mission.",
  },
  {
    num: "03",
    title: "IMPROVEMENT",
    body: "We review, we adapt, we get better. Complacency is the enemy.",
  },
]

export default function About(): JSX.Element {
  return (
    <section className="section about" id="about">
      <div className="section-border-top" />
        <div className="section-container">
          <div className="about-grid">
            {/* Left — copy */}
            <motion.div
              className="about-content"
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div className="section-tag" variants={clipReveal}>
                <span className="tag-line" /> WHO WE ARE
              </motion.div>
              <motion.h2 className="section-headline" variants={clipReveal}>
                TACTICS OVER EVERYTHING.
              </motion.h2>
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

            {/* Right — pillars */}
            <motion.div
              className="about-pillars"
              variants={staggerSlow}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {pillars.map((p) => (
                <motion.div className="pillar" key={p.num} variants={fadeUp}>
                  <div className="ghost-number">{p.num}</div>
                  <h3 className="pillar-title">{p.title}</h3>
                  <p className="pillar-body">{p.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
  )
}
