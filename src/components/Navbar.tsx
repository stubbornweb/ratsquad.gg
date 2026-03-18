"use client"

import { type JSX, useEffect, useState } from "react";
import Link from "next/link";
import { type NavLink } from "@/types";

const navLinks: NavLink[] = [
  { label: "ABOUT", href: "/#about" },
  { label: "ROSTER", href: "/roster" },
  { label: "FAQ", href: "/#faq" },
  { label: "JOIN US", href: "/#join" },
];

export default function Navbar(): JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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
          {navLinks.map(({ label, href }) => (
            <Link key={href} href={href} className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              {label}
            </Link>
          ))}
          <Link href="https://discord.gg/g2qP3fNk" className="btn btn-primary nav-cta" onClick={() => setIsMobileMenuOpen(false)}>
            APPLY NOW
          </Link>
        </div>
      </div>
    </nav>
  );
}
