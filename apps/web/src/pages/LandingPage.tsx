/**
 * BayParee — Landing Page v5.0
 * Cinematic · Editorial · Futuristic · "From Idea to Launch"
 */
import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import {
  ArrowRight, Code2, Palette,
  Globe, Target, MessageSquare, CheckCircle,
  Sparkles, FileText, Megaphone, Search, Share2, Activity,
  Lightbulb, Tag, Image, LayoutGrid, Flag, Paintbrush, MonitorSmartphone,
} from 'lucide-react'

/* ─────────────────────────────────────────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────────────────────────────────────────── */

function Counter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [v, setV] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let cur = 0
    const inc = target / 80
    const t = setInterval(() => {
      cur += inc
      if (cur >= target) { setV(target); clearInterval(t) } else setV(Math.floor(cur))
    }, 16)
    return () => clearInterval(t)
  }, [inView, target])
  return <span ref={ref}>{prefix}{v.toLocaleString()}{suffix}</span>
}

function ProgressBar() {
  const { scrollYProgress } = useScroll()
  return (
    <div style={{ position: 'fixed', left: 0, top: 0, width: 3, height: '100vh', zIndex: 50, background: 'rgba(255,255,255,0.05)' }}>
      <motion.div
        style={{ height: useTransform(scrollYProgress, [0, 1], ['0%', '100%']), background: '#F5B041', width: '100%' }}
      />
    </div>
  )
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <div ref={ref} style={{ overflow: 'hidden' }} className={className}>
      <motion.div
        initial={{ y: '110%', opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 1 — HERO
───────────────────────────────────────────────────────────────────────────── */

const STEPS = [
  { icon: <Lightbulb size={12} />, label: 'Idea Analysis' },
  { icon: <Globe size={12} />, label: 'Business Overview' },
  { icon: <Tag size={12} />, label: 'Name & Category' },
  { icon: <Paintbrush size={12} />, label: 'Brand Direction' },
  { icon: <Image size={12} />, label: 'Brand Assets' },
  { icon: <MonitorSmartphone size={12} />, label: 'Facebook Setup' },
  { icon: <LayoutGrid size={12} />, label: 'Landing Page Copy' },
  { icon: <Megaphone size={12} />, label: 'Marketing Plan' },
  { icon: <FileText size={12} />, label: 'Paperwork & Funding' },
  { icon: <Flag size={12} />, label: 'Launch Dashboard' },
]

function HeroMockup() {
  return (
    <div style={{
      background: 'rgba(15,15,15,0.85)',
      border: '1px solid rgba(67,97,238,0.3)',
      borderRadius: 16,
      padding: '24px 20px',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 0 60px rgba(67,97,238,0.15), 0 24px 80px rgba(0,0,0,0.6)',
      minWidth: 260,
    }}>
      <div style={{ fontSize: 11, color: '#F5B041', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16, textTransform: 'uppercase' }}>
        AI Builder · Live Session
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {STEPS.map((s, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 12px',
              borderRadius: 8,
              background: i === 2 ? 'rgba(67,97,238,0.25)' : 'rgba(255,255,255,0.03)',
              border: i === 2 ? '1px solid rgba(67,97,238,0.5)' : '1px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            <div style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 700,
              background: i < 2 ? '#F5B041' : i === 2 ? '#F5B041' : 'rgba(255,255,255,0.08)',
              color: i < 2 ? '#fff' : i === 2 ? '#000' : '#555',
              flexShrink: 0,
            }}>
              {i < 2 ? <CheckCircle size={12} /> : i + 1}
            </div>
            <span style={{
              fontSize: 12,
              color: i === 2 ? '#fff' : i < 2 ? '#888' : '#555',
              fontWeight: i === 2 ? 600 : 400,
            }}>
              {s.label}
            </span>
            {i === 2 && (
              <span style={{
                marginLeft: 'auto',
                fontSize: 9,
                fontWeight: 700,
                background: '#F5B041',
                color: '#fff',
                padding: '2px 6px',
                borderRadius: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>Active</span>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, padding: '10px 12px', background: 'rgba(67,97,238,0.1)', borderRadius: 8, border: '1px solid rgba(67,97,238,0.2)' }}>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>AI is analyzing your idea…</div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
          <div style={{ width: '35%', height: '100%', background: 'linear-gradient(90deg, #F5B041, #E67E22)', borderRadius: 2 }} />
        </div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: '#050505' }}>
      {/* Ambient blobs */}
      <div style={{
        position: 'absolute', top: -200, left: -200, width: 700, height: 700,
        background: 'radial-gradient(circle, rgba(67,97,238,0.18) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -150, right: -100, width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(123,47,255,0.15) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      {/* Diagonal accent line */}
      <div style={{
        position: 'absolute', top: 0, right: '30%', width: 1, height: '100%',
        background: 'linear-gradient(to bottom, transparent, rgba(67,97,238,0.2), transparent)',
        transform: 'skewX(-15deg)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '120px 48px 80px', width: '100%', display: 'grid', gridTemplateColumns: '1fr auto', gap: 60, alignItems: 'center' }}>
        {/* LEFT */}
        <div>
          {/* Pill badge */}
          <Reveal delay={0}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: 'rgba(67,97,238,0.12)', border: '1px solid rgba(67,97,238,0.35)', marginBottom: 32 }}>
              <Sparkles size={13} color="#F5B041" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#F5B041', letterSpacing: '0.03em' }}>
                AI Business Builder · Free to Start
              </span>
            </div>
          </Reveal>

          {/* Main headline */}
          <div style={{ marginBottom: 28 }}>
            <Reveal delay={0.1}>
              <h1 className="font-display" style={{ fontSize: 'clamp(52px, 7vw, 96px)', fontWeight: 800, lineHeight: 1.0, color: '#fff', margin: 0 }}>
                Your Next Business
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <h1 className="font-display" style={{
                fontSize: 'clamp(52px, 7vw, 96px)', fontWeight: 800, lineHeight: 1.0, margin: 0,
                background: 'linear-gradient(135deg, #F5B041 0%, #E67E22 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Starts Here.
              </h1>
            </Reveal>
          </div>

          <FadeUp delay={0.35}>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 540, marginBottom: 40 }}>
              From idea to launch-ready in one AI session. Get your blueprint, brand,
              marketing plan, and paperwork — all in minutes.
            </p>
          </FadeUp>

          <FadeUp delay={0.45}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/builder" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '16px 32px', borderRadius: 8, fontSize: 16, fontWeight: 700,
                background: '#F5B041', color: '#fff', textDecoration: 'none',
                transition: 'all 0.2s', letterSpacing: '0.01em',
                boxShadow: '0 0 40px rgba(67,97,238,0.4)',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#3451d1'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#F5B041'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)' }}
              >
                Build My Business <ArrowRight size={18} />
              </Link>
              <a href="#how-it-works" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '16px 28px', borderRadius: 8, fontSize: 16, fontWeight: 600,
                background: 'transparent', color: '#fff', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.5)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.2)' }}
              >
                See How It Works
              </a>
            </div>
          </FadeUp>
        </div>

        {/* RIGHT — step mockup */}
        <FadeUp delay={0.5}>
          <HeroMockup />
        </FadeUp>
      </div>

      {/* Bottom fade */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to bottom, transparent, #050505)', pointerEvents: 'none' }} />
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 2 — STATS STRIP
───────────────────────────────────────────────────────────────────────────── */

const STATS = [
  { value: 2400, suffix: '+', label: 'Businesses Built' },
  { value: 10, label: 'Steps to Launch' },
  { value: 3, label: 'Partner Integrations' },
  { value: 0, prefix: '$', label: 'Free to Start' },
]

function StatsStrip() {
  return (
    <section style={{ background: '#0F0F0F', borderLeft: '4px solid #F5B041', padding: '32px 0' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
        {STATS.map((s, i) => (
          <FadeUp key={i} delay={i * 0.08}>
            <div style={{ textAlign: 'center', padding: '16px 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div className="font-display" style={{ fontSize: 40, fontWeight: 800, color: '#F5B041', lineHeight: 1 }}>
                {s.prefix && s.value === 0
                  ? <span>{s.prefix}{s.value}{s.suffix || ''}</span>
                  : <Counter target={s.value} suffix={s.suffix} prefix={s.prefix} />
                }
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 6, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                {s.label}
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 3 — THE JOURNEY (10 steps)
───────────────────────────────────────────────────────────────────────────── */

const JOURNEY_STEPS = [
  { n: '01', icon: <Lightbulb size={20} />, title: 'Idea', desc: 'Tell us your business idea in plain language' },
  { n: '02', icon: <Globe size={20} />, title: 'Overview', desc: 'AI maps the market, niche, and opportunity' },
  { n: '03', icon: <Tag size={20} />, title: 'Name & Category', desc: 'Generate names, pick your business category' },
  { n: '04', icon: <Paintbrush size={20} />, title: 'Brand Direction', desc: 'Define your tone, audience, and visual style' },
  { n: '05', icon: <Image size={20} />, title: 'Brand Assets', desc: 'Logo concept, color palette, typography system' },
  { n: '06', icon: <MonitorSmartphone size={20} />, title: 'Facebook Start', desc: 'Page setup copy, bio, and cover messaging' },
  { n: '07', icon: <LayoutGrid size={20} />, title: 'Landing Page', desc: 'Hero, benefits, CTA — all written by AI' },
  { n: '08', icon: <Megaphone size={20} />, title: 'Marketing', desc: '90-day launch plan with channel priorities' },
  { n: '09', icon: <FileText size={20} />, title: 'Paperwork & Funding', desc: 'LLC docs via ThePaperWorkSquad + funding via CGW' },
  { n: '10', icon: <Flag size={20} />, title: 'Launch', desc: 'Your full launch dashboard — go live today' },
]

function JourneySection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section id="how-it-works" style={{ background: '#050505', padding: '100px 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 48px', marginBottom: 56 }}>
        <FadeUp>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#F5B041', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            The Process
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 800, color: '#fff', margin: 0 }}>
            10 Steps. One Session. Launch Ready.
          </h2>
        </FadeUp>
      </div>

      {/* Horizontal scroll strip */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex', gap: 20, overflowX: 'auto', paddingLeft: 48, paddingRight: 48, paddingBottom: 16,
          scrollbarWidth: 'none', msOverflowStyle: 'none',
        }}
      >
        {JOURNEY_STEPS.map((s, i) => (
          <FadeUp key={i} delay={i * 0.04}>
            <div style={{
              flexShrink: 0, width: 220,
              background: '#0F0F0F',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              padding: '24px 20px',
              position: 'relative',
              transition: 'border-color 0.2s, transform 0.2s',
              cursor: 'default',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'rgba(67,97,238,0.4)'
                el.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'rgba(255,255,255,0.07)'
                el.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', marginBottom: 16 }}>
                STEP {s.n}
              </div>
              <div style={{
                width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(67,97,238,0.12)', color: '#F5B041', marginBottom: 14,
              }}>
                {s.icon}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{s.desc}</div>
              {/* Step connector dot */}
              {i < JOURNEY_STEPS.length - 1 && (
                <div style={{
                  position: 'absolute', right: -11, top: '50%', transform: 'translateY(-50%)',
                  width: 22, height: 2, background: 'rgba(67,97,238,0.25)', zIndex: 1,
                }} />
              )}
            </div>
          </FadeUp>
        ))}
      </div>

      <div style={{ maxWidth: 1400, margin: '48px auto 0', padding: '0 48px' }}>
        <FadeUp delay={0.2}>
          <Link to="/builder" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 28px', borderRadius: 8, fontSize: 15, fontWeight: 700,
            background: 'rgba(67,97,238,0.1)', color: '#F5B041', textDecoration: 'none',
            border: '1px solid rgba(67,97,238,0.3)', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#F5B041'; (e.currentTarget as HTMLAnchorElement).style.color = '#fff' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(67,97,238,0.1)'; (e.currentTarget as HTMLAnchorElement).style.color = '#F5B041' }}
          >
            Start Your 10-Step Journey <ArrowRight size={16} />
          </Link>
        </FadeUp>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 4 — PARTNERS
───────────────────────────────────────────────────────────────────────────── */

const PARTNERS = [
  {
    letter: 'T',
    name: 'ThePaperWorkSquad',
    tagline: 'LLC · Paperwork · Compliance',
    desc: 'File your LLC, handle compliance documents, and get legally set up — fully integrated into your builder session.',
    bg: 'rgba(0,80,70,0.3)',
    border: 'rgba(0,200,180,0.2)',
    color: '#00C8B4',
    badge: 'Integrated in Step 9',
  },
  {
    letter: 'C',
    name: 'CGW Systems',
    tagline: 'Funding · Capital · Credit',
    desc: 'Access startup capital, business credit coaching, and funding introductions to accelerate your launch.',
    bg: 'rgba(20,40,100,0.4)',
    border: 'rgba(67,97,238,0.3)',
    color: '#F5B041',
    badge: 'Integrated in Step 9',
  },
  {
    letter: 'D',
    name: 'DhandaBuzz',
    tagline: 'Ads · Design · Growth',
    desc: 'Run paid campaigns, get professional creative assets, and execute your 90-day growth plan with expert hands.',
    bg: 'rgba(50,10,80,0.4)',
    border: 'rgba(123,47,255,0.3)',
    color: '#E67E22',
    badge: 'Integrated in Step 8',
  },
]

function PartnersSection() {
  return (
    <section style={{ background: '#0F0F0F', padding: '100px 0' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 48px' }}>
        <FadeUp>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#F5B041', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            Partner Ecosystem
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>
            Built-In Expert Partners
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', maxWidth: 560, marginBottom: 56 }}>
            When you need the real thing, our partner network steps in — seamlessly connected inside your builder workflow.
          </p>
        </FadeUp>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {PARTNERS.map((p, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div style={{
                background: p.bg,
                border: `1px solid ${p.border}`,
                borderRadius: 16,
                padding: '36px 32px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
              >
                {/* Letter avatar */}
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: p.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, fontWeight: 800, color: '#fff',
                  marginBottom: 24, fontFamily: 'Sora, sans-serif',
                }}>
                  {p.letter}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{p.name}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: p.color, marginBottom: 14, letterSpacing: '0.04em' }}>{p.tagline}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 24 }}>{p.desc}</div>
                <span style={{
                  display: 'inline-block',
                  fontSize: 11, fontWeight: 700,
                  color: p.color, background: `${p.color}18`,
                  border: `1px solid ${p.color}40`,
                  padding: '4px 10px', borderRadius: 6,
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                }}>
                  {p.badge}
                </span>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 5 — SERVICES GRID
───────────────────────────────────────────────────────────────────────────── */

const SERVICES = [
  { icon: <Target size={22} />, name: 'Ad Campaigns', desc: 'Facebook, Google & TikTok ads built to convert', price: 'from $299' },
  { icon: <Code2 size={22} />, name: 'Web Development', desc: 'High-performance landing pages & full sites', price: 'from $499' },
  { icon: <Palette size={22} />, name: 'Design', desc: 'Brand kits, social graphics, pitch decks & more', price: 'from $149' },
  { icon: <MessageSquare size={22} />, name: 'Copywriting', desc: 'Sales pages, email sequences, and ad copy', price: 'from $199' },
  { icon: <Search size={22} />, name: 'SEO', desc: 'On-page optimization, content strategy, backlinks', price: 'from $349' },
  { icon: <Share2 size={22} />, name: 'Social Media', desc: 'Content calendars, posting, community growth', price: 'from $249' },
]

function ServicesSection() {
  return (
    <section style={{ background: '#050505', padding: '100px 0' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 48px' }}>
        <FadeUp>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#F5B041', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            Services
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>
            Everything Your Business Needs
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', maxWidth: 500, marginBottom: 56 }}>
            Execution services delivered by real experts — directly from your dashboard.
          </p>
        </FadeUp>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {SERVICES.map((s, i) => (
            <FadeUp key={i} delay={i * 0.07}>
              <div style={{
                background: '#0F0F0F',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12,
                padding: '28px 24px',
                transition: 'border-color 0.2s, transform 0.2s',
                cursor: 'default',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = '#F5B041'
                  el.style.transform = 'translateY(-3px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = 'rgba(255,255,255,0.07)'
                  el.style.transform = 'translateY(0)'
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(245,176,65,0.1)', color: '#F5B041', marginBottom: 18,
                }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{s.name}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 16 }}>{s.desc}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5B041' }}>{s.price}</div>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.3}>
          <div style={{ marginTop: 40 }}>
            <Link to="/services" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 8, fontSize: 15, fontWeight: 700,
              background: 'transparent', color: '#F5B041', textDecoration: 'none',
              border: '1px solid rgba(245,176,65,0.35)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#F5B041'; (e.currentTarget as HTMLAnchorElement).style.color = '#000' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = '#F5B041' }}
            >
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 6 — GROWTH CHECK CTA
───────────────────────────────────────────────────────────────────────────── */

function GrowthCheckCTA() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #050505 0%, rgba(67,97,238,0.08) 50%, #050505 100%)',
      padding: '120px 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative diagonal */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(160deg, transparent 40%, rgba(67,97,238,0.05) 100%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: -100, right: -200, width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(67,97,238,0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 48px', textAlign: 'center', position: 'relative' }}>
        <FadeUp>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24, padding: '6px 16px', borderRadius: 100, background: 'rgba(245,176,65,0.1)', border: '1px solid rgba(245,176,65,0.25)' }}>
            <Activity size={14} color="#F5B041" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#F5B041', letterSpacing: '0.05em' }}>Free Diagnostic</span>
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 800, color: '#fff', margin: '0 0 24px', lineHeight: 1.1 }}>
            Is Your Business Ready<br />to Grow?
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Take our 8-question diagnostic — get your personalized growth score in 2 minutes.
          </p>
          <Link to="/growth-check" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '18px 40px', borderRadius: 8, fontSize: 18, fontWeight: 800,
            background: '#F5B041', color: '#000', textDecoration: 'none',
            transition: 'all 0.2s', letterSpacing: '0.01em',
            boxShadow: '0 0 50px rgba(245,176,65,0.3)',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#f0a832'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 60px rgba(245,176,65,0.5)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#F5B041'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 50px rgba(245,176,65,0.3)' }}
          >
            Get My Growth Score <ArrowRight size={20} />
          </Link>
          <div style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>No account required · Takes 2 minutes · 100% free</div>
        </FadeUp>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 7 — PRICING
───────────────────────────────────────────────────────────────────────────── */

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    desc: 'Start building with no commitment.',
    features: [
      '3 blueprints per month',
      'AI chat assistant',
      'Growth Check diagnostic',
      'Basic brand suggestions',
    ],
    cta: 'Get Started Free',
    href: '/register',
    featured: false,
    borderColor: 'rgba(255,255,255,0.08)',
    ctaBg: 'rgba(255,255,255,0.06)',
    ctaColor: '#fff',
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    desc: 'For founders who are serious about launching.',
    features: [
      'Unlimited blueprints',
      'Priority AI processing',
      'Full brand asset generation',
      'Partner network access',
      'Marketing plan export',
    ],
    cta: 'Start Pro',
    href: '/register?plan=pro',
    featured: true,
    borderColor: '#F5B041',
    ctaBg: '#F5B041',
    ctaColor: '#fff',
  },
  {
    name: 'Elite',
    price: '$99',
    period: '/mo',
    desc: 'White-glove service for serious operators.',
    features: [
      'Everything in Pro',
      'White-glove onboarding',
      'Dedicated account manager',
      'Funding introduction call',
      'Priority partner access',
    ],
    cta: 'Go Elite',
    href: '/register?plan=elite',
    featured: false,
    borderColor: '#E67E22',
    ctaBg: '#E67E22',
    ctaColor: '#fff',
  },
]

function PricingSection() {
  return (
    <section style={{ background: '#0F0F0F', padding: '100px 0' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 48px' }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#F5B041', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
              Pricing
            </div>
            <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>
              Simple, Transparent Pricing
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', maxWidth: 440, margin: '0 auto' }}>
              Start free, scale when you're ready.
            </p>
          </div>
        </FadeUp>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, alignItems: 'start' }}>
          {PLANS.map((plan, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div style={{
                background: plan.featured ? 'rgba(67,97,238,0.06)' : '#171717',
                border: `2px solid ${plan.featured ? plan.borderColor : plan.borderColor}`,
                borderRadius: 16,
                padding: plan.featured ? '40px 32px' : '32px 28px',
                position: 'relative',
                transform: plan.featured ? 'scale(1.03)' : 'scale(1)',
              }}>
                {plan.featured && (
                  <div style={{
                    position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                    background: '#F5B041', color: '#fff',
                    fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
                    padding: '4px 16px', borderRadius: 20,
                  }}>
                    Most Popular
                  </div>
                )}
                <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                  <span className="font-display" style={{ fontSize: 48, fontWeight: 800, color: '#fff' }}>{plan.price}</span>
                  <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>{plan.period}</span>
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 28 }}>{plan.desc}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCircle size={16} color="#F5B041" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link to={plan.href} style={{
                  display: 'block', textAlign: 'center',
                  padding: '14px', borderRadius: 8, fontSize: 15, fontWeight: 700,
                  background: plan.ctaBg, color: plan.ctaColor, textDecoration: 'none',
                  transition: 'opacity 0.2s',
                  border: plan.featured ? 'none' : `1px solid ${plan.borderColor}`,
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
                >
                  {plan.cta}
                </Link>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 8 — FOOTER
───────────────────────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer style={{ background: '#050505', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '60px 48px 40px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48, flexWrap: 'wrap', gap: 32 }}>
          {/* Wordmark */}
          <div>
            <div className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
              Bay<span style={{ color: '#F5B041' }}>Paree</span>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', maxWidth: 220, lineHeight: 1.6 }}>
              The AI Business Builder. From idea to launch in one session.
            </div>
          </div>

          {/* Nav links */}
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Platform</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[{ to: '/builder', label: 'Builder' }, { to: '/marketplace', label: 'Marketplace' }, { to: '/services', label: 'Services' }].map(l => (
                  <Link key={l.to} to={l.to} style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)' }}
                  >{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Tools</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[{ to: '/growth-check', label: 'Growth Check' }, { to: '/pricing', label: 'Pricing' }].map(l => (
                  <Link key={l.to} to={l.to} style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)' }}
                  >{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Account</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[{ to: '/login', label: 'Sign In' }, { to: '/register', label: 'Get Started' }].map(l => (
                  <Link key={l.to} to={l.to} style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)' }}
                  >{l.label}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>© 2025 BayParee. Built with AI.</div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy Policy', 'Terms of Service'].map(t => (
              <a key={t} href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.25)' }}
              >{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   NAV
───────────────────────────────────────────────────────────────────────────── */

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(5,5,5,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      transition: 'all 0.3s',
      padding: '0 48px',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>
            Bay<span style={{ color: '#F5B041' }}>Paree</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {[{ to: '/builder', label: 'Builder' }, { to: '/marketplace', label: 'Marketplace' }, { to: '/services', label: 'Services' }, { to: '/growth-check', label: 'Growth Check' }, { to: '/pricing', label: 'Pricing' }].map(l => (
            <Link key={l.to} to={l.to} style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.6)' }}
            >{l.label}</Link>
          ))}
          <Link to="/login" style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.6)' }}
          >Sign In</Link>
          <Link to="/builder" style={{
            fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none',
            background: '#F5B041', padding: '8px 20px', borderRadius: 6,
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#3451d1' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#F5B041' }}
          >
            Start Building
          </Link>
        </div>
      </div>
    </nav>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   ROOT
───────────────────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div style={{ background: '#050505', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <ProgressBar />
      <Nav />
      <Hero />
      <StatsStrip />
      <JourneySection />
      <PartnersSection />
      <ServicesSection />
      <GrowthCheckCTA />
      <PricingSection />
      <Footer />
    </div>
  )
}
