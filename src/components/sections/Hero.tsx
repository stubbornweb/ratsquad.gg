"use client"

import { type JSX, useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { spring } from "@/hooks/useAnimations"

const heroUp = (delay: number) => ({
  initial: { opacity: 0, y: 20, clipPath: "inset(0 100% 0 0)" },
  animate: { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay },
})

export default function Hero(): JSX.Element {
  const [scrollY, setScrollY] = useState(0)
  const [videoLoaded, setVideoLoaded] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="hero" id="hero">
      {/* Grid background — always visible */}
      <div
        className="hero-grid-bg"
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      />

      {/* Video — only shown once loaded, overlaid on grid */}
      <video
        className="hero-video-bg"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        onCanPlayThrough={() => setVideoLoaded(true)}
        style={{ opacity: videoLoaded ? 1 : 0 }}
      >
        <source src="/assets/inspo-images/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Vignette + bottom fade */}
      <div className="hero-vignette"></div>
      <div className="hero-bottom-fade"></div>

      {/* Grain + scanlines overlays */}
      <div className="hero-grain"></div>
      <div className="hero-scanlines"></div>

      {/* Giant watermark */}
      <span className="hero-watermark">RATS</span>

      {/* Content */}
      <div className="hero-content">
        <motion.div className="hero-tag" {...heroUp(0.35)}>
          <span className="tag-line"></span> SQUAD — EU COMPETITIVE CLAN
        </motion.div>

        <h1 className="hero-headline">
          <motion.span className="block" {...heroUp(0.5)}>
            MOVE AS ONE.
          </motion.span>
          <motion.span className="block" {...heroUp(0.65)}>
            STRIKE AS ONE.
          </motion.span>
        </h1>

        <motion.p className="hero-sub" {...heroUp(0.82)}>
          RATS is a competitive EU mil-sim clan for Squad. We don&apos;t play for
          fun. We play to win — together.
        </motion.p>

        <motion.div className="hero-actions" {...heroUp(1.0)}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={spring.snappy}>
            <Link href="/#join" className="btn btn-primary btn-large">
              APPLY TO JOIN
            </Link>
          </motion.div>
          <Link href="/#about" className="btn btn-text">
            LEARN MORE &darr;
          </Link>
        </motion.div>

        <motion.div className="hero-stats" {...heroUp(1.18)}>
          <div className="stat-item">EU BASED</div>
          <div className="stat-item">SQUAD ONLY</div>
          <div className="stat-item">SELECTIVE RECRUITMENT</div>
        </motion.div>
      </div>

      {/* Scroll indicator — hidden once scrolled */}
      {scrollY < 100 && (
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <span className="scroll-ping"></span>
          <span className="scroll-label">SCROLL</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="scroll-bounce"
          >
            <path
              d="M8 3v10M4 9l4 4 4-4"
              stroke="#FFD700"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
        </motion.div>
      )}
    </header>
  )
}
