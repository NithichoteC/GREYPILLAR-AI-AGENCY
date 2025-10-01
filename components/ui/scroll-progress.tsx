'use client';

import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);
  const isOverDarkRef = useRef(false); // useRef instead of useState - no React re-renders
  const willChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // COMBINED RAF scroll handler - progress update + dark mode check (NO React re-renders)
  useEffect(() => {
    let rafId: number | null = null;
    const darkSection = document.querySelector('#solution');

    const updateScrollState = () => {
      if (!progressRef.current) return;

      // 1. Update progress bar (scaleX)
      const winScroll = Math.max(0, window.scrollY || document.documentElement.scrollTop);
      const height = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      ) - window.innerHeight;
      const scrolled = Math.min((winScroll / height) * 100, 100);

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

      // 2. Check dark mode position - DIRECT DOM manipulation (no setState)
      if (darkSection) {
        const rect = darkSection.getBoundingClientRect();
        const progressCenter = 30.5;
        const newIsOverDark = rect.top <= progressCenter && rect.bottom > progressCenter;

        // Only update if value changed (conditional check)
        if (newIsOverDark !== isOverDarkRef.current) {
          if (newIsOverDark) {
            progressRef.current.classList.add('over-dark');
          } else {
            progressRef.current.classList.remove('over-dark');
          }
          isOverDarkRef.current = newIsOverDark;
        }
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

  return (
    <div
      ref={progressRef}
      className="scroll-progress"
      style={{
        '--scroll-progress': '0'
      } as React.CSSProperties}
    />
  );
}