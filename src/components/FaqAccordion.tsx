"use client"

import { type JSX, useState } from "react";
import { motion } from "framer-motion";
import { type FaqItem } from "@/types";
import { cn } from "@/lib/utils";

interface FaqAccordionProps {
  faqs: FaqItem[];
}

export function FaqAccordion({ faqs }: FaqAccordionProps): JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number): void => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.div className="faq-list">
      {faqs.map((faq, index) => (
        <div className="faq-item" key={index}>
          <button
            className={cn("faq-question", openIndex === index && "active")}
            onClick={() => toggleFaq(index)}
            aria-expanded={openIndex === index}
            aria-controls={`faq-answer-${index}`}
            id={`faq-question-${index}`}
          >
            {faq.question}
            <span className="faq-icon" aria-hidden="true">
              {openIndex === index ? "−" : "+"}
            </span>
          </button>
          <motion.div
            className={cn("faq-answer", openIndex === index && "active")}
            id={`faq-answer-${index}`}
            role="region"
            aria-labelledby={`faq-question-${index}`}
            initial={false}
            animate={openIndex === index ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <p>{faq.answer}</p>
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
}
