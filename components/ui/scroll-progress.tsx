'use client';

import { useState, useEffect } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [isOverDark, setIsOverDark] = useState(false);

  // Throttle helper for 60fps performance
  const throttle = (func: Function, delay: number) => {
    let lastCall = 0;
    return (...args: any[]) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  };

  // Update progress on scroll with faster updates (CSS handles smoothing)
  useEffect(() => {
    const updateProgress = throttle(() => {
      const winScroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setProgress(Math.min(scrolled, 100));
    }, 8); // 120fps potential, CSS transition smooths output

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress(); // Initial calculation

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  // Hybrid approach for color adaptation (SYNCHRONIZED with navigation)
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
    <div
      className={`scroll-progress ${isOverDark ? 'over-dark' : ''}`}
      style={{
        '--scroll-progress': `${progress}%`
      } as React.CSSProperties}
    />
  );
}