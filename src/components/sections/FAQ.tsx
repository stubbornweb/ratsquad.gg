"use client"

import { type JSX } from "react"
import { motion } from "framer-motion"
import { FaqAccordion } from "@/components/FaqAccordion"
import { type FaqItem } from "@/types"

const scrollFade = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
})

const faqs: FaqItem[] = [
  {
    question: "What timezones do you operate in?",
    answer: "We primarily operate in EU timezones (CET/CEST), with dedicated operations running during EU evening hours.",
  },
  {
    question: "Do I need DLC or specific mods?",
    answer: "We play vanilla Squad for most of our competitive matches, but occasionally participate in modded events. We will announce any required mods well in advance.",
  },
  {
    question: "How does the recruitment process work?",
    answer: "Join our Discord, submit an application ticket, and you will be invited to a voice interview. If approved, you enter a trial phase where we assess your communication and teamwork in-game.",
  },
  {
    question: "Are you a competitive/esports clan?",
    answer: "Yes. While we enjoy standard matches, our primary focus is structured, competitive 50v50 scrims and tournaments.",
  },
]

export default function FAQ(): JSX.Element {
  return (
    <section className="section faq" id="faq">
      <div className="section-container">
        <motion.div className="section-tag" {...scrollFade()}>
          <span className="tag-line"></span> INTELLIGENCE
        </motion.div>
        <motion.h2 className="section-headline" {...scrollFade(0.1)}>
          FREQUENTLY ASKED QUESTIONS
        </motion.h2>
        <motion.p
          className="section-sub"
          style={{ marginTop: "-24px", marginBottom: "40px" }}
          {...scrollFade(0.2)}
        >
          Need intel before committing? Read our standard operating procedures.
        </motion.p>

        <motion.div {...scrollFade(0.3)}>
          <FaqAccordion faqs={faqs} />
        </motion.div>
      </div>
    </section>
  )
}
