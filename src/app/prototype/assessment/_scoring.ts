/**
 * PROTOTYPE — THROWAWAY. Wayfinder ticket #55.
 *
 * #49's model, transcribed. Nothing here is invented: target profile +
 * importance, mean absolute deviation, the one-directional Схильність floor,
 * the fixed-reference display scale, чіткий vs рівний. #52's reason rule and
 * #51's four nameable kits sit on top.
 *
 * No tests — this is a prototype. It is written to be checkable by hand
 * instead, because #69 requires exactly that of the real thing.
 */

import {
  COPY,
  DIRECTION_GATE,
  DIRECTION_LABELS,
  DIRECTION_PROFILES,
  DIRECTIONS,
  QUESTIONS,
  REASON_FRAGMENTS,
  SCORING_TRAITS,
  type Direction,
  type Inclination,
  type Kit,
  type Trait,
} from "./_data";

/** One answer per question, keyed by question number. */
export type Answers = Record<number, number>;

export type Profile = {
  traits: Record<Trait, number>;
  inclinations: Record<Inclination, boolean>;
};

export type Bar = {
  direction: Direction;
  raw: number;
  displayed: number;
  floored: boolean;
  /** #52: floored bars carry the Схильність line, unfloored ones a computed reason. */
  note?: string;
};

export type Result = {
  profile: Profile;
  bars: Bar[];
  tier1: Bar[];
  tier2: Bar[];
  tier3: Bar[];
  even: boolean;
  /** Set when рівний was forced by a flat profile rather than by a narrow gap. */
  forcedEven: boolean;
  headline: string;
  /** One reason per tier-1 напрямок — with two winners the reason is all that separates them. */
  reasons: string[];
  flexSuppressed: boolean;
  evidencedKits: { kit: Kit; reason: string }[];
};

/* ── Атрибути out of eighteen answers ── */

export function scoreProfile(answers: Answers): Profile {
  const traits = {} as Record<Trait, number>;
  const inclinations = {} as Record<Inclination, boolean>;

  for (const trait of ["AGGRESSION", "PATIENCE", "INDEPENDENCE", "ADAPTABILITY", "MAP_PLAY", "LEADERSHIP"] as Trait[]) {
    const own = QUESTIONS.filter((q) => q.kind === "trait" && q.trait === trait);
    const given = own.filter((q) => answers[q.n] !== undefined);
    // One Риса per question, strictly (#50) — so the score is just the mean.
    traits[trait] = given.length
      ? given.reduce((sum, q) => sum + answers[q.n], 0) / given.length
      : 55;
  }

  for (const q of QUESTIONS) {
    if (q.kind === "inclination") inclinations[q.inclination] = answers[q.n] === 100;
  }

  return { traits, inclinations };
}

/* ── #49's arithmetic ── */

/** `fit = 100 − Σ(importance × |score − target|) ÷ Σ(importance)` */
export function rawFit(profile: Profile, direction: Direction): number {
  const cells = DIRECTION_PROFILES[direction];
  let weighted = 0;
  let importance = 0;
  for (const trait of SCORING_TRAITS) {
    const cell = cells[trait];
    weighted += cell.importance * Math.abs(profile.traits[trait] - cell.target);
    importance += cell.importance;
  }
  return 100 - weighted / importance;
}

/** Raw 50 → 20, raw 95 → 100. Fixed reference, so re-runs are comparable. */
function displayUnfloored(raw: number): number {
  return Math.round(Math.min(100, Math.max(20, 20 + (80 * (raw - 50)) / 45)));
}

/** The floor bypasses the scale entirely, and only ever caps — never boosts. */
function displayFloored(raw: number): number {
  return Math.round((15 * raw) / 100);
}

/* ── #52's computed reason ── */

function reasonFor(profile: Profile, direction: Direction): string {
  const cells = DIRECTION_PROFILES[direction];
  const eligible = SCORING_TRAITS.filter((trait) => {
    const { target, importance } = cells[trait];
    // Importance 0 says nothing; a mid target says nothing quotable.
    return importance > 0 && (target <= 40 || target >= 60);
  });

  const ranked = [...eligible].sort((a, b) => {
    const score = (t: typeof a) =>
      cells[t].importance * (100 - Math.abs(profile.traits[t] - cells[t].target));
    // Ties broken by enum order, which `SCORING_TRAITS` already is.
    return score(b) - score(a) || SCORING_TRAITS.indexOf(a) - SCORING_TRAITS.indexOf(b);
  });

  // Always exactly two: a variable count makes line length a signal the model lacks.
  const [first, second] = ranked;
  const fragment = (t: typeof first) =>
    cells[t].target >= 60 ? REASON_FRAGMENTS[t].high : REASON_FRAGMENTS[t].low;

  return COPY.reason(fragment(first), fragment(second));
}

/* ── #51's four nameable kits ── */

function evidencedKits(profile: Profile): { kit: Kit; reason: string }[] {
  const out: { kit: Kit; reason: string }[] = [];
  const wantsVehicles = profile.inclinations.VEHICLES;
  const leads = profile.traits.LEADERSHIP === 100;

  // CREW_SL is the intersection of two measured things, so it supersedes CREW
  // rather than sitting beside it. That is what keeps #52's «0–3» true while
  // #51 names four kits in total.
  if (wantsVehicles) out.push({ kit: leads ? "CREW_SL" : "CREW", reason: "" });
  if (profile.inclinations.INDIRECT_FIRE) out.push({ kit: "MORTAR", reason: "" });
  if (leads) out.push({ kit: "SL", reason: "" });

  return out;
}

/* ── The whole result ── */

export function computeResult(
  answers: Answers,
  { flexEligible }: { flexEligible: boolean },
): Result {
  const profile = scoreProfile(answers);

  // ФЛЕКС is computed identically to the rest, then removed before scaling.
  const considered = DIRECTIONS.filter((d) => d !== "FLEX" || flexEligible);

  const bars: Bar[] = considered.map((direction) => {
    const raw = rawFit(profile, direction);
    const gate = DIRECTION_GATE[direction];
    const floored = gate !== undefined && !profile.inclinations[gate];
    return {
      direction,
      raw,
      displayed: floored ? displayFloored(raw) : displayUnfloored(raw),
      floored,
      note: floored
        ? direction === "VIC"
          ? COPY.flooredVic
          : COPY.flooredMortar
        : undefined,
    };
  });

  bars.sort((a, b) => b.displayed - a.displayed);

  const unfloored = bars.filter((b) => !b.floored);
  const gap = unfloored.length > 1 ? unfloored[0].displayed - unfloored[1].displayed : 100;

  // The genuine shrug: every Риса inside 40–60 forces рівний regardless of gap.
  const forcedEven = SCORING_TRAITS.every(
    (t) => profile.traits[t] >= 40 && profile.traits[t] <= 60,
  );
  const even = forcedEven || gap < 15;

  // Tier 1 holds two Напрями when рівний, ordered by enum, never by value —
  // ordering them would leak a ranking #49 says is not there.
  const winners = even ? unfloored.slice(0, 2) : unfloored.slice(0, 1);
  const tier1 = even
    ? [...winners].sort(
        (a, b) => DIRECTIONS.indexOf(a.direction) - DIRECTIONS.indexOf(b.direction),
      )
    : winners;

  const tier2 = unfloored.filter((b) => !tier1.includes(b));
  const tier3 = bars.filter((b) => b.floored);

  return {
    profile,
    bars,
    tier1,
    tier2,
    tier3,
    even,
    forcedEven,
    headline: even
      ? COPY.headlineEven
      : COPY.headlineClear(DIRECTION_LABELS[tier1[0].direction]),
    reasons: tier1.map((b) => reasonFor(profile, b.direction)),
    flexSuppressed: !flexEligible,
    evidencedKits: evidencedKits(profile),
  };
}
