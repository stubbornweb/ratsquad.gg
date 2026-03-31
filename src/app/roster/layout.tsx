import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Склад",
  description: "Переглянь активний склад конкурентних гравців у Squad.",
};

export default function RosterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
