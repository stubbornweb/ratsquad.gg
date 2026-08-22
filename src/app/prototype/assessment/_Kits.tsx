"use client";

/**
 * PROTOTYPE — THROWAWAY. Round two of variant A — the three roles.
 *
 * Three ordered slots, one screen each, in A's own rhythm: tap a kit, advance.
 * This is the top-3 **preference** — an ordinal, which is what
 * `MAX_ROLE_PREFERENCES` sizes and what #53 left unwritten.
 *
 * Ordered, not a pick-any-three. #51 settled «top-3: seeded, not ordered» and
 * #53 concluded there was «no ordering to write»; the clan has now asked for the
 * ordering explicitly, and the secondary's parenthetical is the reason it
 * exists — in a загін someone else may already have your main kit.
 *
 * Nothing is pre-selected, including anything the eighteen pointed at. #51 and
 * #52 both refused that and the reason survives: block one is what the answers
 * suggest, this is what the player claims.
 */

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import {
  BASIC_KITS,
  COPY,
  KIT_HINTS,
  KIT_LABELS,
  MEMBER_ON_FILE,
  ROLE_SLOTS,
  ROUND_TWO_COPY,
  SPECIAL_KITS,
  type Kit,
} from "./_data";
import { option, optionGroup, swap } from "./_motion";

type Props = {
  /** One entry per slot, `null` where the player has not chosen. */
  roles: (Kit | null)[];
  slot: number;
  onPick: (slot: number, kit: Kit) => void;
  onSlotChange: (slot: number) => void;
  autoAdvance: boolean;
  /** #54: a returning member's kits are marked, never silently wiped. */
  member: boolean;
  onDone: () => void;
  onBack: () => void;
};

export function Kits({
  roles,
  slot,
  onPick,
  onSlotChange,
  autoAdvance,
  member,
  onDone,
  onBack,
}: Props) {
  const spec = ROLE_SLOTS[slot];
  const chosen = roles[slot];
  const last = slot === ROLE_SLOTS.length - 1;
  const onFile = new Set<Kit>(member ? MEMBER_ON_FILE.kits : []);

  // A kit cannot be two of your three, so earlier picks are out of play here.
  const taken = new Set(
    roles.filter((r, i): r is Kit => r !== null && i !== slot),
  );

  const advance = () => (last ? onDone() : onSlotChange(slot + 1));

  const pick = (kit: Kit) => {
    onPick(slot, kit);
    if (autoAdvance) window.setTimeout(advance, 180);
  };

  return (
    <div className="pa-stage">
      <div className="pa-rail">
        {ROLE_SLOTS.map((s, i) => (
          <div
            key={s.key}
            className="pa-rail-seg"
            data-state={i === slot ? "current" : i < slot ? "done" : "todo"}
          />
        ))}
      </div>

      <button
        type="button"
        className="pa-back"
        onClick={() => (slot === 0 ? onBack() : onSlotChange(slot - 1))}
        aria-label="Назад"
      >
        <ChevronLeft size={14} />
        назад
      </button>

      <div className="pa-stage-body">
        <AnimatePresence mode="wait">
          <motion.div
            key={spec.key}
            variants={swap}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="pa-label" style={{ marginBottom: 10 }}>
              {ROUND_TWO_COPY.eyebrow}
            </div>
            <div className="pa-qnum">
              {ROUND_TWO_COPY.slotCounter(slot + 1)}
            </div>

            <h2 className="pa-situation" style={{ marginBottom: 8 }}>
              {spec.question}
            </h2>
            {spec.note ? <p className="pa-sub">{spec.note}</p> : null}
            <p className="pa-sub">{spec.hint}</p>

            {/* The criteria sit on the first slot only — repeating them three
                times would read as the screen not trusting the player. */}
            {slot === 0 ? (
              <p className="pa-flex-note" style={{ marginTop: 0, marginBottom: 24 }}>
                {ROUND_TWO_COPY.criteria}
              </p>
            ) : null}

            <motion.div variants={optionGroup} initial="hidden" animate="visible">
              <motion.div variants={option}>
                <div className="pa-group-label">{COPY.groupBasic}</div>
                <SlotGrid
                  kits={BASIC_KITS}
                  chosen={chosen}
                  taken={taken}
                  onFile={onFile}
                  onPick={pick}
                />

                <div className="pa-group-label">{COPY.groupSpecial}</div>
                <SlotGrid
                  kits={SPECIAL_KITS}
                  chosen={chosen}
                  taken={taken}
                  onFile={onFile}
                  onPick={pick}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pa-act-nav">
        {/* Only the primary is required, so the other two can be walked past. */}
        {!spec.required ? (
          <button type="button" className="pa-btn" onClick={advance}>
            {ROUND_TWO_COPY.skip}
          </button>
        ) : null}
        <button
          type="button"
          className="pa-btn pa-btn--primary"
          disabled={spec.required && !chosen}
          onClick={advance}
        >
          {last ? ROUND_TWO_COPY.next : "далі"}
        </button>
      </div>
    </div>
  );
}

function SlotGrid({
  kits,
  chosen,
  taken,
  onFile,
  onPick,
}: {
  kits: readonly Kit[];
  chosen: Kit | null;
  taken: Set<Kit>;
  onFile: Set<Kit>;
  onPick: (kit: Kit) => void;
}) {
  return (
    <div className="pa-kit-grid">
      {kits.map((kit) => {
        const isTaken = taken.has(kit);
        return (
          <button
            key={kit}
            type="button"
            className="pa-kit"
            data-ticked={chosen === kit}
            data-onfile={onFile.has(kit)}
            disabled={isTaken}
            onClick={() => onPick(kit)}
          >
            {KIT_LABELS[kit]}
            {KIT_HINTS[kit] ? <span className="pa-kit-hint">{KIT_HINTS[kit]}</span> : null}
            {isTaken ? (
              <span className="pa-kit-hint">{ROUND_TWO_COPY.taken}</span>
            ) : onFile.has(kit) ? (
              <span className="pa-kit-onfile">з профілю</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
