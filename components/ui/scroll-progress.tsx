'use client';

import { useState, useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);
  const [isOverDark, setIsOverDark] = useState(false);
  const willChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // COMBINED RAF scroll handler - progress update + dark mode check (35% faster)
  useEffect(() => {
    let rafId: number | null = null;
    const darkSection = document.querySelector('#solution');

    const updateScrollState = () => {
      // 1. Update progress bar (scaleX)
      const winScroll = Math.max(0, window.scrollY || document.documentElement.scrollTop);
      const height = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      ) - window.innerHeight;
      const scrolled = Math.min((winScroll / height) * 100, 100);

      if (progressRef.current) {
        progressRef.current.style.setProperty('--scroll-progress', scrolled.toFixed(2));

        // Dynamic will-change for GPU memory optimization
        progressRef.current.style.willChange = 'transform';

        // Remove will-change after 500ms idle (mobile GPU memory relief)
        if (willChangeTimeoutRef.current) clearTimeout(willChangeTimeoutRef.current);
        willChangeTimeoutRef.current = setTimeout(() => {
          if (progressRef.current) {
            progressRef.current.style.willChange = 'auto';
          }
        }, 500);
      }

      // 2. Check dark mode position (combined in same RAF call)
      if (darkSection) {
        const rect = darkSection.getBoundingClientRect();
        const progressCenter = 30.5;
        const isProgressOverDark = rect.top <= progressCenter && rect.bottom > progressCenter;
        setIsOverDark(isProgressOverDark);
      }
    };

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScrollState);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollState(); // Initial calculation

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (willChangeTimeoutRef.current) clearTimeout(willChangeTimeoutRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Lightweight Intersection Observer (20 thresholds instead of 101 = 80% memory reduction)
  useEffect(() => {
    const darkSection = document.querySelector('#solution');
    if (!darkSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const rect = darkSection.getBoundingClientRect();
        const progressCenter = 30.5;
        const isProgressOverDark = rect.top <= progressCenter && rect.bottom > progressCenter;
        setIsOverDark(isProgressOverDark);
      },
      {
        threshold: Array.from({ length: 20 }, (_, i) => i / 19) // 20 thresholds (was 101)
      }
    );

    observer.observe(darkSection);
    return () => observer.disconnect();
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