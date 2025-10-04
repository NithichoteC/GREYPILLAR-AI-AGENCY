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

  // Professional Mobile Solution: IntersectionObserver for visibility-based transforms
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;

    // Create IntersectionObserver for each card
    const observers: IntersectionObserver[] = [];

    cardRefs.current.forEach((cardRef, index) => {
      if (!cardRef) return;

      // Observer options for smooth transitions
      const options = {
        root: null,
        rootMargin: '-10% 0px -10% 0px',
        threshold: [0, 0.1, 0.5, 0.9, 1.0]
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const card = entry.target as HTMLElement;
          const ratio = entry.intersectionRatio;

          if (entry.isIntersecting) {
            // Card is visible - apply smooth transforms
            const scale = 0.9 + (ratio * 0.1); // Scale from 0.9 to 1.0
            const translateY = (1 - ratio) * 10; // Subtle Y movement

            // Use scale3d for GPU optimization
            card.style.transform = `scale3d(${scale}, ${scale}, 1) translateY(${translateY}px)`;
            card.style.opacity = String(0.5 + (ratio * 0.5)); // Fade from 0.5 to 1.0

            // Reduce blur on mobile for performance
            if (!isMobile) {
              const blurAmount = Math.max(0, (1 - ratio) * 4);
              card.style.filter = blurAmount > 0 ? `blur(${blurAmount}px)` : '';
            } else {
              // Mobile: minimal blur for performance
              card.style.filter = ratio < 0.5 ? 'blur(2px)' : '';
            }
          } else {
            // Card is not visible - optimize by hiding
            card.style.transform = 'scale3d(0.9, 0.9, 1) translateY(20px)';
            card.style.opacity = '0';
            card.style.filter = '';
          }
        });
      }, options);

      observer.observe(cardRef);
      observers.push(observer);
    });

    // Cleanup observers on unmount
    return () => {
      observers.forEach(observer => observer.disconnect());
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
