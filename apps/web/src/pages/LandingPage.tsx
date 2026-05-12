import { useState } from 'react'
import { Link } from 'react-router-dom'

/* ── Design tokens ─────────────────────────────────────────────────────────── */
const T = {
  primary:   '#6366f1',   // indigo
  accent:    '#06b6d4',   // cyan
  accentSoft:'rgba(6,182,212,0.15)',
  primarySoft:'rgba(99,102,241,0.15)',
  void:      '#070710',
  panel:     '#0f0f1a',
  panel2:    '#13131f',
  border:    'rgba(255,255,255,0.08)',
  text:      '#f1f5f9',
  muted:     '#94a3b8',
  dim:       '#64748b',
  H:         "'Space Grotesk','Inter',sans-serif",
  B:         "'Inter','Manrope',sans-serif",
}

const RESPONSIVE_CSS = `
  .en-nav-links { display: flex; }
  .en-hero-btns { display: flex; }
  .en-features-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
  .en-how-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
  .en-market-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
  .en-geo-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
  .en-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; }
  @media (max-width: 1024px) {
    .en-features-grid { grid-template-columns: repeat(2,1fr); }
    .en-footer-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 768px) {
    .en-nav-links { display: none; }
    .en-how-grid { grid-template-columns: 1fr; }
    .en-market-grid { grid-template-columns: 1fr; }
    .en-geo-grid { grid-template-columns: 1fr; }
    .en-footer-grid { grid-template-columns: 1fr; }
    .en-hero-btns { flex-direction: column; align-items: stretch; }
    .en-hero-btns a, .en-hero-btns button { text-align: center; justify-content: center; }
  }
  @media (max-width: 600px) {
    .en-features-grid { grid-template-columns: 1fr; }
  }
  @keyframes en-fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes en-pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.3); }
    50%       { box-shadow: 0 0 40px rgba(99,102,241,0.6); }
  }
  @keyframes en-float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }
  .en-animate-up { animation: en-fade-up 0.6s ease both; }
  .en-glow-pulse { animation: en-pulse-glow 3s ease infinite; }
  .en-float { animation: en-float 4s ease infinite; }
`

/* ── Reusable primitives ───────────────────────────────────────────────────── */
const pill = (text: string, color = T.primary) => (
  <span style={{
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    background: color === T.primary ? T.primarySoft : T.accentSoft,
    color: color,
    border: `1px solid ${color}30`,
  }}>{text}</span>
)

/* ── Section wrapper ───────────────────────────────────────────────────────── */
const Section = ({ children, bg = 'transparent', py = 96, id }: {
  children: React.ReactNode; bg?: string; py?: number; id?: string
}) => (
  <section id={id} style={{ background: bg, padding: `${py}px 0` }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
      {children}
    </div>
  </section>
)

/* ── Nav ───────────────────────────────────────────────────────────────────── */
function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how' },
    { label: 'Marketplace', href: '#marketplace' },
    { label: 'Pricing', href: '/pricing' },
  ]
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      borderBottom: `1px solid ${T.border}`,
      backdropFilter: 'blur(20px)',
      background: 'rgba(7,7,16,0.85)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${T.primary}, ${T.accent})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: T.H, fontWeight: 900, fontSize: 14, color: '#fff' }}>EN</span>
          </div>
          <span style={{ fontFamily: T.H, fontWeight: 700, fontSize: 17, color: T.text }}>Engine NotREAL</span>
        </Link>

        {/* Nav links */}
        <div className="en-nav-links" style={{ gap: 32, alignItems: 'center' }}>
          {navLinks.map(l => (
            <a key={l.label} href={l.href} style={{ fontFamily: T.B, fontSize: 14, color: T.muted, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = T.text)}
              onMouseLeave={e => (e.currentTarget.style.color = T.muted)}>
              {l.label}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="en-nav-links" style={{ gap: 12, alignItems: 'center' }}>
          <Link to="/login" style={{ fontFamily: T.B, fontSize: 14, color: T.muted, textDecoration: 'none', padding: '8px 16px' }}>Sign In</Link>
          <Link to="/register" style={{
            fontFamily: T.B, fontSize: 14, fontWeight: 600, color: '#fff',
            textDecoration: 'none', padding: '8px 20px', borderRadius: 8,
            background: `linear-gradient(135deg, ${T.primary}, ${T.accent})`,
          }}>Get Started</Link>
          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="en-nav-links"
            style={{ display: 'none', background: 'none', border: 'none', color: T.text, cursor: 'pointer', fontSize: 22 }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  )
}

/* ── Hero ──────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '120px 24px 96px',
      position: 'relative', overflow: 'hidden',
      background: T.void,
      textAlign: 'center',
    }}>
      {/* Background glows */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '60%', left: '30%',
        width: 300, height: 300, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', maxWidth: 860, margin: '0 auto' }}>
        {/* Pill */}
        <div className="en-animate-up" style={{ marginBottom: 24 }}>
          {pill('AI Business Engine · Beta', T.primary)}
        </div>

        {/* Headline */}
        <h1 className="en-animate-up" style={{
          fontFamily: T.H, fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900,
          lineHeight: 1.08, color: T.text, margin: '0 0 24px',
          animationDelay: '0.1s',
        }}>
          Create. Fix. Run. Sell.<br />
          <span style={{
            background: `linear-gradient(90deg, ${T.primary}, ${T.accent})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>One AI Business Engine.</span>
        </h1>

        {/* Subheadline */}
        <p className="en-animate-up" style={{
          fontFamily: T.B, fontSize: 'clamp(16px, 2.5vw, 20px)',
          color: T.muted, lineHeight: 1.7, margin: '0 auto 40px', maxWidth: 640,
          animationDelay: '0.2s',
        }}>
          Engine NotREAL turns business chaos into structured execution — from ideas and problems to blueprints, CRM, marketplace listings, and AI-powered action plans.
        </p>

        {/* CTAs */}
        <div className="en-hero-btns en-animate-up" style={{ gap: 16, justifyContent: 'center', animationDelay: '0.3s' }}>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 12, textDecoration: 'none',
            fontFamily: T.H, fontWeight: 700, fontSize: 16, color: '#fff',
            background: `linear-gradient(135deg, ${T.primary}, ${T.accent})`,
            boxShadow: `0 4px 20px rgba(99,102,241,0.4)`,
          }}>
            Start Building →
          </Link>
          <Link to="/fixer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 12, textDecoration: 'none',
            fontFamily: T.H, fontWeight: 600, fontSize: 16, color: T.text,
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${T.border}`,
          }}>
            Open Fixer Mode
          </Link>
        </div>

        {/* Social proof strip */}
        <div className="en-animate-up" style={{ marginTop: 56, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32, animationDelay: '0.4s' }}>
          {[
            { n: '40+', label: 'AI Models' },
            { n: '9', label: 'Providers' },
            { n: '7', label: 'Core Modules' },
            { n: '0', label: 'Keys needed to start' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: T.H, fontSize: 28, fontWeight: 900, color: T.text }}>{s.n}</div>
              <div style={{ fontFamily: T.B, fontSize: 13, color: T.muted }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Problem ───────────────────────────────────────────────────────────────── */
function Problem() {
  const problems = [
    { icon: '🤯', text: 'You have the idea but no plan to execute it.' },
    { icon: '📉', text: 'Your business has a problem but no clear fix.' },
    { icon: '🗂️', text: 'You\'re managing clients in spreadsheets and WhatsApp.' },
    { icon: '🏪', text: 'You need to sell a service but have no listing or storefront.' },
  ]
  return (
    <Section bg={T.panel} py={80} id="problem">
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        {pill('The Problem', T.accent)}
        <h2 style={{ fontFamily: T.H, fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: T.text, marginTop: 16 }}>
          Business is chaos. It doesn't have to be.
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {problems.map(p => (
          <div key={p.text} style={{
            padding: '28px 24px', borderRadius: 16,
            background: T.panel2,
            border: `1px solid ${T.border}`,
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{p.icon}</div>
            <p style={{ fontFamily: T.B, fontSize: 15, color: T.muted, lineHeight: 1.6, margin: 0 }}>{p.text}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ── Features (Create / Fix / Run / Sell) ─────────────────────────────────── */
function Features() {
  const features = [
    {
      icon: '🏗️',
      tag: 'Create',
      color: T.primary,
      title: 'AI Business Blueprint',
      desc: 'Generate a full business plan — positioning, audience, offer, ad angles, and 30-day roadmap — in minutes.',
      cta: 'Try Create →', link: '/builder',
    },
    {
      icon: '🔧',
      tag: 'Fix',
      color: '#f59e0b',
      title: 'Fixer Mode',
      desc: 'Describe any business problem. Get a structured diagnosis, root cause, fix strategy, and priority actions.',
      cta: 'Fix My Business →', link: '/fixer',
    },
    {
      icon: '📊',
      tag: 'Run',
      color: '#10b981',
      title: 'CRM & Operations',
      desc: 'Manage leads, track projects, handle service requests, and monitor your pipeline — all in one place.',
      cta: 'Open CRM →', link: '/run',
    },
    {
      icon: '🏪',
      tag: 'Sell',
      color: T.accent,
      title: 'Marketplace',
      desc: 'List your services, find ready-made businesses, and connect with buyers and operators globally.',
      cta: 'Browse Market →', link: '/marketplace',
    },
  ]

  return (
    <Section py={96} id="features">
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        {pill('Core Modules', T.primary)}
        <h2 style={{ fontFamily: T.H, fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: T.text, marginTop: 16 }}>
          One engine. Every stage.
        </h2>
        <p style={{ fontFamily: T.B, fontSize: 16, color: T.muted, marginTop: 12 }}>
          From first idea to active business — Engine NotREAL covers the full lifecycle.
        </p>
      </div>

      <div className="en-features-grid">
        {features.map((f, i) => (
          <div key={f.tag} style={{
            padding: '32px 28px', borderRadius: 20,
            background: T.panel,
            border: `1px solid ${T.border}`,
            transition: 'transform 0.2s, border-color 0.2s',
            cursor: 'default',
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
              ;(e.currentTarget as HTMLDivElement).style.borderColor = f.color + '60'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
              ;(e.currentTarget as HTMLDivElement).style.borderColor = T.border
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: f.color + '18',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, marginBottom: 20,
              border: `1px solid ${f.color}30`,
            }}>{f.icon}</div>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: f.color, fontFamily: T.H,
            }}>{f.tag}</span>
            <h3 style={{ fontFamily: T.H, fontSize: 20, fontWeight: 700, color: T.text, margin: '8px 0 12px' }}>{f.title}</h3>
            <p style={{ fontFamily: T.B, fontSize: 14, color: T.muted, lineHeight: 1.65, margin: '0 0 24px' }}>{f.desc}</p>
            <Link to={f.link} style={{
              display: 'inline-flex', alignItems: 'center',
              fontFamily: T.B, fontSize: 13, fontWeight: 600,
              color: f.color, textDecoration: 'none',
            }}>{f.cta}</Link>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ── AI Engine section ─────────────────────────────────────────────────────── */
function AIEngine() {
  const providers = ['Groq', 'OpenAI', 'Anthropic', 'Google', 'Mistral', 'Together', 'DeepSeek', 'xAI', 'Perplexity']
  return (
    <Section bg={T.panel} py={80}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        {pill('AI Layer', T.accent)}
        <h2 style={{ fontFamily: T.H, fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: T.text, marginTop: 16 }}>
          40+ models. 9 providers. One abstraction.
        </h2>
        <p style={{ fontFamily: T.B, fontSize: 16, color: T.muted, marginTop: 12, maxWidth: 560, margin: '12px auto 0' }}>
          No lock-in. The system automatically routes to the best available provider. Add any key, or run in demo mode with zero API keys.
        </p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 40 }}>
        {providers.map((p, i) => (
          <div key={p} style={{
            padding: '10px 20px', borderRadius: 999,
            background: T.panel2,
            border: `1px solid ${i === 0 ? T.primary + '60' : T.border}`,
            fontFamily: T.B, fontSize: 14, fontWeight: 600,
            color: i === 0 ? T.primary : T.muted,
          }}>
            {i === 0 && <span style={{ marginRight: 6, fontSize: 10 }}>★ DEFAULT</span>}
            {p}
          </div>
        ))}
      </div>
      <div style={{
        padding: '24px 32px', borderRadius: 16,
        background: T.primarySoft,
        border: `1px solid ${T.primary}40`,
        textAlign: 'center',
      }}>
        <p style={{ fontFamily: T.B, fontSize: 15, color: T.text, margin: 0 }}>
          <strong style={{ color: T.primary }}>Demo mode included.</strong> Engine NotREAL works out-of-the-box with realistic fallback responses — no API key required to explore.
        </p>
      </div>
    </Section>
  )
}

/* ── How it works ──────────────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: '01', title: 'Describe your situation', desc: 'Enter your business idea, the problem you\'re facing, or what you need help with. No form overload — just plain language.' },
    { n: '02', title: 'Engine generates a plan', desc: 'The AI diagnoses, structures, and generates a precise, actionable output — blueprint, fix strategy, CRM entry, or listing.' },
    { n: '03', title: 'Execute with the platform', desc: 'Use the built-in CRM, marketplace, service requests, and dashboard to take action immediately. Everything stays in one place.' },
  ]
  return (
    <Section py={96} id="how">
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        {pill('How It Works', T.primary)}
        <h2 style={{ fontFamily: T.H, fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: T.text, marginTop: 16 }}>
          Bring the problem. Leave with the plan.
        </h2>
      </div>
      <div className="en-how-grid">
        {steps.map(s => (
          <div key={s.n} style={{ padding: '36px 32px', borderRadius: 20, background: T.panel, border: `1px solid ${T.border}` }}>
            <div style={{ fontFamily: T.H, fontSize: 40, fontWeight: 900, color: T.primary + '30', marginBottom: 16, lineHeight: 1 }}>{s.n}</div>
            <h3 style={{ fontFamily: T.H, fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 12 }}>{s.title}</h3>
            <p style={{ fontFamily: T.B, fontSize: 14, color: T.muted, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ── Marketplace preview ───────────────────────────────────────────────────── */
function MarketplacePreview() {
  const listings = [
    { badge: '🔥 HOT', title: 'SocialBoost — Social Media Growth System', category: 'Service', price: '$299', desc: 'Content calendar, engagement templates, and analytics tracking for consistent organic growth.' },
    { badge: '✨ NEW', title: 'LaunchKit Pro — 30-Day Business Launch', category: 'Package', price: '$999', desc: 'Brand identity, landing page, ad copy, email sequence, and a custom 30-day roadmap.' },
    { badge: '⭐ PREMIUM', title: 'Agency Engine — White-Label AI Platform', category: 'SaaS', price: '$297/mo', desc: 'Run your own AI-powered consulting practice. White-label access and client portal included.' },
  ]
  return (
    <Section bg={T.panel} py={80} id="marketplace">
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        {pill('Marketplace', T.accent)}
        <h2 style={{ fontFamily: T.H, fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: T.text, marginTop: 16 }}>
          Buy, sell, and scale — all in one place.
        </h2>
        <p style={{ fontFamily: T.B, fontSize: 16, color: T.muted, marginTop: 12 }}>
          Services, digital products, business packages, and AI tools — listed and available to the Engine NotREAL community.
        </p>
      </div>
      <div className="en-market-grid">
        {listings.map(l => (
          <div key={l.title} style={{
            padding: '28px 24px', borderRadius: 18,
            background: T.panel2, border: `1px solid ${T.border}`,
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: T.accent, fontFamily: T.H }}>{l.badge}</span>
              <span style={{ fontSize: 12, color: T.dim, fontFamily: T.B, background: T.accentSoft, padding: '2px 10px', borderRadius: 999 }}>{l.category}</span>
            </div>
            <h3 style={{ fontFamily: T.H, fontSize: 16, fontWeight: 700, color: T.text, margin: 0, lineHeight: 1.4 }}>{l.title}</h3>
            <p style={{ fontFamily: T.B, fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0, flex: 1 }}>{l.desc}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: T.H, fontSize: 20, fontWeight: 800, color: T.text }}>{l.price}</span>
              <Link to="/marketplace" style={{
                padding: '8px 16px', borderRadius: 8, textDecoration: 'none',
                fontFamily: T.B, fontSize: 13, fontWeight: 600, color: T.accent,
                background: T.accentSoft, border: `1px solid ${T.accent}30`,
              }}>View →</Link>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 36 }}>
        <Link to="/marketplace" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '12px 28px', borderRadius: 10, textDecoration: 'none',
          fontFamily: T.B, fontSize: 15, fontWeight: 600, color: T.text,
          background: 'rgba(255,255,255,0.06)', border: `1px solid ${T.border}`,
        }}>Browse Full Marketplace →</Link>
      </div>
    </Section>
  )
}

/* ── Global positioning ────────────────────────────────────────────────────── */
function GlobalSection() {
  const markets = [
    { flag: '🇧🇩', country: 'Bangladesh', desc: 'bKash & Nagad payment support built-in. Optimized for local operators and agencies.' },
    { flag: '🇺🇸', country: 'United States', desc: 'Stripe-ready for international payments. Built for US founders and freelancers.' },
    { flag: '🌍', country: 'Global', desc: 'Multi-currency. Multi-language ready. Built for operators everywhere.' },
  ]
  return (
    <Section py={80}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        {pill('Global Platform', T.primary)}
        <h2 style={{ fontFamily: T.H, fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, color: T.text, marginTop: 16 }}>
          Built for operators everywhere.
        </h2>
      </div>
      <div className="en-geo-grid">
        {markets.map(m => (
          <div key={m.country} style={{
            padding: '32px 28px', borderRadius: 18,
            background: T.panel, border: `1px solid ${T.border}`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{m.flag}</div>
            <h3 style={{ fontFamily: T.H, fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 10 }}>{m.country}</h3>
            <p style={{ fontFamily: T.B, fontSize: 14, color: T.muted, lineHeight: 1.65, margin: 0 }}>{m.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ── Pricing CTA ───────────────────────────────────────────────────────────── */
function PricingCTA() {
  const plans = [
    { name: 'Starter', price: 'Free', desc: 'For new founders exploring the platform.', highlight: false },
    { name: 'Growth', price: '$49/mo', desc: 'For active operators and service providers.', highlight: true },
    { name: 'Agency', price: '$149/mo', desc: 'For agencies and high-volume operators.', highlight: false },
  ]
  return (
    <Section bg={T.panel} py={80}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        {pill('Pricing', T.primary)}
        <h2 style={{ fontFamily: T.H, fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: T.text, marginTop: 16 }}>
          Start free. Scale when ready.
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, maxWidth: 900, margin: '0 auto' }}>
        {plans.map(p => (
          <div key={p.name} style={{
            padding: '32px 28px', borderRadius: 20,
            background: p.highlight ? T.primarySoft : T.panel2,
            border: `1px solid ${p.highlight ? T.primary + '60' : T.border}`,
            textAlign: 'center',
            ...(p.highlight ? { transform: 'scale(1.03)' } : {}),
          }}>
            {p.highlight && <div style={{ marginBottom: 12 }}>{pill('Most Popular', T.primary)}</div>}
            <h3 style={{ fontFamily: T.H, fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 6 }}>{p.name}</h3>
            <div style={{ fontFamily: T.H, fontSize: 32, fontWeight: 900, color: p.highlight ? T.primary : T.text, marginBottom: 8 }}>{p.price}</div>
            <p style={{ fontFamily: T.B, fontSize: 14, color: T.muted, marginBottom: 24 }}>{p.desc}</p>
            <Link to="/pricing" style={{
              display: 'block', padding: '10px 24px', borderRadius: 10, textDecoration: 'none',
              fontFamily: T.B, fontSize: 14, fontWeight: 600,
              color: p.highlight ? '#fff' : T.text,
              background: p.highlight ? `linear-gradient(135deg, ${T.primary}, ${T.accent})` : 'rgba(255,255,255,0.08)',
              border: p.highlight ? 'none' : `1px solid ${T.border}`,
            }}>See Full Pricing</Link>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ── Final CTA ─────────────────────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <Section py={96}>
      <div style={{
        textAlign: 'center', padding: '64px 40px', borderRadius: 28,
        background: `linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.10))`,
        border: `1px solid rgba(99,102,241,0.25)`,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative' }}>
          <h2 style={{ fontFamily: T.H, fontSize: 'clamp(28px, 4.5vw, 52px)', fontWeight: 900, color: T.text, marginBottom: 20 }}>
            Ready to run your business<br />
            <span style={{ background: `linear-gradient(90deg, ${T.primary}, ${T.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              like an engine?
            </span>
          </h2>
          <p style={{ fontFamily: T.B, fontSize: 17, color: T.muted, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            No API key required to start. No credit card. Just bring your business problem.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 36px', borderRadius: 12, textDecoration: 'none',
              fontFamily: T.H, fontWeight: 700, fontSize: 16, color: '#fff',
              background: `linear-gradient(135deg, ${T.primary}, ${T.accent})`,
              boxShadow: `0 4px 24px rgba(99,102,241,0.5)`,
            }}>Start Building Free</Link>
            <Link to="/fixer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 36px', borderRadius: 12, textDecoration: 'none',
              fontFamily: T.H, fontWeight: 600, fontSize: 16, color: T.text,
              background: 'rgba(255,255,255,0.07)', border: `1px solid ${T.border}`,
            }}>Fix My Business</Link>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ── Footer ────────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: T.panel, borderTop: `1px solid ${T.border}`, padding: '56px 0 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div className="en-footer-grid" style={{ marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: `linear-gradient(135deg, ${T.primary}, ${T.accent})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: T.H, fontWeight: 900, fontSize: 12, color: '#fff' }}>EN</span>
              </div>
              <span style={{ fontFamily: T.H, fontWeight: 700, fontSize: 15, color: T.text }}>Engine NotREAL</span>
            </div>
            <p style={{ fontFamily: T.B, fontSize: 13, color: T.dim, lineHeight: 1.65, maxWidth: 260 }}>
              An AI-powered business fixer engine for founders, agencies, creators, and operators.
            </p>
          </div>
          {[
            { label: 'Platform', links: ['Dashboard', 'Create', 'Fixer Mode', 'Run / CRM', 'Marketplace', 'Pricing'] },
            { label: 'Account', links: ['Sign In', 'Register', 'AI Tools', 'AI Chat', 'Service Requests'] },
            { label: 'Company', links: ['About', 'Privacy Policy', 'Terms of Service', 'Contact'] },
          ].map(col => (
            <div key={col.label}>
              <h4 style={{ fontFamily: T.H, fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{col.label}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(link => {
                  const path = '/' + link.toLowerCase().replace(/ \/ | /g, '').replace(/\//g, '')
                  return (
                    <Link key={link} to={path} style={{ fontFamily: T.B, fontSize: 13, color: T.dim, textDecoration: 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.color = T.text)}
                      onMouseLeave={e => (e.currentTarget.style.color = T.dim)}>
                      {link}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontFamily: T.B, fontSize: 12, color: T.dim, margin: 0 }}>
            © 2026 Engine NotREAL. Built for real-world operators. Powered by AI.
          </p>
          <p style={{ fontFamily: T.B, fontSize: 12, color: T.dim, margin: 0 }}>
            Bangladesh · United States · Global
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ── Main export ───────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div style={{ background: T.void, color: T.text, minHeight: '100vh' }}>
      <style>{RESPONSIVE_CSS}</style>
      <Nav />
      <main style={{ paddingTop: 0 }}>
        <Hero />
        <Problem />
        <Features />
        <AIEngine />
        <HowItWorks />
        <MarketplacePreview />
        <GlobalSection />
        <PricingCTA />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
