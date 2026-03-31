"use client"

import { type JSX } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): JSX.Element {
  // Error digest contains Next.js error hash for debugging
  // In production, errors should be logged to a service (e.g., Sentry)
  void error;
  return (
    <html lang="uk">
      <body
        style={{
          backgroundColor: "#09090B",
          color: "#FAFAFA",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          margin: 0,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 480, padding: 24 }}>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              color: "#FFD700",
              letterSpacing: "0.2em",
              marginBottom: 16,
            }}
          >
            ПОМИЛКА // RATS КОМАНДНИЙ ТЕРМІНАЛ
          </div>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            ЗБІЙ СИСТЕМИ
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "#A1A1AA",
              marginBottom: 32,
              lineHeight: 1.6,
            }}
          >
            Щось пішло не так. Місію неможливо продовжити.
          </p>
          <button
            onClick={reset}
            style={{
              backgroundColor: "#FFD700",
              color: "#09090B",
              border: "none",
              padding: "12px 32px",
              fontFamily: "inherit",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.1em",
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            ПОВТОРИТИ ОПЕРАЦІЮ
          </button>
        </div>
      </body>
    </html>
  );
}
