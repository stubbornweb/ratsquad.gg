import { describe, expect, it } from "vitest";

import {
  PERMISSION,
  auditBotChannelGrant,
  can,
  resolveChannelPermissions,
} from "./discord-permissions";

const GUILD_ID = "1139847863950639185";
const BOT_USER_ID = "900000000000000001";
const EVERYONE_ROLE = GUILD_ID; // Discord gives @everyone the guild's own ID
const BOT_ROLE = "800000000000000001";

describe("resolveChannelPermissions", () => {
  it("denies Send Messages when the channel's @everyone overwrite denies it", () => {
    const permissions = resolveChannelPermissions({
      guildId: GUILD_ID,
      userId: BOT_USER_ID,
      roleIds: [BOT_ROLE],
      basePermissions: PERMISSION.VIEW_CHANNEL | PERMISSION.SEND_MESSAGES,
      overwrites: [
        {
          id: EVERYONE_ROLE,
          type: 0,
          allow: "0",
          deny: String(PERMISSION.SEND_MESSAGES),
        },
      ],
    });

    expect(can(permissions, PERMISSION.VIEW_CHANNEL)).toBe(true);
    expect(can(permissions, PERMISSION.SEND_MESSAGES)).toBe(false);
  });

  it("lets a role overwrite re-allow what @everyone denied", () => {
    const permissions = resolveChannelPermissions({
      guildId: GUILD_ID,
      userId: BOT_USER_ID,
      roleIds: [BOT_ROLE],
      basePermissions: PERMISSION.VIEW_CHANNEL,
      overwrites: [
        {
          id: EVERYONE_ROLE,
          type: 0,
          allow: "0",
          deny: String(PERMISSION.SEND_MESSAGES),
        },
        {
          id: BOT_ROLE,
          type: 0,
          allow: String(PERMISSION.SEND_MESSAGES | PERMISSION.MANAGE_MESSAGES),
          deny: "0",
        },
      ],
    });

    expect(can(permissions, PERMISSION.SEND_MESSAGES)).toBe(true);
    expect(can(permissions, PERMISSION.MANAGE_MESSAGES)).toBe(true);
  });

  it("ignores overwrites for roles the bot does not hold", () => {
    const permissions = resolveChannelPermissions({
      guildId: GUILD_ID,
      userId: BOT_USER_ID,
      roleIds: [BOT_ROLE],
      basePermissions: PERMISSION.VIEW_CHANNEL,
      overwrites: [
        {
          id: "700000000000000009",
          type: 0,
          allow: String(PERMISSION.SEND_MESSAGES),
          deny: "0",
        },
      ],
    });

    expect(can(permissions, PERMISSION.SEND_MESSAGES)).toBe(false);
  });

  it("applies a member overwrite last, overriding the bot's roles", () => {
    const permissions = resolveChannelPermissions({
      guildId: GUILD_ID,
      userId: BOT_USER_ID,
      roleIds: [BOT_ROLE],
      basePermissions: PERMISSION.VIEW_CHANNEL,
      overwrites: [
        {
          id: BOT_ROLE,
          type: 0,
          allow: String(PERMISSION.SEND_MESSAGES),
          deny: "0",
        },
        {
          id: BOT_USER_ID,
          type: 1,
          allow: "0",
          deny: String(PERMISSION.SEND_MESSAGES),
        },
      ],
    });

    expect(can(permissions, PERMISSION.SEND_MESSAGES)).toBe(false);
  });

  it("grants everything to an administrator regardless of overwrites", () => {
    const permissions = resolveChannelPermissions({
      guildId: GUILD_ID,
      userId: BOT_USER_ID,
      roleIds: [BOT_ROLE],
      basePermissions: PERMISSION.ADMINISTRATOR,
      overwrites: [
        {
          id: EVERYONE_ROLE,
          type: 0,
          allow: "0",
          deny: String(PERMISSION.SEND_MESSAGES),
        },
      ],
    });

    expect(can(permissions, PERMISSION.SEND_MESSAGES)).toBe(true);
    expect(can(permissions, PERMISSION.MANAGE_MESSAGES)).toBe(true);
  });
});

describe("auditBotChannelGrant", () => {
  const EVENT_A = "600000000000000001";
  const EVENT_B = "600000000000000003";
  const APPLICATIONS = "600000000000000002";

  const allowIn = (channelId: string, permissions: bigint) => ({
    id: channelId,
    name: `channel-${channelId}`,
    permission_overwrites: [
      {
        id: BOT_ROLE,
        type: 0 as const,
        allow: String(permissions),
        deny: "0",
      },
    ],
  });

  const readOnly = (channelId: string) => ({
    id: channelId,
    name: `channel-${channelId}`,
    permission_overwrites: [],
  });

  const WRITE = PERMISSION.SEND_MESSAGES | PERMISSION.MANAGE_MESSAGES;

  const context = {
    guildId: GUILD_ID,
    userId: BOT_USER_ID,
    roleIds: [BOT_ROLE],
    // Read-only guild-wide: the bot sees channels but may not post in them.
    basePermissions: PERMISSION.VIEW_CHANNEL,
  };

  it("passes when the bot can write in every event channel and nowhere else", () => {
    const audit = auditBotChannelGrant({
      ...context,
      eventChannelIds: [EVENT_A, EVENT_B],
      channels: [
        allowIn(EVENT_A, WRITE),
        allowIn(EVENT_B, WRITE),
        readOnly(APPLICATIONS),
      ],
    });

    expect(audit.ok).toBe(true);
    expect(audit.eventChannels).toEqual([
      { id: EVENT_A, name: `channel-${EVENT_A}`, canSend: true, canManage: true },
      { id: EVENT_B, name: `channel-${EVENT_B}`, canSend: true, canManage: true },
    ]);
    expect(audit.overreach).toEqual([]);
  });

  it("fails when only some event channels carry the grant", () => {
    const audit = auditBotChannelGrant({
      ...context,
      eventChannelIds: [EVENT_A, EVENT_B],
      channels: [allowIn(EVENT_A, WRITE), readOnly(EVENT_B)],
    });

    expect(audit.ok).toBe(false);
    expect(audit.eventChannels[1]).toMatchObject({
      id: EVENT_B,
      canSend: false,
      canManage: false,
    });
  });

  it("fails when an event channel is missing Manage Messages", () => {
    const audit = auditBotChannelGrant({
      ...context,
      eventChannelIds: [EVENT_A],
      channels: [allowIn(EVENT_A, PERMISSION.SEND_MESSAGES)],
    });

    expect(audit.ok).toBe(false);
    expect(audit.eventChannels[0]).toMatchObject({
      canSend: true,
      canManage: false,
    });
  });

  it("reports write access in a non-event channel as overreach", () => {
    const audit = auditBotChannelGrant({
      ...context,
      eventChannelIds: [EVENT_A],
      channels: [
        allowIn(EVENT_A, WRITE),
        allowIn(APPLICATIONS, PERMISSION.SEND_MESSAGES),
      ],
    });

    expect(audit.ok).toBe(false);
    expect(audit.overreach).toEqual([
      {
        id: APPLICATIONS,
        name: `channel-${APPLICATIONS}`,
        canSend: true,
        canManage: false,
      },
    ]);
  });

  it("treats a guild-wide Send Messages grant as overreach outside the events", () => {
    const audit = auditBotChannelGrant({
      ...context,
      basePermissions: PERMISSION.VIEW_CHANNEL | PERMISSION.SEND_MESSAGES,
      eventChannelIds: [EVENT_A],
      channels: [
        allowIn(EVENT_A, PERMISSION.MANAGE_MESSAGES),
        readOnly(APPLICATIONS),
      ],
    });

    expect(audit.ok).toBe(false);
    expect(audit.overreach.map((c) => c.id)).toEqual([APPLICATIONS]);
  });

  it("reports an event channel that is not in the guild as unwritable", () => {
    const audit = auditBotChannelGrant({
      ...context,
      eventChannelIds: [EVENT_A],
      channels: [readOnly(APPLICATIONS)],
    });

    expect(audit.ok).toBe(false);
    expect(audit.eventChannels).toEqual([
      { id: EVENT_A, name: "", canSend: false, canManage: false },
    ]);
  });

  it("fails when there are no event channels to verify", () => {
    const audit = auditBotChannelGrant({
      ...context,
      eventChannelIds: [],
      channels: [readOnly(APPLICATIONS)],
    });

    expect(audit.eventChannels).toEqual([]);
    expect(audit.ok).toBe(false);
  });

  it("flags a guild-wide Administrator grant as the root cause", () => {
    const audit = auditBotChannelGrant({
      ...context,
      basePermissions: PERMISSION.ADMINISTRATOR,
      eventChannelIds: [EVENT_A],
      channels: [readOnly(EVENT_A), readOnly(APPLICATIONS)],
    });

    // Administrator satisfies the event channels and every other channel at
    // once, which is exactly why it is a finding and not a pass.
    expect(audit.isAdministrator).toBe(true);
    expect(audit.eventChannels[0].canSend).toBe(true);
    expect(audit.overreach.map((c) => c.id)).toEqual([APPLICATIONS]);
    expect(audit.ok).toBe(false);
  });

  it("is not an administrator when permissions are scoped", () => {
    const audit = auditBotChannelGrant({
      ...context,
      eventChannelIds: [EVENT_A],
      channels: [allowIn(EVENT_A, WRITE)],
    });

    expect(audit.isAdministrator).toBe(false);
    expect(audit.ok).toBe(true);
  });

  it("does not count a channel the bot cannot even see as overreach", () => {
    const hidden = {
      id: APPLICATIONS,
      name: "hidden",
      permission_overwrites: [
        {
          id: EVERYONE_ROLE,
          type: 0 as const,
          allow: "0",
          deny: String(PERMISSION.VIEW_CHANNEL),
        },
      ],
    };

    const audit = auditBotChannelGrant({
      ...context,
      // Send Messages guild-wide, but this channel is invisible to the bot.
      basePermissions: PERMISSION.VIEW_CHANNEL | PERMISSION.SEND_MESSAGES,
      eventChannelIds: [EVENT_A],
      channels: [allowIn(EVENT_A, PERMISSION.MANAGE_MESSAGES), hidden],
    });

    expect(audit.overreach).toEqual([]);
    expect(audit.ok).toBe(true);
  });

  it("does not credit an event channel with write access it cannot use", () => {
    const audit = auditBotChannelGrant({
      ...context,
      basePermissions: 0n,
      eventChannelIds: [EVENT_A],
      channels: [allowIn(EVENT_A, WRITE)],
    });

    expect(audit.eventChannels[0]).toMatchObject({
      canSend: false,
      canManage: false,
    });
    expect(audit.ok).toBe(false);
  });
});
