"use client";

/**
 * PROTOTYPE — throwaway. Variant C: «ОПЕРАТИВНА КАРТКА».
 *
 * Deliberately refuses to ask two questions. One flat list of 14, and each row
 * cycles through three states with repeated clicks:
 *
 *   —  ні  →  МОЖУ  →  ТОП-N (ordinal stamped)  →  ні
 *
 * So «можу» and «топ-3» are one gesture at different depths. If this reads
 * cleanly, the two questions were one question. If people can't find the top-3,
 * they weren't.
 *
 * Beside it, a live preview of the card an SL actually reads on scrim night —
 * the only variant that shows the output, not just the input.
 */

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import {
  DIRECTIONS,
  MOCK_DISCORD_USER,
  ROLES,
  ROLE_BY_ID,
  type ProfileDraft,
} from "./_data";

type Props = {
  draft: ProfileDraft;
  setDraft: (next: ProfileDraft) => void;
};

export function VariantC({ draft, setDraft }: Props) {
  /** ні → можу → топ → ні. Falls back to «можу» when the top-3 is full. */
  const cycle = (id: string) => {
    const inCan = draft.can.includes(id);
    const topIndex = draft.top.indexOf(id);

    if (topIndex !== -1) {
      setDraft({
        ...draft,
        can: draft.can.filter((r) => r !== id),
        top: draft.top.filter((r) => r !== id),
      });
      return;
    }
    if (inCan) {
      if (draft.top.length >= 3) return; // stay at «можу»; the cap is visible below
      setDraft({ ...draft, top: [...draft.top, id] });
      return;
    }
    setDraft({ ...draft, can: [...draft.can, id] });
  };

  const topFull = draft.top.length >= 3;

  return (
    <div className="mx-auto grid max-w-[1200px] gap-16 px-6 pt-28 pb-40 lg:grid-cols-[1fr_360px]">
      {/* ── Left: the one list ── */}
      <div>
        <h1 className="mb-3 font-[family-name:var(--font-heading)] text-4xl tracking-[0.06em] uppercase">
          Оперативна картка
        </h1>
        <p className="mb-10 max-w-[560px] text-[15px] text-[var(--text-muted)]">
          Клікни роль один раз — <b className="text-[var(--text-main)]">можу грати</b>.
          Клікни ще раз — <b className="text-[var(--accent)]">у топ-3</b>. Ще раз —
          знімає.
        </p>

        <div className="flex flex-col">
          {ROLES.map((role) => {
            const topIndex = draft.top.indexOf(role.id);
            const inTop = topIndex !== -1;
            const inCan = draft.can.includes(role.id);
            const capped = inCan && !inTop && topFull;

            return (
              <button
                key={role.id}
                onClick={() => cycle(role.id)}
                className={`group flex items-center gap-5 border-b border-[var(--border-subtle)] px-4 py-3.5 text-left transition-colors duration-150 ${
                  inTop
                    ? "bg-[var(--accent-subtle)]"
                    : inCan
                      ? "bg-[var(--bg-alt)]"
                      : "hover:bg-[var(--bg-alt)]"
                }`}
              >
                {/* State stamp */}
                <span className="flex w-10 shrink-0 justify-center">
                  {inTop ? (
                    <span className="flex h-6 w-6 items-center justify-center bg-[var(--accent)] font-[family-name:var(--font-mono)] text-[11px] font-bold text-[var(--bg-main)]">
                      {topIndex + 1}
                    </span>
                  ) : inCan ? (
                    <span className="h-6 w-6 border border-[var(--accent-dim)]" />
                  ) : (
                    <span className="h-6 w-6 border border-[var(--border-subtle)] transition-colors duration-150 group-hover:border-[var(--text-dark)]" />
                  )}
                </span>

                <span
                  className={`w-40 shrink-0 font-[family-name:var(--font-label)] text-[14px] font-bold tracking-[0.12em] uppercase transition-colors duration-150 ${
                    inTop
                      ? "text-[var(--accent)]"
                      : inCan
                        ? "text-[var(--text-main)]"
                        : "text-[var(--text-dark)]"
                  }`}
                >
                  {role.label}
                </span>

                <span className="flex-1 font-[family-name:var(--font-mono)] text-[11px] tracking-wider text-[var(--text-dark)] uppercase">
                  {role.hint}
                </span>

                <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] uppercase">
                  {inTop ? (
                    <span className="text-[var(--accent)]">топ-{topIndex + 1}</span>
                  ) : inCan ? (
                    <span className={capped ? "text-[var(--status-danger)]" : "text-[var(--text-muted)]"}>
                      {capped ? "топ-3 заповнено" : "можу"}
                    </span>
                  ) : (
                    <span className="text-transparent group-hover:text-[var(--text-dark)]">
                      клікни
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-4 font-[family-name:var(--font-mono)] text-[11px] tracking-widest text-[var(--text-dark)] uppercase">
          Можу: {draft.can.length} · Топ-3: {draft.top.length} / 3
        </p>

        {/* Напрямок + Steam, compact — not the point of this variant */}
        <div className="mt-14 border-t border-[var(--border-subtle)] pt-8">
          <p className="mb-4 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[var(--accent)] uppercase">
            Напрямок
          </p>
          <div className="mb-3 flex flex-wrap gap-2">
            {DIRECTIONS.map((d) => (
              <button
                key={d.id}
                onClick={() => setDraft({ ...draft, direction: d.id })}
                title={d.hint}
                className={`border px-4 py-2 font-[family-name:var(--font-label)] text-[12px] font-bold tracking-[0.14em] uppercase transition-colors duration-150 ${
                  draft.direction === d.id
                    ? "border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)]"
                    : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--text-dark)]"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--text-dark)] uppercase">
              також можу
            </span>
            {DIRECTIONS.filter((d) => d.id !== draft.direction).map((d) => (
              <button
                key={d.id}
                onClick={() =>
                  setDraft({
                    ...draft,
                    directionSecondary:
                      draft.directionSecondary === d.id ? null : d.id,
                  })
                }
                className={`border px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] uppercase transition-colors duration-150 ${
                  draft.directionSecondary === d.id
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-[var(--border-subtle)] text-[var(--text-dark)] hover:border-[var(--text-dark)]"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <p className="mt-10 mb-3 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[var(--accent)] uppercase">
            Steam ID
          </p>
          <input
            value={draft.steamId}
            onChange={(e) => setDraft({ ...draft, steamId: e.target.value })}
            placeholder="76561198000000000"
            inputMode="numeric"
            className="w-full max-w-[420px] rounded-none border border-[var(--border-color)] bg-[var(--bg-alt)] px-5 py-3.5 font-[family-name:var(--font-mono)] text-[14px] tracking-wider text-[var(--text-main)] transition-colors duration-150 outline-none placeholder:text-[var(--text-dark)] focus:border-[var(--accent)]"
          />
        </div>
      </div>

      {/* ── Right: live preview of what the SL reads ── */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <p className="mb-4 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[var(--text-dark)] uppercase">
          Так тебе бачить командир
        </p>

        <motion.div
          layout
          className="roster-card"
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
        >
          <p className="role-tag">{MOCK_DISCORD_USER.rank}</p>
          <p className="member-name">{MOCK_DISCORD_USER.callsign}</p>

          <div className="mt-6 flex flex-col gap-1.5">
            {draft.top.length === 0 ? (
              <p className="text-[13px] text-[var(--text-dark)]">
                Топ-3 не заповнено
              </p>
            ) : (
              draft.top.map((id, i) => (
                <div key={id} className="flex items-center gap-3">
                  <Star size={12} className="shrink-0 text-[var(--accent)]" />
                  <span className="font-[family-name:var(--font-label)] text-[14px] font-bold tracking-[0.1em] uppercase">
                    {ROLE_BY_ID[id].label}
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-dark)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 border-t border-[var(--border-subtle)] pt-4">
            <p className="mb-2 font-[family-name:var(--font-mono)] text-[9px] tracking-[0.25em] text-[var(--text-dark)] uppercase">
              також може
            </p>
            <p className="font-[family-name:var(--font-mono)] text-[11px] leading-relaxed tracking-wider text-[var(--text-muted)] uppercase">
              {draft.can.filter((id) => !draft.top.includes(id)).length
                ? draft.can
                    .filter((id) => !draft.top.includes(id))
                    .map((id) => ROLE_BY_ID[id].label)
                    .join(" · ")
                : "—"}
            </p>
          </div>

          <div className="mt-4 flex gap-6 border-t border-[var(--border-subtle)] pt-4">
            <div>
              <p className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.25em] text-[var(--text-dark)] uppercase">
                напрямок
              </p>
              <p className="font-[family-name:var(--font-label)] text-[13px] font-bold tracking-[0.1em] text-[var(--text-main)] uppercase">
                {DIRECTIONS.find((d) => d.id === draft.direction)?.label ?? "—"}
                {draft.directionSecondary && (
                  <span className="text-[var(--text-dark)]">
                    {" / "}
                    {DIRECTIONS.find((d) => d.id === draft.directionSecondary)?.label}
                  </span>
                )}
              </p>
            </div>
          </div>
        </motion.div>

        <button className="btn btn-primary mt-8 w-full">Зберегти</button>
        <p className="mt-4 text-center font-[family-name:var(--font-mono)] text-[10px] tracking-widest text-[var(--text-dark)] uppercase">
          Прототип — нічого не зберігається
        </p>
      </aside>
    </div>
  );
}
