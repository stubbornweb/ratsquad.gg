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
 *
 * The step rail carries the site's uplink motif (a scanline sweeping under the
 * active step, echoing .nav-scanline / .loading-progress). Numbering is earned:
 * a wizard genuinely is a sequence.
 */

import { useState } from "react";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import { ArrowLeft, ArrowRight, GripVertical } from "lucide-react";
import {
  DIRECTIONS,
  GROUP_LABELS,
  ROLES,
  ROLE_BY_ID,
  type ProfileDraft,
  type RoleGroup,
} from "./_data";
import { ease } from "@/hooks/useAnimations";

const GROUPS: RoleGroup[] = ["infantry", "vehicle", "other"];

const STEPS = ["Ролі", "Топ-3", "Напрямок", "Готово"];

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
    <div className="pt-page">
      <div className="pt-shell" style={{ maxWidth: 820 }}>
        <nav className="pt-rail">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              className="pt-rail-step"
              data-state={i === step ? "current" : i < step ? "done" : "todo"}
              onClick={() => setStep(i)}
            >
              <span className="pt-rail-index">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="pt-rail-label">{label}</span>
            </button>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.18, ease: ease.sharp }}
          >
            {step === 0 && (
              <Step
                title="Що ти можеш грати"
                sub="Познач усе, що витягнеш на прохання командира. Це не про бажання — це про здатність."
              >
                <div className="flex flex-col gap-10">
                  {GROUPS.map((group) => (
                    <div key={group}>
                      <p className="pt-group">{GROUP_LABELS[group]}</p>
                      <div className="flex flex-wrap gap-2">
                        {ROLES.filter((r) => r.group === group).map((role) => (
                          <button
                            key={role.id}
                            type="button"
                            className="pt-chip"
                            data-on={draft.can.includes(role.id)}
                            title={role.hint}
                            onClick={() => toggleCan(role.id)}
                          >
                            {role.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Step>
            )}

            {step === 1 && (
              <Step
                title="Твоя топ-3"
                sub="Обери до трьох з того, що позначив. Перетягни, щоб змінити порядок."
              >
                {draft.can.length === 0 ? (
                  <p className="pt-empty">
                    Перший крок порожній — повернись і познач ролі.
                  </p>
                ) : (
                  <>
                    <div className="mb-8 flex flex-wrap gap-2">
                      {draft.can.map((id) => {
                        const on = draft.top.includes(id);
                        return (
                          <button
                            key={id}
                            type="button"
                            className="pt-chip"
                            data-on={on}
                            disabled={draft.top.length >= 3 && !on}
                            onClick={() => toggleTop(id)}
                          >
                            {ROLE_BY_ID[id].label}
                          </button>
                        );
                      })}
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
                          className="pt-reorder-row"
                        >
                          <span className="pt-reorder-index">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="pt-reorder-name">
                            {ROLE_BY_ID[id].label}
                          </span>
                          <span className="pt-cell-hint">
                            {ROLE_BY_ID[id].hint}
                          </span>
                          <GripVertical
                            size={16}
                            style={{ color: "var(--text-dark)" }}
                          />
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  </>
                )}
              </Step>
            )}

            {step === 2 && (
              <Step
                title="Напрямок і Steam"
                sub="Де тобі природно на карті, і чим тебе зіставити зі статистикою матчу."
              >
                <div className="mb-10 flex flex-col gap-2">
                  {DIRECTIONS.map((d) => {
                    const primary = draft.direction === d.id;
                    const second = draft.directionSecondary === d.id;
                    return (
                      <div
                        key={d.id}
                        className="pt-dir-row"
                        data-on={primary || second}
                      >
                        <div className="flex-1">
                          <span
                            className="pt-dir-name"
                            style={
                              primary || second
                                ? { color: "var(--accent)" }
                                : undefined
                            }
                          >
                            {d.label}
                          </span>
                          <span className="pt-dir-hint">{d.hint}</span>
                        </div>
                        <button
                          type="button"
                          className="pt-chip pt-chip--sm"
                          data-on={primary}
                          onClick={() => setDraft({ ...draft, direction: d.id })}
                        >
                          Основний
                        </button>
                        <button
                          type="button"
                          className="pt-chip pt-chip--sm"
                          data-on={second}
                          disabled={primary}
                          onClick={() =>
                            setDraft({
                              ...draft,
                              directionSecondary: second ? null : d.id,
                            })
                          }
                        >
                          Другий
                        </button>
                      </div>
                    );
                  })}
                </div>

                <label className="pt-label" htmlFor="pt-steam">
                  Steam ID — 17 цифр
                </label>
                <input
                  id="pt-steam"
                  className="pt-input"
                  style={{ maxWidth: "none" }}
                  value={draft.steamId}
                  onChange={(e) => setDraft({ ...draft, steamId: e.target.value })}
                  placeholder="76561198000000000"
                  inputMode="numeric"
                />
              </Step>
            )}

            {step === 3 && (
              <Step
                title="Готово"
                sub="Ось що побачить командир. Правити можна будь-коли."
              >
                <Summary draft={draft} />
                <div className="mt-10 flex flex-wrap items-center gap-6">
                  <button type="button" className="btn btn-primary btn-large">
                    Зберегти
                  </button>
                  <span className="pt-note">Прототип — нічого не зберігається</span>
                </div>
              </Step>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="pt-stepnav">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
          >
            <ArrowLeft size={14} /> Назад
          </button>
          <button
            type="button"
            className="is-forward"
            disabled={step === STEPS.length - 1}
            onClick={() => setStep(step + 1)}
          >
            Далі <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Step({
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
      <h2 className="pt-display pt-title" style={{ fontSize: "clamp(30px, 4vw, 40px)" }}>
        {title}
      </h2>
      <p className="pt-lede" style={{ marginBottom: 40 }}>
        {sub}
      </p>
      {children}
    </div>
  );
}

function Summary({ draft }: { draft: ProfileDraft }) {
  const rows: [string, string][] = [
    [
      "Топ-3",
      draft.top.length
        ? draft.top.map((id, i) => `${i + 1}. ${ROLE_BY_ID[id].label}`).join("   ")
        : "—",
    ],
    [
      "Може грати",
      draft.can.length ? draft.can.map((id) => ROLE_BY_ID[id].label).join(", ") : "—",
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
    <div className="pt-summary">
      {rows.map(([key, value]) => (
        <div key={key} className="pt-summary-row">
          <span className="pt-summary-key">{key}</span>
          <span className="pt-summary-val">{value}</span>
        </div>
      ))}
    </div>
  );
}
