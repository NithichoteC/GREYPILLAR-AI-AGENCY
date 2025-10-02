'use client';
import React, { useEffect, useRef } from 'react';

interface CapabilityCardProps {
  icon: string;
  title: string;
  description: string;
  tags: string[];
  index: number;
}

const CapabilityCard = React.forwardRef<HTMLDivElement, CapabilityCardProps>(
  ({ icon, title, description, tags, index }, ref) => {
    return (
      <div
        ref={ref}
        className="capability-card"
        data-index={index}
        style={{
          zIndex: index,
        }}
      >
        {/* Corner bracket decorations */}
        <span className="capability-card-corner capability-card-corner-tl"></span>
        <span className="capability-card-corner capability-card-corner-tr"></span>
        <span className="capability-card-corner capability-card-corner-bl"></span>
        <span className="capability-card-corner capability-card-corner-br"></span>

        <div className="capability-card-content">
          <div className="capability-card-header">
            <div className="capability-icon-circle">
              <span className="capability-card-icon">{icon}</span>
            </div>
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

  const capabilities = [
    {
      icon: '🔹',
      title: 'Immediate Revenue Recovery',
      description: 'We take your "dead" list of past customers and old leads and reignite them with compelling, AI-powered campaigns, booking high-intent appointments and generating cash flow in the first week.',
      tags: ['Lead Reactivation', 'CRM Automation', 'Appointment Setting']
    },
    {
      icon: '⚡',
      title: 'Automated Trust & Authority',
      description: 'Our system turns your happy customers into a powerful marketing engine, automatically prompting them to leave 5-star Google reviews and asking for referrals to create a stream of high-trust, free leads.',
      tags: ['Review Systems', 'Referral Automation', 'Reputation Management']
    },
    {
      icon: '🎯',
      title: '24/7 Lead Capture & Conversion',
      description: 'Never miss an opportunity again. Our system instantly engages any missed call or website lead within 5 minutes, 24/7—answering questions, qualifying prospects, and booking them directly into your calendar.',
      tags: ['AI Receptionist', 'Instant Lead Response', 'CRM Intelligence']
    },
    {
      icon: '📈',
      title: 'Scalable Acquisition Systems',
      description: 'Once your foundation is secure, we build predictable client acquisition machines. We use AI to optimize ad campaigns and nurture leads, ensuring a profitable and scalable return on your marketing spend.',
      tags: ['AI Ad Systems', 'Funnel Optimization', 'Growth Automation']
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const scrollableHeight = container.scrollHeight - window.innerHeight;

      let progress = -containerRect.top / scrollableHeight;
      progress = Math.max(0, Math.min(1, progress));

      const numCards = capabilities.length;
      const activeCardFloat = progress * (numCards - 1);

      // Parallax constants (from pararexcode.txt)
      const STACK_SCALE = 0.9;
      const Y_OFFSET_PER_LEVEL = 4; // in percent
      const MAX_VISIBLE_STACK_CARDS = 3;

      cardRefs.current.forEach((cardRef, index) => {
        if (!cardRef) return;

        cardRef.style.zIndex = String(index);

        const depth = activeCardFloat - index;

        if (depth >= 0) {
          // Card is in stack or exiting
          const depthProgress = Math.min(depth, 1);
          const adjustedDepth = Math.min(depth, MAX_VISIBLE_STACK_CARDS);
          const scale = depth > 1 ? STACK_SCALE : 1 - depthProgress * (1 - STACK_SCALE);
          const baseTranslateY = -adjustedDepth * Y_OFFSET_PER_LEVEL;
          const stackParallax = -depth * 4;

          cardRef.style.transform = `scale(${scale}) translateY(${baseTranslateY + stackParallax}%)`;
          cardRef.style.opacity = adjustedDepth > MAX_VISIBLE_STACK_CARDS ? '0' : '1';

        } else if (depth > -1) {
          // Card is incoming from bottom - smooth slide with fade
          const incomingProgress = 1 + depth; // 0 to 1 as card enters
          const translateY = 100 - (incomingProgress * 100); // 100% to 0%

          // Fade in as card slides up (0 to 1 opacity)
          const opacity = Math.max(0, Math.min(1, incomingProgress));

          cardRef.style.transform = `translateY(${translateY}%)`;
          cardRef.style.opacity = String(opacity);
        } else {
          // Card is off-screen below
          cardRef.style.transform = `translateY(100%)`;
          cardRef.style.opacity = '0';
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [capabilities.length]);

  return (
    <section className="capabilities-section" id="capabilities">
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
