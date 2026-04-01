import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Склад",
  description: "Переглянь активний склад готових до викликів учасників RATS.",
};

export default function RosterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
