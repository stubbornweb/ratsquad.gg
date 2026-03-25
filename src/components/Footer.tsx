import { type JSX } from "react";
import Link from "next/link";
import { DISCORD_URL } from "@/consts/router";

export default function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();
  return (
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
            <Link href="/#about" className="footer-link">About</Link>
            <Link href="/roster" className="footer-link">Roster</Link>
            <Link href="/#faq" className="footer-link">FAQ</Link>
            <Link href="/#join" className="footer-link">How to Join</Link>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">COMMUNITY</h4>
            <Link href={DISCORD_URL} className="footer-link" target="_blank" rel="noopener noreferrer">Discord</Link>
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
            RATS &copy; {currentYear} &mdash; ALL RIGHTS RESERVED
          </div>
          <div className="footer-legal">
            SQUAD IS A TRADEMARK OF OFFWORLD INDUSTRIES
          </div>
        </div>
      </div>

      <div className="footer-brand-mark">
        <div className="brand-mark-text">RATS</div>
      </div>
    </footer>
  );
}
