'use client';

import { useState, useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);
  const [isOverDark, setIsOverDark] = useState(false);

  // RAF-based scroll tracking with direct DOM manipulation (zero React overhead)
  useEffect(() => {
    let rafId: number | null = null;

    const updateProgress = () => {
      // Cross-browser scroll position with iOS bounce protection
      const winScroll = Math.max(0, window.scrollY || document.documentElement.scrollTop);

      // Safari-compatible height calculation (Math.max for accurate scrollHeight)
      const height = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      ) - window.innerHeight;

      const scrolled = Math.min((winScroll / height) * 100, 100);

      // Direct DOM manipulation bypasses React re-renders (0ms overhead)
      // toFixed(2) ensures sub-percentage precision (45.67 instead of 45)
      if (progressRef.current) {
        progressRef.current.style.setProperty('--scroll-progress', scrolled.toFixed(2));
      }
    };

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateProgress);
    };

    // iOS Safari momentum scrolling support (touchmove/touchend)
    const handleTouch = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('touchend', handleTouch, { passive: true });
    updateProgress(); // Initial calculation

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchend', handleTouch);
    };
  }, []);

  // Hybrid approach for color adaptation (SYNCHRONIZED with navigation)
  useEffect(() => {
    const darkSection = document.querySelector('#solution');

    if (!darkSection) return;

    // Position check function - SYNCHRONIZED with navigation (exact same trigger)
    const checkPosition = () => {
      const rect = darkSection.getBoundingClientRect();
      const progressCenter = 30.5; // Match nav center (61px / 2) for synchronized switching
      const isProgressOverDark = rect.top <= progressCenter && rect.bottom > progressCenter;
      setIsOverDark(isProgressOverDark);
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
    <div
      ref={progressRef}
      className={`scroll-progress ${isOverDark ? 'over-dark' : ''}`}
      style={{
        '--scroll-progress': '0'
      } as React.CSSProperties}
    />
  );
}