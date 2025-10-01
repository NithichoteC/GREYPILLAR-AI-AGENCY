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

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleScroll = () => {
      const rect = card.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate scroll progress (0 to 1) based on card position in viewport
      const scrollProgress = Math.max(0, Math.min(1,
        (windowHeight - rect.top) / windowHeight
      ));

      // Apply Nitro-style transforms
      const translateY = -(scrollProgress * index * 90); // Move up by 90px per card
      const scale = Math.max(0.88, 1 - (scrollProgress * 0.12)); // Scale from 1.0 to 0.88

      card.style.transform = `translateY(${translateY}px) scale(${scale})`;
    };

    // Attach scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="capability-card"
      style={{
        // Stacking context - earlier cards behind, later cards in front
        zIndex: 10 - index,
        willChange: 'transform',
      }}
    >
      <div className="capability-card-content">
        <div className="capability-card-header">
          <span className="capability-card-icon">{icon}</span>
          <h3 className="capability-card-title">{title}</h3>
        </div>

        <p className="capability-card-description">{description}</p>

        <div className="capability-card-tags">
          {tags.map((tag, i) => (
            <span key={i} className="capability-tag">{tag}</span>
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
