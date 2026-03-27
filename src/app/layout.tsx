import type { Metadata, Viewport } from "next";
import { DM_Sans, Bebas_Neue, Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { PageTransition } from "@/components/PageTransition";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SmoothScroll } from "@/components/SmoothScroll";
import { LoadingScreenWrapper } from "@/components/LoadingScreen";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-label",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090B",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ratsquad.vercel.app"),
  title: {
    default: "RATS | EU Competitive Squad Clan",
    template: "%s | RATS Clan",
  },
  description: "RATS is a competitive EU mil-sim clan for Squad. We don't play for fun. We play to win — together.",
  keywords: ["Squad", "military simulation", "milsim", "competitive gaming", "EU clan", "tactical shooter", "RATS"],
  authors: [{ name: "RATS Clan" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ratsquad.vercel.app",
    siteName: "RATS Clan",
    title: "RATS | EU Competitive Squad Clan",
    description: "RATS is a competitive EU mil-sim clan for Squad. We don't play for fun. We play to win — together.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RATS Clan - EU Competitive Squad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RATS | EU Competitive Squad Clan",
    description: "RATS is a competitive EU mil-sim clan for Squad. We don't play for fun. We play to win — together.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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
        <LoadingScreenWrapper>
          <PageTransition>
            {children}
          </PageTransition>
        </LoadingScreenWrapper>
      </body>
    </html>
  );
}
