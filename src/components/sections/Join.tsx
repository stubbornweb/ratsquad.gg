"use client"

import { type JSX } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { fadeUp, clipReveal, staggerSlow, spring } from "@/hooks/useAnimations"
import { SectionDivider } from "@/components/ui/SectionDivider"

const requirements = [
  "100+ hours in Squad",
  "Working microphone \u2014 communication is mandatory",
  "Age 18 or older",
  "EU based (or able to play EU servers with low ping)",
  "Willingness to learn, adapt, and put the team first",
]

const steps = [
  {
    num: "01",
    title: "APPLY ON DISCORD",
    body: "Join our Discord server and open a recruitment ticket to start your application.",
  },
  {
    num: "02",
    title: "INTERVIEW",
    body: "A brief voice interview with clan leadership. We want to know how you think and play \u2014 not your stats.",
  },
  {
    num: "03",
    title: "TRIAL PERIOD",
    body: "Approved applicants join as Recruit for a trial period playing alongside the unit.",
  },
  {
    num: "04",
    title: "FULL MEMBER",
    body: "Pass the trial and you\u2019re in. Welcome to RATS.",
  },
]

export default function Join(): JSX.Element {
  return (
    <>
      <SectionDivider label="RECRUITMENT" />
      <section className="section join" id="join">
        <div className="section-border-top" />
        <div className="section-container">
          <motion.div
            className="section-tag"
            variants={clipReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <span className="tag-line" /> RECRUITMENT
          </motion.div>
          <motion.h2
            className="section-headline"
            variants={clipReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            THINK YOU HAVE WHAT IT TAKES?
          </motion.h2>
          <motion.p
            className="section-sub"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            We recruit selectively. We don&apos;t fill seats — we build a unit.
          </motion.p>

          <div className="join-grid">
            {/* Left — requirements */}
            <motion.div
              className="join-requirements"
              variants={staggerSlow}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <ul className="requirements-list">
                {requirements.map((req, i) => (
                  <motion.li key={i} variants={fadeUp}>
                    <span className="check">&check;</span> {req}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Right — steps */}
            <motion.div
              className="join-steps"
              variants={staggerSlow}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {steps.map((s) => (
                <motion.div className="step" key={s.num} variants={fadeUp}>
                  <div className="step-ghost-number">{s.num}</div>
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-body">{s.body}</p>
                  <div className="step-connector" />
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="join-cta"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={spring.snappy}
            >
              <Link
                href="https://discord.gg/"
                target="_blank"
                className="btn btn-primary btn-massive"
              >
                JOIN OUR DISCORD
              </Link>
            </motion.div>
            <p className="join-cta-sub">
              Already a member? Find us in Discord &rarr; #recruitment
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
