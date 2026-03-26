"use client"

import { type JSX, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { type FaqItem } from "@/types"
import { cn } from "@/lib/utils"

interface FaqAccordionProps {
  faqs: FaqItem[]
}

export function FaqAccordion({ faqs }: FaqAccordionProps): JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number): void => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="faq-list">
      {faqs.map((faq, index) => (
        <motion.div
          className="faq-item"
          key={index}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            className={cn("faq-question", openIndex === index && "active")}
            onClick={() => toggleFaq(index)}
            aria-expanded={openIndex === index}
            aria-controls={`faq-answer-${index}`}
            id={`faq-question-${index}`}
          >
            <span>{faq.question}</span>
            <motion.span
              className="faq-icon"
              aria-hidden="true"
              animate={{ rotate: openIndex === index ? 45 : 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              +
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                className="faq-answer-motion"
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="faq-answer-inner">
                  <p>{faq.answer}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
