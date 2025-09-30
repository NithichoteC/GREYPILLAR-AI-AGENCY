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
        // Nav is "over dark" when dark section intersects with top 80px (nav height)
        setIsOverDark(entry.isIntersecting);
      },
      {
        // Watch for intersection at nav height
        rootMargin: '-80px 0px 0px 0px',
        threshold: 0
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