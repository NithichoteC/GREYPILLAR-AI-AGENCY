'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOverDark, setIsOverDark] = useState(false);

  // Hybrid approach for adaptive nav colors (2025 industry standard)
  useEffect(() => {
    const darkSection = document.querySelector('#solution');

    if (!darkSection) return;

    // Position check function for continuous precision
    const checkPosition = () => {
      const rect = darkSection.getBoundingClientRect();
      const isNavOverDark = rect.top <= 0 && rect.bottom > 61;
      setIsOverDark(isNavOverDark);
    };

    // Intersection Observer for threshold-based detection (performance)
    const observer = new IntersectionObserver(
      ([entry]) => {
        checkPosition(); // Update on threshold crossings
      },
      {
        // 101 thresholds catches mobile momentum scrolling
        threshold: Array.from({ length: 101 }, (_, i) => i / 100)
      }
    );

    // Scroll listener for slow scrolling precision (RAF throttled)
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
    checkPosition(); // Initial check

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
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