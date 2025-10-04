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
      <div ref={ref} className="capability-card" data-index={index}>
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
  const prevDepthsRef = useRef<number[]>([]);
  const prevTransformsRef = useRef<string[]>([]); // Cache previous transforms
  const prevOpacitiesRef = useRef<string[]>([]); // Cache previous opacities

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
    let lastScrollTime = 0;

    // Cache viewport dimensions for performance
    let viewportHeight = window.innerHeight;
    let isMobile = window.innerWidth <= 768;
    let cachedScrollableHeight = 0;

    const updateViewportCache = () => {
      viewportHeight = window.innerHeight;
      isMobile = window.innerWidth <= 768;

      if (containerRef.current) {
        cachedScrollableHeight = containerRef.current.scrollHeight - viewportHeight;
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame((timestamp) => {
          // Throttle: Mobile 50ms (20fps), Desktop 16ms (60fps)
          const throttleTime = isMobile ? 50 : 16;
          if (timestamp - lastScrollTime < throttleTime) {
            ticking = false;
            return;
          }
          lastScrollTime = timestamp;

          if (!containerRef.current) {
            ticking = false;
            return;
          }

          const container = containerRef.current;
          const containerRect = container.getBoundingClientRect();
          const containerTop = containerRect.top;

          // Calculate scroll progress
          let progress = -containerTop / cachedScrollableHeight;
          progress = Math.max(0, Math.min(1, progress));

          const numCards = capabilities.length;
          const activeCardFloat = progress * (numCards + 1.0);

          // Parallax constants
          const STACK_SCALE = 0.9;
          const Y_OFFSET_PER_LEVEL = isMobile ? 2 : 4;
          const MAX_VISIBLE_STACK_CARDS = 3;

          cardRefs.current.forEach((cardRef, index) => {
            if (!cardRef) return;

            const depth = activeCardFloat - index;
            let finalDepth = Math.floor(Math.max(0, depth));

            // Last card becomes crisp (depth 0) when scroll reaches end
            const isLastCard = index === numCards - 1;
            if (isLastCard && activeCardFloat >= numCards) {
              finalDepth = 0;
            }

            // Only update data-depth when value changes (prevents flickering)
            if (prevDepthsRef.current[index] !== finalDepth) {
              cardRef.setAttribute('data-depth', finalDepth.toString());
              prevDepthsRef.current[index] = finalDepth;
            }

            // Calculate new transform and opacity values
            let newTransform = '';
            let newOpacity = '';
            let newFilter = '';

            if (depth >= 0 && depth < 4) {
              // Card is in stack or exiting - simplified scroll-based scaling
              const adjustedDepth = Math.min(depth, MAX_VISIBLE_STACK_CARDS);

              // Depth-based scaling
              const scaleProgress = Math.min(depth / 1.5, 1);
              const scale = 1 - scaleProgress * (1 - STACK_SCALE);

              const baseTranslateY = -adjustedDepth * Y_OFFSET_PER_LEVEL;
              const stackParallax = -depth * 4;

              newTransform = `scale(${scale}) translate3d(0, ${baseTranslateY + stackParallax}%, 0)`;

              // Simple opacity - all stacked cards stay visible
              let opacity = 1;

              // Only last card gets exit fade (when scrolling past all cards)
              if (isLastCard && depth > 3) {
                const exitProgress = Math.max(0, depth - 3);
                opacity = Math.max(0, 1 - exitProgress);
              }

              newOpacity = String(opacity);

              // Desktop blur - progressive based on depth
              if (!isMobile && depth > 0) {
                const blurAmount = Math.min(depth * 2, 8); // 2px, 4px, 6px, 8px max
                newFilter = `blur(${blurAmount}px)`;
              }

            } else if (depth >= 4) {
              // Keep cards at final stack position with continuous parallax
              const adjustedDepth = Math.min(depth, MAX_VISIBLE_STACK_CARDS);
              const baseTranslateY = -adjustedDepth * Y_OFFSET_PER_LEVEL;
              const stackParallax = -depth * 4;

              newTransform = `scale(${STACK_SCALE}) translate3d(0, ${baseTranslateY + stackParallax}%, 0)`;
              newOpacity = isLastCard ? '0' : '1';

              if (!isMobile) {
                newFilter = 'blur(8px)'; // Maximum blur
              }

            } else if (depth > -1) {
              // Card is incoming - viewport-relative slide from bottom edge
              const incomingProgress = 1 + depth; // 0 to 1 as card enters

              // Calculate slide from bottom of viewport to stack position
              const startY = viewportHeight - Math.max(0, containerTop);
              const currentY = Math.round(startY - (incomingProgress * startY));

              newTransform = `translate3d(0, ${currentY}px, 0)`;
              newOpacity = '1';
            } else {
              // Card is off-screen below (depth <= -1)
              newTransform = `translate3d(0, 100vh, 0)`;
              newOpacity = '0';
            }

            // Only update styles if values changed (prevents style thrashing)
            if (prevTransformsRef.current[index] !== newTransform) {
              cardRef.style.transform = newTransform;
              prevTransformsRef.current[index] = newTransform;
            }

            if (prevOpacitiesRef.current[index] !== newOpacity) {
              cardRef.style.opacity = newOpacity;
              prevOpacitiesRef.current[index] = newOpacity;
            }

            // Apply blur filter (desktop only, no caching needed)
            cardRef.style.filter = newFilter;
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    const handleResize = () => {
      updateViewportCache();
      handleScroll();
    };

    // Initialize
    updateViewportCache();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
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
