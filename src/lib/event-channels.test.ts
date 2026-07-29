import { describe, expect, it } from "vitest";

import { listEventChannels } from "./event-channels";

const CALENDAR = "1251110806225948722";
const OTHER_CATEGORY = "1461462650100781106";

const template = {
  id: "1249821805607391307",
  name: "🔖・зразок-дд-мм-рр",
  type: 0,
  parent_id: CALENDAR,
  position: 28,
};
const july = {
  id: "1527960074436481074",
  name: "🍺・хх-07-26-анті",
  type: 0,
  parent_id: CALENDAR,
  position: 29,
};
const august = {
  id: "1530605817483628644",
  name: "🍺・09-08-26-sph",
  type: 0,
  parent_id: CALENDAR,
  position: 30,
};

describe("listEventChannels", () => {
  it("returns the calendar's dated channels without the template", () => {
    const events = listEventChannels([august, template, july], CALENDAR);

    expect(events.map((c) => c.id)).toEqual([july.id, august.id]);
  });

  it("ignores channels in other categories", () => {
    const armaTemplate = { ...template, id: "a1", parent_id: OTHER_CATEGORY };
    const armaEvent = { ...july, id: "a2", parent_id: OTHER_CATEGORY };

    const events = listEventChannels(
      [template, july, armaTemplate, armaEvent],
      CALENDAR,
    );

    expect(events.map((c) => c.id)).toEqual([july.id]);
  });

  it("ignores voice channels sitting in the calendar", () => {
    const voice = { ...august, id: "v1", type: 2 };

    const events = listEventChannels([template, july, voice], CALENDAR);

    expect(events.map((c) => c.id)).toEqual([july.id]);
  });

  it("returns nothing when the calendar holds only the template", () => {
    expect(listEventChannels([template], CALENDAR)).toEqual([]);
  });

  it("returns nothing when the calendar is empty", () => {
    expect(listEventChannels([], CALENDAR)).toEqual([]);
  });
});
