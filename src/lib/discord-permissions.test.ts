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
  const EVENT_CHANNEL = "600000000000000001";
  const ANKETA_CHANNEL = "600000000000000002";

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

  const context = {
    guildId: GUILD_ID,
    userId: BOT_USER_ID,
    roleIds: [BOT_ROLE],
    // Read-only guild-wide: the bot sees channels but may not post in them.
    basePermissions: PERMISSION.VIEW_CHANNEL,
  };

  it("passes when the bot can post and manage in the event channel only", () => {
    const audit = auditBotChannelGrant({
      ...context,
      eventChannelId: EVENT_CHANNEL,
      channels: [
        allowIn(
          EVENT_CHANNEL,
          PERMISSION.SEND_MESSAGES | PERMISSION.MANAGE_MESSAGES,
        ),
        readOnly(ANKETA_CHANNEL),
      ],
    });

    expect(audit.ok).toBe(true);
    expect(audit.eventChannel).toEqual({
      id: EVENT_CHANNEL,
      canSend: true,
      canManage: true,
    });
    expect(audit.overreach).toEqual([]);
  });

  it("fails when the event channel is missing Manage Messages", () => {
    const audit = auditBotChannelGrant({
      ...context,
      eventChannelId: EVENT_CHANNEL,
      channels: [
        allowIn(EVENT_CHANNEL, PERMISSION.SEND_MESSAGES),
        readOnly(ANKETA_CHANNEL),
      ],
    });

    expect(audit.ok).toBe(false);
    expect(audit.eventChannel.canSend).toBe(true);
    expect(audit.eventChannel.canManage).toBe(false);
  });

  it("reports write access in any other channel as overreach", () => {
    const audit = auditBotChannelGrant({
      ...context,
      eventChannelId: EVENT_CHANNEL,
      channels: [
        allowIn(
          EVENT_CHANNEL,
          PERMISSION.SEND_MESSAGES | PERMISSION.MANAGE_MESSAGES,
        ),
        allowIn(ANKETA_CHANNEL, PERMISSION.SEND_MESSAGES),
      ],
    });

    expect(audit.ok).toBe(false);
    expect(audit.overreach).toEqual([
      { id: ANKETA_CHANNEL, name: `channel-${ANKETA_CHANNEL}`, canSend: true, canManage: false },
    ]);
  });

  it("treats a guild-wide Send Messages grant as overreach in every channel", () => {
    const audit = auditBotChannelGrant({
      ...context,
      basePermissions: PERMISSION.VIEW_CHANNEL | PERMISSION.SEND_MESSAGES,
      eventChannelId: EVENT_CHANNEL,
      channels: [
        allowIn(EVENT_CHANNEL, PERMISSION.MANAGE_MESSAGES),
        readOnly(ANKETA_CHANNEL),
      ],
    });

    expect(audit.ok).toBe(false);
    expect(audit.overreach.map((c) => c.id)).toEqual([ANKETA_CHANNEL]);
  });

  it("fails when the event channel is not among the channels read", () => {
    const audit = auditBotChannelGrant({
      ...context,
      eventChannelId: EVENT_CHANNEL,
      channels: [readOnly(ANKETA_CHANNEL)],
    });

    expect(audit.ok).toBe(false);
    expect(audit.eventChannel).toEqual({
      id: EVENT_CHANNEL,
      canSend: false,
      canManage: false,
    });
  });

  it("flags a guild-wide Administrator grant as the root cause", () => {
    const audit = auditBotChannelGrant({
      ...context,
      basePermissions: PERMISSION.ADMINISTRATOR,
      eventChannelId: EVENT_CHANNEL,
      channels: [readOnly(EVENT_CHANNEL), readOnly(ANKETA_CHANNEL)],
    });

    // Administrator satisfies the event channel and every other channel at
    // once, which is exactly why it is a finding and not a pass.
    expect(audit.isAdministrator).toBe(true);
    expect(audit.eventChannel.canSend).toBe(true);
    expect(audit.overreach.map((c) => c.id)).toEqual([ANKETA_CHANNEL]);
    expect(audit.ok).toBe(false);
  });

  it("is not an administrator when permissions are scoped", () => {
    const audit = auditBotChannelGrant({
      ...context,
      eventChannelId: EVENT_CHANNEL,
      channels: [
        allowIn(
          EVENT_CHANNEL,
          PERMISSION.SEND_MESSAGES | PERMISSION.MANAGE_MESSAGES,
        ),
      ],
    });

    expect(audit.isAdministrator).toBe(false);
    expect(audit.ok).toBe(true);
  });

  it("does not count a channel the bot cannot even see as overreach", () => {
    const hidden = {
      id: ANKETA_CHANNEL,
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
      eventChannelId: EVENT_CHANNEL,
      channels: [
        allowIn(EVENT_CHANNEL, PERMISSION.MANAGE_MESSAGES),
        hidden,
      ],
    });

    expect(audit.overreach).toEqual([]);
    expect(audit.ok).toBe(true);
  });

  it("does not credit the event channel with write access it cannot use", () => {
    const audit = auditBotChannelGrant({
      ...context,
      basePermissions: 0n,
      eventChannelId: EVENT_CHANNEL,
      channels: [
        allowIn(
          EVENT_CHANNEL,
          PERMISSION.SEND_MESSAGES | PERMISSION.MANAGE_MESSAGES,
        ),
      ],
    });

    expect(audit.eventChannel).toEqual({
      id: EVENT_CHANNEL,
      canSend: false,
      canManage: false,
    });
    expect(audit.ok).toBe(false);
  });
});
