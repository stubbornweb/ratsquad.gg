"use client"

import { type JSX } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { type Member } from "@/types"
import { fadeUp, clipReveal, staggerContainer, spring } from "@/hooks/useAnimations"

const cardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

interface RosterPreviewProps {
  members: Member[];
}

export default function RosterPreview({ members }: RosterPreviewProps): JSX.Element {
  return (
    <section className="section roster" id="roster">
      <div className="section-border-top" />
        <div className="section-container">
          <motion.div
            className="section-tag"
            variants={clipReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <span className="tag-line" /> НАША КОМАНДА
          </motion.div>
          <motion.h2
            className="section-headline"
            variants={clipReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            ЛІДЕРИ RATS
          </motion.h2>
          <motion.p
            className="section-sub"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            Спільнота людей, що цінують координацію та взаємопідтримку.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px] md:gap-6 items-stretch"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {members.map((member) => (
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
                  {member.hours > 0 ? <>{member.hours}г &middot; З {member.since}</> : <>&mdash;</>}
                </div>
              </motion.div>
            ))}

            <motion.div variants={cardVariant} className="flex items-end">
              <Link href="/roster" className="roster-card join-teaser w-full">
                <div className="join-teaser-content">ПОВНИЙ СКЛАД →</div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
  )
}
