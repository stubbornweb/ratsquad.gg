"use client";

/**
 * PROTOTYPE — THROWAWAY. Wayfinder ticket #15.
 *
 * Three variants of the registration + player profile flow, switchable via
 * `?variant=` on `/prototype/profile`. Not production code: no tests, no
 * persistence, no real auth. Delete this whole directory once a variant wins.
 *
 *   A — АНКЕТА             one long form, flat 14, ordinal selects for top-3
 *   B — БРИФІНГ            stepped wizard, grouped roles, drag-to-order top-3
 *   C — ОПЕРАТИВНА КАРТКА  one list, click-to-deepen, live SL-side preview
 *
 * The bar at the bottom also toggles the two cross-variant states the ticket
 * asks about: logged out / in, and a first-timer's empty profile vs a returning
 * member's filled one.
 */

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  PrototypeSwitcher,
  PrototypeToggle,
} from "@/components/PrototypeSwitcher";
import { EMPTY_DRAFT, FILLED_DRAFT, type ProfileDraft } from "./_data";
import "./prototype.css";
import { Login, SessionBar } from "./_Login";
import { VariantA } from "./_VariantA";
import { VariantB } from "./_VariantB";
import { VariantC } from "./_VariantC";

const VARIANTS = [
  { key: "A", name: "Анкета" },
  { key: "B", name: "Брифінг" },
  { key: "C", name: "Оперативна картка" },
];

const LOGIN_MODE = {
  A: "gate",
  B: "step",
  C: "modal",
} as const;

function Prototype() {
  const searchParams = useSearchParams();
  const raw = (searchParams.get("variant") ?? "A").toUpperCase();
  const variant = (VARIANTS.some((v) => v.key === raw) ? raw : "A") as "A" | "B" | "C";

  const [loggedIn, setLoggedIn] = useState(false);
  const [returning, setReturning] = useState(false);
  const [draft, setDraft] = useState<ProfileDraft>(EMPTY_DRAFT);

  const loadProfile = (isReturning: boolean) => {
    setReturning(isReturning);
    setDraft(isReturning ? FILLED_DRAFT : EMPTY_DRAFT);
  };

  const bar = (
    <PrototypeSwitcher variants={VARIANTS} current={variant}>
      <PrototypeToggle
        label={loggedIn ? "вийти" : "увійти"}
        active={loggedIn}
        onClick={() => setLoggedIn(!loggedIn)}
      />
      <PrototypeToggle
        label="новачок"
        active={!returning}
        onClick={() => loadProfile(false)}
      />
      <PrototypeToggle
        label="повертається"
        active={returning}
        onClick={() => loadProfile(true)}
      />
    </PrototypeSwitcher>
  );

  // C shows its card behind the login modal — that is the point of the modal.
  const showBody = loggedIn || variant === "C";

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)" }}>
      {loggedIn && <SessionBar onLogout={() => setLoggedIn(false)} />}

      {!loggedIn && (
        <Login mode={LOGIN_MODE[variant]} onLogin={() => setLoggedIn(true)} />
      )}

      {showBody && (
        <div aria-hidden={!loggedIn}>
          {variant === "A" && <VariantA draft={draft} setDraft={setDraft} />}
          {variant === "B" && <VariantB draft={draft} setDraft={setDraft} />}
          {variant === "C" && <VariantC draft={draft} setDraft={setDraft} />}
        </div>
      )}

      {bar}
    </main>
  );
}

export default function PrototypeProfilePage() {
  return (
    <Suspense>
      <Prototype />
    </Suspense>
  );
}
