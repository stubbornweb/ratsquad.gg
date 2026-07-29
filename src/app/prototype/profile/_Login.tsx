"use client";

/**
 * PROTOTYPE — throwaway. Stubbed Discord login.
 *
 * NOT real OAuth. The real thing is blocked on #14 — the Discord application is
 * personally owned, so no redirect URI and no client secret exist yet. This
 * fakes the round trip with a 900ms delay so the *felt* cost of the step can be
 * judged; whether real Discord consent feels the same is still unanswered.
 *
 * Three presentations, one per variant, because where the login sits changes how
 * much friction it seems to add:
 *   gate   (A) — a wall before the form
 *   step   (B) — step zero of the wizard, framed as progress
 *   modal  (C) — an overlay on top of the thing you already want
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { MOCK_DISCORD_USER } from "./_data";
import { ease } from "@/hooks/useAnimations";

const DISCORD_MARK = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
    <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.036A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127c-.598.35-1.22.644-1.873.891a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.029 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03ZM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
  </svg>
);

export function Login({
  mode,
  onLogin,
}: {
  mode: "gate" | "step" | "modal";
  onLogin: () => void;
}) {
  const [pending, setPending] = useState(false);

  const start = () => {
    setPending(true);
    setTimeout(onLogin, 900);
  };

  const button = (
    <button
      type="button"
      onClick={start}
      disabled={pending}
      className="btn btn-primary btn-large"
      style={pending ? { opacity: 0.6 } : undefined}
    >
      {DISCORD_MARK}
      {pending ? "З'єднання…" : "Увійти через Discord"}
    </button>
  );

  const note = (
    <p className="pt-note" style={{ maxWidth: 380, lineHeight: 1.8 }}>
      Ми читаємо тільки твій нік і ролі на сервері RATS. Нічого не постимо.
    </p>
  );

  if (mode === "gate") {
    return (
      <div className="pt-gate">
        <p className="pt-eyebrow" style={{ marginBottom: 0 }}>
          Доступ до анкети
        </p>
        <h1 className="pt-display pt-title" style={{ marginBottom: 0 }}>
          Спершу — вхід
        </h1>
        <p className="pt-lede" style={{ marginBottom: 0, maxWidth: 440 }}>
          Профіль редагує тільки його власник. Тому потрібен Discord.
        </p>
        {button}
        {note}
      </div>
    );
  }

  if (mode === "step") {
    return (
      <div className="pt-page">
        <div className="pt-shell" style={{ maxWidth: 820 }}>
          <nav className="pt-rail">
            {["Вхід", "Ролі", "Топ-3", "Напрямок"].map((label, i) => (
              <div
                key={label}
                className="pt-rail-step"
                data-state={i === 0 ? "current" : "todo"}
              >
                <span className="pt-rail-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="pt-rail-label">{label}</span>
              </div>
            ))}
          </nav>

          <h2
            className="pt-display pt-title"
            style={{ fontSize: "clamp(30px, 4vw, 40px)" }}
          >
            Впізнай себе
          </h2>
          <p className="pt-lede" style={{ marginBottom: 40 }}>
            Один клік — і решту анкети ми прив&apos;яжемо до твого ніка в Discord.
          </p>
          {button}
          <div className="mt-6">{note}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-modal-backdrop">
      <motion.div
        className="pt-modal"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: ease.sharp }}
      >
        <p className="pt-note pt-note--accent">Потрібен вхід</p>
        <h2
          className="pt-display pt-title"
          style={{ fontSize: 30, marginBottom: 0 }}
        >
          Це твоя картка?
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
          Щоб редагувати — підтверди, що це ти.
        </p>
        {button}
        {note}
      </motion.div>
    </div>
  );
}

/** Logged-in strip — same in every variant, so login state is never ambiguous. */
export function SessionBar({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="pt-session">
      <div className="flex items-center gap-3">
        <span
          className="pt-session-avatar"
          style={{ background: MOCK_DISCORD_USER.colour }}
        >
          {MOCK_DISCORD_USER.callsign[0]}
        </span>
        <span
          style={{
            fontFamily: "var(--font-label), sans-serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {MOCK_DISCORD_USER.callsign}
        </span>
        <span className="pt-note pt-note--accent">{MOCK_DISCORD_USER.rank}</span>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="pt-note"
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
      >
        Вийти
      </button>
    </div>
  );
}
