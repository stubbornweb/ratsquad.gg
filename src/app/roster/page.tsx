"use client"

import { type JSX, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { rosterData } from "@/data/roster"
import { spring, clipReveal, fadeUp } from "@/hooks/useAnimations"

export default function RosterPage(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMembers = rosterData.filter(
    (member) =>
      member.callsign.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <Navbar />

      {/* Roster Header Section */}
      <header className="roster-page-header">
        <div className="section-container">
          <motion.div
            className="section-tag"
            variants={clipReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <span className="tag-line" /> THE UNIT
          </motion.div>
          <motion.h1
            className="section-headline"
            variants={clipReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            ACTIVE ROSTER
          </motion.h1>
          <motion.p
            className="section-sub"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            Our full roster of active, competitive, and dedicated Squad players.
          </motion.p>
        </div>
      </header>

      {/* Roster / Members Main Section */}
      <section className="section roster" id="roster" style={{ paddingTop: 0 }}>
        <div className="section-container">
          {/* Controls (Search & Stats) */}
          <motion.div
            className="roster-controls"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <div className="search-wrapper">
              <Search
                size={20}
                strokeWidth={2}
                className="search-icon"
                aria-hidden="true"
              />
              <input
                type="text"
                id="roster-search"
                className="search-input"
                placeholder="SEARCH BY CALLSIGN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="stats-summary" id="stats-summary">
              TOTAL ACTIVE:{" "}
              <span id="total-count" style={{ color: "var(--accent)" }}>
                {filteredMembers.length}
              </span>
            </div>
          </motion.div>

          {/* Dynamic Grid Container */}
          <AnimatePresence mode="popLayout">
            {filteredMembers.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px] md:gap-6"
                id="roster-grid"
                layout
              >
                {filteredMembers.map((member) => (
                  <motion.div
                    className="roster-card"
                    key={member.callsign}
                    layoutId={`card-${member.callsign}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{
                      scale: 1.02,
                      borderColor: "var(--accent)",
                      boxShadow:
                        "0 0 30px rgba(255, 215, 0, 0.08), 0 8px 32px rgba(0,0,0,0.4)",
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
                      {member.hours}h &middot; Since {member.since}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="roster-no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="member-name roster-no-results-title">
                  NO OPERATORS FOUND
                </h3>
                <p className="roster-no-results-sub">
                  Try adjusting your search terms.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </>
  )
}
