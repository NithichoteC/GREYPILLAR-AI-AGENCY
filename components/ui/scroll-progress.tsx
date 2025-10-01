'use client';

import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);
  const isOverDarkRef = useRef(false);
  const willChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // COMBINED RAF scroll handler - progress update + dark mode check
  useEffect(() => {
    let rafId: number | null = null;
    const darkSection = document.querySelector('#solution');

    const updateScrollState = () => {
      if (!progressRef.current) return;

      // 1. Update progress bar (CSS custom property - browser optimized)
      const winScroll = Math.max(0, window.scrollY || document.documentElement.scrollTop);
      const height = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      ) - window.innerHeight;
      const scrolled = Math.min((winScroll / height) * 100, 100);

      progressRef.current.style.setProperty('--scroll-progress', scrolled.toFixed(2));

      // Dynamic will-change for GPU memory optimization
      progressRef.current.style.willChange = 'transform';

      // Remove will-change after 500ms idle
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

    // Lightweight Intersection Observer (20 thresholds for smoother transitions)
    const observer = new IntersectionObserver(
      ([entry]) => {
        const rect = darkSection?.getBoundingClientRect();
        if (rect && progressRef.current) {
          const progressCenter = 30.5;
          const isProgressOverDark = rect.top <= progressCenter && rect.bottom > progressCenter;

          if (isProgressOverDark !== isOverDarkRef.current) {
            if (isProgressOverDark) {
              progressRef.current.classList.add('over-dark');
            } else {
              progressRef.current.classList.remove('over-dark');
            }
            isOverDarkRef.current = isProgressOverDark;
          }
        }
      },
      {
        threshold: Array.from({ length: 20 }, (_, i) => i / 19) // 20 thresholds for smooth detection
      }
    );

    if (darkSection) observer.observe(darkSection);
    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollState();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (willChangeTimeoutRef.current) clearTimeout(willChangeTimeoutRef.current);
      if (darkSection) observer.disconnect();
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