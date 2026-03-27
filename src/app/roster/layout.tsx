import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roster",
  description: "View our active roster of competitive Squad players.",
};

export default function RosterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
