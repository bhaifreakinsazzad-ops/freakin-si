/**
 * BayParee — Landing Page v7.0
 * SCAN-FIRST design: 3-second decision window
 */
import { Link } from 'react-router-dom'
import { motion, useScroll, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import {
  ArrowRight, CheckCircle, Sparkles, Zap, Globe, Target,
  TrendingUp, Shield, Users, BarChart3, Rocket, Star,
  Lightbulb, FileText, Megaphone, DollarSign, Building2,
  Play, ChevronRight, Award, Clock, Briefcase, Bot,
} from 'lucide-react'

/* ─── COUNTER COMPONENT ─────────────────────────────────────────────────────── */

function Counter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [v, setV] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let cur = 0; const inc = target / 60
    const t = setInterval(() => {
      cur += inc
      if (cur >= target) { setV(target); clearInterval(t) } else setV(Math.floor(cur))
    }, 16)
    return () => clearInterval(t)
  }, [inView, target])
  return <span ref={ref}>{prefix}{v.toLocaleString()}{suffix}</span>
}

/* ─── FADEUP COMPONENT ──────────────────────────────────────────────────────── */

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.25, 0, 0, 1], delay }}
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  )
}

/* ─── MAIN COMPONENT ────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    return scrollY.on('change', (y) => setScrolled(y > 20))
  }, [scrollY])

  return (
    <div style={{ background: '#050508', minHeight: '100vh', color: 'rgba(255,255,255,0.95)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* ── CSS INJECTION ── */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes float {
          0%,100% { transform: perspective(1000px) rotateY(-6deg) rotateX(3deg) translateY(0px); }
          50%     { transform: perspective(1000px) rotateY(-6deg) rotateX(3deg) translateY(-12px); }
        }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.3; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #050508; }
        a { text-decoration: none; color: inherit; }
        .bp-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .bp-section-label {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #F5B041;
          margin-bottom: 16px;
        }
        @media (max-width: 767px) {
          .bp-desktop-only { display: none !important; }
          .bp-hero-grid { flex-direction: column !important; }
          .bp-hero-left { width: 100% !important; }
          .bp-steps-grid { flex-direction: column !important; gap: 24px !important; }
          .bp-steps-arrow { display: none !important; }
          .bp-bento-row1 { flex-direction: column !important; }
          .bp-bento-row2 { flex-direction: column !important; }
          .bp-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .bp-testimonials-grid { flex-direction: column !important; }
          .bp-pricing-grid { flex-direction: column !important; }
          .bp-footer-grid { flex-direction: column !important; gap: 36px !important; }
          .bp-scan-strip-items { flex-wrap: wrap !important; gap: 16px !important; }
        }
        @media (min-width: 768px) {
          .bp-mobile-only { display: none !important; }
        }
      `}</style>

      {/* ════════════════════════════════════════════════════════════
          SECTION 1 — NAV
      ════════════════════════════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 64,
        display: 'flex', alignItems: 'center',
        background: scrolled ? 'rgba(5,5,8,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div className="bp-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 0, letterSpacing: '-0.03em' }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#F5B041' }}>Bay</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: 'rgba(255,255,255,0.95)' }}>Paree</span>
          </Link>

          {/* Center nav — desktop */}
          <div className="bp-desktop-only" style={{ display: 'flex', gap: 32 }}>
            {['How It Works', 'Features', 'Pricing'].map((label, i) => (
              <a
                key={label}
                href={i === 0 ? '#how-it-works' : i === 1 ? '#features' : '#pricing'}
                style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.95)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Right CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link
              to="/login"
              className="bp-desktop-only"
              style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', padding: '6px 12px' }}
            >
              Sign In
            </Link>
            <Link
              to="/builder"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#F5B041', color: '#000', fontWeight: 700,
                fontSize: 13, padding: '8px 18px', borderRadius: 8,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.filter = 'brightness(1.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'brightness(1)'; }}
            >
              Start Building <ArrowRight size={13} />
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="bp-mobile-only"
              onClick={() => setMobileOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', padding: 4 }}
              aria-label="Open menu"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect y="3" width="22" height="2" rx="1" fill="currentColor" />
                <rect y="10" width="22" height="2" rx="1" fill="currentColor" />
                <rect y="17" width="22" height="2" rx="1" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(5,5,8,0.98)', backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column', padding: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em' }}>
              <span style={{ color: '#F5B041' }}>Bay</span>Paree
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { label: 'Builder', to: '/builder' },
              { label: 'Marketplace', to: '/marketplace' },
              { label: 'Business Hub', to: '/hub' },
              { label: 'Pricing', to: '#pricing' },
              { label: 'Login', to: '/login' },
            ].map(item => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                style={{ fontSize: 24, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/builder"
              onClick={() => setMobileOpen(false)}
              style={{
                marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#F5B041', color: '#000', fontWeight: 700,
                fontSize: 16, padding: '14px 28px', borderRadius: 10, width: 'fit-content',
              }}
            >
              Start Building <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          SECTION 2 — HERO
      ════════════════════════════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        paddingTop: 64, position: 'relative', overflow: 'hidden',
      }}>
        {/* Background glows */}
        <div style={{
          position: 'absolute', width: 700, height: 700,
          right: -200, top: -100, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(circle, rgba(245,176,65,0.09) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', width: 600, height: 600,
          left: -150, top: 100, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)',
          filter: 'blur(100px)',
        }} />

        <div className="bp-container" style={{ width: '100%', position: 'relative', zIndex: 1 }}>
          <div className="bp-hero-grid" style={{ display: 'flex', alignItems: 'center', gap: 48, padding: '60px 0' }}>

            {/* LEFT COLUMN */}
            <div className="bp-hero-left" style={{ flex: '0 0 55%', maxWidth: '55%' }}>

              {/* A. Label pill */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: 24 }}
              >
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(245,176,65,0.1)', border: '1px solid rgba(245,176,65,0.3)',
                  borderRadius: 100, padding: '6px 16px',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: '#F5B041',
                }}>
                  <Zap size={11} />
                  AI Business Builder · Free to Start
                </span>
              </motion.div>

              {/* B. Headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{ marginBottom: 20 }}
              >
                <h1 style={{
                  fontSize: 'clamp(3.2rem, 7.5vw, 6.8rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.90,
                }}>
                  <span style={{ display: 'block', color: 'rgba(255,255,255,0.95)' }}>From Idea</span>
                  <span style={{ display: 'block', color: '#F5B041' }}>to Business.</span>
                </h1>
              </motion.div>

              {/* C. One-line sub */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                  fontSize: 17, color: 'rgba(255,255,255,0.55)',
                  marginBottom: 32, lineHeight: 1.5,
                }}
              >
                Describe your idea. AI builds everything. Launch in minutes.
              </motion.p>

              {/* D. What you get — icon pills */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}
              >
                {[
                  { icon: <FileText size={14} />, label: 'Blueprint' },
                  { icon: <Award size={14} />, label: 'Brand' },
                  { icon: <Megaphone size={14} />, label: 'Marketing' },
                  { icon: <Briefcase size={14} />, label: 'Paperwork' },
                  { icon: <Rocket size={14} />, label: 'Launch' },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, padding: '8px 12px',
                    }}
                  >
                    <span style={{ color: '#F5B041' }}>{icon}</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{label}</span>
                  </div>
                ))}
              </motion.div>

              {/* E. CTA Row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}
              >
                <Link
                  to="/builder"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: '#F5B041', color: '#000',
                    fontWeight: 700, fontSize: 16,
                    padding: '15px 32px', borderRadius: 10,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.filter = 'brightness(1.08)'
                    e.currentTarget.style.boxShadow = '0 0 32px rgba(245,176,65,0.3)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.filter = 'brightness(1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  Start Building <ArrowRight size={16} />
                </Link>
                <a
                  href="#how-it-works"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'transparent', color: 'rgba(255,255,255,0.85)',
                    fontWeight: 600, fontSize: 16,
                    padding: '15px 32px', borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.14)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)' }}
                >
                  <Play size={15} /> Watch How It Works
                </a>
              </motion.div>

              {/* F. Trust strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}
              >
                {[
                  '27,403 businesses built',
                  'Free forever plan',
                  'No card needed',
                ].map(text => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT COLUMN — Dashboard Panel */}
            <div className="bp-desktop-only" style={{ flex: '0 0 45%', maxWidth: '45%', perspective: 1000 }}>
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                style={{ animation: 'float 6s ease-in-out infinite' }}
              >
                <div style={{
                  background: 'rgba(12,12,15,0.85)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 20, padding: 28,
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
                }}>
                  {/* Traffic lights */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {['#EF4444', '#F59E0B', '#22C55E'].map(c => (
                        <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                      ))}
                    </div>
                    <span style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                      BayParee Builder — AI Session
                    </span>
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 16 }} />

                  {/* Journey label */}
                  <div style={{ fontSize: 10, color: '#F5B041', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                    10-Step Journey
                  </div>

                  {/* Steps */}
                  {[
                    { num: '01', name: 'Your Idea', badge: 'Complete', badgeColor: '#22C55E', badgeBg: 'rgba(34,197,94,0.12)', pulse: false },
                    { num: '02', name: 'AI Blueprint', badge: 'Generating...', badgeColor: '#F5B041', badgeBg: 'rgba(245,176,65,0.12)', pulse: true },
                    { num: '03', name: 'Brand Identity', badge: 'Pending', badgeColor: 'rgba(255,255,255,0.25)', badgeBg: 'rgba(255,255,255,0.04)', pulse: false },
                    { num: '04', name: 'Marketing Plan', badge: 'Pending', badgeColor: 'rgba(255,255,255,0.25)', badgeBg: 'rgba(255,255,255,0.04)', pulse: false },
                    { num: '05', name: 'Launch Ready', badge: 'Pending', badgeColor: 'rgba(255,255,255,0.25)', badgeBg: 'rgba(255,255,255,0.04)', pulse: false },
                  ].map(step => (
                    <div
                      key={step.num}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}
                    >
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)',
                        flexShrink: 0,
                      }}>
                        {step.num}
                      </div>
                      <span style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>{step.name}</span>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        fontSize: 11, fontWeight: 600,
                        color: step.badgeColor,
                        background: step.badgeBg,
                        padding: '3px 8px', borderRadius: 100,
                      }}>
                        {step.pulse && (
                          <span style={{
                            width: 5, height: 5, borderRadius: '50%',
                            background: '#F5B041',
                            animation: 'pulse-dot 1.4s ease-in-out infinite',
                            display: 'inline-block',
                          }} />
                        )}
                        {step.badge}
                      </span>
                    </div>
                  ))}

                  {/* Shimmer bar */}
                  <div style={{ height: 3, borderRadius: 2, overflow: 'hidden', margin: '14px 0' }}>
                    <div style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(245,176,65,0.3), transparent)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s infinite',
                    }} />
                  </div>

                  {/* Bottom stats */}
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[
                      { label: 'Business Rank', value: '#13,487' },
                      { label: 'Fund Score', value: '92 / 100' },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        style={{
                          flex: 1, background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: 10, padding: '12px 14px',
                        }}
                      >
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>{label}</div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: '#F5B041', letterSpacing: '-0.02em' }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 3 — SCAN STRIP
      ════════════════════════════════════════════════════════════ */}
      <section style={{
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '28px 0',
      }}>
        <div className="bp-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: '#F5B041',
              marginRight: 32, flexShrink: 0,
            }}>
              What's Included
            </span>
            <div
              className="bp-scan-strip-items"
              style={{ display: 'flex', gap: 32, overflowX: 'auto', alignItems: 'center' }}
            >
              {[
                { icon: <Sparkles size={18} />, label: "AI Blueprint" },
                { icon: <Award size={18} />, label: "Brand Identity" },
                { icon: <Megaphone size={18} />, label: "Marketing Plan" },
                { icon: <Briefcase size={18} />, label: "LLC & Paperwork" },
                { icon: <BarChart3 size={18} />, label: "Fundability Check" },
                { icon: <Bot size={18} />, label: "Custom AI Agent" },
                { icon: <Globe size={18} />, label: "Landing Page Copy" },
                { icon: <Target size={18} />, label: "Ad Creatives" },
              ].map(({ icon, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{ color: '#F5B041' }}>{icon}</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500, whiteSpace: 'nowrap' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 4 — HOW IT WORKS
      ════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: '120px 0' }}>
        <div className="bp-container">
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span className="bp-section-label">How It Works</span>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight: 800, letterSpacing: '-0.03em',
                marginBottom: 16, color: 'rgba(255,255,255,0.95)',
              }}>
                Three steps. One session. Launch ready.
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)' }}>
                Answer questions. AI builds everything. You launch.
              </p>
            </div>
          </FadeUp>

          <div className="bp-steps-grid" style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            {[
              {
                num: '01',
                icon: <Lightbulb size={28} />,
                title: 'Describe Your Idea',
                body: 'Tell us your business concept in plain English. Niche, audience, budget. No business degree needed.',
                pill: 'Takes 2 minutes →',
                pillColor: '#22C55E',
                delay: 0,
              },
              {
                num: '02',
                icon: <Sparkles size={28} />,
                title: 'AI Builds Everything',
                body: '10 AI models analyze your idea and generate your complete business: name, brand, marketing strategy, ad creatives, and revenue model.',
                pill: 'Under 3 minutes →',
                pillColor: '#22C55E',
                delay: 0.1,
              },
              {
                num: '03',
                icon: <Rocket size={28} />,
                title: 'Launch With Support',
                body: 'File your LLC, launch your ads, build your website, and access business funding — all from one place.',
                pill: 'Same day →',
                pillColor: '#22C55E',
                delay: 0.2,
              },
            ].map((step, idx) => (
              <div key={step.num} style={{ display: 'flex', alignItems: 'flex-start', gap: 0, flex: 1 }}>
                <FadeUp delay={step.delay}>
                  <div style={{
                    background: '#0C0C0F',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 16, padding: 28,
                    height: '100%', position: 'relative', overflow: 'hidden',
                  }}>
                    {/* Background number */}
                    <div style={{
                      position: 'absolute', top: 16, right: 20,
                      fontSize: 56, fontWeight: 900, fontFamily: 'monospace',
                      color: '#F5B041', opacity: 0.2, lineHeight: 1,
                    }}>
                      {step.num}
                    </div>
                    <div style={{ color: '#F5B041', marginBottom: 16 }}>{step.icon}</div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{step.title}</h3>
                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 20 }}>{step.body}</p>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontSize: 13, color: step.pillColor, fontWeight: 600,
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: step.pillColor }} />
                      {step.pill}
                    </div>
                  </div>
                </FadeUp>

                {idx < 2 && (
                  <div className="bp-steps-arrow" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 4px', paddingTop: 80, flexShrink: 0,
                  }}>
                    <ChevronRight size={20} color="rgba(255,255,255,0.15)" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 4.5 — BUSINESS HUB PROMO STRIP
      ════════════════════════════════════════════════════════════ */}
      <section style={{ paddingBottom: 80 }}>
        <div className="bp-container">
          <FadeUp>
            <Link to="/hub" style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(245,176,65,0.08) 0%, rgba(230,126,34,0.04) 100%)',
                border: '1px solid rgba(245,176,65,0.22)',
                borderRadius: 20, padding: '36px 40px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
                cursor: 'pointer', transition: 'border-color 0.2s',
                flexWrap: 'wrap',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(245,176,65,0.5)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(245,176,65,0.22)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1, minWidth: 240 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                    background: 'rgba(245,176,65,0.12)', border: '1px solid rgba(245,176,65,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                  }}>🏢</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#F5B041' }}>NEW</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>BUSINESS HUB</span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.92)', margin: 0 }}>
                      Your entire business ecosystem — one place.
                    </h3>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: '4px 0 0', lineHeight: 1.5 }}>
                      Hire talent · Check funding eligibility · Learn · AI agents · Mobile AI engine
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {['Hire', 'Fund', 'Learn', 'AI'].map(tag => (
                    <span key={tag} style={{
                      fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
                      background: 'rgba(245,176,65,0.1)', color: '#F5B041',
                      border: '1px solid rgba(245,176,65,0.2)',
                    }}>{tag}</span>
                  ))}
                  <span style={{ color: '#F5B041', fontSize: 18, marginLeft: 8 }}>→</span>
                </div>
              </div>
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 5 — WHAT YOU GET (BENTO GRID)
      ════════════════════════════════════════════════════════════ */}
      <section id="features" style={{ paddingBottom: 120 }}>
        <div className="bp-container">
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span className="bp-section-label">What You Get</span>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight: 800, letterSpacing: '-0.03em',
                color: 'rgba(255,255,255,0.95)',
              }}>
                Everything to go from zero to launch.
              </h2>
            </div>
          </FadeUp>

          {/* Row 1 */}
          <FadeUp delay={0.05}>
            <div className="bp-bento-row1" style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              {/* Large card — Blueprint Engine */}
              <div style={{
                flex: '0 0 60%',
                background: '#0C0C0F',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16, padding: 28,
                position: 'relative', overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
              >
                <div style={{
                  position: 'absolute', top: 20, right: 20,
                  fontSize: 13, fontFamily: 'monospace', color: 'rgba(245,176,65,0.25)', fontWeight: 700,
                }}>01</div>
                {/* Gold blob */}
                <div style={{
                  position: 'absolute', bottom: -60, right: -60,
                  width: 200, height: 200,
                  background: 'radial-gradient(circle, rgba(245,176,65,0.03) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />
                <div style={{ color: '#F5B041', marginBottom: 12 }}><FileText size={28} /></div>
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Complete Business Blueprint</h3>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 20 }}>
                  10-section business plan with revenue model, competitor analysis, pricing strategy, and 90-day roadmap. Generated in under 3 minutes by AI trained on real businesses.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['Business Name & Tagline', 'Revenue Model', 'Target Audience', 'Launch Roadmap'].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={14} color="#F5B041" />
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medium card — Brand Identity */}
              <div style={{
                flex: 1,
                background: '#0C0C0F',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16, padding: 28,
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
              >
                <div style={{ color: '#F5B041', marginBottom: 12 }}><Award size={24} /></div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Complete Brand Identity</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 20 }}>
                  Logo concept, color palette, brand voice, tone of voice, and visual positioning. Ready to hand off to a designer.
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Logo Brief', 'Color System', 'Voice Guide'].map(p => (
                    <span key={p} style={{
                      fontSize: 12, color: 'rgba(255,255,255,0.5)',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 6, padding: '4px 10px',
                    }}>{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Row 2 */}
          <FadeUp delay={0.1}>
            <div className="bp-bento-row2" style={{ display: 'flex', gap: 16 }}>
              {[
                {
                  icon: <Megaphone size={22} />,
                  title: 'Ad Creatives',
                  body: 'Facebook, Google & TikTok hooks, ad copy, and targeting strategy ready to publish.',
                },
                {
                  icon: <Briefcase size={22} />,
                  title: 'Legal & Paperwork',
                  body: 'LLC filing guide, EIN checklist, business bank account setup — via ThePaperWorkSquad.',
                },
                {
                  icon: <BarChart3 size={22} />,
                  title: 'Fundability Score',
                  body: "Check your business's eligibility for US funding before you spend a dollar on ads.",
                },
              ].map(card => (
                <div
                  key={card.title}
                  style={{
                    flex: 1,
                    background: '#0C0C0F',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 16, padding: 28,
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
                >
                  <div style={{ color: '#F5B041', marginBottom: 12 }}>{card.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{card.title}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>{card.body}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 6 — STATS BAR
      ════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '80px 0',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div className="bp-container">
          <div
            className="bp-stats-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, textAlign: 'center' }}
          >
            {[
              { target: 27403, label: 'Businesses Built' },
              { target: 2400, label: 'Active Builders' },
              { target: 40, suffix: '+', label: 'AI Models' },
              { target: 0, prefix: '$', label: 'Cost to Start' },
            ].map(({ target, label, prefix, suffix }) => (
              <FadeUp key={label}>
                <div>
                  <div style={{
                    fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
                    fontWeight: 900, color: '#F5B041', letterSpacing: '-0.03em',
                    lineHeight: 1,
                  }}>
                    <Counter target={target} prefix={prefix} suffix={suffix} />
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 8 }}>{label}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 7 — SOCIAL PROOF
      ════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '120px 0' }}>
        <div className="bp-container">
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span className="bp-section-label">What Builders Say</span>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight: 800, letterSpacing: '-0.03em',
                color: 'rgba(255,255,255,0.95)',
              }}>
                Real results from real entrepreneurs.
              </h2>
            </div>
          </FadeUp>

          <div className="bp-testimonials-grid" style={{ display: 'flex', gap: 20 }}>
            {[
              {
                quote: "I had an idea on Monday. By Friday I had my LLC filed, website live, and first ad running. BayParee did in 5 days what would've taken me 3 months to figure out alone.",
                name: 'Marcus T.',
                role: 'E-commerce · Austin TX',
                delay: 0,
              },
              {
                quote: "The blueprint it generated was more detailed than what a $5,000 consultant gave me. Took 4 minutes.",
                name: 'Sarah K.',
                role: 'SaaS Founder · SF',
                delay: 0.1,
              },
              {
                quote: "I went from zero business knowledge to having a complete strategy and funding checklist. Changed my life.",
                name: 'James R.',
                role: 'Founder · New York',
                delay: 0.2,
              },
            ].map(card => (
              <FadeUp key={card.name} delay={card.delay}>
                <div style={{
                  flex: 1,
                  background: '#0C0C0F',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 16, padding: 28,
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
                >
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={15} fill="#F5B041" color="#F5B041" />
                    ))}
                  </div>
                  <p style={{
                    fontSize: 15, fontStyle: 'italic',
                    color: 'rgba(255,255,255,0.55)', lineHeight: 1.7,
                    marginBottom: 24,
                  }}>
                    "{card.quote}"
                  </p>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.95)' }}>{card.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>{card.role}</div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 8 — PRICING
      ════════════════════════════════════════════════════════════ */}
      <section id="pricing" style={{ paddingBottom: 120 }}>
        <div className="bp-container">
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span className="bp-section-label">Simple Pricing</span>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight: 800, letterSpacing: '-0.03em',
                marginBottom: 12, color: 'rgba(255,255,255,0.95)',
              }}>
                Start free. Scale when ready.
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)' }}>
                No contracts. Cancel anytime. Built for real entrepreneurs.
              </p>
            </div>
          </FadeUp>

          <div
            className="bp-pricing-grid"
            style={{ display: 'flex', gap: 20, maxWidth: 900, margin: '0 auto' }}
          >
            {/* Free */}
            <FadeUp delay={0}>
              <div style={{
                flex: 1,
                background: '#0C0C0F',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16, padding: 28,
              }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Free</div>
                  <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.03em' }}>$0</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Forever</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {['3 AI Blueprints/month', 'Growth Check', 'Marketplace access', 'AI Chat (limited)', 'Community'].map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={14} color="#F5B041" />
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/register"
                  style={{
                    display: 'block', textAlign: 'center', padding: '12px 0',
                    border: '1px solid rgba(255,255,255,0.14)', borderRadius: 8,
                    fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.8)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)' }}
                >
                  Get Started Free
                </Link>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 8 }}>No credit card required</div>
              </div>
            </FadeUp>

            {/* Pro — Highlighted */}
            <FadeUp delay={0.1}>
              <div style={{
                flex: 1,
                background: '#0C0C0F',
                border: '1px solid rgba(245,176,65,0.35)',
                boxShadow: '0 0 50px rgba(245,176,65,0.08)',
                borderRadius: 16, padding: 28,
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: -1, right: 20,
                  background: '#F5B041', color: '#000',
                  fontSize: 10, fontWeight: 700,
                  padding: '4px 12px', borderRadius: '0 0 8px 8px',
                }}>
                  MOST POPULAR
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Pro</div>
                  <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.03em', color: '#F5B041' }}>$29<span style={{ fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.4)' }}>/mo</span></div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Billed monthly</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {['Unlimited blueprints', 'Priority AI', 'Brand assets', 'Partner access', '10% off services', 'Email support'].map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={14} color="#F5B041" />
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/payment"
                  style={{
                    display: 'block', textAlign: 'center', padding: '12px 0',
                    background: '#F5B041', borderRadius: 8,
                    fontSize: 14, fontWeight: 700, color: '#000',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)' }}
                >
                  Start Pro
                </Link>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 8 }}>No credit card required</div>
              </div>
            </FadeUp>

            {/* Elite */}
            <FadeUp delay={0.2}>
              <div style={{
                flex: 1,
                background: '#0C0C0F',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16, padding: 28,
              }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Elite</div>
                  <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.03em' }}>$99<span style={{ fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.4)' }}>/mo</span></div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>White-glove service</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {['All Pro features', 'White-glove onboarding', 'Dedicated manager', 'Funding intro', 'Priority 24h support'].map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={14} color="#F5B041" />
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/payment"
                  style={{
                    display: 'block', textAlign: 'center', padding: '12px 0',
                    border: '1px solid rgba(255,255,255,0.14)', borderRadius: 8,
                    fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.8)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)' }}
                >
                  Go Elite
                </Link>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 8 }}>No credit card required</div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 9 — FINAL CTA
      ════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '140px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background gold glow */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', zIndex: 0,
        }}>
          <div style={{
            width: 800, height: 800,
            background: 'radial-gradient(circle, rgba(245,176,65,0.07) 0%, transparent 60%)',
            filter: 'blur(100px)',
          }} />
        </div>

        <div className="bp-container" style={{ position: 'relative', zIndex: 1 }}>
          <FadeUp>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1,
              marginBottom: 20,
            }}>
              <span style={{ display: 'block', color: 'rgba(255,255,255,0.95)' }}>Your business idea</span>
              <span style={{ display: 'block', color: '#F5B041' }}>deserves to exist.</span>
            </h2>
            <p style={{
              fontSize: 17, color: 'rgba(255,255,255,0.55)',
              marginBottom: 32, maxWidth: 420, margin: '0 auto 32px',
            }}>
              Stop waiting. BayParee builds it with you — starting free, starting now.
            </p>
            <Link
              to="/builder"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#F5B041', color: '#000',
                fontWeight: 700, fontSize: 18,
                padding: '18px 44px', borderRadius: 12,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.02)'
                e.currentTarget.style.boxShadow = '0 0 48px rgba(245,176,65,0.35)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Build My Business <ArrowRight size={18} />
            </Link>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginTop: 16 }}>
              Join 27,403 entrepreneurs. Free to start.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 10 — FOOTER
      ════════════════════════════════════════════════════════════ */}
      <footer style={{
        background: '#0C0C0F',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '60px 0 36px',
      }}>
        <div className="bp-container">
          <div className="bp-footer-grid" style={{ display: 'flex', gap: 48, marginBottom: 48 }}>
            {/* Col 1 — Brand */}
            <div style={{ flex: '0 0 240px' }}>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
                <span style={{ color: '#F5B041' }}>Bay</span>
                <span style={{ color: 'rgba(255,255,255,0.95)' }}>Paree</span>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 12 }}>
                AI Business Builder
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, maxWidth: 200 }}>
                From idea to launch in one session. Powered by AI.
              </p>
            </div>

            {/* Col 2 — Product */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>
                Product
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Builder', to: '/builder' },
                  { label: 'Marketplace', to: '/marketplace' },
                  { label: 'Services', to: '/services' },
                  { label: 'Business Hub', to: '/hub' },
                  { label: 'Growth Check', to: '/growth-check' },
                ].map(item => (
                  <Link
                    key={item.label}
                    to={item.to}
                    style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', transition: 'color 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Col 3 — Company */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>
                Company
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Pricing', to: '#pricing' },
                  { label: 'Partners', to: '/partners' },
                  { label: 'Login', to: '/login' },
                  { label: 'Register', to: '/register' },
                ].map(item => (
                  <Link
                    key={item.label}
                    to={item.to}
                    style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', transition: 'color 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Col 4 — Ecosystem */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>
                Ecosystem
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'MeetAlly', href: 'https://meetally.site' },
                  { label: 'Guru Sphere', href: 'https://guru-sphere.online' },
                  { label: 'AI Shala', href: 'https://powered-by-bhaisazzad.online' },
                  { label: 'Kaamlaa', href: 'https://kaamlaa.site' },
                ].map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 14, color: 'rgba(255,255,255,0.45)',
                      display: 'flex', alignItems: 'center', gap: 4,
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
                  >
                    {item.label}
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.4 }}>
                      <path d="M1.5 8.5L8.5 1.5M8.5 1.5H4M8.5 1.5V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: 24,
            display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap',
          }}>
            {['© 2025 BayParee', 'Privacy Policy', 'Terms'].map((item, i) => (
              <span key={item} style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)' }}>
                {i > 0 && <span style={{ marginRight: 16 }}>·</span>}
                {item}
              </span>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}
