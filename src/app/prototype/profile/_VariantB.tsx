"use client";

/**
 * PROTOTYPE — throwaway. Variant B: «БРИФІНГ».
 *
 * A stepped wizard. Ролі are GROUPED (ПІХОТА / ТЕХНІКА / ІНШЕ) — the thing to
 * judge is whether that grouping earns its keep, and whether «ІНШЕ» (SL, a job;
 * Mortar, a station) reads as the axis-mixing leak it is.
 *
 * Топ-3 is a DRAG-reorder list, and it is a separate step — so the two questions
 * are maximally separated in time. If they still feel like one question here,
 * they are one question.
 */

import { useState } from "react";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, GripVertical } from "lucide-react";
import {
  DIRECTIONS,
  GROUP_LABELS,
  ROLES,
  ROLE_BY_ID,
  type ProfileDraft,
  type RoleGroup,
} from "./_data";

const GROUPS: RoleGroup[] = ["infantry", "vehicle", "other"];

const STEPS = [
  { key: "roles", label: "Ролі" },
  { key: "top", label: "Топ-3" },
  { key: "profile", label: "Напрямок" },
  { key: "done", label: "Готово" },
];

type Props = {
  draft: ProfileDraft;
  setDraft: (next: ProfileDraft) => void;
};

export function VariantB({ draft, setDraft }: Props) {
  const [step, setStep] = useState(0);

  const toggleCan = (id: string) => {
    const can = draft.can.includes(id)
      ? draft.can.filter((r) => r !== id)
      : [...draft.can, id];
    setDraft({ ...draft, can, top: draft.top.filter((r) => can.includes(r)) });
  };

  const toggleTop = (id: string) => {
    if (draft.top.includes(id)) {
      setDraft({ ...draft, top: draft.top.filter((r) => r !== id) });
    } else if (draft.top.length < 3) {
      setDraft({ ...draft, top: [...draft.top, id] });
    }
  };

  return (
    <div className="mx-auto max-w-[820px] px-6 pt-28 pb-40">
      {/* ── Step rail ── */}
      <div className="mb-14 flex items-stretch gap-px bg-[var(--border-subtle)]">
        {STEPS.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setStep(i)}
            className={`flex-1 bg-[var(--bg-alt)] px-3 py-4 text-left transition-colors duration-150 ${
              i === step ? "bg-[var(--accent-subtle)]" : "hover:bg-[var(--bg-card)]"
            }`}
          >
            <span
              className={`block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.25em] ${
                i <= step ? "text-[var(--accent)]" : "text-[var(--text-dark)]"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={`mt-1 block font-[family-name:var(--font-label)] text-[12px] font-bold tracking-[0.14em] uppercase ${
                i === step ? "text-[var(--text-main)]" : "text-[var(--text-dark)]"
              }`}
            >
              {s.label}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
        >
          {step === 0 && (
            <StepShell
              title="Що ти можеш грати"
              sub="Познач усе, що витягнеш на прохання командира. Це не про бажання — це про здатність."
            >
              <div className="flex flex-col gap-10">
                {GROUPS.map((group) => (
                  <div key={group}>
                    <p className="mb-4 flex items-center gap-4 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[var(--accent)] uppercase">
                      {GROUP_LABELS[group]}
                      <span className="h-px flex-1 bg-[var(--accent)] opacity-20" />
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ROLES.filter((r) => r.group === group).map((role) => {
                        const on = draft.can.includes(role.id);
                        return (
                          <button
                            key={role.id}
                            onClick={() => toggleCan(role.id)}
                            title={role.hint}
                            className={`border px-4 py-2.5 font-[family-name:var(--font-label)] text-[13px] font-bold tracking-[0.12em] uppercase transition-colors duration-150 ${
                              on
                                ? "border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)]"
                                : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--text-dark)] hover:text-[var(--text-main)]"
                            }`}
                          >
                            {role.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </StepShell>
          )}

          {step === 1 && (
            <StepShell
              title="Твоя топ-3"
              sub="Обери до трьох з того, що позначив. Перетягни, щоб змінити порядок."
            >
              <div className="mb-8 flex flex-wrap gap-2">
                {draft.can.map((id) => {
                  const on = draft.top.includes(id);
                  const full = draft.top.length >= 3 && !on;
                  return (
                    <button
                      key={id}
                      disabled={full}
                      onClick={() => toggleTop(id)}
                      className={`border px-4 py-2.5 font-[family-name:var(--font-label)] text-[13px] font-bold tracking-[0.12em] uppercase transition-colors duration-150 ${
                        on
                          ? "border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)]"
                          : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--text-dark)]"
                      } ${full ? "cursor-not-allowed opacity-25" : ""}`}
                    >
                      {ROLE_BY_ID[id].label}
                    </button>
                  );
                })}
                {draft.can.length === 0 && (
                  <p className="text-[14px] text-[var(--text-dark)]">
                    Крок 01 порожній — повернись і познач ролі.
                  </p>
                )}
              </div>

              <Reorder.Group
                axis="y"
                values={draft.top}
                onReorder={(top: string[]) => setDraft({ ...draft, top })}
                className="flex flex-col gap-2"
              >
                {draft.top.map((id, i) => (
                  <Reorder.Item
                    key={id}
                    value={id}
                    className="flex cursor-grab items-center gap-4 border border-[var(--border-subtle)] bg-[var(--bg-alt)] px-5 py-4 active:cursor-grabbing"
                  >
                    <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.25em] text-[var(--accent)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-[family-name:var(--font-label)] text-[15px] font-bold tracking-[0.12em] uppercase">
                      {ROLE_BY_ID[id].label}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-dark)] uppercase">
                      {ROLE_BY_ID[id].hint}
                    </span>
                    <GripVertical size={16} className="text-[var(--text-dark)]" />
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </StepShell>
          )}

          {step === 2 && (
            <StepShell
              title="Напрямок і Steam"
              sub="Де тобі природно на карті, і чим тебе зіставити зі статистикою матчу."
            >
              <div className="mb-10 flex flex-col gap-2">
                {DIRECTIONS.map((d) => {
                  const on = draft.direction === d.id;
                  const second = draft.directionSecondary === d.id;
                  return (
                    <div
                      key={d.id}
                      className={`flex items-center gap-4 border px-5 py-4 transition-colors duration-150 ${
                        on || second
                          ? "border-[var(--accent)] bg-[var(--accent-subtle)]"
                          : "border-[var(--border-subtle)] bg-[var(--bg-alt)]"
                      }`}
                    >
                      <div className="flex-1">
                        <span
                          className={`block font-[family-name:var(--font-label)] text-[14px] font-bold tracking-[0.14em] uppercase ${
                            on || second
                              ? "text-[var(--accent)]"
                              : "text-[var(--text-main)]"
                          }`}
                        >
                          {d.label}
                        </span>
                        <span className="text-[12px] text-[var(--text-dark)]">
                          {d.hint}
                        </span>
                      </div>
                      <button
                        onClick={() => setDraft({ ...draft, direction: d.id })}
                        className={`border px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] uppercase transition-colors duration-150 ${
                          on
                            ? "border-[var(--accent)] text-[var(--accent)]"
                            : "border-[var(--border-subtle)] text-[var(--text-dark)] hover:border-[var(--text-dark)]"
                        }`}
                      >
                        Основний
                      </button>
                      <button
                        onClick={() =>
                          setDraft({
                            ...draft,
                            directionSecondary: second ? null : d.id,
                          })
                        }
                        disabled={on}
                        className={`border px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] uppercase transition-colors duration-150 ${
                          second
                            ? "border-[var(--accent)] text-[var(--accent)]"
                            : "border-[var(--border-subtle)] text-[var(--text-dark)] hover:border-[var(--text-dark)]"
                        } ${on ? "cursor-not-allowed opacity-25" : ""}`}
                      >
                        Другий
                      </button>
                    </div>
                  );
                })}
              </div>

              <label className="mb-3 block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.25em] text-[var(--text-dark)] uppercase">
                Steam ID — 17 цифр
              </label>
              <input
                value={draft.steamId}
                onChange={(e) => setDraft({ ...draft, steamId: e.target.value })}
                placeholder="76561198000000000"
                inputMode="numeric"
                className="w-full rounded-none border border-[var(--border-color)] bg-[var(--bg-alt)] px-5 py-4 font-[family-name:var(--font-mono)] text-[15px] tracking-wider text-[var(--text-main)] transition-colors duration-150 outline-none placeholder:text-[var(--text-dark)] focus:border-[var(--accent)]"
              />
            </StepShell>
          )}

          {step === 3 && (
            <StepShell
              title="Готово"
              sub="Ось що побачить командир. Правити можна будь-коли."
            >
              <div className="border border-[var(--border-subtle)] bg-[var(--bg-alt)]">
                <Summary draft={draft} />
              </div>
              <button className="btn btn-primary btn-large mt-10">Зберегти</button>
            </StepShell>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Step nav ── */}
      <div className="mt-14 flex items-center justify-between border-t border-[var(--border-subtle)] pt-6">
        <button
          disabled={step === 0}
          onClick={() => setStep(step - 1)}
          className="flex items-center gap-3 font-[family-name:var(--font-label)] text-[12px] font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase transition-colors duration-150 hover:text-[var(--text-main)] disabled:opacity-25"
        >
          <ArrowLeft size={14} /> Назад
        </button>
        <button
          disabled={step === STEPS.length - 1}
          onClick={() => setStep(step + 1)}
          className="flex items-center gap-3 font-[family-name:var(--font-label)] text-[12px] font-bold tracking-[0.2em] text-[var(--accent)] uppercase transition-colors duration-150 hover:text-[var(--text-main)] disabled:opacity-25"
        >
          Далі <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

function StepShell({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-2 font-[family-name:var(--font-heading)] text-4xl tracking-[0.08em] uppercase">
        {title}
      </h2>
      <p className="mb-10 max-w-[560px] text-[15px] text-[var(--text-muted)]">{sub}</p>
      {children}
    </div>
  );
}

function Summary({ draft }: { draft: ProfileDraft }) {
  const rows: [string, React.ReactNode][] = [
    [
      "Топ-3",
      draft.top.length
        ? draft.top.map((id, i) => `${i + 1}. ${ROLE_BY_ID[id].label}`).join("   ")
        : "—",
    ],
    [
      "Може грати",
      draft.can.length
        ? draft.can.map((id) => ROLE_BY_ID[id].label).join(", ")
        : "—",
    ],
    [
      "Напрямок",
      [draft.direction, draft.directionSecondary]
        .filter(Boolean)
        .map((d) => DIRECTIONS.find((x) => x.id === d)?.label)
        .join(" / ") || "—",
    ],
    ["Steam", draft.steamId || "—"],
  ];

  return (
    <dl className="divide-y divide-[var(--border-subtle)]">
      {rows.map(([label, value]) => (
        <div key={label} className="flex gap-6 px-6 py-4">
          <dt className="w-32 shrink-0 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--text-dark)] uppercase">
            {label}
          </dt>
          <dd className="flex-1 font-[family-name:var(--font-label)] text-[14px] tracking-[0.08em] text-[var(--text-main)] uppercase">
            {value}
          </dd>
        </div>
      ))}
      <div className="flex items-center gap-3 px-6 py-4">
        <Check size={14} className="text-[var(--status-success)]" />
        <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--text-dark)] uppercase">
          Прототип — нічого не зберігається
        </span>
      </div>
    </dl>
  );
}
