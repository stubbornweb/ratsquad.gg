"use client"

import { type JSX } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Hero from "@/components/sections/Hero"
import About from "@/components/sections/About"
import RosterPreview from "@/components/sections/RosterPreview"
import Join from "@/components/sections/Join"
import FAQ from "@/components/sections/FAQ"
import Discord from "@/components/sections/Discord"

export default function Home(): JSX.Element {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <RosterPreview />
      <Join />
      <FAQ />
      <Discord />
      <Footer />
    </>
  )
}
