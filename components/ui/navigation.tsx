'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOverDark, setIsOverDark] = useState(false);

  // Intersection Observer ONLY - no layout reads in scroll handler
  useEffect(() => {
    const darkSection = document.querySelector('#solution');
    if (!darkSection) return;

    // Position check function (called only by IO async callback)
    const checkPosition = () => {
      const rect = darkSection.getBoundingClientRect();
      const navCenter = 30.5;
      const isNavOverDark = rect.top <= navCenter && rect.bottom > navCenter;
      setIsOverDark(isNavOverDark);
    };

    // Intersection Observer with 20 thresholds for smooth detection
    const observer = new IntersectionObserver(
      ([entry]) => {
        checkPosition(); // Async IO callback - no layout thrashing
      },
      {
        threshold: Array.from({ length: 20 }, (_, i) => i / 19)
      }
    );

    observer.observe(darkSection);
    checkPosition(); // Initial check

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <nav className={`glass-nav ${isOverDark ? 'nav-over-dark' : ''} ${isMobileMenuOpen ? 'menu-open' : ''}`}>
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
        </div>
      </nav>
      <button
        className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''} ${isOverDark ? 'over-dark' : ''}`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <span className="menu-text">{isMobileMenuOpen ? 'close' : 'menu'}</span>
        <div className="menu-icon">
          <div className="menu-line"></div>
          <div className="menu-line"></div>
        </div>
      </button>
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
    </>
  );
}