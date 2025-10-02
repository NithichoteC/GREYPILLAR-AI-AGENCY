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
      const activeCardFloat = progress * (numCards + 0.5); // Extended range for last card exit

      // Parallax constants (from pararexcode.txt)
      const STACK_SCALE = 0.9;
      const Y_OFFSET_PER_LEVEL = 4; // in percent
      const MAX_VISIBLE_STACK_CARDS = 3;

      cardRefs.current.forEach((cardRef, index) => {
        if (!cardRef) return;

        cardRef.style.zIndex = String(index);

        const depth = activeCardFloat - index;

        // Set data-depth for CSS styling (stacked vs front card)
        cardRef.setAttribute('data-depth', Math.floor(Math.max(0, depth)).toString());

        if (depth >= 0 && depth < 4) {
          // Card is in stack or exiting - extended range for smooth exit
          const depthProgress = Math.min(depth, 1);
          const adjustedDepth = Math.min(depth, MAX_VISIBLE_STACK_CARDS);

          // Progressive scaling - starts before reaching middle for smooth feel
          const cardRect = cardRef.getBoundingClientRect();
          const cardCenter = cardRect.top + cardRect.height / 2;
          const viewportMiddle = window.innerHeight / 2;

          // Distance below middle (positive = below, negative = above)
          const distanceBelowMiddle = cardCenter - viewportMiddle;

          // Start scaling 500px before middle for smoother, earlier transition
          const scaleStartDistance = 500;
          const scaleRange = Math.max(0, Math.min(1, (scaleStartDistance - distanceBelowMiddle) / scaleStartDistance));

          // Combine distance-based (50%) + depth-based (50%) scaling for smooth progression
          const distanceScale = scaleRange * 0.5;
          const depthScale = Math.min(depth / 1.5, 1) * 0.5;
          const scaleProgress = distanceScale + depthScale;

          const scale = 1 - scaleProgress * (1 - STACK_SCALE);

          const baseTranslateY = -adjustedDepth * Y_OFFSET_PER_LEVEL;
          const stackParallax = -depth * 4;

          cardRef.style.transform = `scale(${scale}) translateY(${baseTranslateY + stackParallax}%)`;

          // Progressive opacity for professional stacking
          const isLastCard = index === numCards - 1;
          let opacity = 1;

          // Fade stacked cards progressively for cleaner, more professional look
          if (adjustedDepth > 1) {
            // Cards deep in stack (2nd, 3rd position) get progressively dimmer
            const stackFade = Math.min((adjustedDepth - 1) / 2, 0.4); // Max 40% fade
            opacity = 1 - stackFade;
          }

          // Last card exit fade
          if (isLastCard && depth > 3) {
            const exitProgress = Math.max(0, depth - 3);
            opacity = Math.max(0, 1 - exitProgress);
          }

          cardRef.style.opacity = String(opacity);

        } else if (depth >= 4) {
          // Fully exited cards - off screen above
          cardRef.style.opacity = '0';
          cardRef.style.transform = 'scale(0.8) translateY(-200%)';

        } else if (depth > -1) {
          // Card is incoming - viewport-relative slide from bottom edge
          const incomingProgress = 1 + depth; // 0 to 1 as card enters

          // Calculate slide from bottom of viewport to stack position
          const viewportHeight = window.innerHeight;
          const containerTop = containerRect.top;

          // Start position: bottom of viewport relative to container
          const startY = viewportHeight - Math.max(0, containerTop);
          // End position: stack position (0)
          const targetY = 0;

          // Interpolate between start and target based on scroll progress
          const currentY = startY - (incomingProgress * startY);

          cardRef.style.transform = `translateY(${currentY}px)`;
          cardRef.style.opacity = '1'; // Always full opacity - no fade
        } else {
          // Card is off-screen below (depth <= -1)
          cardRef.style.transform = `translateY(100vh)`;
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
