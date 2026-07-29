/**
 * Discord channel permission resolution.
 *
 * Discord returns permissions as decimal strings of a 64-bit bitfield, so all
 * arithmetic here is BigInt. The resolution order below is Discord's own:
 * base role permissions, then the @everyone channel overwrite, then the
 * member's role overwrites, then the member-specific overwrite.
 *
 * https://discord.com/developers/docs/topics/permissions
 */

export const PERMISSION = {
  ADMINISTRATOR: 1n << 3n,
  VIEW_CHANNEL: 1n << 10n,
  SEND_MESSAGES: 1n << 11n,
  MANAGE_MESSAGES: 1n << 13n,
} as const;

const ALL_PERMISSIONS = ~0n;

/** A channel permission overwrite: type 0 targets a role, type 1 a member. */
export interface ChannelOverwrite {
  id: string;
  type: 0 | 1;
  allow: string;
  deny: string;
}

export interface ChannelPermissionContext {
  guildId: string;
  /** The user (bot) whose effective permissions are being resolved. */
  userId: string;
  /** Every role the user holds, excluding @everyone. */
  roleIds: string[];
  /** Guild-wide permissions from @everyone plus the user's roles. */
  basePermissions: bigint;
  overwrites: ChannelOverwrite[];
}

export function can(permissions: bigint, flag: bigint): boolean {
  return (permissions & flag) === flag;
}

export function resolveChannelPermissions(
  ctx: ChannelPermissionContext,
): bigint {
  if (can(ctx.basePermissions, PERMISSION.ADMINISTRATOR)) {
    return ALL_PERMISSIONS;
  }

  let permissions = ctx.basePermissions;

  const everyone = ctx.overwrites.find(
    (o) => o.type === 0 && o.id === ctx.guildId,
  );
  if (everyone) {
    permissions &= ~BigInt(everyone.deny);
    permissions |= BigInt(everyone.allow);
  }

  // Role overwrites accumulate across every role the user holds, and every
  // deny is applied before any allow — one role's allow beats another's deny.
  let roleAllow = 0n;
  let roleDeny = 0n;
  for (const overwrite of ctx.overwrites) {
    if (overwrite.type !== 0 || !ctx.roleIds.includes(overwrite.id)) continue;
    roleAllow |= BigInt(overwrite.allow);
    roleDeny |= BigInt(overwrite.deny);
  }
  permissions &= ~roleDeny;
  permissions |= roleAllow;

  const member = ctx.overwrites.find(
    (o) => o.type === 1 && o.id === ctx.userId,
  );
  if (member) {
    permissions &= ~BigInt(member.deny);
    permissions |= BigInt(member.allow);
  }

  return permissions;
}

/** A guild channel as returned by `GET /guilds/{id}/channels`. */
export interface GuildChannel {
  id: string;
  name: string;
  permission_overwrites: ChannelOverwrite[];
}

export interface ChannelWriteAccess {
  id: string;
  name: string;
  canSend: boolean;
  canManage: boolean;
}

export interface BotChannelGrantAudit {
  /**
   * Guild-wide Administrator, which overrides every channel overwrite and
   * makes any scoped grant meaningless. Reported separately because it is the
   * root cause of a fully-overreaching audit, not one finding among many.
   */
  isAdministrator: boolean;
  /** Write access in each event channel, in the order they were given. */
  eventChannels: ChannelWriteAccess[];
  /** Channels outside the event set where the bot can write. */
  overreach: ChannelWriteAccess[];
  ok: boolean;
}

/**
 * Verify the bot's write access is exactly what issue #14 authorises:
 * Send Messages + Manage Messages in the event channels, and nowhere else.
 *
 * The event channels are a set, not one ID — RATS opens a channel per scrim
 * (see `listEventChannels`). Write access outside that set is a finding, not a
 * warning: the bot is meant to be read-only everywhere else.
 */
export function auditBotChannelGrant(
  args: Omit<ChannelPermissionContext, "overwrites"> & {
    eventChannelIds: string[];
    channels: GuildChannel[];
  },
): BotChannelGrantAudit {
  const { eventChannelIds, channels, ...ctx } = args;
  const isEvent = new Set(eventChannelIds);

  const access = channels.map((channel): ChannelWriteAccess => {
    const permissions = resolveChannelPermissions({
      ...ctx,
      overwrites: channel.permission_overwrites,
    });
    // Without View Channel the write bits are inert: Discord will not let the
    // bot post in, or moderate, a channel it cannot see.
    const visible = can(permissions, PERMISSION.VIEW_CHANNEL);
    return {
      id: channel.id,
      name: channel.name,
      canSend: visible && can(permissions, PERMISSION.SEND_MESSAGES),
      canManage: visible && can(permissions, PERMISSION.MANAGE_MESSAGES),
    };
  });

  // An event channel the guild fetch did not return cannot be written to, and
  // saying so beats dropping it silently.
  const eventChannels = eventChannelIds.map(
    (id): ChannelWriteAccess =>
      access.find((c) => c.id === id) ?? {
        id,
        name: "",
        canSend: false,
        canManage: false,
      },
  );

  const overreach = access.filter(
    (c) => !isEvent.has(c.id) && (c.canSend || c.canManage),
  );

  const isAdministrator = can(ctx.basePermissions, PERMISSION.ADMINISTRATOR);

  return {
    isAdministrator,
    eventChannels,
    overreach,
    ok:
      !isAdministrator &&
      eventChannels.length > 0 &&
      eventChannels.every((c) => c.canSend && c.canManage) &&
      overreach.length === 0,
  };
}
