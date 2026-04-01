import { type JSX } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Hero from "@/components/sections/Hero"
import About from "@/components/sections/About"
import RosterPreview from "@/components/sections/RosterPreview"
import Join from "@/components/sections/Join"
import FAQ from "@/components/sections/FAQ"
import Discord from "@/components/sections/Discord"
import { fetchRosterFromDiscord } from "@/lib/discord"
import { FEATURED_MEMBERS } from "@/data/roster"

export const revalidate = 300;

export default async function Home(): Promise<JSX.Element> {
  const roster = await fetchRosterFromDiscord();
  const featured = roster.featured.length > 0 ? roster.featured : FEATURED_MEMBERS;

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <RosterPreview members={featured} />
      <Join />
      <FAQ />
      <Discord />
      <Footer />
    </>
  )
}
