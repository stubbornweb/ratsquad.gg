"use client"

import { type JSX, useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { spring } from "@/hooks/useAnimations"

const heroUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
})

const heroFade = (delay: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
})

export default function Hero(): JSX.Element {
  const [terminalLines, setTerminalLines] = useState<string[]>([])

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
    ]

    const typingSpeedMs = 30
    const lineDelayMs = 800
    const clearDelayMs = 4000

    let logIndex = 0
    let charIndex = 0
    let timeoutId: NodeJS.Timeout

    const typeNext = () => {
      if (logIndex >= terminalLogs.length) {
        timeoutId = setTimeout(() => {
          setTerminalLines([])
          logIndex = 0
          charIndex = 0
          typeNext()
        }, clearDelayMs)
        return
      }

      const targetLine = terminalLogs[logIndex]

      if (charIndex < targetLine.length) {
        const partial = targetLine.slice(0, charIndex + 1)
        charIndex++
        setTerminalLines((prev) => {
          const next = [...prev]
          next[logIndex] = partial
          return next
        })
        timeoutId = setTimeout(typeNext, targetLine === " " ? 0 : typingSpeedMs)
      } else {
        logIndex++
        charIndex = 0
        timeoutId = setTimeout(typeNext, lineDelayMs)
      }
    }

    const initialTimeout = setTimeout(typeNext, 1500)

    return () => {
      clearTimeout(initialTimeout)
      clearTimeout(timeoutId)
    }
  }, [])

  return (
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
  )
}
