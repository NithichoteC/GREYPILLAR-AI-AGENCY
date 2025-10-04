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
    // OPTIMIZED MOBILE PARALLAX: Simplified calculations for smooth performance
    let ticking = false;
    let lastScrollTime = 0; // Define here for desktop throttling
    let resizeTimeout: NodeJS.Timeout | null = null;

    // Cache all dimensions once
    let viewportHeight = window.innerHeight;
    let isMobile = window.innerWidth <= 768;
    let cachedDocumentTop = 0;
    let cachedScrollableHeight = 0;

    const updateCache = () => {
      viewportHeight = window.innerHeight;
      isMobile = window.innerWidth <= 768;

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        cachedDocumentTop = rect.top + window.scrollY;
        cachedScrollableHeight = containerRef.current.scrollHeight - viewportHeight;
      }
    };

    const handleScroll = () => {
      // Check mobile state in real-time to handle browser testing
      const currentIsMobile = window.innerWidth <= 768;

      // Mobile uses simpler calculations, no throttling needed
      if (currentIsMobile) {
        // Remove ticking flag for mobile - it's causing issues
        window.requestAnimationFrame(() => {
          if (!containerRef.current) {
            return;
          }

          // Ensure cache is updated if not initialized or if mobile state changed
          if (cachedDocumentTop === 0 || cachedScrollableHeight === 0 || isMobile !== currentIsMobile) {
            updateCache();
          }

          // Simple mobile calculations
          const scrollY = window.scrollY;
          const containerTop = cachedDocumentTop - scrollY;
          const progress = cachedScrollableHeight > 0
            ? Math.max(0, Math.min(1, -containerTop / cachedScrollableHeight))
            : 0;
          const activeCard = progress * (capabilities.length + 0.5);

          // Mobile constants - proper stacking values
          const MOBILE_SCALE = 0.92; // Slightly smaller scale for mobile
          const MOBILE_OFFSET = 50; // Show 50px of each stacked card

          cardRefs.current.forEach((cardRef, index) => {
            if (!cardRef) return;

            const depth = activeCard - index;

            // Simple mobile transforms - proper stacking with significant overlap
            if (depth >= 0 && depth < 3) {
              // Card in view or stacking
              // Scale cards based on depth for visual hierarchy
              const scale = 1 - (depth * 0.02); // 1, 0.98, 0.96, etc.
              // Stack cards with proper overlap (show 50px of each stacked card)
              const yOffset = Math.round(index * MOBILE_OFFSET);

              cardRef.style.transform = `scale(${scale}) translateY(${yOffset}px)`;
              cardRef.style.opacity = '1';
              cardRef.style.zIndex = String(3 - index); // Reverse z-index so first card is on top

            } else if (depth < 0 && depth > -1) {
              // Card entering from bottom
              const enterProgress = 1 + depth;
              const yPos = Math.round(viewportHeight * (1 - enterProgress));

              cardRef.style.transform = `translateY(${yPos}px)`;
              cardRef.style.opacity = String(enterProgress);
              cardRef.style.zIndex = String(3 - index);

            } else if (depth >= 3) {
              // Card stacked deep - maintain stacking position
              const scale = 0.94; // Smallest scale for deep cards
              const yOffset = Math.round(index * MOBILE_OFFSET);

              cardRef.style.transform = `scale(${scale}) translateY(${yOffset}px)`;
              cardRef.style.opacity = index === capabilities.length - 1 ? '0' : '1';
              cardRef.style.zIndex = String(3 - index);

            } else {
              // Card off-screen
              cardRef.style.transform = 'translateY(100vh)';
              cardRef.style.opacity = '0';
              cardRef.style.zIndex = '0';
            }
          });
        });
        return; // Exit early for mobile
      }

      // Desktop uses original complex calculations with throttling
      const now = performance.now();
      const throttleTime = 16; // 60fps for desktop

      if (now - lastScrollTime < throttleTime) {
        return;
      }
      lastScrollTime = now;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) {
            ticking = false;
            return;
          }

          const scrollY = window.scrollY;
          const containerViewportTop = cachedDocumentTop - scrollY;
          let progress = -containerViewportTop / cachedScrollableHeight;
          progress = Math.max(0, Math.min(1, progress));

          const numCards = capabilities.length;
          const activeCardFloat = progress * (numCards + 1.0);

          // Desktop constants
          const STACK_SCALE = 0.9;
          const Y_OFFSET_PER_LEVEL = 4;
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

            // Desktop only: update data-depth for blur effects
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

              // Use pixels for all transforms (no % to prevent rounding jitter)
              const baseTranslateY = -adjustedDepth * Y_OFFSET_PER_LEVEL * 10; // Convert to pixels
              const stackParallax = -depth * 40; // Desktop parallax

              // Round values to avoid subpixel rendering issues
              const roundedY = Math.round(baseTranslateY + stackParallax);

              // Desktop uses translate3d for GPU acceleration
              cardRef.style.transform = `scale(${scale}) translate3d(0, ${roundedY}px, 0)`;

              // Simple opacity - all stacked cards stay visible
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
              const stackParallax = -depth * 40; // Desktop parallax

              // Round values for performance
              const roundedY = Math.round(baseTranslateY + stackParallax);

              // Desktop transform
              cardRef.style.transform = `scale(${STACK_SCALE}) translate3d(0, ${roundedY}px, 0)`;

              // Explicitly set opacity - last card fades, others stay visible
              cardRef.style.opacity = isLastCard ? '0' : '1';

            } else if (depth > -1) {
              // Card is incoming - viewport-relative slide from bottom edge
              const incomingProgress = 1 + depth; // 0 to 1 as card enters

              // Desktop calculation
              const startY = viewportHeight - Math.max(0, containerViewportTop);

              // Interpolate between start and target based on scroll progress
              const currentY = Math.round(startY * (1 - incomingProgress));

              // Desktop transform
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

    // Set initial positions for mobile cards - check mobile state in real-time
    const currentIsMobile = window.innerWidth <= 768;
    if (currentIsMobile) {
      cardRefs.current.forEach((cardRef, index) => {
        if (cardRef) {
          cardRef.style.willChange = 'transform, opacity';
          // Set initial positions - stack cards with proper overlap
          if (index === 0) {
            cardRef.style.transform = 'translateY(0)';
            cardRef.style.opacity = '1';
            cardRef.style.zIndex = '3';
          } else {
            // Stack subsequent cards behind with 50px offset
            const yOffset = index * 50;
            const scale = 1 - (index * 0.02);
            cardRef.style.transform = `scale(${scale}) translateY(${yOffset}px)`;
            cardRef.style.opacity = '1';
            cardRef.style.zIndex = String(3 - index);
          }
        }
      });
    } else {
      cardRefs.current.forEach((cardRef) => {
        if (cardRef) {
          cardRef.style.willChange = 'transform, opacity';
        }
      });
    }

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