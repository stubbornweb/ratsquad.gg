"use client"

import { type JSX } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { FEATURED_MEMBERS } from "@/data/roster"

const scrollFade = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
})

export default function RosterPreview(): JSX.Element {
  return (
    <section className="section roster" id="roster">
      <div className="section-container">
        <motion.div className="section-tag" {...scrollFade()}>
          <span className="tag-line"></span> THE UNIT
        </motion.div>
        <motion.h2 className="section-headline" {...scrollFade(0.1)}>
          MEET THE RATS.
        </motion.h2>
        <motion.p className="section-sub" {...scrollFade(0.2)}>
          A small, selective unit of serious Squad players.
        </motion.p>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px] md:gap-6" {...scrollFade(0.3)}>
          {FEATURED_MEMBERS.map((member) => (
            <div className="roster-card" key={member.callsign}>
              <div className="avatar-placeholder">
                <span className="watermark">RATS</span>
              </div>
              <div className="role-tag">{member.role}</div>
              <h3 className="member-name">{member.callsign}</h3>
              <div className="member-stats">
                {member.hours}h &middot; Since {member.since}
              </div>
            </div>
          ))}

          <Link href="/roster" className="roster-card join-teaser">
            <div className="join-teaser-content">VIEW FULL ROSTER &rarr;</div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
