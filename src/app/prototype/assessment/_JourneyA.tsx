"use client";

/**
 * PROTOTYPE — THROWAWAY. Variant A — ЧЕРГА.
 *
 * The shape #17 settled and the source spec describes: one question per screen,
 * auto-advance on tap, a segmented rail across the top showing all eighteen.
 *
 * This is the variant that tests #55's first two questions most directly. The
 * rail is honest — eighteen segments, and the player can count how many are
 * dark. Whether that reads as «earned» or as a sentence is the finding.
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { QUESTIONS } from "./_data";
import { option, optionGroup, swap } from "./_motion";
import type { Answers } from "./_scoring";

type Props = {
  answers: Answers;
  onAnswer: (n: number, value: number) => void;
  autoAdvance: boolean;
  onDone: () => void;
};

export function JourneyA({ answers, onAnswer, autoAdvance, onDone }: Props) {
  const [index, setIndex] = useState(0);
  const [back, setBack] = useState(false);
  // Held for the 180ms between the tap and the swap, so the tap is acknowledged.
  const [confirming, setConfirming] = useState<number | null>(null);

  const question = QUESTIONS[index];
  const answered = answers[question.n];

  const advance = () => {
    setBack(false);
    if (index === QUESTIONS.length - 1) onDone();
    else setIndex(index + 1);
  };

  const choose = (value: number) => {
    onAnswer(question.n, value);
    if (!autoAdvance) return;
    setConfirming(value);
    window.setTimeout(() => {
      setConfirming(null);
      advance();
    }, 180);
  };

  const goBack = () => {
    if (index === 0) return;
    setBack(true);
    setIndex(index - 1);
  };

  return (
    <div className="pa-stage">
      <div className="pa-rail">
        {QUESTIONS.map((q, i) => (
          <div
            key={q.n}
            className="pa-rail-seg"
            data-state={i === index ? "current" : i < index ? "done" : "todo"}
          />
        ))}
      </div>

      <button
        type="button"
        className="pa-back"
        onClick={goBack}
        disabled={index === 0}
        aria-label="Попереднє питання"
      >
        <ChevronLeft size={14} />
        назад
      </button>

      <div className="pa-stage-body">
        <AnimatePresence mode="wait" custom={back}>
          <motion.div
            key={question.n}
            custom={back}
            variants={swap}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="pa-qnum">
              {String(question.n).padStart(2, "0")}
              <span> / {QUESTIONS.length}</span>
            </div>
            <h2 className="pa-situation">{question.situation}</h2>

            <motion.div variants={optionGroup} initial="hidden" animate="visible">
              {question.options.map((o) => (
                <motion.button
                  key={o.label}
                  type="button"
                  variants={option}
                  className="pa-option"
                  data-selected={answered === o.value}
                  data-confirmed={confirming === o.value}
                  onClick={() => choose(o.value)}
                >
                  {o.label}
                </motion.button>
              ))}
            </motion.div>

            {/* Without auto-advance the player needs a way forward of their own. */}
            {!autoAdvance ? (
              <button
                type="button"
                className="pa-btn pa-btn--primary"
                style={{ marginTop: 16, width: "100%" }}
                disabled={answered === undefined}
                onClick={advance}
              >
                {index === QUESTIONS.length - 1 ? "результат" : "далі"}
              </button>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
