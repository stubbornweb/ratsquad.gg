"use client";

/**
 * PROTOTYPE — throwaway. Variant A: «АНКЕТА».
 *
 * One long scrolling form. The 14 ролі are a FLAT grid — no grouping at all,
 * so this is the control case for "is 14 a wall?". Топ-3 is a visibly separate
 * block with three explicit ordinal slots, each a plain select — no drag.
 * Closest thing to the Discord form it replaces.
 *
 * Deliberately NOT numbered 01/02/03: the four blocks are independent fields,
 * not a sequence, so ordinal markers would be decoration claiming to be
 * structure. B earns its numbering because a wizard really is a sequence.
 */

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  DIRECTIONS,
  ROLES,
  ROLE_BY_ID,
  type Direction,
  type ProfileDraft,
} from "./_data";
import { fadeUp, staggerContainer } from "@/hooks/useAnimations";

type Props = {
  draft: ProfileDraft;
  setDraft: (next: ProfileDraft) => void;
};

export function VariantA({ draft, setDraft }: Props) {
  const toggleCan = (id: string) => {
    const can = draft.can.includes(id)
      ? draft.can.filter((r) => r !== id)
      : [...draft.can, id];
    // Dropping a capability must drop it from the top-3 too.
    setDraft({ ...draft, can, top: draft.top.filter((r) => can.includes(r)) });
  };

  const setTopAt = (slot: number, id: string) => {
    const top = [...draft.top];
    while (top.length < slot) top.push("");
    // Picking a role already in another slot swaps them rather than duplicating.
    const existing = top.indexOf(id);
    if (existing !== -1 && existing !== slot) top[existing] = top[slot] ?? "";
    top[slot] = id;
    setDraft({ ...draft, top: top.filter(Boolean) });
  };

  return (
    <div className="pt-page">
      <motion.div
        className="pt-shell"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp}>
          <p className="pt-eyebrow">Анкета оператора</p>
          <h1 className="pt-display pt-title">Твій профіль</h1>
          <p className="pt-lede">
            Це те, що бачить командир, коли збирає склад на скрим. Заповни один
            раз — далі тільки правки.
          </p>
        </motion.div>

        {/* ── Capability set — flat, ungrouped, all 14 ── */}
        <Block
          title="Які ролі ти можеш грати"
          sub="Все, що ти витягнеш, якщо попросять. Не «хочу» — «можу». Обирай скільки завгодно."
        >
          <div className="pt-grid">
            {ROLES.map((role) => (
              <button
                key={role.id}
                type="button"
                data-on={draft.can.includes(role.id)}
                onClick={() => toggleCan(role.id)}
                className="pt-cell"
              >
                <Check size={14} className="pt-cell-mark" />
                <span className="pt-cell-name">{role.label}</span>
                <span className="pt-cell-hint">{role.hint}</span>
              </button>
            ))}
          </div>
          <p className="pt-note mt-4">
            Обрано: {draft.can.length} / {ROLES.length}
          </p>
        </Block>

        {/* ── Top-3, explicitly ordinal, no drag ── */}
        <Block
          title="Твоя топ-3"
          sub="З обраного вище — що ти береш першим, другим, третім. Це підказка, а не обмеження."
        >
          {draft.can.length === 0 ? (
            <p className="pt-empty">
              Спочатку познач, які ролі ти можеш грати.
            </p>
          ) : (
            <div className="pt-slots">
              {[0, 1, 2].map((slot) => (
                <div key={slot} className="pt-slot">
                  <p className="pt-slot-ordinal">
                    {String(slot + 1).padStart(2, "0")}
                  </p>
                  <select
                    className="pt-select"
                    value={draft.top[slot] ?? ""}
                    onChange={(e) => setTopAt(slot, e.target.value)}
                  >
                    <option value="">—</option>
                    {draft.can.map((id) => (
                      <option key={id} value={id}>
                        {ROLE_BY_ID[id].label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </Block>

        {/* ── Напрямок, primary + optional secondary ── */}
        <Block
          title="Напрямок"
          sub="Де тобі природно на карті. Другий — опційно, якщо перший не вичерпує."
        >
          <DirectionRow
            value={draft.direction}
            onChange={(d) =>
              setDraft({
                ...draft,
                direction: d,
                directionSecondary:
                  draft.directionSecondary === d ? null : draft.directionSecondary,
              })
            }
          />
          <p className="pt-label mt-8">Другий напрямок — опційно</p>
          <DirectionRow
            value={draft.directionSecondary}
            blocked={draft.direction}
            onChange={(d) =>
              setDraft({
                ...draft,
                directionSecondary: draft.directionSecondary === d ? null : d,
              })
            }
          />
        </Block>

        {/* ── Steam ID ── */}
        <Block
          title="Steam ID"
          sub="SteamID64 — 17 цифр. Потрібен, щоб зіставити тебе зі статистикою матчу."
        >
          <input
            className="pt-input"
            value={draft.steamId}
            onChange={(e) => setDraft({ ...draft, steamId: e.target.value })}
            placeholder="76561198000000000"
            inputMode="numeric"
          />
        </Block>

        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6">
          <button type="button" className="btn btn-primary btn-large">
            Зберегти
          </button>
          <span className="pt-note">Прототип — нічого не зберігається</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Block({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section variants={fadeUp} className="pt-block">
      <h2 className="pt-display pt-block-title">{title}</h2>
      <p className="pt-block-sub">{sub}</p>
      {children}
    </motion.section>
  );
}

function DirectionRow({
  value,
  onChange,
  blocked,
}: {
  value: Direction | null;
  onChange: (d: Direction) => void;
  blocked?: Direction | null;
}) {
  return (
    <div className="pt-dirs">
      {DIRECTIONS.map((d) => (
        <button
          key={d.id}
          type="button"
          className="pt-dir"
          data-on={value === d.id}
          disabled={blocked === d.id}
          onClick={() => onChange(d.id)}
        >
          <span className="pt-dir-name">{d.label}</span>
          <span className="pt-dir-hint">{d.hint}</span>
        </button>
      ))}
    </div>
  );
}
