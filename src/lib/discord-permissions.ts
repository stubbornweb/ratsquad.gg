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
  eventChannel: Omit<ChannelWriteAccess, "name">;
  /** Channels other than the event channel where the bot can write. */
  overreach: ChannelWriteAccess[];
  ok: boolean;
}

/**
 * Verify the bot's write access is exactly what issue #14 authorises:
 * Send Messages + Manage Messages in the event channel, and nowhere else.
 *
 * Write access anywhere else is a finding, not a warning — the bot is
 * otherwise read-only and this grant is a deliberate escalation.
 */
export function auditBotChannelGrant(
  args: Omit<ChannelPermissionContext, "overwrites"> & {
    eventChannelId: string;
    channels: GuildChannel[];
  },
): BotChannelGrantAudit {
  const { eventChannelId, channels, ...ctx } = args;

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

  const event = access.find((c) => c.id === eventChannelId);
  const eventChannel = {
    id: eventChannelId,
    canSend: event?.canSend ?? false,
    canManage: event?.canManage ?? false,
  };

  const overreach = access.filter(
    (c) => c.id !== eventChannelId && (c.canSend || c.canManage),
  );

  const isAdministrator = can(ctx.basePermissions, PERMISSION.ADMINISTRATOR);

  return {
    isAdministrator,
    eventChannel,
    overreach,
    ok:
      !isAdministrator &&
      eventChannel.canSend &&
      eventChannel.canManage &&
      overreach.length === 0,
  };
}
