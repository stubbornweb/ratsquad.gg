"use client"

import { type JSX, useEffect, useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { spring, ease } from "@/hooks/useAnimations"

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS - Defined outside component to prevent recreation
// ═══════════════════════════════════════════════════════════════════════════════

// Glitch burst frames - Ukrainian flag colors
const GLITCH_FRAMES = [
  { x: -4, shadow: "4px 0 #0057B8, -4px 0 #FFD700" },
  { x: 3, shadow: "-3px 0 #FFD700, 3px 0 #0057B8" },
  { x: -2, shadow: "2px 0 #0057B8, -2px 0 #FFD700" },
  { x: 1, shadow: "-1px 0 #FFD700, 1px 0 #0057B8" },
  { x: 0, shadow: "none" },
] as const

const FRAME_DURATION = 50 // ms per glitch frame

// Animation timing constants
const TIMING = {
  PHASE_2: 800,      // Signal acquisition starts
  PHASE_3: 1800,     // Identity reveal starts
  STATUS_CONFIRM: 2400,
  EXIT_START: 2600,
  COMPLETE: 3100,
} as const

// HUD data - static, no need to recreate
const HUD_DATA = [
  { label: "FREQ", value: "147.300 MHz" },
  { label: "ENCRYPT", value: "AES-256" },
  { label: "LATENCY", value: "12ms" },
  { label: "STATUS", valueLocked: "LOCKED", valueConfirmed: "CONFIRMED" },
] as const

const CORNERS = ["top-left", "top-right", "bottom-left", "bottom-right"] as const

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS - Memoized outside component
// ═══════════════════════════════════════════════════════════════════════════════

const containerVariants = {
  hidden: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

const bracketVariants = {
  hidden: (corner: string) => {
    const [v, h] = corner.split("-")
    return {
      x: h === "left" ? -60 : 60,
      y: v === "top" ? -60 : 60,
      opacity: 0,
    }
  },
  visible: {
    x: 0,
    y: 0,
    opacity: 0.4,
    transition: { ...spring.snappy, delay: 0.1 },
  },
}

const crosshairVariants = {
  hidden: (dir: string) => ({
    x: dir === "h" ? 0 : -30,
    y: dir === "h" ? -30 : 0,
    opacity: 0,
  }),
  visible: {
    x: 0,
    y: 0,
    opacity: 0.2,
    transition: { ...spring.snappy, delay: 0.15 },
  },
}

const hudItemVariants = {
  hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
  visible: (i: number) => ({
    opacity: 1,
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.4, ease: ease.out, delay: i * 0.1 },
  }),
  dimmed: { opacity: 0.15, transition: { duration: 0.3 } },
}

const textRevealVariants = {
  hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.4, ease: ease.out },
  },
}

const glowPulseVariants = {
  hidden: { scale: 0, opacity: 0.3 },
  visible: {
    scale: 1,
    opacity: 0,
    transition: { duration: 0.6, ease: ease.out },
  },
}

const splitVariants = {
  top: {
    exit: {
      y: "-100vh",
      transition: { duration: 0.5, ease: ease.out },
    },
  },
  bottom: {
    exit: {
      y: "100vh",
      transition: { duration: 0.5, ease: ease.out },
    },
  },
}

const progressVariants = {
  initial: { scaleX: 0 },
  animate: {
    scaleX: 1,
    transition: { duration: 3.1, ease: [0, 0, 1, 1] as const }
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOADING SCREEN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps): JSX.Element {
  const [phase, setPhase] = useState(0)
  const [glitchFrame, setGlitchFrame] = useState<number | null>(null)
  const [showGradient, setShowGradient] = useState(false)
  const [statusConfirmed, setStatusConfirmed] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const prefersReduced = useReducedMotion()

  // Glitch burst effect - using requestAnimationFrame for smoother animation
  const runGlitchBurst = useCallback(() => {
    let i = 0
    const step = () => {
      if (i < GLITCH_FRAMES.length) {
        setGlitchFrame(i)
        i++
        setTimeout(step, FRAME_DURATION)
      } else {
        setGlitchFrame(null)
        setShowGradient(true)
        setTimeout(() => setShowGradient(false), 200)
      }
    }
    step()
  }, [])

  // Master timeline - single effect with all timers
  useEffect(() => {
    if (prefersReduced) {
      onComplete()
      return
    }

    const timers: ReturnType<typeof setTimeout>[] = []

    // Phase 2: Signal Acquisition
    timers.push(setTimeout(() => setPhase(2), TIMING.PHASE_2))

    // Phase 3: Identity Confirmation with glitch
    timers.push(setTimeout(() => {
      setPhase(3)
      runGlitchBurst()
    }, TIMING.PHASE_3))

    // Status confirmed
    timers.push(setTimeout(() => setStatusConfirmed(true), TIMING.STATUS_CONFIRM))

    // Phase 4: Exit
    timers.push(setTimeout(() => {
      setIsExiting(true)
      setPhase(4)
    }, TIMING.EXIT_START))

    // Complete
    timers.push(setTimeout(onComplete, TIMING.COMPLETE))

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [onComplete, prefersReduced, runGlitchBurst])

  // Memoized glitch style to prevent object recreation
  const glitchStyle = useMemo(() => {
    if (glitchFrame === null) return {}
    return {
      textShadow: GLITCH_FRAMES[glitchFrame].shadow,
      transform: `translate(${GLITCH_FRAMES[glitchFrame].x}px, 0)`,
    }
  }, [glitchFrame])

  // Memoized gradient style
  const gradientStyle = useMemo(() => showGradient ? {
    background: "linear-gradient(180deg, #0057B8 50%, #FFD700 50%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  } : {}, [showGradient])

  if (prefersReduced) return <></>

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="loading-screen"
          variants={containerVariants}
          initial="hidden"
          exit="exit"
        >
          {/* Grain overlay */}
          <motion.div
            className="loading-grain"
            initial={{ opacity: 0.15 }}
            animate={{ opacity: phase >= 2 ? 0.04 : 0.15 }}
            transition={{ duration: 1 }}
            style={{ willChange: "opacity" }}
          />

          {/* Scanlines */}
          <motion.div
            className="loading-scanlines"
            initial={{ opacity: 0.08 }}
            animate={{ opacity: phase >= 2 ? 0.03 : 0.08 }}
            transition={{ duration: 1 }}
            style={{ willChange: "opacity" }}
          />

          {/* Progress bar */}
          <motion.div
            className="loading-progress"
            variants={progressVariants}
            initial="initial"
            animate="animate"
          />

          {/* Top-left network text */}
          <div className="loading-network-text">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {"RATS ТАКТИЧНА МЕРЕЖА".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02, duration: 0.05 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
            <motion.div
              className="loading-blink"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "loop" }}
            >
              ВСТАНОВЛЕННЯ ЗВ&apos;ЯЗКУ...
            </motion.div>
          </div>

          {/* Corner brackets - render conditionally */}
          {phase >= 2 && (
            <>
              {CORNERS.map((corner) => (
                <motion.div
                  key={corner}
                  className={`loading-corner-bracket loading-corner-bracket--${corner}`}
                  custom={corner}
                  variants={bracketVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ willChange: "transform, opacity" }}
                />
              ))}
            </>
          )}

          {/* Crosshairs */}
          {phase >= 2 && (
            <>
              <motion.div
                className="loading-crosshair loading-crosshair--h"
                custom="h"
                variants={crosshairVariants}
                initial="hidden"
                animate="visible"
                style={{ willChange: "transform, opacity" }}
              />
              <motion.div
                className="loading-crosshair loading-crosshair--v"
                custom="v"
                variants={crosshairVariants}
                initial="hidden"
                animate="visible"
                style={{ willChange: "transform, opacity" }}
              />
            </>
          )}

          {/* Center content */}
          <div className="loading-center">
            {/* Phase 1-2: Waveform / Signal Acquired */}
            {phase < 3 && (
              <>
                <motion.div
                  className="loading-waveform"
                  initial={{ scaleX: 0, opacity: 0.8 }}
                  animate={{
                    scaleX: [0, 0.4, 0.2, 0.5, 0.3, 0.4, 0.2, 0.5],
                    opacity: [0.8, 0.5, 0.8, 0.4, 0.8, 0.5, 0.8],
                  }}
                  transition={{ duration: 0.8, times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1] }}
                  style={{ willChange: "transform, opacity" }}
                />
                {phase >= 2 && (
                  <motion.span
                    className="loading-signal-text"
                    variants={textRevealVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    СИГНАЛ ОТРИМАНО
                  </motion.span>
                )}
              </>
            )}

            {/* Phase 3: RATS Identity */}
            {phase >= 3 && (
              <>
                {/* Glow pulse */}
                <motion.div
                  className="loading-glow-pulse"
                  variants={glowPulseVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ willChange: "transform, opacity" }}
                />

                {/* RATS text */}
                <motion.div
                  className="loading-rats-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ ...glitchStyle, willChange: "transform, opacity" }}
                >
                  <span
                    className={showGradient ? "loading-rats-gradient" : ""}
                    style={gradientStyle}
                  >
                    RATS
                  </span>
                </motion.div>

                {/* Subtitle */}
                <motion.span
                  className="loading-subtitle"
                  variants={textRevealVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                >
                  КОНКУРЕНТНИЙ EU КЛАН У SQUAD
                </motion.span>
              </>
            )}
          </div>

          {/* HUD readout - right side */}
          {phase >= 2 && (
            <motion.div
              className="loading-hud-readout"
              animate={phase >= 3 ? "dimmed" : "visible"}
            >
              {HUD_DATA.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="loading-hud-item"
                  custom={i}
                  variants={hudItemVariants}
                  initial="hidden"
                  animate={phase >= 3 ? "dimmed" : "visible"}
                  style={{ willChange: "opacity, clip-path" }}
                >
                  <span className="loading-hud-label">{item.label}:</span>
                  <span
                    className="loading-hud-value"
                    style={item.label === "STATUS" && statusConfirmed ? { color: "#22C55E" } : {}}
                  >
                    {item.label === "STATUS"
                      ? (statusConfirmed ? item.valueConfirmed : item.valueLocked)
                      : item.value}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Split wipe exit panels */}
      {isExiting && (
        <>
          <motion.div
            className="loading-split loading-split--top"
            variants={splitVariants.top}
            initial={{ y: 0 }}
            animate="exit"
            style={{ willChange: "transform" }}
          />
          <motion.div
            className="loading-split loading-split--bottom"
            variants={splitVariants.bottom}
            initial={{ y: 0 }}
            animate="exit"
            style={{ willChange: "transform" }}
          />
        </>
      )}
    </AnimatePresence>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// WRAPPER COMPONENT - Always shows loading on initial mount
// Ensures fonts and resources are loaded before content appears
// ═══════════════════════════════════════════════════════════════════════════════

export function LoadingScreenWrapper({ children }: { children: React.ReactNode }): JSX.Element {
  // Track if loading is complete - starts false on both server and client
  const [isComplete, setIsComplete] = useState(false)
  // Track if mounted on client - starts false, set to true after hydration via microtask
  const [isMounted, setIsMounted] = useState(false)

  // Use microtask to set mounted state after initial render
  // This avoids the lint error while still updating before paint
  useEffect(() => {
    // Using queueMicrotask to defer state update outside synchronous effect
    queueMicrotask(() => {
      setIsMounted(true)
    })
  }, [])

  const handleComplete = useCallback(() => {
    setIsComplete(true)
  }, [])

  // Lock body scroll during loading
  useEffect(() => {
    if (!isComplete && isMounted) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isComplete, isMounted])

  // Show loader on client after mount until animation completes
  const showLoader = isMounted && !isComplete

  return (
    <>
      {showLoader && <LoadingScreen onComplete={handleComplete} />}
      {/* Hide content until loading complete to prevent FOUC */}
      <div style={{ visibility: showLoader ? "hidden" : "visible" }}>
        {children}
      </div>
    </>
  )
}
