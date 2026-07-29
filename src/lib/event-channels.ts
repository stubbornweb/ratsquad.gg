/**
 * Which Discord channels are event channels.
 *
 * RATS opens one channel per scrim under the «Календар» category, each named
 * for its date. There is no single standing RSVP channel — the set changes
 * every week — so "the event channel" is a query over the category, not an ID
 * anyone can write down.
 *
 * The category's first channel is the «зразок-дд-мм-рр» template that new
 * event channels are copied from. It carries no RSVP embed and is skipped.
 */

/** A guild channel as returned by `GET /guilds/{id}/channels`. */
export interface CategorisedChannel {
  id: string;
  name: string;
  type: number;
  parent_id: string | null;
  position: number;
}

/** Type 0 is a normal text channel. */
const CHANNEL_TYPE_TEXT = 0;

export function listEventChannels(
  channels: CategorisedChannel[],
  categoryId: string,
): CategorisedChannel[] {
  return (
    channels
      .filter(
        (c) => c.parent_id === categoryId && c.type === CHANNEL_TYPE_TEXT,
      )
      // Discord orders a category by position, so the template is first.
      .sort((a, b) => a.position - b.position)
      .slice(1)
  );
}
