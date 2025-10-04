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
    // UNIFIED PARALLAX: Works on both mobile and desktop
    let ticking = false;
    let lastScrollTime = 0;
    let resizeTimeout: NodeJS.Timeout | null = null;

    // Cache viewport AND container dimensions
    let viewportHeight = window.innerHeight;
    let cachedDocumentTop = 0;
    let cachedScrollableHeight = 0;

    const updateCache = () => {
      viewportHeight = window.innerHeight;

      // Cache container's absolute position in document
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        cachedDocumentTop = rect.top + window.scrollY;
        cachedScrollableHeight = containerRef.current.scrollHeight - viewportHeight;
      }
    };

    // PERFORMANCE: Set will-change once on init (no toggling to prevent jitter)

    const handleScroll = () => {
      // THROTTLE: 60fps for both mobile and desktop for consistency
      const now = performance.now();
      const throttleTime = 16; // Consistent 60fps - better than trying 120fps on mobile

      if (now - lastScrollTime < throttleTime) {
        return; // Skip this frame entirely
      }

      if (!ticking) {
        window.requestAnimationFrame(() => {
          lastScrollTime = performance.now();

          if (!containerRef.current) {
            ticking = false;
            return;
          }

          const container = containerRef.current;

          // Calculate isMobile ONCE at the start
          const isMobile = window.innerWidth <= 768;

          // Pure math - NO DOM reads during scroll for smooth mobile performance
          const scrollY = window.scrollY;
          const containerViewportTop = cachedDocumentTop - scrollY;

          let progress = -containerViewportTop / cachedScrollableHeight;
          progress = Math.max(0, Math.min(1, progress));

          const numCards = capabilities.length;
          const activeCardFloat = progress * (numCards + 1.0); // EXTENDED: +1.0 gives first card smoother exit (was +0.5 too abrupt)

          // Parallax constants - adjusted for mobile/desktop (using isMobile from above)
          const STACK_SCALE = isMobile ? 0.98 : 0.9; // Even less scaling on mobile for performance
          const Y_OFFSET_PER_LEVEL = isMobile ? 1 : 4; // Minimal spacing on mobile
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

        // PERFORMANCE: Only update data-depth on desktop (mobile doesn't use blur)
        if (!isMobile && prevDepthsRef.current[index] !== finalDepth) {
          cardRef.setAttribute('data-depth', finalDepth.toString());
          prevDepthsRef.current[index] = finalDepth;
        } else if (isMobile && cardRef.hasAttribute('data-depth')) {
          // Clear data-depth on mobile to prevent blur CSS from applying
          cardRef.removeAttribute('data-depth');
        }

        if (depth >= 0 && depth < 4) {
          // Card is in stack or exiting - simplified scroll-based scaling
          const adjustedDepth = Math.min(depth, MAX_VISIBLE_STACK_CARDS);

          // SIMPLIFIED: Depth-based scaling only (no expensive getBoundingClientRect)
          const scaleProgress = Math.min(depth / 1.5, 1);
          const scale = 1 - scaleProgress * (1 - STACK_SCALE);

          // Use pixels for all transforms (no % to prevent rounding jitter)
          const baseTranslateY = -adjustedDepth * Y_OFFSET_PER_LEVEL * 10; // Convert to pixels
          const stackParallax = isMobile ? -depth * 10 : -depth * 40; // Much less parallax on mobile

          // Round values to avoid subpixel rendering issues
          const roundedY = Math.round(baseTranslateY + stackParallax);

          // Use translate3d with z:0 to force GPU acceleration
          cardRef.style.transform = `scale(${scale}) translate3d(0, ${roundedY}px, 0)`;

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
          const baseTranslateY = -adjustedDepth * Y_OFFSET_PER_LEVEL * 10; // Pixels
          const stackParallax = isMobile ? -depth * 10 : -depth * 40; // Much less parallax on mobile

          // Round values for performance
          const roundedY = Math.round(baseTranslateY + stackParallax);

          cardRef.style.transform = `scale(${STACK_SCALE}) translate3d(0, ${roundedY}px, 0)`;

          // Explicitly set opacity - last card fades, others stay visible
          const isLastCard = index === numCards - 1;
          cardRef.style.opacity = isLastCard ? '0' : '1';

        } else if (depth > -1) {
          // Card is incoming - viewport-relative slide from bottom edge
          const incomingProgress = 1 + depth; // 0 to 1 as card enters

          // Calculate slide from bottom of viewport to stack position (use cached math)
          const startY = viewportHeight - Math.max(0, containerViewportTop);
          // End position: stack position (0)
          const targetY = 0;

          // Interpolate between start and target based on scroll progress
          const currentY = Math.round(startY - (incomingProgress * startY));

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
        updateCache(); // Update all cached values
        handleScroll(); // Recalculate positions
      }, 100);
    };

    // Initialize cache
    updateCache();

    // Set will-change once on all cards (no toggling)
    // Also set initial position for mobile cards
    cardRefs.current.forEach((cardRef, index) => {
      if (cardRef) {
        cardRef.style.willChange = 'transform, opacity';
        // Start cards below viewport on mobile
        if (window.innerWidth <= 768) {
          cardRef.style.transform = 'translate3d(0, 100vh, 0)';
          cardRef.style.opacity = '0';
        }
      }
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      // Clean up will-change on unmount
      cardRefs.current.forEach(cardRef => {
        if (cardRef) cardRef.style.willChange = 'auto';
      });
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