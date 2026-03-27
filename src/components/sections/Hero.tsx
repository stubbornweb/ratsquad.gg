"use client"

import { type JSX, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { spring, ease } from "@/hooks/useAnimations"
import { HeroGlitchLine } from "@/components/ui/HeroGlitchLine"

const boot = (delay: number) => ({
  initial: { opacity: 0, y: 24, clipPath: "inset(0 100% 0 0)" },
  animate: { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" },
  transition: { duration: 0.85, ease: ease.out, delay },
})

export default function Hero(): JSX.Element {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const { scrollY } = useScroll()

  // Parallax transforms
  const gridY = useTransform(scrollY, [0, 600], [0, 90])
  const watermarkY = useTransform(scrollY, [0, 600], [0, -60])
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const contentY = useTransform(scrollY, [0, 400], [0, -40])
  const indicatorOpacity = useTransform(scrollY, [0, 100], [1, 0])

  return (
    <header className="hero" id="hero">
      {/* Grid background — parallax */}
      <motion.div className="hero-grid-bg" style={{ y: gridY }} />

      {/* Video — fades in once loaded */}
      <motion.video
        className="hero-video-bg"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        onCanPlayThrough={() => setVideoLoaded(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: videoLoaded ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <source src="/assets/inspo-images/hero-bg.mp4" type="video/mp4" />
      </motion.video>

      {/* Vignette + bottom fade */}
      <div className="hero-vignette" />
      <div className="hero-bottom-fade" />

      {/* Grain + scanlines overlays */}
      <div className="hero-grain" />
      <div className="hero-scanlines" />

      {/* Giant watermark — parallax */}
      <motion.span className="hero-watermark" style={{ y: watermarkY }}>
        RATS
      </motion.span>

      {/* Content — fades on scroll */}
      <motion.div className="hero-content" style={{ opacity: contentOpacity, y: contentY }}>
        <motion.div className="hero-tag" {...boot(0.3)}>
          <span className="tag-line" />
          <span>SQUAD — EU COMPETITIVE CLAN</span>
        </motion.div>

        <h1 className="hero-headline">
          <HeroGlitchLine bootDelay={0.5} delay={2500} interval={7000}>
            MOVE AS ONE.
          </HeroGlitchLine>
          <HeroGlitchLine bootDelay={0.65} delay={2700} interval={7000}>
            STRIKE AS
          </HeroGlitchLine>
          <HeroGlitchLine bootDelay={0.8} delay={2900} interval={7000}>
            ONE.
          </HeroGlitchLine>
        </h1>

        <motion.p className="hero-sub" {...boot(0.85)}>
          RATS is a competitive EU mil-sim clan for Squad. We don&apos;t play for
          fun. We play to win — together.
        </motion.p>

        <motion.div className="hero-actions" {...boot(1.05)}>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.snappy}
          >
            <Link href="/#join" className="btn btn-primary btn-large">
              APPLY TO JOIN
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ x: 4 }}
            transition={spring.snappy}
          >
            <Link href="/#about" className="btn btn-text">
              LEARN MORE &darr;
            </Link>
          </motion.div>
        </motion.div>

        <motion.div className="hero-stats" {...boot(1.25)}>
          <div className="stat-item">EU BASED</div>
          <div className="stat-item">SQUAD ONLY</div>
          <div className="stat-item">SELECTIVE RECRUITMENT</div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator — smooth fade out */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ opacity: indicatorOpacity }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <span className="scroll-ping" />
        <span className="scroll-label">SCROLL</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="scroll-bounce"
          aria-hidden="true"
        >
          <path
            d="M8 3v10M4 9l4 4 4-4"
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeLinecap="square"
          />
        </svg>
      </motion.div>
    </header>
  )
}
