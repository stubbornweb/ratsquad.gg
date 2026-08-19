/**
 * Server-side environment: the credentials provisioned in issue #14.
 *
 * Every value here is a secret. None of them may ever appear under a
 * `NEXT_PUBLIC_` name — that would inline the value into the client bundle.
 * Non-secret Discord IDs (guild, roles, channels) are not env vars at all;
 * they live in `src/consts/discord.ts`.
 *
 * **Two targets, one set of names.** The clan's real services and their
 * throwaway counterparts use the *same* variable names; what differs is where
 * the values come from:
 *
 * - locally, `.env.development` and `.env.production`, chosen per command
 * - on Vercel, the Preview and Production environment scopes
 *
 * Vercel never reads a repo `.env*` file, and a Preview build runs with
 * `NODE_ENV=production` — so neither the filename nor `NODE_ENV` can be
 * trusted to say which services this process is talking to. `APP_ENV` says it
 * explicitly instead: every source of values declares its own target, and a
 * caller that cares asserts the one it expects. A `.env.production` loaded by
 * `make db-migrate` fails the assertion rather than migrating the clan's real
 * database.
 */

export interface ServerEnv {
  /** Which services these credentials point at. Declared, never inferred. */
  target: EnvTarget;
  discordBotToken: string;
  discordClientId: string;
  discordClientSecret: string;
  discordRedirectUri: string;
  tursoDatabaseUrl: string;
  tursoAuthToken: string;
}

/** The real clan services, or their throwaway counterparts. */
export type EnvTarget = "development" | "production";

const TARGETS: readonly EnvTarget[] = ["development", "production"];

const KEYS = {
  DISCORD_BOT_TOKEN: "discordBotToken",
  DISCORD_CLIENT_ID: "discordClientId",
  DISCORD_CLIENT_SECRET: "discordClientSecret",
  DISCORD_REDIRECT_URI: "discordRedirectUri",
  TURSO_DATABASE_URL: "tursoDatabaseUrl",
  TURSO_AUTH_TOKEN: "tursoAuthToken",
} as const satisfies Record<string, keyof ServerEnv>;

/** The marker every source of values must carry. Not a secret. */
export const TARGET_KEY = "APP_ENV";

export type ServerEnvKey = keyof typeof KEYS | typeof TARGET_KEY;

export type EnvResult =
  | { ok: true; config: ServerEnv }
  | { ok: false; problems: EnvProblem[] };

export interface EnvProblem {
  key: ServerEnvKey;
  /**
   * `exposed`  — the value was found under a `NEXT_PUBLIC_` alias.
   * `mismatch` — `APP_ENV` names a target the caller did not ask for.
   */
  reason: "missing" | "exposed" | "invalid" | "mismatch";
}

/** Per-key shape checks, to catch the paste errors that look plausible. */
const SHAPE: Partial<Record<ServerEnvKey, (value: string) => boolean>> = {
  // libsql:// and https:// are Turso; file: is the self-hosted exit path.
  TURSO_DATABASE_URL: (v) => /^(libsql|https|file):/.test(v),
  // Discord matches redirect URIs exactly, so it must be absolute.
  DISCORD_REDIRECT_URI: (v) => /^https?:\/\/.+/.test(v),
};

/**
 * Read the six credentials, and the target they belong to.
 *
 * Pass `expected` from any caller that must not run against the wrong
 * services — the migration runner, the seeder. Omit it to accept whichever
 * target the environment declares, which is what the app itself does: it is
 * handed one set of values per deployment and has no second one to confuse
 * them with.
 */
export function readServerEnv(
  env: Partial<Record<string, string>>,
  expected?: EnvTarget,
): EnvResult {
  const problems: EnvProblem[] = [];
  const target = readTarget(env, expected, problems);

  const config = { target } as ServerEnv;

  for (const [key, field] of Object.entries(KEYS) as [
    keyof typeof KEYS,
    Exclude<keyof ServerEnv, "target">,
  ][]) {
    // A NEXT_PUBLIC_ alias is a leak whether or not the private name is also
    // set: Next.js inlines it into the client bundle at build time.
    if (env[`NEXT_PUBLIC_${key}`]?.trim()) {
      problems.push({ key, reason: "exposed" });
      continue;
    }

    const value = env[key]?.trim();
    if (!value) {
      problems.push({ key, reason: "missing" });
      continue;
    }

    if (SHAPE[key] && !SHAPE[key](value)) {
      problems.push({ key, reason: "invalid" });
      continue;
    }

    config[field] = value;
  }

  return problems.length > 0 ? { ok: false, problems } : { ok: true, config };
}

/**
 * Resolve the declared target, recording a problem rather than throwing.
 *
 * There is deliberately no fallback to `NODE_ENV` or `VERCEL_ENV`: both say
 * `production` on a Vercel Preview, which is the one case where guessing
 * would point test traffic at the clan's real data.
 */
function readTarget(
  env: Partial<Record<string, string>>,
  expected: EnvTarget | undefined,
  problems: EnvProblem[],
): EnvTarget {
  const declared = env[TARGET_KEY]?.trim();

  if (!declared) {
    problems.push({ key: TARGET_KEY, reason: "missing" });
    return expected ?? "production";
  }

  if (!TARGETS.includes(declared as EnvTarget)) {
    problems.push({ key: TARGET_KEY, reason: "invalid" });
    return expected ?? "production";
  }

  if (expected && declared !== expected) {
    problems.push({ key: TARGET_KEY, reason: "mismatch" });
  }

  return declared as EnvTarget;
}
