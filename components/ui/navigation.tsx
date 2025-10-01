'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOverDark, setIsOverDark] = useState(false);

  // Hybrid approach: IO for efficiency + RAF for responsive color switching
  useEffect(() => {
    const darkSection = document.querySelector('#solution');
    if (!darkSection) return;

    // Position check function for continuous precision
    const checkPosition = () => {
      const rect = darkSection.getBoundingClientRect();
      const navCenter = 30.5;
      const isNavOverDark = rect.top <= navCenter && rect.bottom > navCenter;
      setIsOverDark(isNavOverDark);
    };

    // Intersection Observer for threshold-based detection
    const observer = new IntersectionObserver(
      ([entry]) => {
        checkPosition();
      },
      {
        threshold: Array.from({ length: 20 }, (_, i) => i / 19) // 20 thresholds for smooth detection
      }
    );

    // Scroll listener for real-time color switching (RAF throttled)
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    observer.observe(darkSection);
    window.addEventListener('scroll', handleScroll, { passive: true });
    checkPosition();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
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