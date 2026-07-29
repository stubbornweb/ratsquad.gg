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
 * Signature: the rows are styled as a kit manifest — dense, mono, stamped —
 * and beside them sits the real `.roster-card` from the live site, so you read
 * the output while editing the input. The only variant that shows both.
 */

import { motion } from "framer-motion";
import {
  DIRECTIONS,
  MOCK_DISCORD_USER,
  ROLES,
  ROLE_BY_ID,
  type ProfileDraft,
} from "./_data";
import { ease } from "@/hooks/useAnimations";

type Props = {
  draft: ProfileDraft;
  setDraft: (next: ProfileDraft) => void;
};

export function VariantC({ draft, setDraft }: Props) {
  /** ні → можу → топ → ні. Holds at «можу» when the top-3 is full. */
  const cycle = (id: string) => {
    const topIndex = draft.top.indexOf(id);

    if (topIndex !== -1) {
      setDraft({
        ...draft,
        can: draft.can.filter((r) => r !== id),
        top: draft.top.filter((r) => r !== id),
      });
      return;
    }
    if (draft.can.includes(id)) {
      if (draft.top.length >= 3) return; // the cap is called out in the row
      setDraft({ ...draft, top: [...draft.top, id] });
      return;
    }
    setDraft({ ...draft, can: [...draft.can, id] });
  };

  const spare = draft.can.filter((id) => !draft.top.includes(id));
  const topFull = draft.top.length >= 3;

  return (
    <div className="pt-page">
      <div className="pt-shell pt-shell--wide grid gap-16 lg:grid-cols-[1fr_340px]">
        {/* ── The one list ── */}
        <div>
          <p className="pt-eyebrow">Оперативна картка</p>
          <h1 className="pt-display pt-title">Що ти вмієш</h1>
          <p className="pt-lede" style={{ marginBottom: 40 }}>
            Клікни роль один раз — <b style={{ color: "var(--text-main)" }}>можу грати</b>.
            Клікни ще раз — <b style={{ color: "var(--accent)" }}>у топ-3</b>. Ще
            раз — знімає.
          </p>

          <div className="pt-manifest">
            {ROLES.map((role) => {
              const topIndex = draft.top.indexOf(role.id);
              const inTop = topIndex !== -1;
              const inCan = draft.can.includes(role.id);
              const capped = inCan && !inTop && topFull;

              return (
                <button
                  key={role.id}
                  type="button"
                  className="pt-manifest-row"
                  data-state={inTop ? "top" : inCan ? "can" : "off"}
                  onClick={() => cycle(role.id)}
                >
                  <span className="pt-stamp">{inTop ? topIndex + 1 : ""}</span>
                  <span className="pt-manifest-name">{role.label}</span>
                  <span className="pt-manifest-hint">{role.hint}</span>
                  <span
                    className="pt-manifest-state"
                    style={
                      inTop
                        ? { color: "var(--accent)" }
                        : capped
                          ? { color: "var(--status-danger)" }
                          : inCan
                            ? { color: "var(--text-muted)" }
                            : undefined
                    }
                  >
                    {inTop
                      ? `топ-${topIndex + 1}`
                      : capped
                        ? "топ-3 заповнено"
                        : inCan
                          ? "можу"
                          : "клікни"}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="pt-note mt-4">
            Можу: {draft.can.length} · Топ-3: {draft.top.length} / 3
          </p>

          {/* Напрямок + Steam — supporting, not the point of this variant */}
          <div className="pt-block" style={{ marginTop: 56, marginBottom: 0 }}>
            <p className="pt-label" style={{ color: "var(--accent)" }}>
              Напрямок
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              {DIRECTIONS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className="pt-chip"
                  data-on={draft.direction === d.id}
                  title={d.hint}
                  onClick={() => setDraft({ ...draft, direction: d.id })}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="pt-note">також можу</span>
              {DIRECTIONS.filter((d) => d.id !== draft.direction).map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className="pt-chip pt-chip--sm"
                  data-on={draft.directionSecondary === d.id}
                  onClick={() =>
                    setDraft({
                      ...draft,
                      directionSecondary:
                        draft.directionSecondary === d.id ? null : d.id,
                    })
                  }
                >
                  {d.label}
                </button>
              ))}
            </div>

            <p className="pt-label" style={{ color: "var(--accent)", marginTop: 40 }}>
              Steam ID
            </p>
            <input
              className="pt-input"
              value={draft.steamId}
              onChange={(e) => setDraft({ ...draft, steamId: e.target.value })}
              placeholder="76561198000000000"
              inputMode="numeric"
            />
          </div>
        </div>

        {/* ── Live preview: the real roster card ── */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="pt-label">Так тебе бачить командир</p>

          <motion.div
            layout
            className="roster-card"
            transition={{ duration: 0.18, ease: ease.sharp }}
          >
            <p className="role-tag">{MOCK_DISCORD_USER.rank}</p>
            <p className="member-name">{MOCK_DISCORD_USER.callsign}</p>

            <div className="pt-preview-block">
              <p className="pt-preview-key">топ-3</p>
              {draft.top.length === 0 ? (
                <p className="pt-preview-val">не заповнено</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {draft.top.map((id, i) => (
                    <div key={id} className="pt-preview-line">
                      <span className="pt-stamp pt-stamp--filled">{i + 1}</span>
                      <span>{ROLE_BY_ID[id].label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-preview-block">
              <p className="pt-preview-key">також може</p>
              <p className="pt-preview-val">
                {spare.length
                  ? spare.map((id) => ROLE_BY_ID[id].label).join(" · ")
                  : "—"}
              </p>
            </div>

            <div className="pt-preview-block">
              <p className="pt-preview-key">напрямок</p>
              <p className="pt-preview-val">
                {DIRECTIONS.find((d) => d.id === draft.direction)?.label ?? "—"}
                {draft.directionSecondary &&
                  ` / ${DIRECTIONS.find((d) => d.id === draft.directionSecondary)?.label}`}
              </p>
            </div>
          </motion.div>

          <button type="button" className="btn btn-primary mt-8 w-full">
            Зберегти
          </button>
          <p className="pt-note mt-4 text-center">
            Прототип — нічого не зберігається
          </p>
        </aside>
      </div>
    </div>
  );
}
