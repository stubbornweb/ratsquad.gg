"use client";

/**
 * PROTOTYPE — THROWAWAY. Variant C — СЕКТОРИ.
 *
 * Eighteen questions chunked into five screens of three to four, in #50's fixed
 * order — no reordering, no grouping by Риса, just contiguous slices. No
 * auto-advance: the player answers everything on the screen and taps ДАЛІ.
 *
 * This is the answer to «does the length feel earned» from the other end: the
 * progress indicator counts to five instead of to eighteen, and the player can
 * see and change every answer on the current screen before committing to it.
 * The cost, which the prototype should expose, is that a screen of four
 * questions looks like a form — the thing the source spec is emphatic about not
 * being.
 *
 * The act labels are the question numbers, deliberately: any name for a group
 * of questions is a hint about what they measure, and #50 spent a session
 * proving that leaks the result.
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { QUESTIONS } from "./_data";
import { option, optionGroup, swap } from "./_motion";
import type { Answers } from "./_scoring";

/** Contiguous slices of #50's order. Never reordered, never regrouped. */
const ACTS = [
  QUESTIONS.slice(0, 4),
  QUESTIONS.slice(4, 8),
  QUESTIONS.slice(8, 12),
  QUESTIONS.slice(12, 16),
  QUESTIONS.slice(16, 18),
];

type Props = {
  answers: Answers;
  onAnswer: (n: number, value: number) => void;
  onDone: () => void;
};

export function JourneyC({ answers, onAnswer, onDone }: Props) {
  const [act, setAct] = useState(0);
  const [back, setBack] = useState(false);

  const questions = ACTS[act];
  const actComplete = questions.every((q) => answers[q.n] !== undefined);
  const last = act === ACTS.length - 1;

  const next = () => {
    setBack(false);
    if (last) onDone();
    else {
      setAct(act + 1);
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <div className="pa-stage">
      <div className="pa-stage-body">
        <div className="pa-act-head">
          <div className="pa-act-steps">
            {ACTS.map((slice, i) => (
              <div
                key={i}
                className="pa-act-step"
                data-state={i === act ? "current" : i < act ? "done" : "todo"}
              >
                <div className="pa-act-step-bar" />
                <div className="pa-act-step-name">
                  {slice[0].n}–{slice[slice.length - 1].n}
                </div>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait" custom={back}>
          <motion.div
            key={act}
            custom={back}
            variants={swap}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div variants={optionGroup} initial="hidden" animate="visible">
              {questions.map((q) => (
                <motion.div key={q.n} variants={option} className="pa-act-q">
                  <h2 className="pa-situation">{q.situation}</h2>
                  {q.options.map((o) => (
                    <button
                      key={o.label}
                      type="button"
                      className="pa-option"
                      data-selected={answers[q.n] === o.value}
                      onClick={() => onAnswer(q.n, o.value)}
                    >
                      {o.label}
                    </button>
                  ))}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pa-act-nav">
        <button
          type="button"
          className="pa-btn"
          disabled={act === 0}
          onClick={() => {
            setBack(true);
            setAct(act - 1);
            window.scrollTo({ top: 0 });
          }}
        >
          <ChevronLeft size={14} style={{ display: "inline", verticalAlign: "-2px" }} />{" "}
          назад
        </button>
        <button
          type="button"
          className="pa-btn pa-btn--primary"
          disabled={!actComplete}
          onClick={next}
        >
          {last ? "результат" : "далі"}
        </button>
      </div>
    </div>
  );
}
