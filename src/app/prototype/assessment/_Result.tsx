"use client";

/**
 * PROTOTYPE — THROWAWAY. Wayfinder ticket #55.
 *
 * #52's result screen. There is exactly ONE of these and all three journey
 * variants land on it — deliberately. #52 fixed the order, the tiers, the
 * numeral ban and the copy; three takes on it would be re-opening a closed
 * decision rather than answering #55's question, which is «does it land».
 *
 * #54's returning-member stack lives here too, because #54 made the result
 * screen the only surface: ФЛЕКС unsuppressed, the grid seeded from
 * `member_roles` and marked, the Напрямок on file offered with no default.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BASIC_KITS,
  COPY,
  DIRECTIONS,
  DIRECTION_LABELS,
  INCLINATIONS,
  INCLINATION_LABELS,
  INCLINATION_SENTENCES,
  KIT_HINTS,
  KIT_LABELS,
  KIT_REASONS,
  MEMBER_ON_FILE,
  SL_INVITATION,
  SPECIAL_KITS,
  TRAITS,
  TRAIT_LABELS,
  TRAIT_SENTENCES,
  type Direction,
  type Kit,
} from "./_data";
import { barFill, resultBlock } from "./_motion";
import type { Bar, Result } from "./_scoring";

type Props = {
  result: Result;
  /** #54: a logged-in member. Drives ФЛЕКС, the seeded grid and the on-file Напрямок. */
  member: boolean;
  onRestart: () => void;
};

const reveal = {
  variants: resultBlock,
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: { once: true, amount: 0.2 },
};

export function Result({ result, member, onRestart }: Props) {
  // #52: the choice is pre-selected to the recommendation — except for a
  // returning member with a Напрямок on file, where #54 requires no default.
  const hasOnFile = member && MEMBER_ON_FILE.directionPrimary !== undefined;
  const [choice, setChoice] = useState<Direction | null>(
    hasOnFile ? null : result.tier1[0].direction,
  );

  // #52: all ten unticked. #54: seeded from `member_roles` for a member, and
  // unticking a seeded kit deletes the row — the marking below is the only
  // thing standing between the player and that.
  const [ticked, setTicked] = useState<Set<Kit>>(
    () => new Set(member ? MEMBER_ON_FILE.kits : []),
  );
  const [saved, setSaved] = useState(false);

  const onFileKits = new Set(member ? MEMBER_ON_FILE.kits : []);
  const removed = [...onFileKits].filter((k) => !ticked.has(k));

  const toggle = (kit: Kit) => {
    setTicked((prev) => {
      const next = new Set(prev);
      if (next.has(kit)) next.delete(kit);
      else next.add(kit);
      return next;
    });
  };

  const visibleChoices = DIRECTIONS.filter(
    (d) => d !== "FLEX" || !result.flexSuppressed,
  );

  return (
    <div className="pa-result">
      {/* 1 · Headline + computed reason */}
      <motion.div {...reveal} className="pa-result-section">
        <h1 className="pa-display pa-headline">{result.headline}</h1>
        {result.reasons.map((reason, i) => (
          <p key={i} className="pa-reason">
            {result.even ? (
              <strong>{DIRECTION_LABELS[result.tier1[i].direction]} — </strong>
            ) : null}
            {reason}
          </p>
        ))}
      </motion.div>

      {/* 2 · Six bars, three tiers. No numeral appears anywhere. */}
      <motion.section {...reveal} className="pa-result-section">
        <Tier label={COPY.tier1} tier={1} bars={result.tier1} />
        <Tier label={COPY.tier2} tier={2} bars={result.tier2} />
        <Tier label={COPY.tier3} tier={3} bars={result.tier3} />

        {/* 3 · ФЛЕКС suppression is acknowledged, never silent. */}
        {result.flexSuppressed ? (
          <p className="pa-flex-note">{COPY.flexSuppressed}</p>
        ) : null}
      </motion.section>

      {/* 4 · All eight Атрибути, directly under the bars, not behind a disclosure. */}
      <motion.section {...reveal} className="pa-result-section">
        <h2 className="pa-section-head">{COPY.attributesHeader}</h2>

        {TRAITS.map((trait) => (
          <div key={trait} className="pa-attr">
            <div className="pa-attr-name">{TRAIT_LABELS[trait]}</div>
            <div className="pa-attr-track">
              <motion.div
                className="pa-attr-fill"
                {...barFill(result.profile.traits[trait])}
              />
            </div>
            <p className="pa-attr-sentence">{TRAIT_SENTENCES[trait]}</p>
          </div>
        ))}

        {INCLINATIONS.map((inc) => (
          <div key={inc} className="pa-attr">
            <div className="pa-attr-name">{INCLINATION_LABELS[inc]}</div>
            <div>
              <span className="pa-chip" data-want={result.profile.inclinations[inc]}>
                {result.profile.inclinations[inc] ? COPY.chipYes : COPY.chipNo}
              </span>
            </div>
            <p className="pa-attr-sentence">{INCLINATION_SENTENCES[inc]}</p>
          </div>
        ))}
      </motion.section>

      {/* 5 · Вибір гравця — the player is the author, the tool's reading is a default. */}
      <motion.section {...reveal} className="pa-result-section">
        <h2 className="pa-section-head">{COPY.choice}</h2>
        <p className="pa-sub">
          {COPY.choiceSub}
          {hasOnFile ? (
            <>
              {" "}
              У профілі зараз{" "}
              <strong>{DIRECTION_LABELS[MEMBER_ON_FILE.directionPrimary]}</strong>. Обери
              один — перезапис повний.
            </>
          ) : null}
        </p>
        <div className="pa-choice-grid">
          {visibleChoices.map((d) => (
            <button
              key={d}
              type="button"
              className="pa-choice"
              data-selected={choice === d}
              onClick={() => setChoice(d)}
            >
              {DIRECTION_LABELS[d]}
              {hasOnFile && d === MEMBER_ON_FILE.directionPrimary ? (
                <span className="pa-choice-onfile">у профілі</span>
              ) : null}
            </button>
          ))}
        </div>
      </motion.section>

      {/* 6 · Evidenced kits (0–3), then the ten-grid split базові / спеціальні. */}
      <motion.section {...reveal} className="pa-result-section">
        <h2 className="pa-section-head">{COPY.evidencedHeader}</h2>

        {result.evidencedKits.length === 0 ? (
          <p className="pa-attr-sentence">{COPY.evidencedEmpty}</p>
        ) : (
          result.evidencedKits.map(({ kit }) => (
            <div key={kit} className="pa-evidenced">
              <div className="pa-evidenced-kit">{KIT_LABELS[kit]}</div>
              <p className="pa-evidenced-reason">{KIT_REASONS[kit]}</p>
              {/* #51: the invitation hangs off the SL entry, never as a banner. */}
              {kit === "SL" ? <p className="pa-evidenced-invite">{SL_INVITATION}</p> : null}
            </div>
          ))
        )}

        <h2 className="pa-section-head" style={{ marginTop: 32 }}>
          {COPY.gridHeader}
        </h2>

        <div className="pa-group-label">{COPY.groupBasic}</div>
        <KitGrid
          kits={BASIC_KITS}
          ticked={ticked}
          onFile={onFileKits}
          onToggle={toggle}
        />

        <div className="pa-group-label">{COPY.groupSpecial}</div>
        <KitGrid
          kits={SPECIAL_KITS}
          ticked={ticked}
          onFile={onFileKits}
          onToggle={toggle}
        />
      </motion.section>

      {/* 7 · What will be saved, then the CTA. */}
      <motion.section {...reveal} className="pa-result-section">
        <h2 className="pa-section-head">{COPY.saveHeader}</h2>
        <div className="pa-save">
          <div className="pa-save-row">
            <span className="pa-save-key">Напрямок</span>
            <span className="pa-save-val">
              {choice ? DIRECTION_LABELS[choice] : "— обери вище"}
            </span>
          </div>
          <div className="pa-save-row">
            <span className="pa-save-key">Кіти</span>
            <span className="pa-save-val">
              {ticked.size
                ? [...ticked].map((k) => KIT_LABELS[k]).join(", ")
                : "жодного"}
            </span>
          </div>
          {removed.length ? (
            <div className="pa-save-row">
              <span className="pa-save-key">Прибереться</span>
              <span className="pa-save-val" style={{ color: "var(--status-danger)" }}>
                {removed.map((k) => KIT_LABELS[k]).join(", ")}
              </span>
            </div>
          ) : null}
          {/* #53, and now simply true. */}
          <p className="pa-save-negative">{COPY.saveNoAttributes}</p>
        </div>

        {saved ? (
          // #54: after save the player stays put — confirm inline, never redirect.
          <div className="pa-saved">
            Збережено. <a href="#">Профіль</a>
          </div>
        ) : (
          <div className="pa-cta">
            <button type="button" className="pa-btn pa-btn--ghost" onClick={onRestart}>
              {COPY.ctaSecondary}
            </button>
            <button
              type="button"
              className="pa-btn pa-btn--primary"
              disabled={choice === null}
              onClick={() => setSaved(true)}
            >
              {COPY.cta}
            </button>
          </div>
        )}
      </motion.section>
    </div>
  );
}

function Tier({ label, tier, bars }: { label: string; tier: 1 | 2 | 3; bars: Bar[] }) {
  if (!bars.length) return null;
  return (
    <div className="pa-tier" data-tier={tier}>
      <div className="pa-tier-label">{label}</div>
      {bars.map((bar) => (
        <div key={bar.direction} className="pa-bar" data-tier={tier}>
          <div className="pa-bar-head">
            <span className="pa-bar-name">{DIRECTION_LABELS[bar.direction]}</span>
            <span className="pa-bar-en">{bar.direction}</span>
          </div>
          <div className="pa-bar-track">
            <motion.div className="pa-bar-fill" {...barFill(bar.displayed)} />
          </div>
          {bar.note ? <p className="pa-bar-note">{bar.note}</p> : null}
        </div>
      ))}
    </div>
  );
}

function KitGrid({
  kits,
  ticked,
  onFile,
  onToggle,
}: {
  kits: readonly Kit[];
  ticked: Set<Kit>;
  onFile: Set<Kit>;
  onToggle: (kit: Kit) => void;
}) {
  return (
    <div className="pa-kit-grid">
      {kits.map((kit) => {
        const isTicked = ticked.has(kit);
        const wasOnFile = onFile.has(kit);
        return (
          <button
            key={kit}
            type="button"
            className="pa-kit"
            data-ticked={isTicked}
            data-onfile={wasOnFile}
            onClick={() => onToggle(kit)}
          >
            {KIT_LABELS[kit]}
            {KIT_HINTS[kit] ? <span className="pa-kit-hint">{KIT_HINTS[kit]}</span> : null}
            {wasOnFile ? (
              <span className="pa-kit-onfile">
                {isTicked ? "з профілю" : "буде видалено"}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
