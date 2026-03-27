"use client"

import { type JSX } from "react"
import { motion } from "framer-motion"
import { FaqAccordion } from "@/components/FaqAccordion"
import { clipReveal, fadeUp } from "@/hooks/useAnimations"
import { faqs } from "@/data/faq"

export default function FAQ(): JSX.Element {
  return (
    <section className="section faq" id="faq">
      <div className="section-border-top" />
        <div className="section-container">
          <motion.div
            className="section-tag"
            variants={clipReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <span className="tag-line" /> INTELLIGENCE
          </motion.div>
          <motion.h2
            className="section-headline"
            variants={clipReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            FREQUENTLY ASKED QUESTIONS
          </motion.h2>
          <motion.p
            className="section-sub"
            style={{ marginTop: "-24px", marginBottom: "40px" }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            Need intel before committing? Read our standard operating procedures.
          </motion.p>

          <FaqAccordion faqs={faqs} />
        </div>
      </section>
  )
}
