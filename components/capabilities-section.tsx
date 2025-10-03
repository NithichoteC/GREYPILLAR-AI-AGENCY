'use client';
import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

interface CapabilityCardProps {
  iconSrc: string;
  accentColor: string;
  title: string;
  description: string;
  tags: string[];
  index: number;
  totalCards: number;
}

const CapabilityCard = ({ iconSrc, accentColor, title, description, tags, index, totalCards }: CapabilityCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Track this specific card's scroll progress
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"]
  });

  // Desktop: Scale from 1 → 0.9 based on card position in stack
  const targetScale = 1 - ((totalCards - index) * 0.05);
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  // Last card fades out at end of scroll
  const isLastCard = index === totalCards - 1;
  const opacity = isLastCard
    ? useTransform(scrollYProgress, [0.8, 1], [1, 0])
    : 1;

  return (
    <motion.div
      ref={cardRef}
      style={{
        scale,
        opacity,
        top: `calc(-5vh + ${index * 25}px)`,
        zIndex: index
      }}
      className="capability-card"
      data-index={index}
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
    </motion.div>
  );
};

export default function CapabilitiesSection() {
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

        <div className="capabilities-cards-wrapper">
          <div className="capabilities-cards">
            {capabilities.map((capability, index) => (
              <CapabilityCard
                key={index}
                {...capability}
                index={index}
                totalCards={capabilities.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
