'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOverDark, setIsOverDark] = useState(false);

  // Intersection Observer ONLY - no RAF scroll handler (eliminates layout thrashing)
  useEffect(() => {
    const darkSection = document.querySelector('#solution');
    if (!darkSection) return;

    const cachedRect = { top: 0, bottom: 0 };

    // Cache rect updates from Intersection Observer
    const updateCachedRect = () => {
      const rect = darkSection.getBoundingClientRect();
      cachedRect.top = rect.top;
      cachedRect.bottom = rect.bottom;
    };

    // Check position using cached values
    const checkPosition = () => {
      const navCenter = 30.5;
      const isNavOverDark = cachedRect.top <= navCenter && cachedRect.bottom > navCenter;
      setIsOverDark(isNavOverDark);
    };

    // Intersection Observer with optimized thresholds
    const observer = new IntersectionObserver(
      () => {
        updateCachedRect();
        checkPosition();
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] } // 5 thresholds vs 101 (95% less memory)
    );

    observer.observe(darkSection);
    updateCachedRect();
    checkPosition();

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