/**
 * Server-side environment: the credentials provisioned in issue #14.
 *
 * Every value here is a secret and lives only in `.env.local` (local) or
 * Vercel Environment Variables (preview, production). None of them may ever
 * appear under a `NEXT_PUBLIC_` name — that would inline the value into the
 * client bundle. Non-secret Discord IDs (guild, roles, channels) are not env
 * vars at all; they live in `src/consts/discord.ts`.
 */

export interface ServerEnv {
  discordBotToken: string;
  discordClientId: string;
  discordClientSecret: string;
  discordRedirectUri: string;
  tursoDatabaseUrl: string;
  tursoAuthToken: string;
}

const KEYS = {
  DISCORD_BOT_TOKEN: "discordBotToken",
  DISCORD_CLIENT_ID: "discordClientId",
  DISCORD_CLIENT_SECRET: "discordClientSecret",
  DISCORD_REDIRECT_URI: "discordRedirectUri",
  TURSO_DATABASE_URL: "tursoDatabaseUrl",
  TURSO_AUTH_TOKEN: "tursoAuthToken",
} as const satisfies Record<string, keyof ServerEnv>;

export type ServerEnvKey = keyof typeof KEYS;

export type EnvResult =
  | { ok: true; config: ServerEnv }
  | { ok: false; problems: EnvProblem[] };

export interface EnvProblem {
  key: ServerEnvKey;
  /** `exposed` — the value was found under a `NEXT_PUBLIC_` alias. */
  reason: "missing" | "exposed" | "invalid";
}

/** Per-key shape checks, to catch the paste errors that look plausible. */
const SHAPE: Partial<Record<ServerEnvKey, (value: string) => boolean>> = {
  // libsql:// and https:// are Turso; file: is the self-hosted exit path.
  TURSO_DATABASE_URL: (v) => /^(libsql|https|file):/.test(v),
  // Discord matches redirect URIs exactly, so it must be absolute.
  DISCORD_REDIRECT_URI: (v) => /^https?:\/\/.+/.test(v),
};

export function readServerEnv(
  env: Partial<Record<string, string>>,
): EnvResult {
  const config = {} as ServerEnv;
  const problems: EnvProblem[] = [];

  for (const [key, field] of Object.entries(KEYS) as [
    ServerEnvKey,
    keyof ServerEnv,
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
