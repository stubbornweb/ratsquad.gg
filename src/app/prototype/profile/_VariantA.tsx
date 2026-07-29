"use client";

/**
 * PROTOTYPE — throwaway. Variant A: «АНКЕТА».
 *
 * One long scrolling form. The 14 ролі are a FLAT grid — no grouping at all,
 * so this is the control case for "is 14 a wall?". Топ-3 is a visibly separate
 * numbered section with three explicit ordinal slots (1-й / 2-й / 3-й), each a
 * plain select — no drag. Closest thing to the Discord form it replaces.
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
    <div className="mx-auto max-w-[900px] px-6 pt-28 pb-40">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div variants={fadeUp}>
          <p className="mb-4 flex items-center gap-4 font-[family-name:var(--font-label)] text-[11px] tracking-[0.25em] text-[var(--accent)] uppercase">
            <span className="inline-block h-0.5 w-8 bg-[var(--accent)]" />
            Анкета оператора
          </p>
          <h1 className="mb-3 font-[family-name:var(--font-heading)] text-5xl tracking-[0.06em] uppercase">
            Твій профіль
          </h1>
          <p className="mb-16 max-w-[520px] text-[15px] text-[var(--text-muted)]">
            Це те, що бачить командир, коли збирає склад на скрим. Заповни один
            раз — далі тільки правки.
          </p>
        </motion.div>

        {/* ── 01. Capability set — flat, ungrouped, all 14 ── */}
        <Section
          index="01"
          title="Які ролі ти можеш грати"
          sub="Все, що ти витягнеш, якщо попросять. Не «хочу» — «можу». Обирай скільки завгодно."
        >
          <div className="grid grid-cols-2 gap-px bg-[var(--border-subtle)] sm:grid-cols-3 md:grid-cols-4">
            {ROLES.map((role) => {
              const on = draft.can.includes(role.id);
              return (
                <button
                  key={role.id}
                  onClick={() => toggleCan(role.id)}
                  className={`group relative flex flex-col items-start gap-1 p-4 text-left transition-colors duration-150 ${
                    on
                      ? "bg-[var(--accent-subtle)]"
                      : "bg-[var(--bg-alt)] hover:bg-[var(--bg-card)]"
                  }`}
                >
                  <span
                    className={`absolute top-3 right-3 transition-opacity duration-150 ${
                      on ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Check size={14} className="text-[var(--accent)]" />
                  </span>
                  <span
                    className={`font-[family-name:var(--font-label)] text-[13px] font-bold tracking-[0.12em] uppercase transition-colors duration-150 ${
                      on ? "text-[var(--accent)]" : "text-[var(--text-main)]"
                    }`}
                  >
                    {role.label}
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[var(--text-dark)] uppercase">
                    {role.hint}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-4 font-[family-name:var(--font-mono)] text-[11px] tracking-widest text-[var(--text-dark)] uppercase">
            Обрано: {draft.can.length} / {ROLES.length}
          </p>
        </Section>

        {/* ── 02. Top-3, explicitly ordinal, no drag ── */}
        <Section
          index="02"
          title="Твоя топ-3"
          sub="З обраного вище — що ти береш першим, другим, третім. Це підказка, а не обмеження."
        >
          {draft.can.length === 0 ? (
            <p className="border border-dashed border-[var(--border-subtle)] p-8 text-center text-[14px] text-[var(--text-dark)]">
              Спочатку познач, які ролі ти можеш грати.
            </p>
          ) : (
            <div className="grid gap-px bg-[var(--border-subtle)] sm:grid-cols-3">
              {[0, 1, 2].map((slot) => (
                <div key={slot} className="bg-[var(--bg-alt)] p-5">
                  <p className="mb-3 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.25em] text-[var(--accent)] uppercase">
                    {slot + 1}-й вибір
                  </p>
                  <select
                    value={draft.top[slot] ?? ""}
                    onChange={(e) => setTopAt(slot, e.target.value)}
                    className="w-full appearance-none rounded-none border border-[var(--border-color)] bg-[var(--bg-main)] px-3 py-3 font-[family-name:var(--font-label)] text-[14px] tracking-[0.08em] text-[var(--text-main)] uppercase transition-colors duration-150 outline-none focus:border-[var(--accent)]"
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
        </Section>

        {/* ── 03. Напрямок, primary + optional secondary ── */}
        <Section
          index="03"
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
          <p className="mt-8 mb-3 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.25em] text-[var(--text-dark)] uppercase">
            Другий напрямок — опційно
          </p>
          <DirectionRow
            value={draft.directionSecondary}
            disabled={draft.direction}
            onChange={(d) =>
              setDraft({
                ...draft,
                directionSecondary: draft.directionSecondary === d ? null : d,
              })
            }
          />
        </Section>

        {/* ── 04. Steam ID ── */}
        <Section
          index="04"
          title="Steam ID"
          sub="SteamID64 — 17 цифр. Потрібен, щоб зіставити тебе зі статистикою матчу."
        >
          <input
            value={draft.steamId}
            onChange={(e) => setDraft({ ...draft, steamId: e.target.value })}
            placeholder="76561198000000000"
            inputMode="numeric"
            className="w-full max-w-[420px] rounded-none border border-[var(--border-color)] bg-[var(--bg-alt)] px-5 py-4 font-[family-name:var(--font-mono)] text-[15px] tracking-wider text-[var(--text-main)] transition-colors duration-150 outline-none placeholder:text-[var(--text-dark)] focus:border-[var(--accent)]"
          />
        </Section>

        <motion.div variants={fadeUp} className="mt-16 flex items-center gap-6">
          <button className="btn btn-primary btn-large">Зберегти</button>
          <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-widest text-[var(--text-dark)] uppercase">
            Прототип — нічого не зберігається
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Section({
  index,
  title,
  sub,
  children,
}: {
  index: string;
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      variants={fadeUp}
      className="mb-20 border-t border-[var(--border-subtle)] pt-8"
    >
      <div className="mb-6">
        <p className="mb-2 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[var(--accent)]">
          {index}
        </p>
        <h2 className="mb-2 font-[family-name:var(--font-heading)] text-2xl tracking-[0.1em] uppercase">
          {title}
        </h2>
        <p className="max-w-[560px] text-[14px] text-[var(--text-muted)]">{sub}</p>
      </div>
      {children}
    </motion.section>
  );
}

function DirectionRow({
  value,
  onChange,
  disabled,
}: {
  value: Direction | null;
  onChange: (d: Direction) => void;
  disabled?: Direction | null;
}) {
  return (
    <div className="grid gap-px bg-[var(--border-subtle)] sm:grid-cols-4">
      {DIRECTIONS.map((d) => {
        const off = disabled === d.id;
        const on = value === d.id;
        return (
          <button
            key={d.id}
            disabled={off}
            onClick={() => onChange(d.id)}
            className={`p-5 text-left transition-colors duration-150 ${
              on
                ? "bg-[var(--accent-subtle)]"
                : "bg-[var(--bg-alt)] hover:bg-[var(--bg-card)]"
            } ${off ? "cursor-not-allowed opacity-25" : ""}`}
          >
            <span
              className={`block font-[family-name:var(--font-label)] text-[14px] font-bold tracking-[0.14em] uppercase ${
                on ? "text-[var(--accent)]" : "text-[var(--text-main)]"
              }`}
            >
              {d.label}
            </span>
            <span className="mt-1 block text-[12px] text-[var(--text-dark)]">
              {d.hint}
            </span>
          </button>
        );
      })}
    </div>
  );
}
