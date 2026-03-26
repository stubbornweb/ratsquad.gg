"use client"

import { type JSX, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { navLinks, DISCORD_URL } from "@/consts/router"
import { cn } from "@/lib/utils"
import { spring } from "@/hooks/useAnimations"

const menuItemVariant = {
  closed: { opacity: 0, x: -16 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.05 + i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export default function Navbar(): JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isMobileMenuOpen])

  return (
    <nav className={cn("navbar", isScrolled && "scrolled")} id="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>RATS</Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="mobile-menu-btn"
          aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
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

        {/* Desktop nav links */}
        <div className="nav-links-desktop">
          {navLinks.map(({ label, href }) => (
            <Link key={href} href={href} className="nav-link">
              {label}
            </Link>
          ))}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.snappy}
          >
            <Link href={DISCORD_URL} className="btn btn-primary nav-cta">
              APPLY NOW
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-menu-inner">
              {navLinks.map(({ label, href }, i) => (
                <motion.div
                  key={href}
                  custom={i}
                  variants={menuItemVariant}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <Link
                    href={href}
                    className="mobile-nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                custom={navLinks.length}
                variants={menuItemVariant}
                initial="closed"
                animate="open"
                exit="closed"
                className="mobile-menu-cta"
              >
                <Link
                  href={DISCORD_URL}
                  className="btn btn-primary btn-large"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  APPLY NOW
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
