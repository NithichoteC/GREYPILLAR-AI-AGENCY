'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FloatingCTAProps {
  heroCTARef?: React.RefObject<HTMLElement>;
}

export default function FloatingCTA({ heroCTARef }: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

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
        <button className="glass-button relative isolate all-unset cursor-pointer rounded-full transition-all">
          <Link href="#audit" className="glass-button-text relative block select-none tracking-tighter">
            Book Strategy Call
          </Link>
        </button>
        <div className="glass-button-shadow rounded-full"></div>
      </div>
    </div>
  );
}