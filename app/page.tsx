'use client';

import Navigation from '@/components/ui/navigation';
import { VoidHero } from '@/components/ui/void-hero';
import GridCanvas from '@/components/ui/grid-canvas';
import InfiniteShaderBg from '@/components/ui/infinite-shader-bg';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-lightest">
      <Navigation />

      {/* Hero Section */}
      <section className="section-hero pt-20">
        <div className="hero-container">
          <div className="hero-frame">
            <GridCanvas className="grid-canvas" />
          </div>
          <div className="container max-w-6xl mx-auto px-8">
            <div className="hero-text-content">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-darkest">
                Your Business is Leaking Revenue.<br />
                We Build the AI Systems to Stop It.
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Subheading Section */}
      <section className="hero-subheading-section py-8">
        <div className="container max-w-6xl mx-auto px-8">
          <p className="text-xl md:text-2xl text-left text-medium-dark leading-relaxed">
            No huge upfront investment. No complex tech to manage. Just results.<br />
            Trusted by teams in construction, medicine, and professional services.
          </p>
        </div>
      </section>

      {/* Logo Marquee Section (PixelFlow Style) */}
      <section className="section marquee">
        <div className="container marquee">
          <p className="marquee-title">Trusted by world-class companies</p>
          <div className="marquee-wrapper">
            <div className="marquee-content">
              <div className="marquee-content-wrapper">
                <div className="marquee-block">
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTQwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnPjxwYXRoIGQ9Ik0zMCAyMGw0IDlINDJsLTUgNCAxLjkgOEwzMCAzMmwtNy4xIDNMMjUgMjdsLTUtNGg4bDQtOXoiIGZpbGw9IiM2Yzc1N2QiLz48L2c+PHRleHQgeD0iNTAiIHk9IjMwIiBmb250LWZhbWlseT0iSW50ZXIsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiM2Yzc1N2QiPlNub3dmbGFrZTwvdGV4dD48L3N2Zz4=" alt="Snowflake" />
                </div>
                <div className="marquee-block">
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTQwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnPjxwYXRoIGQ9Ik0zMCAxNWw4IDIwSDIybDgtMjB6IiBmaWxsPSIjNmM3NTdkIi8+PHBhdGggZD0iTTI3IDI1aDZsLTMgMTAtMy0xMHoiIGZpbGw9IiM2Yzc1N2QiLz48L2c+PHRleHQgeD0iNTAiIHk9IjMwIiBmb250LWZhbWlseT0iSW50ZXIsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiM2Yzc1N2QiPlByb2xpbmU8L3RleHQ+PC9zdmc+" alt="Proline" />
                </div>
                <div className="marquee-block">
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTQwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCIgeD0iMTAiIHk9IjEwIiBmaWxsPSJub25lIiBzdHJva2U9IiM2Yzc1N2QiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjU1IiB5PSIzMCIgZm9udC1mYW1pbHk9IkludGVyLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSIjNmM3NTdkIj5PcmFjbGU8L3RleHQ+PC9zdmc+" alt="Oracle" />
                </div>
                <div className="marquee-block">
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTQwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnPjxwYXRoIGQ9Im0xNSAxNWgxNXYyMGgtMTV6bTIwIDBoMTV2MjBoLTE1eiIgZmlsbD0iIzZjNzU3ZCIvPjwvZz48dGV4dCB4PSI1NSIgeT0iMzAiIGZvbnQtZmFtaWx5PSJJbnRlciwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjYwMCIgZmlsbD0iIzZjNzU3ZCI+TWljcm9zb2Z0PC90ZXh0Pjwvc3ZnPg==" alt="Microsoft" />
                </div>
                <div className="marquee-block">
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTQwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjMiIGZpbGw9IiNlYTQzMzUiLz48Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSI0IiBmaWxsPSIjZmJiYzA0Ii8+PGNpcmNsZSBjeD0iMzAiIGN5PSIyMCIgcj0iMyIgZmlsbD0iIzM0YTg1MyIvPjxjaXJjbGUgY3g9IjM1IiBjeT0iMjUiIHI9IjQiIGZpbGw9IiM0Mjg1ZjQiLz48L2c+PHRleHQgeD0iNTAiIHk9IjMwIiBmb250LWZhbWlseT0iSW50ZXIsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiM2Yzc1N2QiPkdvb2dsZTwvdGV4dD48L3N2Zz4=" alt="Google" />
                </div>
                <div className="marquee-block">
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTQwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnPjxwYXRoIGQ9Ik0yNSAxNWM1IDAgOS41IDMuNSA5LjUgOHMtNC41IDgtOS41IDgtOS41LTMuNS05LjUtOCA0LjUtOCA5LjUtOHptMCA2Yy0xIDAtMiAuNS0yIDFzMSAxIDIgMSAyLS41IDItMWMwLS41LTEtMS0yLTF6IiBmaWxsPSIjNmM3NTdkIi8+PC9nPjx0ZXh0IHg9IjQzIiB5PSIzMCIgZm9udC1mYW1pbHk9IkludGVyLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSIjNmM3NTdkIj5BcHBsZTwvdGV4dD48L3N2Zz4=" alt="Apple" />
                </div>
              </div>
              <div className="marquee-content-wrapper">
                <div className="marquee-block">
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTQwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnPjxwYXRoIGQ9Ik0zMCAyMGw0IDlINDJsLTUgNCAxLjkgOEwzMCAzMmwtNy4xIDNMMjUgMjdsLTUtNGg4bDQtOXoiIGZpbGw9IiM2Yzc1N2QiLz48L2c+PHRleHQgeD0iNTAiIHk9IjMwIiBmb250LWZhbWlseT0iSW50ZXIsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiM2Yzc1N2QiPlNub3dmbGFrZTwvdGV4dD48L3N2Zz4=" alt="Snowflake" />
                </div>
                <div className="marquee-block">
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTQwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnPjxwYXRoIGQ9Ik0zMCAxNWw4IDIwSDIybDgtMjB6IiBmaWxsPSIjNmM3NTdkIi8+PHBhdGggZD0iTTI3IDI1aDZsLTMgMTAtMy0xMHoiIGZpbGw9IiM2Yzc1N2QiLz48L2c+PHRleHQgeD0iNTAiIHk9IjMwIiBmb250LWZhbWlseT0iSW50ZXIsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiM2Yzc1N2QiPlByb2xpbmU8L3RleHQ+PC9zdmc+" alt="Proline" />
                </div>
                <div className="marquee-block">
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTQwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCIgeD0iMTAiIHk9IjEwIiBmaWxsPSJub25lIiBzdHJva2U9IiM2Yzc1N2QiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjU1IiB5PSIzMCIgZm9udC1mYW1pbHk9IkludGVyLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSIjNmM3NTdkIj5PcmFjbGU8L3RleHQ+PC9zdmc+" alt="Oracle" />
                </div>
                <div className="marquee-block">
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTQwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnPjxwYXRoIGQ9Im0xNSAxNWgxNXYyMGgtMTV6bTIwIDBoMTV2MjBoLTE1eiIgZmlsbD0iIzZjNzU3ZCIvPjwvZz48dGV4dCB4PSI1NSIgeT0iMzAiIGZvbnQtZmFtaWx5PSJJbnRlciwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjYwMCIgZmlsbD0iIzZjNzU3ZCI+TWljcm9zb2Z0PC90ZXh0Pjwvc3ZnPg==" alt="Microsoft" />
                </div>
                <div className="marquee-block">
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTQwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjMiIGZpbGw9IiNlYTQzMzUiLz48Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSI0IiBmaWxsPSIjZmJiYzA0Ii8+PGNpcmNsZSBjeD0iMzAiIGN5PSIyMCIgcj0iMyIgZmlsbD0iIzM0YTg1MyIvPjxjaXJjbGUgY3g9IjM1IiBjeT0iMjUiIHI9IjQiIGZpbGw9IiM0Mjg1ZjQiLz48L2c+PHRleHQgeD0iNTAiIHk9IjMwIiBmb250LWZhbWlseT0iSW50ZXIsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiM2Yzc1N2QiPkdvb2dsZTwvdGV4dD48L3N2Zz4=" alt="Google" />
                </div>
                <div className="marquee-block">
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTQwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnPjxwYXRoIGQ9Ik0yNSAxNWM1IDAgOS41IDMuNSA5LjUgOHMtNC41IDgtOS41IDgtOS41LTMuNS05LjUtOCA0LjUtOCA5LjUtOHptMCA2Yy0xIDAtMiAuNS0yIDFzMSAxIDIgMSAyLS41IDItMWMwLS41LTEtMS0yLTF6IiBmaWxsPSIjNmM3NTdkIi8+PC9nPjx0ZXh0IHg9IjQzIiB5PSIzMCIgZm9udC1mYW1pbHk9IkludGVyLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSIjNmM3NTdkIj5BcHBsZTwvdGV4dD48L3N2Zz4=" alt="Apple" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PixelFlow Style Revenue Recovery Section */}
      <section className="section pixelflow-section">
        <div className="container">
          <div className="pixelflow-content">

            {/* Main Heading with Inline Icons */}
            <div className="pixelflow-text-group">
              <h2 className="pixelflow-headline">
                Every missed call or slow reply<img src="coin-icon.png" alt="Revenue Loss" className="inline-icon" />is <span style={{whiteSpace: 'nowrap'}}>a customer lost.</span><br /><br />
                Our AI<img src="boticon.png" alt="AI Bot" className="inline-icon" />captures every opportunity.
              </h2>
              <p className="pixelflow-subtext">
                Book your <strong>free</strong> 30-minute strategy session.<br />
                We'll find your #1 leak and guarantee a win in 30 days.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pixelflow-cta">
              <a href="#audit" className="interactive-hover-button">
                <span className="button-text">Find My Revenue Leaks</span>
                <div className="hover-content">
                  <span>Find My Revenue Leaks</span>
                  <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7,7 17,7 17,17"></polyline>
                  </svg>
                </div>
                <div className="button-background"></div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section with Animated Leak Cards */}
      <section className="section problem-section">
        <div className="container">
          {/* Section Header */}
          <div className="problem-header">
            <h2 className="problem-headline">The Silent Killers of Growth<br />Are Already in Your Business</h2>
            <p className="problem-subtext">You feel it, don't you? The nagging sense that you're leaving money on the table.</p>
          </div>

          {/* Professional Problem Cards */}
          <div className="problem-cards-container">

            {/* Card 1: The Missed Call */}
            <div className="problem-card">
              <div className="card-number">01</div>
              <div className="card-content">
                <h3 className="card-title">THE MISSED CALL</h3>
                <p className="card-description">
                  $5,000 client calls. Gets voicemail.
                  Hangs up. Calls your competitor.
                </p>
              </div>
              <div className="card-impact">That's a leak</div>
            </div>

            {/* Card 2: The Response Delay */}
            <div className="problem-card">
              <div className="card-number">02</div>
              <div className="card-content">
                <h3 className="card-title">THE RESPONSE DELAY</h3>
                <p className="card-description">
                  Website inquiry sits 6 hours.
                  You reply. Their urgency is gone.
                </p>
              </div>
              <div className="card-impact">That's a leak</div>
            </div>

            {/* Card 3: The Dormant Database */}
            <div className="problem-card">
              <div className="card-number">03</div>
              <div className="card-content">
                <h3 className="card-title">THE DORMANT DATABASE</h3>
                <p className="card-description">
                  500 old leads. Pure goldmine.
                  Sitting untouched for years.
                </p>
              </div>
              <div className="card-impact">That's a massive leak</div>
            </div>

          </div>

          {/* Emotional Amplification */}
          <div className="problem-amplification">
            <p className="amplification-text">These aren't just minor issues.</p>
            <p className="amplification-emphasis">
              They are <strong>SYSTEMIC FAILURES</strong> that cap your growth and hand your
              best opportunities directly to the competition.
            </p>
            <p className="amplification-closer">In today's market, the business that responds fastest, <strong>WINS</strong>.</p>
          </div>

          {/* Bridge Text Only */}
          <div className="problem-bridge">
            <p className="bridge-text">"But what if you could capture EVERY opportunity?"</p>
          </div>
        </div>
      </section>

      {/* Solution Section - Infinite Shader 2025 */}
      <section className="section solution-section relative overflow-hidden" style={{ backgroundColor: '#0A0A0A', paddingTop: '140px', paddingBottom: '140px' }} id="solution">
        {/* Infinite terrain shader background */}
        <div className="absolute inset-0" style={{
          pointerEvents: 'none',
          zIndex: 1
        }}>
          <InfiniteShaderBg className="w-full h-full" />
        </div>

        {/* Radial gradient overlay for depth */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(120% 80% at 50% 50%, transparent 40%, black 100%)',
          zIndex: 2
        }} />

        <div className="container relative text-center mx-auto px-6" style={{ zIndex: 10, maxWidth: '1200px' }}>
          {/* Headline */}
          <h2 className="text-[clamp(2.25rem,6vw,4rem)] font-bold leading-[0.95] tracking-tight text-white mb-6">
            We Don't Sell AI.<br />We Engineer Revenue.
          </h2>

          {/* Subtitle - Concise */}
          <p className="text-white/70 text-base md:text-lg mx-auto max-w-2xl text-center leading-relaxed mb-20">
            Most "AI consultants" try to sell you a flashy new tool. That's why 95% of AI projects fail to deliver ROI—they force technology onto a broken process. We do things differently. Our approach is built on a first-principles, engineering mindset.
          </p>

          {/* Premium 3-Stage Process - Mobile Responsive */}
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Subtle connecting line - desktop only */}
              <div className="hidden md:block absolute top-5 left-0 right-0 h-px" style={{
                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08) 50%, transparent)'
              }}></div>

              {/* Responsive Grid: Mobile stack, Desktop 3-col */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
                {/* Step 1 - Audit */}
                <div className="text-center relative px-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-6 relative border border-white/10">
                    <span className="text-white/70 text-sm font-semibold">01</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Audit</h3>
                  <p className="text-white/60 text-base leading-relaxed">
                    We analyze your customer journey to find the single biggest revenue leak costing you customers.
                  </p>
                </div>

                {/* Step 2 - Blueprint */}
                <div className="text-center relative px-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-6 relative border border-white/10">
                    <span className="text-white/70 text-sm font-semibold">02</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Blueprint</h3>
                  <p className="text-white/60 text-base leading-relaxed">
                    We design your custom AI system to capture those lost opportunities automatically.
                  </p>
                </div>

                {/* Step 3 - Guarantee */}
                <div className="text-center relative px-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-6 relative border border-white/10">
                    <span className="text-white/70 text-sm font-semibold">03</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Guarantee</h3>
                  <p className="text-white/60 text-base leading-relaxed">
                    We deliver a measurable revenue win in 30 days, or you don't pay. The risk is 100% on us.
                  </p>
                </div>
              </div>
            </div>

            {/* Subtle Partnership Signal */}
            <div className="text-center mt-20">
              <p className="text-white/40 text-sm font-light">
                Then we grow together as your partner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-lightest">
        <div className="container max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-darkest mb-8">
            Ready to Stop the Revenue Leak?
          </h2>
          <p className="text-xl text-medium-dark mb-12 leading-relaxed">
            Book a free strategy call to discover your biggest opportunity.
          </p>
          <a
            href="/contact"
            className="inline-block bg-darkest text-white px-12 py-4 rounded-lg text-lg font-semibold hover:bg-very-dark transition-colors duration-300"
          >
            Book Free Strategy Call
          </a>
        </div>
      </section>
    </div>
  );
}