import type { Metadata, Viewport } from "next";
import { Inter, Oswald, Roboto_Condensed, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { PageTransition } from "@/components/PageTransition";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SmoothScroll } from "@/components/SmoothScroll";
import { LoadingScreenWrapper } from "@/components/LoadingScreen";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  display: "swap",
});

const oswald = Oswald({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  variable: "--font-heading",
  display: "swap",
});

const robotoCondensed = Roboto_Condensed({
  weight: ["500", "700"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-label",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin", "cyrillic"],
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
    default: "RATS | Конкурентний EU клан у Squad",
    template: "%s | RATS Clan",
  },
  description: "RATS — конкурентний EU клан у Squad. Тут грають ті, з ким хочеться грати ще.",
  keywords: ["Squad", "military simulation", "milsim", "competitive gaming", "EU clan", "tactical shooter", "RATS", "клан", "конкурентний", "тактичний шутер"],
  authors: [{ name: "RATS Clan" }],
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "https://ratsquad.vercel.app",
    siteName: "RATS Clan",
    title: "RATS | Конкурентний EU клан у Squad",
    description: "RATS — конкурентний EU клан у Squad. Тут грають ті, з ким хочеться грати ще.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RATS Clan — конкурентний EU клан у Squad",
      },
    ],
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
    <html lang="uk">
      <body
        className={`${inter.variable} ${oswald.variable} ${robotoCondensed.variable} ${ibmPlexMono.variable} antialiased`}
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
