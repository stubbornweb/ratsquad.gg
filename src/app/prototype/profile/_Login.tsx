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
    <p className="max-w-[380px] font-[family-name:var(--font-mono)] text-[11px] leading-relaxed tracking-wider text-[var(--text-dark)] uppercase">
      Ми читаємо тільки твій нік і ролі на сервері RATS. Нічого не постимо.
    </p>
  );

  if (mode === "gate") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
        <p className="flex items-center gap-4 font-[family-name:var(--font-label)] text-[11px] tracking-[0.25em] text-[var(--accent)] uppercase">
          <span className="inline-block h-0.5 w-8 bg-[var(--accent)]" />
          Доступ до анкети
          <span className="inline-block h-0.5 w-8 bg-[var(--accent)]" />
        </p>
        <h1 className="font-[family-name:var(--font-heading)] text-5xl tracking-[0.06em] uppercase">
          Спершу — вхід
        </h1>
        <p className="max-w-[440px] text-[15px] text-[var(--text-muted)]">
          Профіль редагує тільки його власник. Тому потрібен Discord.
        </p>
        {button}
        {note}
      </div>
    );
  }

  if (mode === "step") {
    return (
      <div className="mx-auto max-w-[820px] px-6 pt-28 pb-40">
        <div className="mb-14 flex items-stretch gap-px bg-[var(--border-subtle)]">
          {["Вхід", "Ролі", "Топ-3", "Напрямок"].map((label, i) => (
            <div
              key={label}
              className={`flex-1 px-3 py-4 ${
                i === 0 ? "bg-[var(--accent-subtle)]" : "bg-[var(--bg-alt)]"
              }`}
            >
              <span
                className={`block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.25em] ${
                  i === 0 ? "text-[var(--accent)]" : "text-[var(--text-dark)]"
                }`}
              >
                {String(i).padStart(2, "0")}
              </span>
              <span
                className={`mt-1 block font-[family-name:var(--font-label)] text-[12px] font-bold tracking-[0.14em] uppercase ${
                  i === 0 ? "text-[var(--text-main)]" : "text-[var(--text-dark)]"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
        <h2 className="mb-2 font-[family-name:var(--font-heading)] text-4xl tracking-[0.08em] uppercase">
          Впізнай себе
        </h2>
        <p className="mb-10 max-w-[560px] text-[15px] text-[var(--text-muted)]">
          Один клік — і решту анкети ми прив&apos;яжемо до твого ніка в Discord.
        </p>
        {button}
        <div className="mt-6">{note}</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-[rgba(9,9,11,0.92)] px-6 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
        className="flex w-full max-w-[440px] flex-col items-start gap-6 border border-[var(--border-subtle)] bg-[var(--bg-alt)] p-10"
      >
        <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] text-[var(--accent)] uppercase">
          Потрібен вхід
        </p>
        <h2 className="font-[family-name:var(--font-heading)] text-3xl tracking-[0.06em] uppercase">
          Це твоя картка?
        </h2>
        <p className="text-[14px] text-[var(--text-muted)]">
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
    <div className="fixed top-0 right-0 left-0 z-[300] flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-footer)] px-6 py-3">
      <div className="flex items-center gap-3">
        <span
          className="flex h-7 w-7 items-center justify-center font-[family-name:var(--font-mono)] text-[11px] font-bold text-white"
          style={{ background: MOCK_DISCORD_USER.colour }}
        >
          {MOCK_DISCORD_USER.callsign[0]}
        </span>
        <span className="font-[family-name:var(--font-label)] text-[13px] font-bold tracking-[0.12em] uppercase">
          {MOCK_DISCORD_USER.callsign}
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--accent)] uppercase">
          {MOCK_DISCORD_USER.rank}
        </span>
      </div>
      <button
        onClick={onLogout}
        className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--text-dark)] uppercase transition-colors duration-150 hover:text-[var(--text-main)]"
      >
        Вийти
      </button>
    </div>
  );
}
