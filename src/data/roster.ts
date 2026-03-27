import { type Member } from "@/types";

// Squad Leads
export const squadLeads: Member[] = [
  { callsign: "belkooo875", role: "SQUAD LEAD", hours: 0, since: 0 },
  { callsign: "BYKA", role: "SQUAD LEAD", hours: 0, since: 0 },
  { callsign: "KoRt", role: "SQUAD LEAD", hours: 0, since: 0 },
  { callsign: "Lupine Dominus", role: "SQUAD LEAD", hours: 0, since: 0 },
  { callsign: "Tarasovich", role: "SQUAD LEAD", hours: 0, since: 0 },
  { callsign: "Zompa", role: "SQUAD LEAD", hours: 0, since: 0 },
];

// Members (all other RATS roles)
export const members: Member[] = [
  { callsign: "Agent_4SV", role: "MEMBER", hours: 0, since: 0 },
  { callsign: "Andrik264", role: "MEMBER", hours: 0, since: 0 },
  { callsign: "BadHab", role: "MEMBER", hours: 0, since: 0 },
  { callsign: "By_Getman", role: "MEMBER", hours: 0, since: 0 },
  { callsign: "casLoT", role: "MEMBER", hours: 0, since: 0 },
  { callsign: "cfi333", role: "MEMBER", hours: 0, since: 0 },
  { callsign: "frikston", role: "MEMBER", hours: 0, since: 0 },
  { callsign: "Glek", role: "MEMBER", hours: 0, since: 0 },
  { callsign: "Grubsen", role: "MEMBER", hours: 0, since: 0 },
  { callsign: "Howlin`", role: "MEMBER", hours: 0, since: 0 },
  { callsign: "Loudness so silent", role: "MEMBER", hours: 0, since: 0 },
  { callsign: "MOP", role: "MEMBER", hours: 0, since: 0 },
  { callsign: "Nine", role: "MEMBER", hours: 0, since: 0 },
  { callsign: "Novice", role: "MEMBER", hours: 0, since: 0 },
  { callsign: "Rave XIII", role: "MEMBER", hours: 0, since: 0 },
  { callsign: "Shakhrai", role: "MEMBER", hours: 0, since: 0 },
  { callsign: "SoulNext", role: "MEMBER", hours: 0, since: 0 },
  { callsign: "swps", role: "MEMBER", hours: 0, since: 0 },
  { callsign: "Tolian", role: "MEMBER", hours: 0, since: 0 },
  { callsign: "Отаман", role: "MEMBER", hours: 0, since: 0 },
];

// Combined for backwards compatibility
export const rosterData: Member[] = [...squadLeads, ...members];

export const FEATURED_MEMBERS: Member[] = [
  { callsign: "belkooo875", role: "SQUAD LEAD", hours: 0, since: 0 },
  { callsign: "BYKA", role: "SQUAD LEAD", hours: 0, since: 0 },
  { callsign: "KoRt", role: "SQUAD LEAD", hours: 0, since: 0 },
];
