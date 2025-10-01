'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GlassButton } from './glass-button';

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
        // Show floating CTA when main "Find My Revenue Leaks" CTA out of view
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '0px 0px -200px 0px' // Hide when main CTA within 200px of bottom viewport
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
      const buttonHeight = 50; // Approximate button height
      const buttonCenter = buttonBottom - (buttonHeight / 2); // Triggers at 50% overlap
      const isOverDarkSection = rect.top <= buttonCenter && rect.bottom > buttonCenter;
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
        transform: isVisible ? 'translateY(0) translateZ(0)' : 'translateY(20px) translateZ(0)',
        transition: 'transform 150ms ease-in-out',
        backfaceVisibility: 'hidden',
        pointerEvents: isVisible ? 'auto' : 'none'
      } as React.CSSProperties}
    >
      <Link href="#audit">
        <GlassButton
          className={isOverDark ? 'over-dark' : ''}
          size="default"
        >
          Book Strategy Call
        </GlassButton>
      </Link>
    </div>
  );
}