'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FloatingCTAProps {
  heroCTARef?: React.RefObject<HTMLElement>;
}

export default function FloatingCTA({ heroCTARef }: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isOverDark, setIsOverDark] = useState(false);

  // Intersection Observer for show/hide logic (Stripe/Arc Browser pattern)
  useEffect(() => {
    if (!heroCTARef?.current) {
      // Default: show after scrolling past viewport
      const handleScroll = () => {
        setIsVisible(window.scrollY > window.innerHeight * 0.8);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();

      return () => window.removeEventListener('scroll', handleScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show floating CTA when hero CTA out of view
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '0px'
      }
    );

    observer.observe(heroCTARef.current);

    return () => observer.disconnect();
  }, [heroCTARef]);

  // Adaptive color detection (same as navigation)
  useEffect(() => {
    const darkSection = document.querySelector('#solution');

    if (!darkSection) return;

    const checkPosition = () => {
      const rect = darkSection.getBoundingClientRect();
      const buttonBottom = window.innerHeight - 24; // Button position from bottom
      const isOverDarkSection = rect.top <= buttonBottom && rect.bottom > buttonBottom;
      setIsOverDark(isOverDarkSection);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        checkPosition();
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100)
      }
    );

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
    <div
      className={`floating-cta ${isVisible ? 'visible' : ''}`}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 50,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 300ms ease-in-out, transform 300ms ease-in-out',
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      <div className="glass-button-wrap cursor-pointer rounded-full">
        <button className={`glass-button relative isolate all-unset cursor-pointer rounded-full transition-all ${isOverDark ? 'over-dark' : ''}`}>
          <Link href="#audit" className="glass-button-text relative block select-none tracking-tighter">
            Book Strategy Call
          </Link>
        </button>
      </div>
    </div>
  );
}