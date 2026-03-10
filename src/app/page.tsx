"use client"

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

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

    const elements = document.querySelectorAll(".fade-up, .fade-in");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Terminal Typing Effect
  useEffect(() => {
    const terminalOutput = terminalRef.current;
    if (!terminalOutput) return;

    const terminalLogs = [
      "> RATS COMMAND TERMINAL ONLINE",
      "> REGION: EUROPE // LANGUAGE: ENGLISH",
      "> PLAYSTYLE: HARDCORE MIL-SIM",
      " ",
      "> CURRENT STATUS: RECRUITING",
      "> LATEST OPERATION: FIRESTORM [VICTORY]",
      "> NEXT SCRIM: SATURDAY 20:00 CET",
      " ",
      "> REQUIREMENT: 100+ HOURS IN SQUAD",
      "> REQUIREMENT: WORKING MICROPHONE",
      "> CLEARANCE: WAITING FOR APPLICATION...",
      " ",
      "> PINGING DISCORD SERVER...",
      "> 142 MEMBERS ONLINE",
      "> UPLINK SECURE."
    ];

    let logIndex = 0;
    let charIndex = 0;
    let currentLine = "";
    let timeoutId: NodeJS.Timeout;

    const typingSpeedMs = 30;
    const lineDelayMs = 800;
    const clearDelayMs = 4000;

    const typeTerminalLine = () => {
      if (!terminalRef.current) return; // Unmounted

      if (logIndex >= terminalLogs.length) {
        timeoutId = setTimeout(() => {
          if (terminalRef.current) terminalRef.current.innerHTML = "";
          logIndex = 0;
          typeTerminalLine();
        }, clearDelayMs);
        return;
      }

      const targetLine = terminalLogs[logIndex];

      if (charIndex < targetLine.length) {
        currentLine += targetLine.charAt(charIndex);
        charIndex++;

        const previousLinesHtml = terminalLogs
          .slice(0, logIndex)
          .map((line) => `<div>${line}</div>`)
          .join("");
        terminalRef.current.innerHTML =
          previousLinesHtml + `<div>${currentLine}</div>`;

        timeoutId = setTimeout(
          typeTerminalLine,
          targetLine === " " ? 0 : typingSpeedMs
        );
      } else {
        logIndex++;
        charIndex = 0;
        currentLine = "";

        terminalRef.current.innerHTML = terminalLogs
          .slice(0, logIndex)
          .map((line) => `<div>${line}</div>`)
          .join("");

        timeoutId = setTimeout(typeTerminalLine, lineDelayMs);
      }
    };

    const initialTimeout = setTimeout(typeTerminalLine, 1500);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(timeoutId);
    };
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    { q: "What timezones do you operate in?", a: "We primarily operate in EU timezones (CET/CEST), with dedicated operations running during EU evening hours." },
    { q: "Do I need DLC or specific mods?", a: "We play vanilla Squad for most of our competitive matches, but occasionally participate in modded events. We will announce any required mods well in advance." },
    { q: "How does the recruitment process work?", a: "Join our Discord, submit an application ticket, and you will be invited to a voice interview. If approved, you enter a trial phase where we assess your communication and teamwork in-game." },
    { q: "Are you a competitive/esports clan?", a: "Yes. While we enjoy standard matches, our primary focus is structured, competitive 50v50 scrims and tournaments." },
  ];

  return (
    <>
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

      {/* 2. Hero Section */}
      <header className="hero" id="hero">
        <div className="noise-overlay"></div>
        <video className="hero-video-bg" autoPlay loop muted playsInline>
          <source src="/assets/inspo-images/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="hero-bg-overlay"></div>
        <div className="hero-content">
          <div className="hero-tag fade-up" style={{ transitionDelay: "0s" }}>
            <span className="tag-line"></span> SQUAD — EU COMPETITIVE CLAN
          </div>
          <h1 className="hero-headline">
            <span className="fade-up block" style={{ transitionDelay: "0.15s" }}>
              MOVE AS ONE.
            </span>
            <span className="fade-up block" style={{ transitionDelay: "0.3s" }}>
              STRIKE AS ONE.
            </span>
          </h1>
          <p className="hero-sub fade-up" style={{ transitionDelay: "0.5s" }}>
            RATS is a competitive EU mil-sim clan for Squad. We don&apos;t play for
            fun. We play to win — together.
          </p>
          <div className="hero-actions fade-up" style={{ transitionDelay: "0.7s" }}>
            <Link href="/#join" className="btn btn-primary btn-large">
              APPLY TO JOIN
            </Link>
            <Link href="/#about" className="btn btn-text">
              LEARN MORE &darr;
            </Link>
          </div>
          <div className="hero-stats fade-up" style={{ transitionDelay: "0.9s" }}>
            <div className="stat-item">EU BASED</div>
            <div className="stat-item">SQUAD ONLY</div>
            <div className="stat-item">SELECTIVE RECRUITMENT</div>
          </div>
        </div>

        {/* Right Side: Tactical HUD & Terminal */}
        <div className="hero-hud fade-in" style={{ transitionDelay: "1.2s" }}>
          <div className="hud-frame">
            <div className="hud-corner top-left"></div>
            <div className="hud-corner top-right"></div>
            <div className="hud-corner bottom-left"></div>
            <div className="hud-corner bottom-right"></div>

            <div className="hud-header">
              <span className="hud-label">UPLINK ESTABLISHED</span>
              <span className="hud-data blinking">REC</span>
            </div>

            <div className="terminal-container">
              <div className="terminal-content" ref={terminalRef}>
                {/* JS typing effect goes here */}
              </div>
              <span className="terminal-cursor">&#x2588;</span>
            </div>

            {/* NEW: Stats Box in HUD */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginTop: "auto",
              marginBottom: "16px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)"
            }}>
              <div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.1em" }}>ACTIVE MEMS</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "16px", color: "var(--accent)" }}>42</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.1em" }}>SQUAD LEADS</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "16px", color: "var(--accent)" }}>8</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.1em" }}>RECRUITS</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "16px", color: "var(--accent)" }}>12</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.1em" }}>ESTABLISHED</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "16px", color: "var(--accent)" }}>2023</div>
              </div>
            </div>

            <div className="hud-footer" style={{ marginTop: "0", borderTop: "none", paddingTop: "0" }}>
              <div className="hud-bar-container">
                <div className="hud-bar filled"></div>
                <div className="hud-bar filled"></div>
                <div className="hud-bar filled"></div>
                <div className="hud-bar half"></div>
                <div className="hud-bar empty"></div>
              </div>
              <span className="hud-data">CONN: SECURE</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. About the Clan */}
      <section className="section about" id="about">
        <div className="section-container">
          <div className="about-grid">
            <div className="about-content fade-in">
              <div className="section-tag">
                <span className="tag-line"></span> WHO WE ARE
              </div>
              <h2 className="section-headline">TACTICS OVER EVERYTHING.</h2>
              <p>
                RATS is not your average Squad clan. We are a tight-knit EU unit
                built around one principle: coordinated, disciplined play. No
                lone wolves. No wasted shots. Every move is calculated.
              </p>
              <p>
                We recruit selectively because quality beats quantity. If you&apos;re
                serious about Squad — if you study the map, call out positions,
                and trust your squadmates — you belong here.
              </p>
            </div>
            <div className="about-pillars fade-in">
              <div className="pillar">
                <div className="ghost-number">01</div>
                <h3 className="pillar-title">DISCIPLINE</h3>
                <p className="pillar-body">
                  We train, we coordinate, we execute. Every op is treated as
                  the real thing.
                </p>
              </div>
              <div className="pillar">
                <div className="ghost-number">02</div>
                <h3 className="pillar-title">TEAMWORK</h3>
                <p className="pillar-body">
                  Six soldiers thinking as one. Communication is not optional —
                  it&apos;s the mission.
                </p>
              </div>
              <div className="pillar">
                <div className="ghost-number">03</div>
                <h3 className="pillar-title">IMPROVEMENT</h3>
                <p className="pillar-body">
                  We review, we adapt, we get better. Complacency is the enemy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Roster / Members */}
      <section className="section roster" id="roster">
        <div className="section-container">
          <div className="section-tag fade-in">
            <span className="tag-line"></span> THE UNIT
          </div>
          <h2 className="section-headline fade-in">MEET THE RATS.</h2>
          <p className="section-sub fade-in">
            A small, selective unit of serious Squad players.
          </p>

          <div className="roster-grid fade-in">
            <div className="roster-card">
              <div className="avatar-placeholder">
                <span className="watermark">RATS</span>
              </div>
              <div className="role-tag">CLAN LEADER</div>
              <h3 className="member-name">[CALLSIGN_1]</h3>
              <div className="member-stats">1500h &middot; Since 2021</div>
            </div>
            <div className="roster-card">
              <div className="avatar-placeholder">
                <span className="watermark">RATS</span>
              </div>
              <div className="role-tag">SQUAD LEAD</div>
              <h3 className="member-name">[CALLSIGN_2]</h3>
              <div className="member-stats">1200h &middot; Since 2022</div>
            </div>
            <div className="roster-card">
              <div className="avatar-placeholder">
                <span className="watermark">RATS</span>
              </div>
              <div className="role-tag">SQUAD LEAD</div>
              <h3 className="member-name">[CALLSIGN_3]</h3>
              <div className="member-stats">850h &middot; Since 2022</div>
            </div>

            <Link href="/roster" className="roster-card join-teaser">
              <div className="join-teaser-content">VIEW FULL ROSTER &rarr;</div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. How to Join / Recruitment */}
      <section className="section join" id="join">
        <div className="section-border-top"></div>
        <div className="section-container">
          <div className="section-tag fade-in">
            <span className="tag-line"></span> RECRUITMENT
          </div>
          <h2 className="section-headline fade-in">
            THINK YOU HAVE WHAT IT TAKES?
          </h2>
          <p className="section-sub fade-in">
            We recruit selectively. We don&apos;t fill seats — we build a unit.
          </p>

          <div className="join-grid fade-in">
            <div className="join-requirements">
              <ul className="requirements-list">
                <li>
                  <span className="check">&check;</span> 100+ hours in Squad
                </li>
                <li>
                  <span className="check">&check;</span> Working microphone —
                  communication is mandatory
                </li>
                <li>
                  <span className="check">&check;</span> Age 18 or older
                </li>
                <li>
                  <span className="check">&check;</span> EU based (or able to
                  play EU servers with low ping)
                </li>
                <li>
                  <span className="check">&check;</span> Willingness to learn,
                  adapt, and put the team first
                </li>
              </ul>
            </div>
            <div className="join-steps">
              <div className="step">
                <div className="step-ghost-number">01</div>
                <h3 className="step-title">APPLY ON DISCORD</h3>
                <p className="step-body">
                  Join our Discord server and open a recruitment ticket to start
                  your application.
                </p>
              </div>
              <div className="step">
                <div className="step-ghost-number">02</div>
                <h3 className="step-title">INTERVIEW</h3>
                <p className="step-body">
                  A brief voice interview with clan leadership. We want to know
                  how you think and play — not your stats.
                </p>
              </div>
              <div className="step">
                <div className="step-ghost-number">03</div>
                <h3 className="step-title">TRIAL PERIOD</h3>
                <p className="step-body">
                  Approved applicants join as Recruit for a trial period playing
                  alongside the unit.
                </p>
              </div>
              <div className="step">
                <div className="step-ghost-number">04</div>
                <h3 className="step-title">FULL MEMBER</h3>
                <p className="step-body">
                  Pass the trial and you&apos;re in. Welcome to RATS.
                </p>
              </div>
            </div>
          </div>

          <div className="join-cta fade-in">
            <Link
              href="https://discord.gg/"
              target="_blank"
              className="btn btn-primary btn-massive"
            >
              JOIN OUR DISCORD
            </Link>
            <p className="join-cta-sub">
              Already a member? Find us in Discord &rarr; #recruitment
            </p>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="section faq" id="faq">
        <div className="section-container">
          <div className="section-tag fade-in">
            <span className="tag-line"></span> INTELLIGENCE
          </div>
          <h2 className="section-headline fade-in">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="section-sub fade-in" style={{ marginTop: "-24px", marginBottom: "40px" }}>
            Need intel before committing? Read our standard operating procedures.
          </p>

          <div className="faq-list fade-in">
            {faqs.map((faq, index) => (
              <div className="faq-item" key={index}>
                <button
                  className={`faq-question ${openFaq === index ? "active" : ""}`}
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                >
                  {faq.q}
                  <span className="faq-icon">+</span>
                </button>
                <div className={`faq-answer ${openFaq === index ? "active" : ""}`}>
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Discord & Social Links + Footer */}
      <section className="discord-banner" id="discord">
        <div className="noise-overlay"></div>
        <div className="section-border-top"></div>
        <div className="section-container text-center">
          <div className="section-tag fade-in center-tag">
            <span className="tag-line"></span> COMMUNITY{" "}
            <span className="tag-line"></span>
          </div>
          <h2 className="section-headline fade-in">
            THE MISSION CONTINUES IN DISCORD.
          </h2>
          <p className="section-sub fade-in mx-auto">
            Ops planning, scrims, clan news, and the RATS community — all in
            one place.
          </p>

          <div className="social-links fade-in">
            <a
              href="https://discord.gg/"
              target="_blank"
              aria-label="Discord"
              className="social-icon"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
              >
                <path d="M18 6h-2c-1.1 0-2 .9-2 2s.9 2 2 2h2c1.1 0 2-.9 2-2s-.9-2-2-2zm-12 0H4c-1.1 0-2 .9-2 2s.9 2 2 2h2c1.1 0 2-.9 2-2s-.9-2-2-2z" />
                <path d="M9 12c-2.2 0-4 1.8-4 4v4h14v-4c0-2.2-1.8-4-4-4H9z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Steam"
              className="social-icon"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <circle cx="9" cy="15" r="2" />
                <circle cx="15.5" cy="8.5" r="2.5" />
                <path d="M10.8 14.2l3-2.5" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="social-icon"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
          </div>

          <div className="fade-in">
            <Link
              href="https://discord.gg/"
              target="_blank"
              className="btn btn-primary btn-large discord-btn"
            >
              JOIN DISCORD
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
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
