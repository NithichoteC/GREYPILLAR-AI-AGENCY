'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOverDark, setIsOverDark] = useState(false);

  // Intersection Observer for adaptive nav colors (Apple/Stripe pattern)
  useEffect(() => {
    const darkSection = document.querySelector('#solution');

    if (!darkSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const rect = entry.target.getBoundingClientRect();
        // "Is this dark section below me now?"
        // Triggers when section has scrolled up and is UNDER the navigation
        const isNavOverDark = rect.top <= 0 && rect.bottom > 61;
        setIsOverDark(isNavOverDark);
        console.log('🎨 Nav Over Dark:', isNavOverDark, '| Section Top:', rect.top.toFixed(0), '| Section Bottom:', rect.bottom.toFixed(0));
      },
      {
        // 2025 Standard: 101 thresholds (0.00 to 1.00) catches mobile momentum scrolling
        threshold: Array.from({ length: 101 }, (_, i) => i / 100)
      }
    );

    observer.observe(darkSection);

    return () => observer.disconnect();
  }, []);

  return (
    <nav className={`glass-nav ${isOverDark ? 'nav-over-dark' : ''}`}>
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