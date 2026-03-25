"use client"

import { type JSX, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { rosterData } from "@/data/roster";

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
