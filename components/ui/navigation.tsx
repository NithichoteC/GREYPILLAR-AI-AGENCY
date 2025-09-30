'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="glass-nav">
      <div className="nav-container">
        <Link href="/" className="logo">
          GREYPILLAR
        </Link>
        <div className="nav-links">
          <Link href="#problem" className="nav-link">Problem</Link>
          <Link href="#solution" className="nav-link">Solution</Link>
          <Link href="#how" className="nav-link">How We Work</Link>
          <Link href="#results" className="nav-link">Results</Link>
          <Link href="/contact" className="nav-cta">
            Get Started
            <div className="underline"></div>
          </Link>
        </div>
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="menu-text">menu</span>
          <div className="menu-icon">
            <div className="menu-line"></div>
            <div className="menu-line"></div>
          </div>
        </button>
      </div>
      <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link href="#problem" className="nav-link">Problem</Link>
        <Link href="#solution" className="nav-link">Solution</Link>
        <Link href="#how" className="nav-link">How We Work</Link>
        <Link href="#results" className="nav-link">Results</Link>
        <Link href="/contact" className="nav-cta">
          Get Started
          <div className="underline"></div>
        </Link>
      </div>
    </nav>
  );
}