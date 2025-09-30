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

  // Update progress on scroll (LinkedIn/Medium pattern)
  useEffect(() => {
    const updateProgress = throttle(() => {
      const winScroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setProgress(Math.min(scrolled, 100));
      console.log('📊 Scroll Progress:', scrolled.toFixed(1) + '%');
    }, 16); // 60fps

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress(); // Initial calculation

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  // Intersection Observer for color adaptation (matches navigation)
  useEffect(() => {
    const darkSection = document.querySelector('#solution');

    if (!darkSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOverDark(entry.isIntersecting);
      },
      {
        rootMargin: '-80px 0px 0px 0px',
        threshold: 0
      }
    );

    observer.observe(darkSection);

    return () => observer.disconnect();
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