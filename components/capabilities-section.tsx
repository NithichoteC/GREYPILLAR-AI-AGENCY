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

  // PERFORMANCE: Set static zIndex only ONCE on mount (not every frame!)
  useEffect(() => {
    cardRefs.current.forEach((cardRef, index) => {
      if (cardRef) cardRef.style.zIndex = String(index);
    });
  }, []);

  // Hybrid Parallax Solution: CSS scroll-driven for desktop, optimized JS for mobile
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const supportsScrollDriven = CSS.supports && CSS.supports('animation-timeline', 'scroll()');

    // Check if we should use CSS scroll-driven animations (Chrome 115+) or JavaScript
    const useCSSAnimation = supportsScrollDriven && !isMobile;

    if (useCSSAnimation) {
      // Modern browsers: Let CSS handle everything (no JavaScript during scroll!)
      cardRefs.current.forEach((cardRef, index) => {
        if (!cardRef) return;
        cardRef.classList.add('parallax-css-driven');
        cardRef.style.setProperty('--card-index', String(index));
      });
    } else {
      // Safari/Mobile: Optimized JavaScript fallback
      let ticking = false;
      let frameCount = 0;

      const handleScroll = () => {
        // Mobile: Skip frames for better performance (30fps instead of 60fps)
        if (isMobile) {
          frameCount++;
          if (frameCount % 2 !== 0) return; // Skip every other frame on mobile
        }

        if (!ticking) {
          window.requestAnimationFrame(() => {
            if (!containerRef.current) {
              ticking = false;
              return;
            }

            const scrollY = window.scrollY;
            const containerTop = containerRef.current.offsetTop;
            const containerHeight = containerRef.current.offsetHeight;
            const viewportHeight = window.innerHeight;

            // Calculate scroll progress through the section
            const scrollProgress = Math.max(0, Math.min(1,
              (scrollY - containerTop + viewportHeight) / (containerHeight + viewportHeight)
            ));

            cardRefs.current.forEach((cardRef, index) => {
              if (!cardRef) return;

              // Calculate each card's individual progress
              const cardProgress = scrollProgress * capabilities.length - index;
              const clampedProgress = Math.max(-1, Math.min(2, cardProgress));

              if (clampedProgress < -0.5) {
                // Card hasn't entered yet
                cardRef.style.transform = 'translateY(100vh) scale3d(0.9, 0.9, 1)';
                cardRef.style.opacity = '0';
              } else if (clampedProgress < 0) {
                // Card is entering
                const enterProgress = (clampedProgress + 1) * 2;
                cardRef.style.transform = `translateY(${(1 - enterProgress) * 100}vh) scale3d(${0.9 + enterProgress * 0.1}, ${0.9 + enterProgress * 0.1}, 1)`;
                cardRef.style.opacity = String(enterProgress);
              } else if (clampedProgress < 1) {
                // Card is in view - parallax effect
                const scale = 1 - clampedProgress * 0.1;
                const translateY = clampedProgress * -30;
                const zIndex = capabilities.length - index;

                cardRef.style.transform = `translateY(${translateY}%) scale3d(${scale}, ${scale}, 1)`;
                cardRef.style.opacity = '1';
                cardRef.style.zIndex = String(zIndex);

                // Blur only on desktop for performance
                if (!isMobile && clampedProgress > 0.1) {
                  const blurAmount = Math.min(8, clampedProgress * 8);
                  cardRef.style.filter = `blur(${blurAmount}px)`;
                } else {
                  cardRef.style.filter = '';
                }
              } else {
                // Card has exited
                cardRef.style.transform = 'translateY(-50%) scale3d(0.8, 0.8, 1)';
                cardRef.style.opacity = '0.5';
                cardRef.style.filter = isMobile ? '' : 'blur(8px)';
              }
            });

            ticking = false;
          });
          ticking = true;
        }
      };

      // Add optimized scroll listener
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial call

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
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
