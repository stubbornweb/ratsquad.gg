"use client"

import { type JSX, useCallback, useEffect, useRef, useState } from "react"
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { navLinks, DISCORD_URL } from "@/consts/router"
import { cn } from "@/lib/utils"
import { spring, staggerContainer, fadeIn } from "@/hooks/useAnimations"

/* ── Magnetic hover wrapper ── */
function MagneticLink({
  children,
  href,
  isActive,
  onClick,
}: {
  children: string
  href: string
  isActive: boolean
  onClick?: () => void
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    x.set(dx * 0.15)
    y.set(dy * 0.15)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={href}
        className={cn("nav-link", isActive && "nav-link-active")}
        onClick={onClick}
      >
        {children}
      </Link>
    </motion.div>
  )
}

/* ── Mobile menu item stagger ── */
const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1]

const mobileItemVariant = {
  closed: { opacity: 0, x: -20 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.08 + i * 0.07,
      duration: 0.4,
      ease: easeOut,
    },
  }),
}

export default function Navbar(): JSX.Element {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [logoGlitching, setLogoGlitching] = useState(false)

  /* ── Scroll state ── */
  const [navState, setNavState] = useState({
    visible: true,
    scrolled: false,
    progress: 0,
  })
  const lastScrollY = useRef(0)
  const rafId = useRef(0)

  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafId.current)
    rafId.current = requestAnimationFrame(() => {
      const y = window.scrollY
      const scrollingDown = y > lastScrollY.current
      const nearTop = y < 100

      setNavState({
        visible: !scrollingDown || nearTop || isMobileMenuOpen,
        scrolled: y > 50,
        progress: Math.min(y / 300, 1),
      })

      lastScrollY.current = y
    })
  }, [isMobileMenuOpen])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(rafId.current)
    }
  }, [handleScroll])

  /* ── Active section tracking ── */
  const [activeSection, setActiveSection] = useState("")
  const isHomePage = pathname === "/"

  useEffect(() => {
    if (!isHomePage) return

    const sectionIds = ["about", "faq", "join"]
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { threshold: 0.3, rootMargin: "-64px 0px -50% 0px" },
    )

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => {
      observer.disconnect()
      setActiveSection("")
    }
  }, [isHomePage])

  /* ── Body scroll lock ── */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  /* ── Logo glitch ── */
  const triggerGlitch = () => {
    if (logoGlitching) return
    setLogoGlitching(true)
    setTimeout(() => setLogoGlitching(false), 500)
  }

  /* ── Check active link ── */
  const isLinkActive = (href: string) => {
    if (href === "/roster") return pathname === "/roster"
    const hash = href.replace("/#", "")
    return activeSection === hash
  }

  return (
    <motion.nav
      className={cn("navbar", navState.scrolled && "scrolled")}
      id="navbar"
      animate={{ y: navState.visible ? 0 : -100 }}
      transition={spring.snappy}
      style={{
        background: `rgba(9, 9, 11, ${0.85 * navState.progress})`,
        backdropFilter: `blur(${16 * navState.progress}px)`,
        WebkitBackdropFilter: `blur(${16 * navState.progress}px)`,
      }}
    >
      {/* Noise texture */}
      <div
        className="nav-noise"
        style={{ opacity: 0.03 * navState.progress }}
      />

      {/* Scanline */}
      <div
        className="nav-scanline"
        style={{ opacity: navState.progress }}
      />

      <motion.div
        className="nav-container"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Zone 1: Brand + Status */}
        <motion.div className="nav-brand" variants={fadeIn}>
          <div
            onMouseEnter={triggerGlitch}
          >
            <Link
              href="/"
              className={cn(
                "nav-logo-text",
                logoGlitching && "glitch-active",
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              RATS
            </Link>
          </div>
          <span className="nav-status">
            <span className="nav-status-dot" />
            <span className="nav-status-label">ACTIVE</span>
          </span>
        </motion.div>

        {/* Zone 2: Centered nav links */}
        <motion.div className="nav-links-desktop" variants={fadeIn}>
          {navLinks.map(({ label, href }) => (
            <MagneticLink
              key={href}
              href={href}
              isActive={isLinkActive(href)}
            >
              {label}
            </MagneticLink>
          ))}
        </motion.div>

        {/* Zone 3: CTA */}
        <motion.div className="nav-actions" variants={fadeIn}>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.snappy}
          >
            <Link href={DISCORD_URL} className="btn btn-primary nav-cta">
              ПОДАТИ ЗАЯВКУ
            </Link>
          </motion.div>
        </motion.div>

        {/* Mobile toggle */}
        <button
          className="mobile-menu-btn"
          aria-label={isMobileMenuOpen ? "Закрити меню" : "Відкрити меню"}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} strokeWidth={2} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} strokeWidth={2} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </motion.div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.4, ease: easeOut }}
          >
            <div className="mobile-menu-inner">
              {/* Header */}
              <div className="mobile-menu-header">
                <span className="mobile-menu-label">{"// НАВІГАЦІЯ"}</span>
              </div>

              {/* Links */}
              <div className="mobile-menu-links">
                {navLinks.map(({ label, href, description }, i) => (
                  <motion.div
                    key={href}
                    custom={i}
                    variants={mobileItemVariant}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <Link
                      href={href}
                      className={cn(
                        "mobile-nav-link",
                        isLinkActive(href) && "mobile-nav-link-active",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="mobile-link-index">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="mobile-link-content">
                        <span className="mobile-link-label">{label}</span>
                        <span className="mobile-link-desc">{description}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Bottom CTA */}
              <motion.div
                className="mobile-menu-cta"
                custom={navLinks.length}
                variants={mobileItemVariant}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <Link
                  href={DISCORD_URL}
                  className="btn btn-primary btn-large"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ПОДАТИ ЗАЯВКУ
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
