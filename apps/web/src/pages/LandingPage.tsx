/**
 * BayParee — Landing Page v6.0
 * Design references: Linear.app, Vercel, Stripe, Loom, Figma, Notion
 */
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import {
  ArrowRight, CheckCircle, Sparkles, Zap, Globe, Target,
  TrendingUp, Shield, Users, BarChart3, Rocket, Star,
  ChevronRight, Lightbulb, FileText, Megaphone, DollarSign,
  Building2, Clock, Award, Play,
} from 'lucide-react'

/* ─── CSS INJECTION ─────────────────────────────────────────────────────────── */

const GLOBAL_STYLES = `
  :root {
    --fsi-void:      #050508;
    --fsi-surface:   #0C0C0F;
    --fsi-surface-2: #131318;
    --fsi-border:    rgba(255,255,255,0.06);
    --fsi-border-hover: rgba(255,255,255,0.12);
    --fsi-gold:      #F5B041;
    --fsi-gold-dim:  rgba(245,176,65,0.12);
    --fsi-text:      rgba(255,255,255,0.95);
    --fsi-text-muted: rgba(255,255,255,0.55);
    --fsi-text-dim:  rgba(255,255,255,0.25);
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes pulse-gold {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
  .marquee-track {
    display: flex;
    width: max-content;
    animation: marquee 28s linear infinite;
  }
  .shimmer-bar {
    background: linear-gradient(90deg, rgba(245,176,65,0.15) 0%, rgba(245,176,65,0.6) 40%, rgba(245,176,65,0.15) 100%);
    background-size: 200% auto;
    animation: shimmer 2s linear infinite;
  }
  .pulse-gold { animation: pulse-gold 2s ease-in-out infinite; }
`

/* ─── PRIMITIVES ─────────────────────────────────────────────────────────────── */

function StyleInjector() {
  return <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
}

function Counter({
  target,
  prefix = '',
  suffix = '',
}: {
  target: number
  prefix?: string
  suffix?: string
}) {
  const [v, setV] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let cur = 0
    const inc = target / 80
    const t = setInterval(() => {
      cur += inc
      if (cur >= target) {
        setV(target)
        clearInterval(t)
      } else {
        setV(Math.floor(cur))
      }
    }, 16)
    return () => clearInterval(t)
  }, [inView, target])

  return (
    <span ref={ref}>
      {prefix}
      {v.toLocaleString()}
      {suffix}
    </span>
  )
}

function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0, 0, 1], delay }}
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  )
}

function SectionLabel({ text }: { text: string }) {
  return (
    <p
      style={{
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.15em',
        color: 'var(--fsi-gold)',
        textTransform: 'uppercase',
        marginBottom: 24,
      }}
    >
      {text}
    </p>
  )
}

/* ─── 1. NAV ─────────────────────────────────────────────────────────────────── */

function Nav() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    return scrollY.on('change', (v) => setScrolled(v > 20))
  }, [scrollY])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Hub', href: '/hub' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Pricing', href: '#pricing' },
  ]

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 64,
          background: scrolled ? 'rgba(5,5,8,0.92)' : 'rgba(5,5,8,0)',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          transition: 'background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 24px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Wordmark */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              <span style={{ color: 'var(--fsi-gold)' }}>Bay</span>
              <span style={{ color: 'rgba(255,255,255,0.95)' }}>Paree</span>
            </span>
          </Link>

          {/* Center links — hidden on mobile */}
          <div
            style={{
              display: 'flex',
              gap: 36,
              alignItems: 'center',
            }}
            className="nav-center-links"
          >
            {navLinks.map((link) =>
              link.href.startsWith('#') || link.href.startsWith('/') ? (
                link.href.startsWith('#') ? (
                  <a
                    key={link.label}
                    href={link.href}
                    style={{
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.6)',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.95)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    style={{
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.6)',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.95)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                  >
                    {link.label}
                  </Link>
                )
              ) : null
            )}
          </div>

          {/* Right CTA group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link
              to="/login"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.95)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
            >
              Sign In
            </Link>
            <Link
              to="/builder"
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#000',
                background: 'var(--fsi-gold)',
                textDecoration: 'none',
                padding: '8px 20px',
                borderRadius: 8,
                transition: 'opacity 0.2s, transform 0.2s',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9'
                e.currentTarget.style.transform = 'scale(1.02)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              Start Building
            </Link>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.7)',
                padding: 4,
              }}
              className="mobile-menu-btn"
              aria-label="Menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 49,
            background: 'rgba(5,5,8,0.97)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 36,
          }}
        >
          {navLinks.map((link) =>
            link.href.startsWith('#') ? (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.85)',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.85)',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            to="/builder"
            onClick={() => setMobileOpen(false)}
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#000',
              background: 'var(--fsi-gold)',
              textDecoration: 'none',
              padding: '14px 36px',
              borderRadius: 10,
              marginTop: 12,
            }}
          >
            Start Building →
          </Link>
        </div>
      )}

      {/* Responsive style overrides */}
      <style>{`
        @media (max-width: 768px) {
          .nav-center-links { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  )
}

/* ─── 2. HERO ────────────────────────────────────────────────────────────────── */

function DashboardPanel() {
  const steps = [
    { n: '1', label: 'Idea' },
    { n: '2', label: 'Overview' },
    { n: '3', label: 'Brand' },
    { n: '4', label: 'Marketing' },
    { n: '5', label: 'Launch' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.9, ease: [0.25, 0, 0, 1], delay: 0.4 }}
      style={{
        background: 'rgba(12,12,15,0.8)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: 24,
        backdropFilter: 'blur(20px)',
        boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
        width: '100%',
        maxWidth: 420,
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 24,
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
        </div>
        <span
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 12,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.02em',
          }}
        >
          BayParee Builder
        </span>
      </div>

      {/* Progress rail */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          marginBottom: 24,
          alignItems: 'center',
        }}
      >
        {steps.map((step, i) => (
          <div
            key={step.n}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              gap: 6,
            }}
          >
            <div
              style={{
                width: '100%',
                height: 3,
                borderRadius: 2,
                background:
                  i < 2
                    ? 'rgba(245,176,65,0.7)'
                    : i === 2
                    ? 'var(--fsi-gold)'
                    : 'rgba(255,255,255,0.1)',
                transition: 'background 0.3s',
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: i === 2 ? 700 : 500,
                color: i === 2 ? 'var(--fsi-gold)' : 'rgba(255,255,255,0.3)',
                letterSpacing: '0.04em',
              }}
            >
              {step.n} {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Generating bar */}
      <div
        style={{
          background: 'var(--fsi-surface-2)',
          borderRadius: 10,
          padding: 16,
          marginBottom: 16,
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
          }}
        >
          <Sparkles size={14} color="var(--fsi-gold)" />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
            Blueprint generating...
          </span>
          <span className="pulse-gold" style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--fsi-gold)' }}>
            ●
          </span>
        </div>
        <div
          style={{
            height: 6,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.06)',
            overflow: 'hidden',
          }}
        >
          <div
            className="shimmer-bar"
            style={{ height: '100%', width: '65%', borderRadius: 3 }}
          />
        </div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {['Analyzing market opportunity...', 'Building brand identity...', 'Drafting revenue model...'].map(
            (line, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 11,
                  color: i === 1 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)',
                }}
              >
                <CheckCircle
                  size={10}
                  color={i === 0 ? '#28C840' : 'rgba(255,255,255,0.15)'}
                />
                {line}
              </div>
            )
          )}
        </div>
      </div>

      {/* Stat boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { label: 'Business Rank', value: '#13,487' },
          { label: 'Fundability', value: '92/100' },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: 'var(--fsi-surface-2)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10,
              padding: '12px 14px',
            }}
          >
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 4, fontWeight: 500 }}>
              {stat.label}
            </p>
            <p style={{ fontSize: 16, fontWeight: 800, color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.02em' }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function Hero() {
  return (
    <section
      style={{
        minHeight: '100vh',
        paddingTop: 120,
        paddingBottom: 80,
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--fsi-void)',
      }}
    >
      {/* Ambient glows */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          top: -100,
          left: -200,
          background: 'radial-gradient(circle, rgba(245,176,65,0.07) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          top: 200,
          right: -100,
          background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 60,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* LEFT COLUMN */}
        <div style={{ flex: '0 0 55%', maxWidth: '55%' }} className="hero-left">
          {/* Label pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0, 0, 1] }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--fsi-gold)',
                background: 'var(--fsi-gold-dim)',
                border: '1px solid rgba(245,176,65,0.25)',
                borderRadius: 100,
                padding: '5px 14px',
                marginBottom: 32,
              }}
            >
              <Sparkles size={11} />
              AI Business Builder · Free to Start
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0, 0, 1], delay: 0.1 }}
          >
            <h1
              style={{
                fontSize: 'clamp(3.5rem, 7vw, 6.5rem)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                lineHeight: 0.92,
                margin: 0,
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.95)', display: 'block' }}>Build a Real</span>
              <span style={{ color: 'var(--fsi-gold)', display: 'block' }}>Business.</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0, 0, 1], delay: 0.2 }}
            style={{
              fontSize: 18,
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.58)',
              maxWidth: 480,
              marginTop: 28,
              marginBottom: 0,
            }}
          >
            From idea to launch-ready in one AI session. Get your complete blueprint, brand identity,
            marketing plan, and legal paperwork — all in minutes.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0, 0, 1], delay: 0.3 }}
            style={{
              marginTop: 44,
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Link
              to="/builder"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 18,
                fontWeight: 700,
                color: '#000',
                background: 'var(--fsi-gold)',
                textDecoration: 'none',
                padding: '16px 32px',
                borderRadius: 10,
                transition: 'transform 0.2s, box-shadow 0.2s, filter 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)'
                e.currentTarget.style.filter = 'brightness(1.08)'
                e.currentTarget.style.boxShadow = '0 0 40px rgba(245,176,65,0.35)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.filter = 'brightness(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Start Building <ArrowRight size={18} />
            </Link>
            <a
              href="#how-it-works"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 18,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.95)',
                textDecoration: 'none',
                padding: '16px 28px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'transparent',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <Play size={16} />
              See How It Works
            </a>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{
              marginTop: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              flexWrap: 'wrap',
              fontSize: 13,
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#28C840', display: 'inline-block' }} />
              No credit card required
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#28C840', display: 'inline-block' }} />
              Free forever plan
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {/* Avatar strip */}
              <span style={{ display: 'flex', position: 'relative' }}>
                {['M', 'S', 'J', 'A'].map((letter, i) => (
                  <span
                    key={letter}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: `hsl(${i * 60 + 20}, 60%, 45%)`,
                      border: '2px solid var(--fsi-void)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 9,
                      fontWeight: 700,
                      color: '#fff',
                      marginLeft: i === 0 ? 0 : -8,
                      position: 'relative',
                      zIndex: 4 - i,
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </span>
              2,400+ builders
            </span>
          </motion.div>
        </div>

        {/* RIGHT COLUMN — dashboard panel, hidden on mobile */}
        <div
          style={{
            flex: '0 0 45%',
            maxWidth: '45%',
            display: 'flex',
            justifyContent: 'center',
          }}
          className="hero-right"
        >
          <DashboardPanel />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-left  { flex: 0 0 100% !important; max-width: 100% !important; }
          .hero-right { display: none !important; }
        }
      `}</style>
    </section>
  )
}

/* ─── 3. MARQUEE LOGO STRIP ──────────────────────────────────────────────────── */

function MarqueeStrip() {
  const items = [
    'Y Combinator Alumni',
    'Shopify Stores',
    'Amazon Sellers',
    'Etsy Creators',
    'Google Play Publishers',
    'LinkedIn Creators',
    'TikTok Shops',
    'Freelancers',
  ]
  // Duplicate for seamless loop
  const doubled = [...items, ...items]

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '20px 0',
        overflow: 'hidden',
      }}
    >
      <p
        style={{
          textAlign: 'center',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.2)',
          marginBottom: 16,
        }}
      >
        Trusted by builders from
      </p>
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <div className="marquee-track">
          {doubled.map((item, i) => (
            <span
              key={i}
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.3)',
                padding: '0 48px',
                whiteSpace: 'nowrap',
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── 4. STATS SECTION ───────────────────────────────────────────────────────── */

function StatsSection() {
  const stats = [
    { value: 27403, label: 'Businesses Built' },
    { value: 2400, label: 'Active Builders', suffix: '+' },
    { value: 40, label: 'AI Models', suffix: '+' },
    { value: 99, label: '% Uptime', suffix: '%' },
  ]

  return (
    <section
      id="stats"
      style={{
        background: 'var(--fsi-surface)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '80px 0',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '48px 0',
        }}
        className="stats-grid"
      >
        {stats.map((stat, i) => (
          <FadeUp key={stat.label} delay={i * 0.1}>
            <div
              style={{
                textAlign: 'center',
                borderRight:
                  i % 2 === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                padding: '0 32px',
              }}
              className={`stat-item stat-item-${i}`}
            >
              <div
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontWeight: 900,
                  color: 'var(--fsi-gold)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}
              >
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.5)',
                  fontWeight: 500,
                  marginTop: 8,
                  marginBottom: 0,
                }}
              >
                {stat.label}
              </p>
            </div>
          </FadeUp>
        ))}
      </div>
      <style>{`
        @media (min-width: 768px) {
          .stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
          .stat-item { border-right: 1px solid rgba(255,255,255,0.06) !important; }
          .stat-item-3 { border-right: none !important; }
        }
      `}</style>
    </section>
  )
}

/* ─── 5. HOW IT WORKS ────────────────────────────────────────────────────────── */

function HowItWorks() {
  const steps = [
    {
      n: '01',
      icon: <Lightbulb size={24} color="var(--fsi-gold)" />,
      title: 'Describe Your Idea',
      body: 'Tell us what business you want to build. Niche, audience, budget — as much or as little as you know.',
    },
    {
      n: '02',
      icon: <Sparkles size={24} color="var(--fsi-gold)" />,
      title: 'AI Builds Your Blueprint',
      body: 'Our AI analyzes your idea and generates a complete business plan, brand identity, marketing strategy, and revenue model.',
    },
    {
      n: '03',
      icon: <Rocket size={24} color="var(--fsi-gold)" />,
      title: 'Launch with Confidence',
      body: 'Get your paperwork filed, website built, ads running, and funding checked — all from one platform.',
    },
  ]

  return (
    <section
      id="how-it-works"
      style={{ padding: '140px 0', background: 'var(--fsi-void)' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <FadeUp>
          <SectionLabel text="How It Works" />
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'rgba(255,255,255,0.95)',
              marginBottom: 20,
              marginTop: 0,
            }}
          >
            From idea to launch in one session.
          </h2>
          <p
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.55)',
              maxWidth: 560,
              marginBottom: 64,
              lineHeight: 1.65,
              marginTop: 0,
            }}
          >
            Answer a few questions about your business idea. Our AI generates a full business
            package — ready to act on immediately.
          </p>
        </FadeUp>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 32,
            position: 'relative',
          }}
          className="steps-grid"
        >
          {steps.map((step, i) => (
            <FadeUp key={step.n} delay={i * 0.15}>
              <div
                style={{
                  position: 'relative',
                  padding: '40px 32px',
                  background: 'var(--fsi-surface)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 16,
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                }}
              >
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 900,
                    fontFamily: 'monospace',
                    color: 'var(--fsi-gold)',
                    opacity: 0.3,
                    lineHeight: 1,
                    marginBottom: 16,
                  }}
                >
                  {step.n}
                </div>
                <div style={{ marginBottom: 14 }}>{step.icon}</div>
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.95)',
                    marginBottom: 12,
                    marginTop: 0,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    color: 'rgba(255,255,255,0.55)',
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {step.body}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .steps-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}

/* ─── 6. FEATURES BENTO GRID ─────────────────────────────────────────────────── */

function FeaturesGrid() {
  const cardBase: React.CSSProperties = {
    background: 'var(--fsi-surface)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 32,
    overflow: 'hidden',
    position: 'relative',
    transition: 'border-color 0.2s',
  }

  return (
    <section
      id="features"
      style={{ padding: '0 0 140px', background: 'var(--fsi-void)' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <FadeUp>
          <SectionLabel text="Features" />
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'rgba(255,255,255,0.95)',
              marginBottom: 48,
              marginTop: 0,
            }}
          >
            Everything you need to launch.
          </h2>
        </FadeUp>

        {/* Row 1 */}
        <div
          style={{ display: 'grid', gap: 16, marginBottom: 16 }}
          className="bento-row-1"
        >
          {/* Large card */}
          <FadeUp>
            <div
              style={{ ...cardBase, gridColumn: '1 / 2' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
            >
              {/* Background blob */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -80,
                  right: -80,
                  width: 320,
                  height: 320,
                  background: 'radial-gradient(circle, rgba(245,176,65,0.04) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
              <Sparkles size={28} color="var(--fsi-gold)" style={{ marginBottom: 20 }} />
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.95)',
                  marginBottom: 14,
                  marginTop: 0,
                }}
              >
                Complete Business Blueprint
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: 'rgba(255,255,255,0.55)',
                  lineHeight: 1.65,
                  marginBottom: 28,
                  marginTop: 0,
                }}
              >
                Get a 10-section business plan covering revenue model, brand identity, marketing
                strategy, competitor analysis, and 90-day launch roadmap — generated in under 3
                minutes.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Business Name & Brand',
                  'Revenue Model',
                  'Marketing Plan',
                  'Launch Roadmap',
                ].map((item) => (
                  <div
                    key={item}
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <CheckCircle size={14} color="var(--fsi-gold)" />
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Small card */}
          <FadeUp delay={0.1}>
            <div
              style={cardBase}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
            >
              <Users size={24} color="var(--fsi-gold)" style={{ marginBottom: 20 }} />
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.95)',
                  marginBottom: 12,
                  marginTop: 0,
                }}
              >
                Built-In Expert Partners
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.55)',
                  lineHeight: 1.65,
                  marginBottom: 24,
                  marginTop: 0,
                }}
              >
                ThePaperWorkSquad for LLC filing. CGW Systems for funding. DhandaBuzz for
                marketing execution.
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Legal', 'Funding', 'Marketing'].map((pill) => (
                  <span
                    key={pill}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--fsi-gold)',
                      background: 'var(--fsi-gold-dim)',
                      border: '1px solid rgba(245,176,65,0.2)',
                      borderRadius: 100,
                      padding: '4px 12px',
                    }}
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Row 2 */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
          className="bento-row-2"
        >
          {[
            {
              icon: <Globe size={22} color="var(--fsi-gold)" />,
              title: 'Global Marketplace',
              body: 'Buy and sell ready-made businesses, templates, and AI agents.',
            },
            {
              icon: <BarChart3 size={22} color="var(--fsi-gold)" />,
              title: 'Growth Check',
              body: "8-question diagnostic that reveals your business's fundability score and growth potential.",
            },
            {
              icon: <Shield size={22} color="var(--fsi-gold)" />,
              title: 'Secure & Private',
              body: 'Your business ideas and blueprints are encrypted and private. We never share your data.',
            },
          ].map((card, i) => (
            <FadeUp key={card.title} delay={i * 0.1}>
              <div
                style={cardBase}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
              >
                <div style={{ marginBottom: 16 }}>{card.icon}</div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.95)',
                    marginBottom: 10,
                    marginTop: 0,
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.55)',
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {card.body}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>

      <style>{`
        .bento-row-1 {
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .bento-row-1 { grid-template-columns: 60fr 40fr; }
        }
        @media (max-width: 768px) {
          .bento-row-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

/* ─── 7. TESTIMONIALS ────────────────────────────────────────────────────────── */

function Testimonials() {
  const testimonials = [
    {
      stars: 5,
      quote:
        "I had an idea on Monday. By Friday I had my LLC filed, website live, and first ad running. BayParee did in 5 days what would've taken me 3 months.",
      name: 'Marcus T.',
      role: 'E-commerce Entrepreneur · Austin, TX',
    },
    {
      stars: 5,
      quote:
        'The blueprint it generated was more detailed than what a $5,000 business consultant gave me. And it took 4 minutes.',
      name: 'Sarah K.',
      role: 'SaaS Founder · San Francisco, CA',
    },
    {
      stars: 5,
      quote:
        'I went from zero business knowledge to having a complete brand, marketing strategy, and funding checklist. Game changer.',
      name: 'James R.',
      role: 'Side Hustler → Full-Time Founder · New York, NY',
    },
  ]

  return (
    <section style={{ padding: '0 0 140px', background: 'var(--fsi-void)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <FadeUp>
          <SectionLabel text="What Builders Say" />
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'rgba(255,255,255,0.95)',
              marginBottom: 48,
              marginTop: 0,
            }}
          >
            Real results from real entrepreneurs.
          </h2>
        </FadeUp>

        <div
          style={{ display: 'grid', gap: 24 }}
          className="testimonials-grid"
        >
          {testimonials.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.1}>
              <div
                style={{
                  background: 'var(--fsi-surface)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 16,
                  padding: 28,
                  transition: 'border-color 0.2s',
                  height: '100%',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
              >
                {/* Stars */}
                <div style={{ display: 'flex', gap: 3, marginBottom: 18 }}>
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} size={14} fill="var(--fsi-gold)" color="var(--fsi-gold)" />
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 15,
                    color: 'rgba(255,255,255,0.8)',
                    lineHeight: 1.7,
                    marginBottom: 24,
                    marginTop: 0,
                    fontStyle: 'italic',
                  }}
                >
                  "{t.quote}"
                </p>
                <div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: 'rgba(255,255,255,0.9)',
                      marginBottom: 4,
                      marginTop: 0,
                    }}
                  >
                    {t.name}
                  </p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                    {t.role}
                  </p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .testimonials-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}

/* ─── 8. PRICING ─────────────────────────────────────────────────────────────── */

function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/mo',
      badge: null,
      highlighted: false,
      features: [
        '3 AI Blueprints/month',
        'Growth Check tool',
        'Marketplace access',
        'AI Chat (limited)',
      ],
      cta: 'Get Started Free',
      ctaHref: '/register',
      ctaStyle: 'ghost',
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/mo',
      badge: 'MOST POPULAR',
      highlighted: true,
      features: [
        'Unlimited blueprints',
        'Priority AI processing',
        'Full brand assets',
        'Partner access (ThePaperWorkSquad + CGW)',
        'Services 10% off',
        'Email support',
      ],
      cta: 'Start Pro',
      ctaHref: '/payment',
      ctaStyle: 'gold',
    },
    {
      name: 'Elite',
      price: '$99',
      period: '/mo',
      badge: 'BEST VALUE',
      highlighted: false,
      features: [
        'Everything in Pro',
        'White-glove onboarding',
        'Dedicated account manager',
        'Funding intro (CGW)',
        'Priority support',
      ],
      cta: 'Go Elite',
      ctaHref: '/payment',
      ctaStyle: 'ghost',
    },
  ]

  return (
    <section
      id="pricing"
      style={{ padding: '0 0 140px', background: 'var(--fsi-void)' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <FadeUp>
          <SectionLabel text="Pricing" />
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'rgba(255,255,255,0.95)',
              marginBottom: 12,
              marginTop: 0,
            }}
          >
            Start free. Scale when you're ready.
          </h2>
          <p
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.55)',
              marginBottom: 56,
              marginTop: 0,
            }}
          >
            No contracts. Cancel anytime. Built for American entrepreneurs.
          </p>
        </FadeUp>

        <div
          style={{
            display: 'grid',
            gap: 24,
            maxWidth: 900,
            margin: '0 auto',
          }}
          className="pricing-grid"
        >
          {plans.map((plan, i) => (
            <FadeUp key={plan.name} delay={i * 0.1}>
              <div
                style={{
                  background: 'var(--fsi-surface)',
                  border: plan.highlighted
                    ? '1px solid rgba(245,176,65,0.4)'
                    : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 16,
                  padding: '32px 28px',
                  position: 'relative',
                  boxShadow: plan.highlighted
                    ? '0 0 60px rgba(245,176,65,0.1)'
                    : 'none',
                  height: '100%',
                  boxSizing: 'border-box',
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      color: plan.highlighted ? '#000' : 'rgba(255,255,255,0.7)',
                      background: plan.highlighted ? 'var(--fsi-gold)' : 'rgba(255,255,255,0.1)',
                      borderRadius: 100,
                      padding: '3px 12px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {plan.badge}
                  </span>
                )}

                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.95)',
                    marginBottom: 8,
                    marginTop: 0,
                  }}
                >
                  {plan.name}
                </h3>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 4,
                    marginBottom: 28,
                  }}
                >
                  <span
                    style={{
                      fontSize: 42,
                      fontWeight: 900,
                      color: 'rgba(255,255,255,0.95)',
                      letterSpacing: '-0.03em',
                      lineHeight: 1,
                    }}
                  >
                    {plan.price}
                  </span>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                    {plan.period}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCircle size={14} color="var(--fsi-gold)" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{f}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to={plan.ctaHref}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'center',
                    padding: '13px 0',
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxSizing: 'border-box',
                    transition: 'opacity 0.2s, transform 0.2s',
                    ...(plan.ctaStyle === 'gold'
                      ? {
                          background: 'var(--fsi-gold)',
                          color: '#000',
                          border: 'none',
                        }
                      : {
                          background: 'transparent',
                          color: 'rgba(255,255,255,0.8)',
                          border: '1px solid rgba(255,255,255,0.15)',
                        }),
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.85'
                    e.currentTarget.style.transform = 'scale(1.01)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  {plan.cta}
                </Link>
                <p
                  style={{
                    textAlign: 'center',
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.25)',
                    marginTop: 12,
                    marginBottom: 0,
                  }}
                >
                  No credit card required
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .pricing-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}

/* ─── 9. FINAL CTA ───────────────────────────────────────────────────────────── */

function FinalCTA() {
  return (
    <section
      style={{
        padding: '140px 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--fsi-void)',
      }}
    >
      {/* Radial gold glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          height: 600,
          background: 'radial-gradient(ellipse, rgba(245,176,65,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '0 24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <FadeUp>
          <h2
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.95)', display: 'block' }}>
              Your business idea
            </span>
            <span style={{ color: 'var(--fsi-gold)', display: 'block' }}>deserves to exist.</span>
          </h2>

          <p
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.55)',
              marginTop: 24,
              marginBottom: 0,
              maxWidth: 480,
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.65,
            }}
          >
            Stop planning. Stop hesitating. BayParee will build it with you — starting today, for
            free.
          </p>

          <div style={{ marginTop: 44 }}>
            <Link
              to="/builder"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 18,
                fontWeight: 700,
                color: '#000',
                background: 'var(--fsi-gold)',
                textDecoration: 'none',
                padding: '18px 40px',
                borderRadius: 12,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)'
                e.currentTarget.style.boxShadow = '0 0 50px rgba(245,176,65,0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Build My Business <ArrowRight size={18} />
            </Link>

            <p
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.25)',
                marginTop: 20,
                marginBottom: 0,
              }}
            >
              Join 27,403 entrepreneurs. Free to start.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

/* ─── 10. FOOTER ─────────────────────────────────────────────────────────────── */

function Footer() {
  const productLinks = [
    { label: 'Builder', href: '/builder' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Services', href: '/services' },
    { label: 'Business Hub', href: '/hub' },
    { label: 'Growth Check', href: '/growth-check' },
  ]

  const companyLinks = [
    { label: 'Pricing', href: '#pricing' },
    { label: 'Partners', href: '/partners' },
    { label: 'Login', href: '/login' },
    { label: 'Register', href: '/register' },
  ]

  const ecosystemLinks = [
    { label: 'MeetAlly', href: 'https://meetally.site' },
    { label: 'Guru Sphere', href: 'https://guru-sphere.online' },
    { label: 'AI Shala', href: 'https://powered-by-bhaisazzad.online' },
    { label: 'Kaamlaa', href: 'https://kaamlaa.site' },
  ]

  const linkStyle: React.CSSProperties = {
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
    textDecoration: 'none',
    display: 'block',
    marginBottom: 12,
    transition: 'color 0.2s',
  }

  return (
    <footer
      style={{
        background: 'var(--fsi-surface)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '64px 0 40px',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        {/* Columns */}
        <div
          style={{
            display: 'grid',
            gap: '40px 32px',
            marginBottom: 56,
          }}
          className="footer-grid"
        >
          {/* Col 1 — Brand */}
          <div>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em' }}>
                <span style={{ color: 'var(--fsi-gold)' }}>Bay</span>
                <span style={{ color: 'rgba(255,255,255,0.95)' }}>Paree</span>
              </span>
            </Link>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', margin: 0 }}>
              AI Business Builder
            </p>
          </div>

          {/* Col 2 — Product */}
          <div>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                marginBottom: 20,
                marginTop: 0,
              }}
            >
              Product
            </p>
            {productLinks.map((link) => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.label}
                  to={link.href}
                  style={linkStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  style={linkStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                >
                  {link.label}
                </a>
              )
            ))}
          </div>

          {/* Col 3 — Company */}
          <div>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                marginBottom: 20,
                marginTop: 0,
              }}
            >
              Company
            </p>
            {companyLinks.map((link) =>
              link.href.startsWith('#') ? (
                <a
                  key={link.label}
                  href={link.href}
                  style={linkStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  style={linkStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Col 4 — Ecosystem */}
          <div>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                marginBottom: 20,
                marginTop: 0,
              }}
            >
              Ecosystem
            </p>
            {ecosystemLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)', margin: 0 }}>
            © 2025 BayParee
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy Policy', 'Terms of Service'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase().replace(' ', '-')}`}
                style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.2)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .footer-grid {
          grid-template-columns: 1fr 1fr;
        }
        @media (min-width: 768px) {
          .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr !important; }
        }
      `}</style>
    </footer>
  )
}

/* ─── PAGE ASSEMBLY ──────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div
      style={{
        background: 'var(--fsi-void)',
        color: 'var(--fsi-text)',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      <StyleInjector />
      <Nav />
      <Hero />
      <MarqueeStrip />
      <StatsSection />
      <HowItWorks />
      <FeaturesGrid />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  )
}
