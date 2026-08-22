"use client";

/**
 * PROTOTYPE — THROWAWAY. Wayfinder ticket #55.
 *
 * The assessment journey end to end, switchable via `?variant=` on
 * `/prototype/assessment`. Not production code: no tests, no persistence, no
 * real auth, no server. Delete this whole directory once the journey is settled.
 *
 *   A — ЧЕРГА     one question per screen, auto-advance, eighteen-segment rail
 *   B — СТРІЧКА   one scroll, all eighteen, no countdown on screen
 *   C — СЕКТОРИ   five screens of three-to-four, confirm each, no auto-advance
 *
 * All three land on the SAME result screen — #52 fixed that design and three
 * takes on it would re-open a closed decision instead of answering #55's
 * question, which is whether it lands.
 *
 * The bar at the bottom also drives the cross-variant states the ticket and its
 * inherited constraints ask about:
 *
 *   автоперехід   auto-advance on/off — «fast, or a machine gun?»
 *   анонім/учасник  #54's two audiences: ФЛЕКС suppressed vs not, empty grid vs
 *                   seeded-and-marked, no Напрямок on file vs one with no default
 *   заповнити     jump to a realistic result without eighteen taps
 *   шруг          every middle option — #49's forced рівний результат
 */

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  PrototypeSwitcher,
  PrototypeToggle,
} from "@/components/PrototypeSwitcher";
import { MAX_MAIN_KITS, MEMBER_ON_FILE, QUESTIONS, type Kit } from "./_data";
import { Kits } from "./_Kits";
import { JourneyA } from "./_JourneyA";
import { JourneyB } from "./_JourneyB";
import { JourneyC } from "./_JourneyC";
import { Result } from "./_Result";
import { computeResult, type Answers } from "./_scoring";
import "./prototype.css";

const VARIANTS = [
  { key: "A", name: "Черга" },
  { key: "B", name: "Стрічка" },
  { key: "C", name: "Сектори" },
];

/**
 * A runs two rounds — the eighteen, then the kits. B and C are frozen at the
 * one-round shape they were judged in; they are the record of why A won, not
 * live designs, so they skip `kits` and keep the grid on the result screen.
 */
type Stage = "intro" | "questions" | "kits" | "result";

/**
 * A realistic run, for reaching the result screen without eighteen taps.
 * High САМОСТІЙНІСТЬ and ЧИТАННЯ КАРТИ, both Схильності low — the shape of
 * #49's worked example, snapped onto #50's lattice.
 */
const FILLED: Answers = {
  1: 100, 2: 100, 3: 100, 4: 100, 5: 100,
  6: 55, 7: 55, 8: 55, 9: 100, 10: 55,
  11: 55, 12: 100, 13: 55, 14: 55, 15: 100,
  16: 100, 17: 0, 18: 0,
};

/** Every middle option. #50 designed this to land on exactly 55 everywhere. */
const SHRUG: Answers = Object.fromEntries(
  QUESTIONS.map((q) => [q.n, q.kind === "trait" ? 55 : 0]),
);

function Prototype() {
  const searchParams = useSearchParams();
  const raw = (searchParams.get("variant") ?? "A").toUpperCase();
  const variant = (VARIANTS.some((v) => v.key === raw) ? raw : "A") as
    | "A"
    | "B"
    | "C";

  const [answers, setAnswers] = useState<Answers>({});
  const [stage, setStage] = useState<Stage>("intro");
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [member, setMember] = useState(false);
  // Round two: three ordered slots — the top-3 preference, not the capability
  // set. Seeded for a returning member, per #54.
  const [roles, setRoles] = useState<(Kit | null)[]>([null, null, null]);
  const [slot, setSlot] = useState(0);

  // The site's global Lenis smoothing is tuned for the homepage's long reveals.
  // A and C are fixed full-screen stages that never scroll, and leaving Lenis
  // running there means every programmatic jump drifts for a second — which
  // would read as a finding about the design rather than about the library.
  // B and the result screen ARE scrolls, so they keep it.
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } })
      .__lenis;
    if (!lenis) return;
    if (stage === "questions" && variant !== "B") lenis.stop();
    else lenis.start();
    return () => lenis.start();
  }, [stage, variant]);

  const onAnswer = useCallback((n: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [n]: value }));
  }, []);

  // A goes to round two; B and C go straight to the result they were judged on.
  const onDone = useCallback(() => {
    setStage(variant === "A" ? "kits" : "result");
    window.scrollTo({ top: 0 });
  }, [variant]);

  const pickRole = useCallback((at: number, kit: Kit) => {
    setRoles((prev) => prev.map((r, i) => (i === at ? kit : r)));
  }, []);

  const restart = () => {
    setAnswers({});
    setRoles([null, null, null]);
    setSlot(0);
    setStage("intro");
    window.scrollTo({ top: 0 });
  };

  // Lands on round two for A, so the whole A path stays reachable in one tap.
  const jump = (preset: Answers) => {
    setAnswers(preset);
    setStage(variant === "A" ? "kits" : "result");
    window.scrollTo({ top: 0 });
  };

  // #49: ФЛЕКС is computed then suppressed for anonymous and below-rank runs.
  const result =
    stage === "result"
      ? computeResult(answers, { flexEligible: member })
      : null;

  return (
    <main style={{ minHeight: "100svh", backgroundColor: "var(--bg-main)" }}>
      {stage === "intro" ? (
        <div className="pa-intro">
          {/* UNSIGNED — placeholder chrome. The tool's name is still fog on the
              map, and #50's rule bites on situations, not on a title. */}
          <div className="pa-label">RATS</div>
          <h1 className="pa-display pa-intro-title">ЯК ТИ ХОЧЕШ ГРАТИ</h1>
          <p className="pa-intro-lede">
            18 питань. Правильних відповідей немає — є тільки те, що тобі
            подобається. У кінці отримаєш напрямок і кіти, які відзначиш сам.
          </p>
          <button
            type="button"
            className="pa-btn pa-btn--primary"
            onClick={() => setStage("questions")}
          >
            почати
          </button>
        </div>
      ) : null}

      {stage === "questions" && variant === "A" ? (
        <JourneyA
          answers={answers}
          onAnswer={onAnswer}
          autoAdvance={autoAdvance}
          onDone={onDone}
        />
      ) : null}

      {stage === "questions" && variant === "B" ? (
        <JourneyB
          answers={answers}
          onAnswer={onAnswer}
          autoAdvance={autoAdvance}
          onDone={onDone}
        />
      ) : null}

      {/* C has no auto-advance by design — the toggle does not reach it. */}
      {stage === "questions" && variant === "C" ? (
        <JourneyC answers={answers} onAnswer={onAnswer} onDone={onDone} />
      ) : null}

      {stage === "kits" ? (
        <Kits
          roles={roles}
          slot={slot}
          onPick={pickRole}
          onSlotChange={setSlot}
          autoAdvance={autoAdvance}
          member={member}
          onBack={() => setStage("questions")}
          onDone={() => {
            setStage("result");
            window.scrollTo({ top: 0 });
          }}
        />
      ) : null}

      {result ? (
        <Result
          result={result}
          member={member}
          // A collects the three roles in round two, so the result screen shows
          // them read-only. B and C keep the grid they were judged with.
          roles={variant === "A" ? roles : null}
          onRestart={restart}
        />
      ) : null}

      <PrototypeSwitcher variants={VARIANTS} current={variant}>
        <PrototypeToggle
          label="автоперехід"
          active={autoAdvance}
          onClick={() => setAutoAdvance(!autoAdvance)}
        />
        <PrototypeToggle
          label={member ? "учасник" : "анонім"}
          active={member}
          onClick={() => {
            const next = !member;
            setMember(next);
            // #54: a returning member's slots are seeded from what is on file.
            setRoles(
              next
                ? Array.from(
                    { length: MAX_MAIN_KITS },
                    (_, i) => MEMBER_ON_FILE.kits[i] ?? null,
                  )
                : [null, null, null],
            );
          }}
        />
        <PrototypeToggle
          label="заповнити"
          active={false}
          onClick={() => jump(FILLED)}
        />
        <PrototypeToggle label="шруг" active={false} onClick={() => jump(SHRUG)} />
        <PrototypeToggle label="спочатку" active={false} onClick={restart} />
      </PrototypeSwitcher>
    </main>
  );
}

export default function PrototypeAssessmentPage() {
  return (
    <Suspense>
      <Prototype />
    </Suspense>
  );
}
