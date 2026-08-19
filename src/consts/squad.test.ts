import { describe, expect, it } from "vitest";

import {
  DIRECTION_LABELS,
  DIRECTIONS,
  MAX_ROLE_PREFERENCES,
  RANKS,
  SQUAD_ROLE_HINTS,
  SQUAD_ROLE_LABELS,
  SQUAD_ROLES,
} from "./squad";

describe("Squad roles", () => {
  it("has the fourteen kits the clan plays", () => {
    expect(SQUAD_ROLES).toHaveLength(14);
  });

  it("labels every one of them", () => {
    for (const role of SQUAD_ROLES) {
      expect(SQUAD_ROLE_LABELS[role]).toBeTruthy();
    }
  });

  it("distinguishes the three Tech tiers by their vehicles", () => {
    // The tiers are meaningless without them — «Tech middle» tells nobody
    // whether they are being asked to crew a BTR.
    expect(SQUAD_ROLE_HINTS.TECH_LIGHT).toBe("RWS, BRDM");
    expect(SQUAD_ROLE_HINTS.TECH_MIDDLE).toBe("BTR, LAV");
    expect(SQUAD_ROLE_HINTS.TECH_HEAVY).toBe("Tank, ZBD");
  });

  it("has no duplicates", () => {
    expect(new Set(SQUAD_ROLES).size).toBe(SQUAD_ROLES.length);
  });
});

describe("Напрями", () => {
  // Issue #18 corrected these from four to six, against the clan's written
  // squad doctrine. The four-item list came from CSV column values and is
  // still present in the profile prototype — this test is the guard.
  it("has six, including VIC and MORTAR", () => {
    expect(DIRECTIONS).toHaveLength(6);
    expect(DIRECTIONS).toContain("VIC");
    expect(DIRECTIONS).toContain("MORTAR");
  });

  it("carries the Ukrainian gloss for every one", () => {
    for (const direction of DIRECTIONS) {
      expect(DIRECTION_LABELS[direction]).toBeTruthy();
    }
  });
});

describe("Ranks", () => {
  it("includes Recruit and Inactive", () => {
    // Both are real Discord roles that were missing from the constants, and
    // `members.rank` cannot be populated correctly without them (#12, #13).
    expect(RANKS).toContain("RECRUIT");
    expect(RANKS).toContain("INACTIVE");
  });
});

describe("preferences", () => {
  it("caps the top-N at three", () => {
    expect(MAX_ROLE_PREFERENCES).toBe(3);
  });
});
