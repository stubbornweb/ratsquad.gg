import { describe, expect, it } from "vitest";

import { readServerEnv } from "./env";

const complete = {
  APP_ENV: "production",
  DISCORD_BOT_TOKEN: "bot-token",
  DISCORD_CLIENT_ID: "1249800000000000000",
  DISCORD_CLIENT_SECRET: "client-secret",
  DISCORD_REDIRECT_URI: "http://localhost:3000/api/auth/callback",
  TURSO_DATABASE_URL: "libsql://rats-site.turso.io",
  TURSO_AUTH_TOKEN: "turso-token",
};

describe("readServerEnv", () => {
  it("returns the provisioned config when every variable is set", () => {
    const result = readServerEnv(complete);

    expect(result).toEqual({
      ok: true,
      config: {
        target: "production",
        discordBotToken: "bot-token",
        discordClientId: "1249800000000000000",
        discordClientSecret: "client-secret",
        discordRedirectUri: "http://localhost:3000/api/auth/callback",
        tursoDatabaseUrl: "libsql://rats-site.turso.io",
        tursoAuthToken: "turso-token",
      },
    });
  });

  it("reports every missing variable at once, not just the first", () => {
    const result = readServerEnv({
      APP_ENV: "production",
      DISCORD_BOT_TOKEN: "bot-token",
      TURSO_DATABASE_URL: "libsql://rats-site.turso.io",
    });

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.problems).toEqual([
      { key: "DISCORD_CLIENT_ID", reason: "missing" },
      { key: "DISCORD_CLIENT_SECRET", reason: "missing" },
      { key: "DISCORD_REDIRECT_URI", reason: "missing" },
      { key: "TURSO_AUTH_TOKEN", reason: "missing" },
    ]);
  });

  it("treats a blank value as missing", () => {
    const result = readServerEnv({ ...complete, TURSO_AUTH_TOKEN: "   " });

    expect(result.ok === false && result.problems).toEqual([
      { key: "TURSO_AUTH_TOKEN", reason: "missing" },
    ]);
  });

  it("rejects a credential exposed under a NEXT_PUBLIC_ name", () => {
    const result = readServerEnv({
      ...complete,
      NEXT_PUBLIC_DISCORD_CLIENT_SECRET: "client-secret",
    });

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.problems).toEqual([
      { key: "DISCORD_CLIENT_SECRET", reason: "exposed" },
    ]);
  });

  it("rejects the public alias even when the private one is absent", () => {
    const withoutToken = { ...complete, TURSO_AUTH_TOKEN: undefined };
    const result = readServerEnv({
      ...withoutToken,
      NEXT_PUBLIC_TURSO_AUTH_TOKEN: "turso-token",
    });

    expect(result.ok === false && result.problems).toEqual([
      { key: "TURSO_AUTH_TOKEN", reason: "exposed" },
    ]);
  });

  it("rejects a Turso URL pasted without a scheme", () => {
    const result = readServerEnv({
      ...complete,
      TURSO_DATABASE_URL: "rats-site-stubbornweb.turso.io",
    });

    expect(result.ok === false && result.problems).toEqual([
      { key: "TURSO_DATABASE_URL", reason: "invalid" },
    ]);
  });

  it.each(["libsql://rats.turso.io", "https://rats.turso.io", "file:./local.db"])(
    "accepts the Turso URL %s",
    (url) => {
      expect(readServerEnv({ ...complete, TURSO_DATABASE_URL: url }).ok).toBe(
        true,
      );
    },
  );

  it("rejects a redirect URI that is not absolute", () => {
    const result = readServerEnv({
      ...complete,
      DISCORD_REDIRECT_URI: "/api/auth/callback",
    });

    expect(result.ok === false && result.problems).toEqual([
      { key: "DISCORD_REDIRECT_URI", reason: "invalid" },
    ]);
  });

  it("accepts the production redirect URI", () => {
    const result = readServerEnv({
      ...complete,
      DISCORD_REDIRECT_URI: "https://ratsquad.gg/api/auth/callback",
    });

    expect(result.ok).toBe(true);
  });
});

/**
 * The one set of names means nothing tells these two sets of credentials apart
 * except the marker — so the marker is the whole safety rail, and it is
 * checked here rather than trusted.
 */
/** `complete` with the marker stripped — an environment that declares nothing. */
function unmarked(): Record<string, string> {
  const env = { ...complete } as Record<string, string>;
  delete env.APP_ENV;
  return env;
}

describe("the APP_ENV target marker", () => {
  it("reports the target the values belong to", () => {
    const result = readServerEnv({ ...complete, APP_ENV: "development" });

    expect(result.ok === true && result.config.target).toBe("development");
  });

  it("refuses an environment that declares no target at all", () => {
    const result = readServerEnv(unmarked());

    expect(result.ok === false && result.problems).toEqual([
      { key: "APP_ENV", reason: "missing" },
    ]);
  });

  it("refuses a target it does not recognise", () => {
    const result = readServerEnv({ ...complete, APP_ENV: "staging" });

    expect(result.ok === false && result.problems).toEqual([
      { key: "APP_ENV", reason: "invalid" },
    ]);
  });

  it("fails a caller that asked for development and got production", () => {
    const result = readServerEnv(complete, "development");

    expect(result.ok === false && result.problems).toEqual([
      { key: "APP_ENV", reason: "mismatch" },
    ]);
  });

  it("passes a caller whose expectation the environment matches", () => {
    const result = readServerEnv({ ...complete, APP_ENV: "development" }, "development");

    expect(result.ok).toBe(true);
  });

  // NODE_ENV and VERCEL_ENV both read "production" on a Vercel Preview, which
  // is exactly where guessing would point test traffic at the clan's real
  // data. Nothing here may fall back to either.
  it("does not infer the target from NODE_ENV", () => {
    const result = readServerEnv({ ...unmarked(), NODE_ENV: "production" });

    expect(result.ok === false && result.problems).toEqual([
      { key: "APP_ENV", reason: "missing" },
    ]);
  });
});
