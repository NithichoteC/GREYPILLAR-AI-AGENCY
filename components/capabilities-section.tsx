'use client';
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

interface CapabilityCardProps {
  iconSrc: string;
  accentColor: string;
  title: string;
  description: string;
  tags: string[];
  index: number;
}

const CapabilityCard = React.forwardRef<HTMLDivElement, CapabilityCardProps>(
  ({ iconSrc, accentColor, title, description, tags, index }, ref) => {
    return (
      <div
        ref={ref}
        className="capability-card"
        data-index={index}
        style={{
          zIndex: index,
        }}
      >
        <div className="capability-card-content">
          <div className="capability-card-header">
            <Image
              src={iconSrc}
              alt={title}
              width={64}
              height={64}
              className="capability-icon"
              priority={index === 0}
            />
            <div>
              <h3 className="capability-card-title">{title}</h3>
              <p className="capability-card-description">{description}</p>
            </div>
          </div>

          <div className="capability-card-tags">
            {tags.map((tag, i) => (
              <span key={i} className="capability-tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

export default function CapabilitiesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevDepthsRef = useRef<number[]>([]); // Cache previous data-depth values

  const capabilities = [
    {
      iconSrc: '/icons/revenue-recovery.png',
      accentColor: '#2563eb',
      title: 'Immediate Revenue Recovery',
      description: 'We take your "dead" list of past customers and old leads and reignite them with compelling, AI-powered campaigns, booking high-intent appointments and generating cash flow in the first week.',
      tags: ['Lead Reactivation', 'CRM Automation', 'Appointment Setting']
    },
    {
      iconSrc: '/icons/trust-authority.png',
      accentColor: '#10b981',
      title: 'Automated Trust & Authority',
      description: 'Our system turns your happy customers into a powerful marketing engine, automatically prompting them to leave 5-star Google reviews and asking for referrals to create a stream of high-trust, free leads.',
      tags: ['Review Systems', 'Referral Automation', 'Reputation Management']
    },
    {
      iconSrc: '/icons/lead-capture.png',
      accentColor: '#8b5cf6',
      title: '24/7 Lead Capture & Conversion',
      description: 'Never miss an opportunity again. Our system instantly engages any missed call or website lead within 5 minutes, 24/7—answering questions, qualifying prospects, and booking them directly into your calendar.',
      tags: ['AI Receptionist', 'Instant Lead Response', 'CRM Intelligence']
    },
    {
      iconSrc: '/icons/custom-systems.png',
      accentColor: '#f59e0b',
      title: 'Scalable Acquisition Systems',
      description: 'Once your foundation is secure, we build predictable client acquisition machines. We use AI to optimize ad campaigns and nurture leads, ensuring a profitable and scalable return on your marketing spend.',
      tags: ['AI Ad Systems', 'Funnel Optimization', 'Growth Automation']
    }
  ];

  useEffect(() => {
    let ticking = false;
    let scrollIdleTimeout: NodeJS.Timeout | null = null;
    let resizeTimeout: NodeJS.Timeout | null = null;

    // PERFORMANCE: Cache viewport AND container dimensions (2025 Apple pattern)
    let viewportHeight = window.innerHeight;
    let isMobile = window.innerWidth <= 768;
    let cachedScrollableHeight = 0;
    let cachedContainerTop = 0;

    const updateViewportCache = () => {
      viewportHeight = window.innerHeight;
      isMobile = window.innerWidth <= 768;

      // Cache container dimensions to eliminate getBoundingClientRect() in scroll loop
      if (containerRef.current) {
        cachedScrollableHeight = containerRef.current.scrollHeight - viewportHeight;
        cachedContainerTop = containerRef.current.getBoundingClientRect().top;
      }
    };

    // PERFORMANCE: Persistent GPU layers for smooth scrolling (Apple 2025 pattern)
    const enableGPULayers = () => {
      cardRefs.current.forEach(cardRef => {
        if (cardRef) {
          cardRef.style.willChange = 'transform, opacity';
          cardRef.style.transform = cardRef.style.transform || 'translateZ(0)'; // Force GPU layer
        }
      });
    };

    const disableGPULayers = () => {
      cardRefs.current.forEach(cardRef => {
        if (cardRef) cardRef.style.willChange = 'auto';
      });
    };

    const handleScroll = () => {
      // Enable GPU layers on first scroll
      enableGPULayers();

      // Clear previous idle timeout
      if (scrollIdleTimeout) clearTimeout(scrollIdleTimeout);

      // Disable GPU layers after 150ms of no scrolling (battery optimization)
      scrollIdleTimeout = setTimeout(disableGPULayers, 150);

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) {
            ticking = false;
            return;
          }

          const container = containerRef.current;

          // PERFORMANCE: Read container position ONCE per scroll (not per card = 94% fewer reads)
          const containerRect = container.getBoundingClientRect();
          const containerTop = containerRect.top;

          // Calculate scroll progress based on container position
          let progress = -containerTop / cachedScrollableHeight;
          progress = Math.max(0, Math.min(1, progress));

          const numCards = capabilities.length;
          const activeCardFloat = progress * (numCards + 1.0); // EXTENDED: +1.0 gives first card smoother exit (was +0.5 too abrupt)

          // Parallax constants - mobile optimized
          const STACK_SCALE = 0.9;
          const Y_OFFSET_PER_LEVEL = isMobile ? 2 : 4; // Reduced on mobile for better visibility
          const MAX_VISIBLE_STACK_CARDS = 3;

      cardRefs.current.forEach((cardRef, index) => {
        if (!cardRef) return;

        cardRef.style.zIndex = String(index);

        const depth = activeCardFloat - index;

        // Set data-depth for CSS styling (stacked vs front card)
        let finalDepth = Math.floor(Math.max(0, depth));

        // Last card becomes crisp (depth 0) when scroll reaches end
        const isLastCard = index === numCards - 1;
        if (isLastCard && activeCardFloat >= numCards) {
          finalDepth = 0; // Crystal clear at scroll end
        }

        // PERFORMANCE: Only update data-depth when value changes (prevents flickering)
        if (prevDepthsRef.current[index] !== finalDepth) {
          cardRef.setAttribute('data-depth', finalDepth.toString());
          prevDepthsRef.current[index] = finalDepth;
        }

        if (depth >= 0 && depth < 4) {
          // Card is in stack or exiting - simplified scroll-based scaling
          const adjustedDepth = Math.min(depth, MAX_VISIBLE_STACK_CARDS);

          // SIMPLIFIED: Depth-based scaling only (no expensive getBoundingClientRect)
          const scaleProgress = Math.min(depth / 1.5, 1);
          const scale = 1 - scaleProgress * (1 - STACK_SCALE);

          const baseTranslateY = -adjustedDepth * Y_OFFSET_PER_LEVEL;
          const stackParallax = -depth * 4;

          cardRef.style.transform = `scale(${scale}) translate3d(0, ${baseTranslateY + stackParallax}%, 0)`;

          // Simple opacity - all stacked cards stay visible
          const isLastCard = index === numCards - 1;
          let opacity = 1; // All cards in stack range stay fully visible

          // Only last card gets exit fade (when scrolling past all cards)
          if (isLastCard && depth > 3) {
            const exitProgress = Math.max(0, depth - 3);
            opacity = Math.max(0, 1 - exitProgress);
          }

          cardRef.style.opacity = String(opacity);

        } else if (depth >= 4) {
          // Keep cards at final stack position with continuous parallax
          const adjustedDepth = Math.min(depth, MAX_VISIBLE_STACK_CARDS);
          const baseTranslateY = -adjustedDepth * Y_OFFSET_PER_LEVEL;
          const stackParallax = -depth * 4; // MAINTAIN parallax - prevents jump from -27% to -12%!

          cardRef.style.transform = `scale(${STACK_SCALE}) translate3d(0, ${baseTranslateY + stackParallax}%, 0)`;

          // Explicitly set opacity - last card fades, others stay visible
          const isLastCard = index === numCards - 1;
          cardRef.style.opacity = isLastCard ? '0' : '1';

        } else if (depth > -1) {
          // Card is incoming - viewport-relative slide from bottom edge
          const incomingProgress = 1 + depth; // 0 to 1 as card enters

          // Calculate slide from bottom of viewport to stack position
          const startY = viewportHeight - Math.max(0, containerTop);
          // End position: stack position (0)
          const targetY = 0;

          // Interpolate between start and target based on scroll progress
          const currentY = startY - (incomingProgress * startY);

          cardRef.style.transform = `translate3d(0, ${currentY}px, 0)`;
          cardRef.style.opacity = '1'; // Always full opacity - no fade
        } else {
          // Card is off-screen below (depth <= -1)
          cardRef.style.transform = `translate3d(0, 100vh, 0)`;
          cardRef.style.opacity = '0';
        }
      });

          ticking = false;
        });
        ticking = true;
      }
    };

    // PERFORMANCE: Debounced resize handler (iOS address bar hide/show fires constantly)
    const handleResize = () => {
      // Clear previous resize timeout
      if (resizeTimeout) clearTimeout(resizeTimeout);

      // Debounce 100ms to prevent iOS address bar thrashing
      resizeTimeout = setTimeout(() => {
        updateViewportCache();
        handleScroll(); // Recalculate positions
      }, 100);
    };

    // Initialize cache
    updateViewportCache();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (scrollIdleTimeout) clearTimeout(scrollIdleTimeout);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      disableGPULayers(); // Cleanup: remove GPU layers on unmount
    };
  }, [capabilities.length]);

  return (
    <section className="capabilities-section" id="capabilities">
      {/* Grid overlay - 14 vertical lines with CSS Grid */}
      <div className="capabilities-grid-overlay" aria-hidden="true">
        {/* Left frame line */}
        <div className="grid-line frame-line"></div>

        {/* 13 interior grid lines (between frames) */}
        {Array.from({ length: 13 }).map((_, i) => (
          <div key={i} className="grid-line interior-line"></div>
        ))}

        {/* Right frame line */}
        <div className="grid-line frame-line"></div>
      </div>

      <div className="capabilities-container">
        <p className="capabilities-intro">
          We've identified four critical domains where AI can stop revenue leaks and create a foundation for scalable growth. We apply our engineering mindset to build custom solutions in each of these areas, tailored to your specific bottlenecks.
        </p>

        <div ref={containerRef} className="capabilities-cards-wrapper">
          <div className="capabilities-cards">
            {capabilities.map((capability, index) => (
              <CapabilityCard
                key={index}
                ref={(el) => { cardRefs.current[index] = el; }}
                {...capability}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
