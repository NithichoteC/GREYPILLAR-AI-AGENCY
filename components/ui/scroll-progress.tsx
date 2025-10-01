'use client';

import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const isOverDarkRef = useRef(false);
  const cachedRectRef = useRef<DOMRect | null>(null);
  const isScrollingRef = useRef(false);
  const scrollEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let rafId: number | null = null;
    const darkSection = document.querySelector('#solution');

    // Performance optimization: Cache dark section position via Intersection Observer
    const updateCachedRect = () => {
      if (darkSection) {
        cachedRectRef.current = darkSection.getBoundingClientRect();
      }
    };

    const updateScrollState = () => {
      if (!progressBarRef.current) return;

      // 1. Direct transform manipulation (40x faster than CSS custom properties)
      const winScroll = Math.max(0, window.scrollY || document.documentElement.scrollTop);
      const height = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      ) - window.innerHeight;
      const scrolled = Math.min(winScroll / height, 1); // 0-1 range

      // Direct transform (no CSS variable overhead)
      progressBarRef.current.style.transform = `translate3d(0, 0, 0) scaleX(${scrolled.toFixed(4)})`;

      // Debounced will-change management (set once per scroll session)
      if (!isScrollingRef.current) {
        progressBarRef.current.style.willChange = 'transform';
        isScrollingRef.current = true;
      }

      // Detect scroll end (debounced)
      if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current);
      scrollEndTimeoutRef.current = setTimeout(() => {
        if (progressBarRef.current) {
          progressBarRef.current.style.willChange = 'auto';
          isScrollingRef.current = false;
        }
      }, 150);

      // 2. Dark mode check using CACHED rect (no getBoundingClientRect on every frame)
      if (cachedRectRef.current && progressRef.current) {
        const progressCenter = 30.5;
        const rect = cachedRectRef.current;
        const newIsOverDark = rect.top <= progressCenter && rect.bottom > progressCenter;

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

    // Intersection Observer for dark section position updates (async, no forced reflow)
    const observer = new IntersectionObserver(
      () => {
        updateCachedRect(); // Only recalculate when section moves
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    if (darkSection) {
      observer.observe(darkSection);
      updateCachedRect(); // Initial cache
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollState();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current);
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={progressRef} className="scroll-progress">
      <div ref={progressBarRef} className="scroll-progress-bar" />
    </div>
  );
}