"use client"

import { type JSX, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { type FaqItem } from "@/types";
import { FEATURED_MEMBERS } from "@/data/roster";
import { FaqAccordion } from "@/components/FaqAccordion";
import { spring } from "@/hooks/useAnimations";

// Animation prop helpers — hero (immediate) vs scroll-triggered
const heroUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
});

const heroFade = (delay: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
});

const scrollFade = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
});

export default function Home(): JSX.Element {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  // Terminal typing effect — state-driven, no innerHTML mutation
  useEffect(() => {
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
      "> UPLINK SECURE.",
    ];

    const typingSpeedMs = 30;
    const lineDelayMs = 800;
    const clearDelayMs = 4000;

    let logIndex = 0;
    let charIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const typeNext = () => {
      if (logIndex >= terminalLogs.length) {
        timeoutId = setTimeout(() => {
          setTerminalLines([]);
          logIndex = 0;
          charIndex = 0;
          typeNext();
        }, clearDelayMs);
        return;
      }

      const targetLine = terminalLogs[logIndex];

      if (charIndex < targetLine.length) {
        const partial = targetLine.slice(0, charIndex + 1);
        charIndex++;
        setTerminalLines((prev) => {
          const next = [...prev];
          next[logIndex] = partial;
          return next;
        });
        timeoutId = setTimeout(typeNext, targetLine === " " ? 0 : typingSpeedMs);
      } else {
        logIndex++;
        charIndex = 0;
        timeoutId = setTimeout(typeNext, lineDelayMs);
      }
    };

    const initialTimeout = setTimeout(typeNext, 1500);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(timeoutId);
    };
  }, []);

  const faqs: FaqItem[] = [
    { question: "What timezones do you operate in?", answer: "We primarily operate in EU timezones (CET/CEST), with dedicated operations running during EU evening hours." },
    { question: "Do I need DLC or specific mods?", answer: "We play vanilla Squad for most of our competitive matches, but occasionally participate in modded events. We will announce any required mods well in advance." },
    { question: "How does the recruitment process work?", answer: "Join our Discord, submit an application ticket, and you will be invited to a voice interview. If approved, you enter a trial phase where we assess your communication and teamwork in-game." },
    { question: "Are you a competitive/esports clan?", answer: "Yes. While we enjoy standard matches, our primary focus is structured, competitive 50v50 scrims and tournaments." },
  ];

  return (
    <>
      <Navbar />

      {/* 2. Hero Section */}
      <header className="hero" id="hero">
        <div className="noise-overlay"></div>
        <video className="hero-video-bg" autoPlay loop muted playsInline preload="metadata">
          <source src="/assets/inspo-images/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="hero-bg-overlay"></div>
        <div className="hero-content">
          <motion.div className="hero-tag" {...heroUp(0)}>
            <span className="tag-line"></span> SQUAD — EU COMPETITIVE CLAN
          </motion.div>
          <h1 className="hero-headline">
            <motion.span className="block" {...heroUp(0.15)}>
              MOVE AS ONE.
            </motion.span>
            <motion.span className="block" {...heroUp(0.3)}>
              STRIKE AS ONE.
            </motion.span>
          </h1>
          <motion.p className="hero-sub" {...heroUp(0.5)}>
            RATS is a competitive EU mil-sim clan for Squad. We don&apos;t play for
            fun. We play to win — together.
          </motion.p>
          <motion.div className="hero-actions" {...heroUp(0.7)}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={spring.snappy}>
              <Link href="/#join" className="btn btn-primary btn-large">
                APPLY TO JOIN
              </Link>
            </motion.div>
            <Link href="/#about" className="btn btn-text">
              LEARN MORE &darr;
            </Link>
          </motion.div>
          <motion.div className="hero-stats" {...heroUp(0.9)}>
            <div className="stat-item">EU BASED</div>
            <div className="stat-item">SQUAD ONLY</div>
            <div className="stat-item">SELECTIVE RECRUITMENT</div>
          </motion.div>
        </div>

        {/* Right Side: Tactical HUD & Terminal */}
        <motion.div className="hero-hud" {...heroFade(1.2)}>
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
              <div className="terminal-content">
                {terminalLines.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
              <span className="terminal-cursor">&#x2588;</span>
            </div>

            {/* Stats Box in HUD */}
            <div className="hud-stats-grid">
              <div>
                <div className="hud-stat-label">ACTIVE MEMS</div>
                <div className="hud-stat-value">42</div>
              </div>
              <div>
                <div className="hud-stat-label">SQUAD LEADS</div>
                <div className="hud-stat-value">8</div>
              </div>
              <div>
                <div className="hud-stat-label">RECRUITS</div>
                <div className="hud-stat-value">12</div>
              </div>
              <div>
                <div className="hud-stat-label">ESTABLISHED</div>
                <div className="hud-stat-value">2023</div>
              </div>
            </div>

            <div className="hud-footer hud-footer-compact">
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
        </motion.div>
      </header>

      {/* 3. About the Clan */}
      <section className="section about" id="about">
        <div className="section-container">
          <div className="about-grid">
            <motion.div className="about-content" {...scrollFade()}>
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
            </motion.div>
            <motion.div className="about-pillars" {...scrollFade(0.2)}>
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Roster / Members */}
      <section className="section roster" id="roster">
        <div className="section-container">
          <motion.div className="section-tag" {...scrollFade()}>
            <span className="tag-line"></span> THE UNIT
          </motion.div>
          <motion.h2 className="section-headline" {...scrollFade(0.1)}>MEET THE RATS.</motion.h2>
          <motion.p className="section-sub" {...scrollFade(0.2)}>
            A small, selective unit of serious Squad players.
          </motion.p>

          <motion.div className="roster-grid" {...scrollFade(0.3)}>
            {FEATURED_MEMBERS.map((member) => (
              <div className="roster-card" key={member.callsign}>
                <div className="avatar-placeholder">
                  <span className="watermark">RATS</span>
                </div>
                <div className="role-tag">{member.role}</div>
                <h3 className="member-name">{member.callsign}</h3>
                <div className="member-stats">{member.hours}h &middot; Since {member.since}</div>
              </div>
            ))}

            <Link href="/roster" className="roster-card join-teaser">
              <div className="join-teaser-content">VIEW FULL ROSTER &rarr;</div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 5. How to Join / Recruitment */}
      <section className="section join" id="join">
        <div className="section-border-top"></div>
        <div className="section-container">
          <motion.div className="section-tag" {...scrollFade()}>
            <span className="tag-line"></span> RECRUITMENT
          </motion.div>
          <motion.h2 className="section-headline" {...scrollFade(0.1)}>
            THINK YOU HAVE WHAT IT TAKES?
          </motion.h2>
          <motion.p className="section-sub" {...scrollFade(0.2)}>
            We recruit selectively. We don&apos;t fill seats — we build a unit.
          </motion.p>

          <motion.div className="join-grid" {...scrollFade(0.3)}>
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
          </motion.div>

          <motion.div className="join-cta" {...scrollFade(0.4)}>
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
          </motion.div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="section faq" id="faq">
        <div className="section-container">
          <motion.div className="section-tag" {...scrollFade()}>
            <span className="tag-line"></span> INTELLIGENCE
          </motion.div>
          <motion.h2 className="section-headline" {...scrollFade(0.1)}>
            FREQUENTLY ASKED QUESTIONS
          </motion.h2>
          <motion.p className="section-sub" style={{ marginTop: "-24px", marginBottom: "40px" }} {...scrollFade(0.2)}>
            Need intel before committing? Read our standard operating procedures.
          </motion.p>

          <motion.div {...scrollFade(0.3)}>
            <FaqAccordion faqs={faqs} />
          </motion.div>
        </div>
      </section>

      {/* 7. Discord & Social Links */}
      <section className="discord-banner" id="discord">
        <div className="noise-overlay"></div>
        <div className="section-border-top"></div>
        <div className="section-container text-center">
          <motion.div className="section-tag center-tag" {...scrollFade()}>
            <span className="tag-line"></span> COMMUNITY{" "}
            <span className="tag-line"></span>
          </motion.div>
          <motion.h2 className="section-headline" {...scrollFade(0.1)}>
            THE MISSION CONTINUES IN DISCORD.
          </motion.h2>
          <motion.p className="section-sub mx-auto" {...scrollFade(0.2)}>
            Ops planning, scrims, clan news, and the RATS community — all in
            one place.
          </motion.p>

          <motion.div className="social-links" {...scrollFade(0.3)}>
            <a
              href="https://discord.gg/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="social-icon"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
                <path d="M18 6h-2c-1.1 0-2 .9-2 2s.9 2 2 2h2c1.1 0 2-.9 2-2s-.9-2-2-2zm-12 0H4c-1.1 0-2 .9-2 2s.9 2 2 2h2c1.1 0 2-.9 2-2s-.9-2-2-2z" />
                <path d="M9 12c-2.2 0-4 1.8-4 4v4h14v-4c0-2.2-1.8-4-4-4H9z" />
              </svg>
            </a>
          </motion.div>

          <motion.div {...scrollFade(0.4)}>
            <Link
              href="https://discord.gg/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-large discord-btn"
            >
              JOIN DISCORD
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
