"use client";

/**
 * PROTOTYPE — THROWAWAY. Round two of variant A — the kits.
 *
 * A second round, after the eighteen: the player picks up to three main kits.
 * This is the top-3 **preference**, not the capability set — see MAX_MAIN_KITS
 * in `_data.ts` for what that costs.
 *
 * Deliberately a pick and not a set of questions. #50 found that player-facing
 * scrim situations must come from a clan member, and no ticket has ever written
 * any for kits. The round is structured so real questions drop straight in.
 *
 * Nothing is pre-ticked, including anything the eighteen pointed at. #51 and
 * #52 both refused that, and the reason survives the cap: block one is what the
 * answers suggest, this is what the player claims.
 */

import { motion } from "framer-motion";
import {
  BASIC_KITS,
  COPY,
  KIT_HINTS,
  KIT_LABELS,
  MAX_MAIN_KITS,
  MEMBER_ON_FILE,
  ROUND_TWO_COPY,
  SPECIAL_KITS,
  type Kit,
} from "./_data";
import { option, optionGroup } from "./_motion";

type Props = {
  picked: Kit[];
  onToggle: (kit: Kit) => void;
  /** #54: a returning member's kits are seeded and marked, never silently wiped. */
  member: boolean;
  onDone: () => void;
  onBack: () => void;
};

export function Kits({ picked, onToggle, member, onDone, onBack }: Props) {
  const full = picked.length >= MAX_MAIN_KITS;
  const onFile = new Set<Kit>(member ? MEMBER_ON_FILE.kits : []);

  return (
    <div className="pa-stage">
      <div className="pa-stage-body">
        <motion.div variants={optionGroup} initial="hidden" animate="visible">
          <motion.div variants={option}>
            <div className="pa-label">{ROUND_TWO_COPY.eyebrow}</div>
            <h2 className="pa-display pa-intro-title" style={{ fontSize: 32 }}>
              {ROUND_TWO_COPY.title}
            </h2>
            <p className="pa-intro-lede" style={{ marginBottom: 20 }}>
              {ROUND_TWO_COPY.lede}
            </p>
          </motion.div>

          <motion.div variants={option}>
            <div className="pa-group-label">{COPY.groupBasic}</div>
            <KitPickGrid
              kits={BASIC_KITS}
              picked={picked}
              onFile={onFile}
              full={full}
              onToggle={onToggle}
            />

            <div className="pa-group-label">{COPY.groupSpecial}</div>
            <KitPickGrid
              kits={SPECIAL_KITS}
              picked={picked}
              onFile={onFile}
              full={full}
              onToggle={onToggle}
            />
          </motion.div>

          <motion.p variants={option} className="pa-sub" style={{ marginTop: 18 }}>
            {full ? ROUND_TWO_COPY.full : ROUND_TWO_COPY.counter(picked.length)}
          </motion.p>
        </motion.div>
      </div>

      <div className="pa-act-nav">
        <button type="button" className="pa-btn" onClick={onBack}>
          назад
        </button>
        <button
          type="button"
          className="pa-btn pa-btn--primary"
          // Zero kits is a real answer — a player may not have a main.
          onClick={onDone}
        >
          {ROUND_TWO_COPY.next}
        </button>
      </div>
    </div>
  );
}

function KitPickGrid({
  kits,
  picked,
  onFile,
  full,
  onToggle,
}: {
  kits: readonly Kit[];
  picked: Kit[];
  onFile: Set<Kit>;
  full: boolean;
  onToggle: (kit: Kit) => void;
}) {
  return (
    <div className="pa-kit-grid">
      {kits.map((kit) => {
        const isPicked = picked.includes(kit);
        const wasOnFile = onFile.has(kit);
        return (
          <button
            key={kit}
            type="button"
            className="pa-kit"
            data-ticked={isPicked}
            data-onfile={wasOnFile}
            // A full grid greys the rest rather than swallowing the tap, so the
            // cap is visible before the player hits it.
            disabled={full && !isPicked}
            onClick={() => onToggle(kit)}
          >
            {KIT_LABELS[kit]}
            {KIT_HINTS[kit] ? <span className="pa-kit-hint">{KIT_HINTS[kit]}</span> : null}
            {wasOnFile ? (
              <span className="pa-kit-onfile">
                {isPicked ? "з профілю" : "буде видалено"}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
