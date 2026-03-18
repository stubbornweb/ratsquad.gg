"use client"

import { type JSX, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { type Member } from "@/types";

const rosterData: Member[] = [
  // Leadership
  { callsign: "GHOST", role: "CLAN LEADER", hours: "3500", since: "2019" },
  { callsign: "REAPER", role: "CO-LEADER", hours: "3100", since: "2019" },
  // Squad Leads
  { callsign: "VIPER", role: "SQUAD LEAD", hours: "2400", since: "2020" },
  { callsign: "TITAN", role: "SQUAD LEAD", hours: "2150", since: "2020" },
  { callsign: "SHADOW", role: "SQUAD LEAD", hours: "1800", since: "2021" },
  { callsign: "RAVEN", role: "SQUAD LEAD", hours: "1650", since: "2021" },
  // Veterans
  { callsign: "BULLDOG", role: "VETERAN", hours: "1500", since: "2021" },
  { callsign: "STRIKER", role: "VETERAN", hours: "1420", since: "2021" },
  { callsign: "HUNTER", role: "VETERAN", hours: "1380", since: "2021" },
  { callsign: "SILVER", role: "VETERAN", hours: "1250", since: "2022" },
  { callsign: "APEX", role: "VETERAN", hours: "1100", since: "2022" },
  { callsign: "NOVA", role: "VETERAN", hours: "1050", since: "2022" },
  // Members
  { callsign: "COBALT", role: "MEMBER", hours: "900", since: "2022" },
  { callsign: "FROST", role: "MEMBER", hours: "850", since: "2022" },
  { callsign: "WOLF", role: "MEMBER", hours: "780", since: "2023" },
  { callsign: "ECHO", role: "MEMBER", hours: "720", since: "2023" },
  { callsign: "DELTA", role: "MEMBER", hours: "690", since: "2023" },
  { callsign: "SPARTAN", role: "MEMBER", hours: "640", since: "2023" },
  { callsign: "IRON", role: "MEMBER", hours: "580", since: "2023" },
  { callsign: "BRASS", role: "MEMBER", hours: "510", since: "2023" },
  { callsign: "STONE", role: "MEMBER", hours: "490", since: "2023" },
  { callsign: "BLAZE", role: "MEMBER", hours: "450", since: "2024" },
  { callsign: "DRIFT", role: "MEMBER", hours: "420", since: "2024" },
  { callsign: "FLINT", role: "MEMBER", hours: "380", since: "2024" },
  { callsign: "ROGUE", role: "MEMBER", hours: "350", since: "2024" },
  { callsign: "JESTER", role: "MEMBER", hours: "310", since: "2024" },
  { callsign: "CRASH", role: "MEMBER", hours: "280", since: "2024" },
  { callsign: "WIRE", role: "MEMBER", hours: "250", since: "2024" },
  // Recruits
  { callsign: "SPARK", role: "RECRUIT", hours: "150", since: "2024" },
  { callsign: "GRIT", role: "RECRUIT", hours: "120", since: "2024" },
  { callsign: "NANO", role: "RECRUIT", hours: "110", since: "2024" },
];

export default function RosterPage(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = rosterData.filter((member) =>
    member.callsign.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />

      {/* Roster Header Section */}
      <header className="roster-page-header">
        <div className="section-container">
          <motion.div
            className="section-tag"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="tag-line"></span> THE UNIT
          </motion.div>
          <motion.h1
            className="section-headline"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            ACTIVE ROSTER
          </motion.h1>
          <motion.p
            className="section-sub"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="search-wrapper">
              <svg
                className="search-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
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
          {filteredMembers.length > 0 ? (
            <div className="roster-grid" id="roster-grid">
              {filteredMembers.map((member) => (
                <motion.div
                  className="roster-card"
                  key={member.callsign}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
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
            </div>
          ) : (
            <div className="roster-no-results">
              <h3 className="member-name roster-no-results-title">
                NO OPERATORS FOUND
              </h3>
              <p className="roster-no-results-sub">Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
