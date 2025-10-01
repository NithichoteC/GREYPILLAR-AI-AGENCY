'use client';

import { useState, useEffect } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [isOverDark, setIsOverDark] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // RAF-based scroll tracking with iOS Safari fixes (2025 industry standard)
  useEffect(() => {
    let rafId: number | null = null;
    let scrollEndTimer: NodeJS.Timeout | null = null;

    const updateProgress = () => {
      // Cross-browser scroll position (Safari uses window.scrollY, Chrome uses both)
      const winScroll = window.scrollY || document.documentElement.scrollTop;

      // Safari-compatible height calculation (Math.max for accurate scrollHeight)
      const height = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      ) - window.innerHeight;

      const scrolled = (winScroll / height) * 100;
      setProgress(Math.min(scrolled, 100));
    };

    const handleScroll = () => {
      setIsScrolling(true);
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateProgress);

      // Detect scroll end for GPU acceleration cleanup
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => setIsScrolling(false), 150);
    };

    // iOS Safari momentum scrolling support (touchmove/touchend)
    const handleTouch = () => {
      setIsScrolling(true);
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateProgress);

      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => setIsScrolling(false), 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('touchend', handleTouch, { passive: true });
    updateProgress(); // Initial calculation

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
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
      className={`scroll-progress ${isOverDark ? 'over-dark' : ''} ${isScrolling ? 'scrolling' : ''}`}
      style={{
        '--scroll-progress': progress
      } as React.CSSProperties}
    />
  );
}