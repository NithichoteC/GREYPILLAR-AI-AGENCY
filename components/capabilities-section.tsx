'use client';

import { useEffect, useRef } from 'react';

interface CapabilityCardProps {
  icon: string;
  title: string;
  description: string;
  tags: string[];
  index: number;
}

const CapabilityCard = ({ icon, title, description, tags, index }: CapabilityCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const willChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const parallaxSpeed = 0.05 + (index * 0.03); // 0.05, 0.08, 0.11, 0.14
    let rafId: number | null = null;

    const updateParallax = () => {
      if (!card) return;

      const scrollY = window.scrollY;
      const sectionTop = card.closest('section')?.offsetTop || 0;
      const relativeScroll = scrollY - sectionTop;

      // Only apply parallax when section is in view
      if (relativeScroll > -window.innerHeight && relativeScroll < window.innerHeight * 2) {
        card.style.transform = `translate3d(0, ${relativeScroll * parallaxSpeed}px, 0)`;
        card.style.willChange = 'transform';

        // Remove will-change after idle
        if (willChangeTimeoutRef.current) clearTimeout(willChangeTimeoutRef.current);
        willChangeTimeoutRef.current = setTimeout(() => {
          if (card) card.style.willChange = 'auto';
        }, 500);
      }
    };

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateParallax);
    };

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      updateParallax(); // Initial position
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (willChangeTimeoutRef.current) clearTimeout(willChangeTimeoutRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="capability-card"
      style={{
        zIndex: 4 - index, // Card 1: z-4, Card 2: z-3, Card 3: z-2, Card 4: z-1
        marginTop: index === 0 ? 0 : '-100px' // Overlap cards
      }}
    >
      <div className="card-content">
        <div className="card-header">
          <span className="card-icon">{icon}</span>
          <h3 className="card-title">{title}</h3>
        </div>

        <p className="card-description">{description}</p>

        <div className="card-tags">
          {tags.map((tag, i) => (
            <span key={i} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function CapabilitiesSection() {
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

  return (
    <section className="capabilities-section" id="capabilities">
      <div className="capabilities-container">
        <p className="capabilities-intro">
          We've identified four critical domains where AI can stop revenue leaks and create a foundation for scalable growth. We apply our engineering mindset to build custom solutions in each of these areas, tailored to your specific bottlenecks.
        </p>

        <div className="capabilities-cards">
          {capabilities.map((capability, index) => (
            <CapabilityCard key={index} {...capability} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
