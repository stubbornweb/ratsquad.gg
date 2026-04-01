import { type JSX } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RosterHeader from "@/components/RosterHeader"
import RosterClient from "@/components/RosterClient"
import { fetchRosterFromDiscord } from "@/lib/discord"
import { squadLeads as fallbackSLs, members as fallbackMembers } from "@/data/roster"

export const revalidate = 300;

export default async function RosterPage(): Promise<JSX.Element> {
  const roster = await fetchRosterFromDiscord();

  // Fall back to static data if Discord API returns empty
  const squadLeads = roster.squadLeads.length > 0 || roster.featured.length > 0
    ? [...roster.featured, ...roster.squadLeads]
    : fallbackSLs;
  const members = roster.members.length > 0 ? roster.members : fallbackMembers;

  return (
    <>
      <Navbar />
      <RosterHeader />
      <RosterClient squadLeads={squadLeads} members={members} />
      <Footer />
    </>
  )
}
