"use client";

/**
 * PROTOTYPE — THROWAWAY. Variant B — СТРІЧКА.
 *
 * One scroll, all eighteen. Answering scrolls the next question to the top;
 * answered questions collapse to the option the player chose, so the column
 * behind them reads as a transcript of what they said rather than a filled form.
 *
 * The point of this variant is that it never shows a total. There is no «6 / 18»
 * on the screen the player is reading — only a thin bar and a counter chip they
 * have to look for. #55 asks whether the progress indicator makes the length
 * bearable or just shows how far is left; this is the version that mostly hides
 * it, and it is the direct counter-test to A's eighteen honest segments.
 *
 * Changing an answer is free here — everything stays on the page. That makes it
 * the misclick control against A's auto-advance.
 */

import { useEffect, useRef } from "react";
import { QUESTIONS } from "./_data";
import type { Answers } from "./_scoring";

type Props = {
  answers: Answers;
  onAnswer: (n: number, value: number) => void;
  autoAdvance: boolean;
  onDone: () => void;
};

export function JourneyB({ answers, onAnswer, autoAdvance, onDone }: Props) {
  const refs = useRef<Record<number, HTMLDivElement | null>>({});
  const count = Object.keys(answers).length;
  const complete = count === QUESTIONS.length;

  // The feed's own progress: scroll depth, not a countdown.
  useEffect(() => {
    if (!complete) return;
    const t = window.setTimeout(onDone, 400);
    return () => window.clearTimeout(t);
  }, [complete, onDone]);

  const choose = (n: number, value: number) => {
    onAnswer(n, value);
    if (!autoAdvance) return;
    const next = QUESTIONS.find((q) => q.n > n && answers[q.n] === undefined);
    if (!next) return;
    window.setTimeout(() => {
      const el = refs.current[next.n];
      if (!el) return;
      // Lenis owns the scroll on this route; `scrollIntoView` fights it and the
      // page ends up drifting past the target.
      const lenis = (
        window as unknown as {
          __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void };
        }
      ).__lenis;
      if (lenis) lenis.scrollTo(el, { offset: -24, duration: 0.5 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 160);
  };

  return (
    <div style={{ backgroundColor: "var(--bg-main)", minHeight: "100svh" }}>
      <div
        className="pa-thinbar"
        style={{ width: `${(count / QUESTIONS.length) * 100}%` }}
      />

      <div className="pa-feed">
        {QUESTIONS.map((q) => {
          const answered = answers[q.n];
          return (
            <div
              key={q.n}
              ref={(el) => {
                refs.current[q.n] = el;
              }}
              className="pa-feed-item"
              data-answered={answered !== undefined}
              style={{ scrollMarginTop: 24 }}
            >
              <div className="pa-qnum">{String(q.n).padStart(2, "0")}</div>
              <h2 className="pa-situation">{q.situation}</h2>
              {q.options.map((o) => (
                <button
                  key={o.label}
                  type="button"
                  className="pa-option"
                  data-selected={answered === o.value}
                  onClick={() => choose(q.n, o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          );
        })}
      </div>

      <div className="pa-feed-counter">
        {count} / {QUESTIONS.length}
      </div>
    </div>
  );
}
