export interface Member {
  callsign: string;
  role: string;
  hours: number;
  since: number;
  discordId?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface NavLink {
  label: string;
  href: string;
}
