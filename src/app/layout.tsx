import type { Metadata } from "next";
import { DM_Sans, Bebas_Neue, Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { PageTransition } from "@/components/PageTransition";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SmoothScroll } from "@/components/SmoothScroll";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-label",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "RATS | EU Competitive Squad Clan",
  description: "RATS is a competitive EU mil-sim clan for Squad. We don't play for fun. We play to win — together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${bebasNeue.variable} ${barlowCondensed.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <SmoothScroll />
        <ScrollProgress />
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
