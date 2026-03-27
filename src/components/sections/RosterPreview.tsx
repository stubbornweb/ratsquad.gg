"use client"

import { type JSX } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { FEATURED_MEMBERS } from "@/data/roster"
import { fadeUp, clipReveal, staggerContainer, spring } from "@/hooks/useAnimations"
import { SectionDivider } from "@/components/ui/SectionDivider"

const cardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export default function RosterPreview(): JSX.Element {
  return (
    <>
      <SectionDivider label="UNIT" />
      <section className="section roster" id="roster">
        <div className="section-container">
          <motion.div
            className="section-tag"
            variants={clipReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <span className="tag-line" /> THE UNIT
          </motion.div>
          <motion.h2
            className="section-headline"
            variants={clipReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            MEET THE RATS.
          </motion.h2>
          <motion.p
            className="section-sub"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            A small, selective unit of serious Squad players.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px] md:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {FEATURED_MEMBERS.map((member) => (
              <motion.div
                className="roster-card"
                key={member.callsign}
                variants={cardVariant}
                whileHover={{
                  scale: 1.02,
                  borderColor: "var(--accent)",
                  boxShadow: "0 0 30px rgba(255, 215, 0, 0.08), 0 8px 32px rgba(0,0,0,0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={spring.gentle}
              >
                <div className="avatar-placeholder">
                  <span className="watermark">RATS</span>
                </div>
                <div className="role-tag">{member.role}</div>
                <h3 className="member-name">{member.callsign}</h3>
                <div className="member-stats">
                  {member.hours > 0 ? <>{member.hours}h &middot; Since {member.since}</> : <>&mdash;</>}
                </div>
              </motion.div>
            ))}

            <motion.div variants={cardVariant}>
              <Link href="/roster" className="roster-card join-teaser">
                <div className="join-teaser-content">VIEW FULL ROSTER &rarr;</div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
