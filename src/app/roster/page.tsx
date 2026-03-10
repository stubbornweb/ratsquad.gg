"use client"

import { useEffect, useState } from "react";
import Link from "next/link";

const rosterData = [
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

export default function RosterPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = rosterData.filter((member) =>
    member.callsign.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for fade animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll(".fade-in");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [filteredMembers]); // Re-run when members update

  return (
    <>
      <style>{`
        .roster-page-header {
          padding-top: 160px;
          padding-bottom: 60px;
          background-color: var(--bg-main);
          position: relative;
        }
      `}</style>
      
      {/* 1. Navigation Bar */}
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`} id="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <Link href="/">RATS</Link>
          </div>

          <button
            className="mobile-menu-btn"
            aria-label="Toggle Menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
              <Link href="/#about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              ABOUT
            </Link>
            <Link href="/roster" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              ROSTER
            </Link>
            <Link href="/#faq" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              FAQ
            </Link>
            <Link href="/#join" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              JOIN US
            </Link>
            <Link href="/#join" className="btn btn-primary nav-cta" onClick={() => setIsMobileMenuOpen(false)}>
              APPLY NOW
            </Link>
          </div>
        </div>
      </nav>

      {/* Roster Header Section */}
      <header className="roster-page-header">
        <div className="section-container" style={{ padding: "0 40px", margin: "0 auto", maxWidth: "1200px" }}>
          <div className="section-tag fade-in">
            <span className="tag-line"></span> THE UNIT
          </div>
          <h1 className="section-headline fade-in">ACTIVE ROSTER</h1>
          <p className="section-sub fade-in">
            Our full roster of active, competitive, and dedicated Squad players.
          </p>
        </div>
      </header>

      {/* Roster / Members Main Section */}
      <section className="section roster" id="roster" style={{ paddingTop: 0 }}>
        <div className="section-container">
          {/* Controls (Search & Stats) */}
          <div className="roster-controls fade-in">
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
          </div>

          {/* Dynamic Grid Container */}
          {filteredMembers.length > 0 ? (
            <div className="roster-grid fade-in" id="roster-grid">
              {filteredMembers.map((member, i) => (
                <div className="roster-card fade-in" key={i}>
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
            </div>
          ) : (
            <div id="no-results" style={{ textAlign: "center", padding: "60px 0" }}>
              <h3 className="member-name" style={{ color: "var(--text-muted)" }}>
                NO OPERATORS FOUND
              </h3>
              <p style={{ color: "var(--text-dark)" }}>Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="section-border-top footer-border"></div>
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">RATS</div>
              <div className="footer-tagline">EU COMPETITIVE SQUAD CLAN</div>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">NAVIGATE</h4>
              <Link href="/#about" className="footer-link">
                About
              </Link>
              <Link href="/roster" className="footer-link">
                Roster
              </Link>
              <Link href="/#faq" className="footer-link">
                FAQ
              </Link>
              <Link href="/#join" className="footer-link">
                How to Join
              </Link>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">COMMUNITY</h4>
              <Link href="#" className="footer-link">
                Discord
              </Link>
              <Link href="#" className="footer-link">
                Steam Group
              </Link>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">CONTACT / INFO</h4>
              <p className="footer-text">
                For recruitment enquiries, open a ticket in Discord.
              </p>
              <p className="footer-text mt-2">Region: EU — Europe</p>
              <p className="footer-text">Game: Squad</p>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copy">
              RATS &copy; 2025 &mdash; ALL RIGHTS RESERVED
            </div>
            <div className="footer-legal">
              SQUAD IS A TRADEMARK OF OFFWORLD INDUSTRIES
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
