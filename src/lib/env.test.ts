import { describe, expect, it } from "vitest";

import { readServerEnv, resolveTarget } from "./env";

const complete = {
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

const completeDev = {
  DISCORD_DEV_BOT_TOKEN: "dev-bot-token",
  DISCORD_DEV_CLIENT_ID: "1539396258769412196",
  DISCORD_DEV_CLIENT_SECRET: "dev-client-secret",
  DISCORD_DEV_REDIRECT_URI: "http://localhost:3000/api/auth/callback",
  TURSO_DEV_DATABASE_URL: "libsql://rats-site-dev.turso.io",
  TURSO_DEV_AUTH_TOKEN: "dev-turso-token",
};

describe("the development target", () => {
  it("reads only the _DEV_ names", () => {
    const result = readServerEnv(completeDev, "development");

    expect(result).toEqual({
      ok: true,
      config: {
        discordBotToken: "dev-bot-token",
        discordClientId: "1539396258769412196",
        discordClientSecret: "dev-client-secret",
        discordRedirectUri: "http://localhost:3000/api/auth/callback",
        tursoDatabaseUrl: "libsql://rats-site-dev.turso.io",
        tursoAuthToken: "dev-turso-token",
      },
    });
  });

  it("never falls back to a production credential", () => {
    // The whole point of the split: a half-configured dev setup must fail
    // loudly rather than quietly writing to the clan's real database.
    const result = readServerEnv(
      { ...completeDev, TURSO_DEV_DATABASE_URL: undefined, ...complete },
      "development",
    );

    expect(result.ok === false && result.problems).toEqual([
      { key: "TURSO_DEV_DATABASE_URL", reason: "missing" },
    ]);
  });

  it("names the _DEV_ variable in the problem, so the fix is unambiguous", () => {
    const result = readServerEnv({}, "development");

    expect(result.ok === false && result.problems.map((p) => p.key)).toEqual([
      "DISCORD_DEV_BOT_TOKEN",
      "DISCORD_DEV_CLIENT_ID",
      "DISCORD_DEV_CLIENT_SECRET",
      "DISCORD_DEV_REDIRECT_URI",
      "TURSO_DEV_DATABASE_URL",
      "TURSO_DEV_AUTH_TOKEN",
    ]);
  });
});

describe("resolveTarget", () => {
  it("treats a Vercel preview as development", () => {
    // A preview branch is where the registration flow gets tested with
    // invented profiles; those must not land in the clan's real database.
    expect(resolveTarget({ VERCEL_ENV: "preview" })).toBe("development");
  });

  it("treats a Vercel production deployment as production", () => {
    expect(resolveTarget({ VERCEL_ENV: "production" })).toBe("production");
  });

  it("follows NODE_ENV when Vercel is not the host", () => {
    expect(resolveTarget({ NODE_ENV: "development" })).toBe("development");
  });

  it("defaults to production, so scripts check the real services", () => {
    expect(resolveTarget({})).toBe("production");
    expect(resolveTarget({ NODE_ENV: "test" })).toBe("production");
  });

  it("lets APP_ENV override the host's own signal", () => {
    expect(resolveTarget({ APP_ENV: "development", VERCEL_ENV: "production" })).toBe(
      "development",
    );
  });
});
