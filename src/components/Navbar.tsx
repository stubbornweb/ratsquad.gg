"use client"

import { type JSX, useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { navLinks, DISCORD_URL } from "@/consts/router";
import { cn } from "@/lib/utils";

export default function Navbar(): JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn("navbar", isScrolled && "scrolled")} id="navbar">
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
          <Menu
            size={24}
            strokeWidth={2}
          />
        </button>

        <div className={cn("nav-links", isMobileMenuOpen && "active")}>
          {navLinks.map(({ label, href }) => (
            <Link key={href} href={href} className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              {label}
            </Link>
          ))}
          <Link href={DISCORD_URL} className="btn btn-primary nav-cta" onClick={() => setIsMobileMenuOpen(false)}>
            APPLY NOW
          </Link>
        </div>
      </div>
    </nav>
  );
}
