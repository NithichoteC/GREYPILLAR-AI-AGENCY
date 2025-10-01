'use client';
import { useEffect, useRef, useState } from 'react';

interface CapabilityCardProps {
  icon: string;
  title: string;
  description: string;
  tags: string[];
  index: number;
  scrollProgress: number; // Container scroll progress passed down
}

const CapabilityCard = ({ icon, title, description, tags, index, scrollProgress }: CapabilityCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // DIFFERENTIAL SPEED: Each card moves at different rate for parallax effect
    // Card 0 (index 0): moves very little (stays in background)
    // Card 3 (index 3): moves most (slides over foreground)
    const speedMultiplier = index * 50; // 0, 50, 100, 150
    const translateY = -(scrollProgress * speedMultiplier);

    // Scale: all cards scale down slightly as section scrolls
    const scale = Math.max(0.88, 1 - (scrollProgress * 0.12));

    card.style.transform = `translateY(${translateY}px) scale(${scale})`;
  }, [scrollProgress, index]);

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
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = section.offsetHeight;

      // Calculate how far through the section we've scrolled (0 to 1)
      // Section starts at top of viewport (rect.top = 0)
      // Section ends when bottom leaves viewport (rect.bottom = 0)
      const progress = Math.max(0, Math.min(1,
        -rect.top / (sectionHeight - windowHeight)
      ));

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <section ref={sectionRef} className="capabilities-section" id="capabilities">
      <div className="capabilities-container">
        <p className="capabilities-intro">
          We've identified four critical domains where AI can stop revenue leaks and create a foundation for scalable growth. We apply our engineering mindset to build custom solutions in each of these areas, tailored to your specific bottlenecks.
        </p>

        <div className="capabilities-cards">
          {capabilities.map((capability, index) => (
            <CapabilityCard key={index} {...capability} index={index} scrollProgress={scrollProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
