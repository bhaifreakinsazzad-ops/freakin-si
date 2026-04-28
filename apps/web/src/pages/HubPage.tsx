import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Users, BarChart3, BookOpen, Smartphone, Bot,
  ArrowRight, ExternalLink, Briefcase, DollarSign,
  Zap, Globe, Star, ChevronRight,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Counter
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Shared fade-in variant
// ---------------------------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

// ---------------------------------------------------------------------------
// HubPage
// ---------------------------------------------------------------------------
export default function HubPage() {
  return (
    <div
      style={{
        background: 'var(--fsi-void, #080808)',
        color: 'var(--fsi-text, #F4F6FA)',
        minHeight: '100vh',
        fontFamily: 'Inter, sans-serif',
        overflowX: 'hidden',
      }}
    >
      {/* ================================================================
          STICKY NAV
      ================================================================ */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 60,
          background: 'rgba(8,8,8,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--fsi-border, rgba(255,255,255,0.08))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            className="font-display"
            style={{ fontSize: 18, fontWeight: 700, color: '#c8102e' }}
          >
            Black Sheep
          </span>
          <ChevronRight size={14} style={{ color: 'var(--fsi-text-muted, #A7ACB8)', opacity: 0.6 }} />
          <span style={{ fontSize: 13, color: 'var(--fsi-text-muted, #A7ACB8)', letterSpacing: '0.04em' }}>
            Business Hub
          </span>
        </div>
        <Link
          to="/builder"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--fsi-void, #080808)',
            background: 'var(--fsi-gold, #F5B041)',
            padding: '7px 16px',
            borderRadius: 8,
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Start Building <ArrowRight size={13} />
        </Link>
      </nav>

      {/* ================================================================
          MAIN — pt-16 to clear nav
      ================================================================ */}
      <main style={{ paddingTop: 64 }}>

        {/* ==============================================================
            SECTION 1 — HERO
        ============================================================== */}
        <section
          style={{
            position: 'relative',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '80px 32px 80px',
            overflow: 'hidden',
          }}
        >
          {/* Ambient gold glow blob */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '20%',
              transform: 'translate(-50%, -50%)',
              width: 600,
              height: 600,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245,176,65,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          {/* Diagonal amber accent line */}
          <div
            style={{
              position: 'absolute',
              top: '30%',
              right: '8%',
              width: 220,
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(230,126,34,0.5), transparent)',
              transform: 'rotate(-35deg)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '60%',
              right: '14%',
              width: 100,
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(245,176,65,0.3), transparent)',
              transform: 'rotate(-35deg)',
              pointerEvents: 'none',
            }}
          />

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            style={{ position: 'relative', maxWidth: 900, margin: '0 auto', width: '100%', textAlign: 'center' }}
          >
            {/* Department strip */}
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: 'var(--fsi-gold, #F5B041)',
                textTransform: 'uppercase',
                marginBottom: 32,
                fontVariant: 'small-caps',
              }}
            >
              01 HIRE &nbsp;·&nbsp; 02 VALUATION &nbsp;·&nbsp; 03 LEARN &nbsp;·&nbsp; 04 MOBILE &nbsp;·&nbsp; 05 AGENTS
            </p>

            {/* Headline */}
            <h1
              className="font-display"
              style={{
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                fontWeight: 800,
                lineHeight: 1.08,
                margin: '0 0 16px',
              }}
            >
              <span style={{ color: '#F4F6FA' }}>Your Business.</span>
              <br />
              <span style={{ color: 'var(--fsi-gold, #F5B041)' }}>Every Department.</span>
            </h1>

            {/* Subheadline */}
            <p
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                color: 'var(--fsi-text-muted, #A7ACB8)',
                maxWidth: 640,
                margin: '0 auto 40px',
                lineHeight: 1.6,
              }}
            >
              Access hiring, funding, education, AI tools, and custom agents — all from one place.
            </p>

            {/* Stats strip */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 12,
              }}
            >
              {['5 Departments', '5 Partner Platforms', 'Free to Access'].map((s) => (
                <span
                  key={s}
                  style={{
                    padding: '8px 18px',
                    border: '1px solid rgba(245,176,65,0.25)',
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--fsi-gold, #F5B041)',
                    background: 'rgba(245,176,65,0.06)',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ==============================================================
            SECTION 2 — DEPARTMENT 01: HIRE
        ============================================================== */}
        <section
          style={{
            background: 'rgba(245,176,65,0.03)',
            padding: '100px 32px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Large background number */}
          <span
            aria-hidden
            style={{
              position: 'absolute',
              right: 32,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 200,
              fontWeight: 900,
              color: 'rgba(245,176,65,0.04)',
              userSelect: 'none',
              lineHeight: 1,
              fontFamily: 'Sora, sans-serif',
            }}
          >
            01
          </span>

          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            {/* Left: content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--fsi-gold, #F5B041)', textTransform: 'uppercase', marginBottom: 20 }}>
                DEPARTMENT 01 · HIRING
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <Users size={28} style={{ color: 'var(--fsi-gold, #F5B041)' }} />
              </div>
              <h2 className="font-display" style={{ fontSize: 48, fontWeight: 800, margin: '0 0 16px', lineHeight: 1.1 }}>
                Hire Others
              </h2>
              <p style={{ fontSize: 16, color: 'var(--fsi-text-muted, #A7ACB8)', lineHeight: 1.7, marginBottom: 36, maxWidth: 420 }}>
                Find top talent fast. Designers, developers, marketers, copywriters, moderators — on-demand.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <a
                  href="https://meetally.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '12px 22px', borderRadius: 10,
                    background: 'var(--fsi-gold, #F5B041)', color: '#080808',
                    fontWeight: 700, fontSize: 14, textDecoration: 'none',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  Browse on MeetAlly <ArrowRight size={14} />
                </a>
                <a
                  href="https://vibing.world"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '12px 22px', borderRadius: 10,
                    border: '1.5px solid var(--fsi-gold, #F5B041)', color: 'var(--fsi-gold, #F5B041)',
                    fontWeight: 700, fontSize: 14, textDecoration: 'none', background: 'transparent',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,176,65,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  Explore Vibing <ExternalLink size={13} />
                </a>
              </div>
            </motion.div>

            {/* Right: tag cloud */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'flex-start', alignContent: 'flex-start' }}
            >
              {['Design', 'Development', 'Marketing', 'Copywriting', 'Video', 'Virtual Assistant'].map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid rgba(245,176,65,0.35)',
                    borderRadius: 999,
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--fsi-text, #F4F6FA)',
                    background: 'rgba(17,17,17,0.8)',
                    letterSpacing: '0.01em',
                  }}
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 3 — DEPARTMENT 02: VALUATION & FUNDING
        ============================================================== */}
        <section
          style={{
            background: 'rgba(245,176,65,0.02)',
            padding: '100px 32px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <span
            aria-hidden
            style={{
              position: 'absolute',
              right: 32,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 200,
              fontWeight: 900,
              color: 'rgba(245,176,65,0.04)',
              userSelect: 'none',
              lineHeight: 1,
              fontFamily: 'Sora, sans-serif',
            }}
          >
            02
          </span>

          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            {/* Left: score widget */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                background: 'var(--fsi-surface, #111111)',
                border: '1px solid rgba(245,176,65,0.18)',
                borderRadius: 16,
                padding: '36px 32px',
                boxShadow: '0 0 60px rgba(245,176,65,0.04)',
              }}
            >
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: 'var(--fsi-text-muted, #A7ACB8)', textTransform: 'uppercase', marginBottom: 12 }}>
                BUSINESS RANKING
              </p>
              <p
                className="font-display"
                style={{ fontSize: 56, fontWeight: 800, color: 'var(--fsi-gold, #F5B041)', margin: '0 0 24px', lineHeight: 1 }}
              >
                #<Counter target={13487} />
              </p>

              <div style={{ height: 1, background: 'rgba(245,176,65,0.15)', marginBottom: 24 }} />

              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: 'var(--fsi-text-muted, #A7ACB8)', textTransform: 'uppercase', marginBottom: 12 }}>
                FUNDABILITY ELIGIBILITY
              </p>
              <p
                className="font-display"
                style={{ fontSize: 56, fontWeight: 800, color: 'var(--fsi-gold, #F5B041)', margin: '0 0 16px', lineHeight: 1 }}
              >
                <Counter target={92} /> <span style={{ fontSize: 24, color: 'var(--fsi-text-muted, #A7ACB8)' }}>/ 100</span>
              </p>
              {/* Progress bar */}
              <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 999, height: 6, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '92%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--fsi-gold, #F5B041), #E67E22)',
                    borderRadius: 999,
                  }}
                />
              </div>
            </motion.div>

            {/* Right: content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--fsi-gold, #F5B041)', textTransform: 'uppercase', marginBottom: 20 }}>
                DEPARTMENT 02 · VALUATION & FUNDING
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <BarChart3 size={28} style={{ color: 'var(--fsi-gold, #F5B041)' }} />
              </div>
              <h2 className="font-display" style={{ fontSize: 42, fontWeight: 800, margin: '0 0 16px', lineHeight: 1.1 }}>
                Check Valuation &amp; Fund Eligibility
              </h2>
              <p style={{ fontSize: 16, color: 'var(--fsi-text-muted, #A7ACB8)', lineHeight: 1.7, marginBottom: 36, maxWidth: 420 }}>
                See where your business ranks globally. Check if you qualify for US business funding approval.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <a
                  href="https://freakin-si.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '12px 22px', borderRadius: 10,
                    background: 'var(--fsi-gold, #F5B041)', color: '#080808',
                    fontWeight: 700, fontSize: 14, textDecoration: 'none',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  Check on Freakin-SI <ArrowRight size={14} />
                </a>
                <a
                  href="https://hoooplaaaa.space"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '12px 22px', borderRadius: 10,
                    border: '1.5px solid var(--fsi-gold, #F5B041)', color: 'var(--fsi-gold, #F5B041)',
                    fontWeight: 700, fontSize: 14, textDecoration: 'none', background: 'transparent',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,176,65,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  Try Hoooplaaaa <ExternalLink size={13} />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 4 — DEPARTMENT 03: LEARN & RESEARCH (centered)
        ============================================================== */}
        <section
          style={{
            padding: '100px 32px',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
          }}
        >
          <span
            aria-hidden
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 260,
              fontWeight: 900,
              color: 'rgba(245,176,65,0.03)',
              userSelect: 'none',
              lineHeight: 1,
              fontFamily: 'Sora, sans-serif',
              pointerEvents: 'none',
            }}
          >
            03
          </span>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--fsi-gold, #F5B041)', textTransform: 'uppercase', marginBottom: 20 }}>
              DEPARTMENT 03 · EDUCATION
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <BookOpen size={28} style={{ color: 'var(--fsi-gold, #F5B041)' }} />
            </div>
            <h2 className="font-display" style={{ fontSize: 48, fontWeight: 800, margin: '0 0 16px', lineHeight: 1.1 }}>
              Learn, Study &amp; Level Up
            </h2>
            <p style={{ fontSize: 16, color: 'var(--fsi-text-muted, #A7ACB8)', lineHeight: 1.7, marginBottom: 36 }}>
              Business courses, market research tools, growth playbooks, legal guides. Everything a founder needs to know.
            </p>

            {/* Topic pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
              {['Finance', 'Marketing', 'Operations', 'Legal', 'Technology', 'Strategy'].map((topic) => (
                <TopicPill key={topic} label={topic} />
              ))}
            </div>

            <a
              href="https://guru-sphere.online"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', borderRadius: 10,
                background: 'var(--fsi-gold, #F5B041)', color: '#080808',
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Visit Guru Sphere <ArrowRight size={15} />
            </a>
          </motion.div>
        </section>

        {/* ==============================================================
            SECTION 5 — DEPARTMENT 04: MOBILE AI
        ============================================================== */}
        <section
          style={{
            background: 'rgba(245,176,65,0.02)',
            padding: '100px 32px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <span
            aria-hidden
            style={{
              position: 'absolute',
              right: 32,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 200,
              fontWeight: 900,
              color: 'rgba(245,176,65,0.04)',
              userSelect: 'none',
              lineHeight: 1,
              fontFamily: 'Sora, sans-serif',
            }}
          >
            04
          </span>

          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            {/* Left: phone mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <div
                style={{
                  width: 180,
                  height: 360,
                  borderRadius: 28,
                  background: 'linear-gradient(160deg, #111111 0%, #0d0d0d 100%)',
                  border: '1.5px solid var(--fsi-gold, #F5B041)',
                  boxShadow: '0 0 40px rgba(245,176,65,0.12), 0 0 80px rgba(245,176,65,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Notch */}
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    width: 60,
                    height: 8,
                    borderRadius: 999,
                    background: 'rgba(245,176,65,0.15)',
                  }}
                />
                {/* Glowing dot */}
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: 'var(--fsi-gold, #F5B041)',
                    boxShadow: '0 0 12px rgba(245,176,65,0.8)',
                  }}
                />
                <span
                  className="font-display"
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    color: 'var(--fsi-gold, #F5B041)',
                    textTransform: 'uppercase',
                  }}
                >
                  AI SHALA
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: 'var(--fsi-text-muted, #A7ACB8)',
                    letterSpacing: '0.08em',
                  }}
                >
                  40+ Models
                </span>
                {/* Bottom bar */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 14,
                    width: 48,
                    height: 4,
                    borderRadius: 999,
                    background: 'rgba(245,176,65,0.3)',
                  }}
                />
              </div>
            </motion.div>

            {/* Right: content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--fsi-gold, #F5B041)', textTransform: 'uppercase', marginBottom: 20 }}>
                DEPARTMENT 04 · MOBILE AI
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <Smartphone size={28} style={{ color: 'var(--fsi-gold, #F5B041)' }} />
              </div>
              <h2 className="font-display" style={{ fontSize: 42, fontWeight: 800, margin: '0 0 16px', lineHeight: 1.1 }}>
                AI Shala — 40 Models in Your Pocket
              </h2>
              <p style={{ fontSize: 16, color: 'var(--fsi-text-muted, #A7ACB8)', lineHeight: 1.7, marginBottom: 28, maxWidth: 440 }}>
                The most powerful mobile AI super-engine ever built. Chat, create, generate, analyze — powered by 40+ AI models.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 36 }}>
                {['40+ AI Models', 'Chat', 'Image Gen', 'Voice', 'Free Tier'].map((feat) => (
                  <span
                    key={feat}
                    style={{
                      padding: '6px 14px',
                      background: 'rgba(245,176,65,0.08)',
                      border: '1px solid rgba(245,176,65,0.2)',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--fsi-gold, #F5B041)',
                    }}
                  >
                    {feat}
                  </span>
                ))}
              </div>
              <a
                href="https://powered-by-bhaisazzad.online"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 22px', borderRadius: 10,
                  background: 'var(--fsi-gold, #F5B041)', color: '#080808',
                  fontWeight: 700, fontSize: 14, textDecoration: 'none',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Launch AI Shala <ArrowRight size={14} />
              </a>
            </motion.div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 6 — DEPARTMENT 05: CUSTOM AI AGENTS (darkest)
        ============================================================== */}
        <section
          style={{
            background: '#050505',
            padding: '100px 32px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <span
            aria-hidden
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 300,
              fontWeight: 900,
              color: 'rgba(245,176,65,0.025)',
              userSelect: 'none',
              lineHeight: 1,
              fontFamily: 'Sora, sans-serif',
              pointerEvents: 'none',
            }}
          >
            05
          </span>

          <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ marginBottom: 60 }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--fsi-gold, #F5B041)', textTransform: 'uppercase', marginBottom: 20 }}>
                DEPARTMENT 05 · AI AGENTS
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <Bot size={28} style={{ color: 'var(--fsi-gold, #F5B041)' }} />
              </div>
              <h2 className="font-display" style={{ fontSize: 48, fontWeight: 800, margin: '0 0 16px', lineHeight: 1.1 }}>
                Design Your Custom AI Agent
              </h2>
              <p style={{ fontSize: 16, color: 'var(--fsi-text-muted, #A7ACB8)', lineHeight: 1.7, maxWidth: 560 }}>
                Build, buy, or subscribe to an AI agent tailored to your exact business needs. Your 24/7 digital employee.
              </p>
            </motion.div>

            {/* Agent cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 48 }}
            >
              <AgentCard
                letter="A"
                name="Assistant Elite"
                desc="Executive personal assistant"
                avatarColor="#F5B041"
                price="$49/mo"
              />
              <AgentCard
                letter="L"
                name="LeadHunterPro"
                desc="Automated lead generation"
                avatarColor="#E67E22"
                price="$79/mo"
              />
              <AgentCard
                letter="E"
                name="EcommercePro"
                desc="Full e-commerce automation"
                avatarColor="#1ABC9C"
                price="$99/mo"
              />
            </motion.div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <a
                href="https://kaamlaa.site"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 24px', borderRadius: 10,
                  background: 'var(--fsi-gold, #F5B041)', color: '#080808',
                  fontWeight: 700, fontSize: 14, textDecoration: 'none',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Browse Agents on Kaamlaa <ArrowRight size={14} />
              </a>
              <a
                href="https://kaamlaa.site"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 24px', borderRadius: 10,
                  border: '1.5px solid var(--fsi-gold, #F5B041)', color: 'var(--fsi-gold, #F5B041)',
                  fontWeight: 700, fontSize: 14, textDecoration: 'none', background: 'transparent',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,176,65,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                Commission Custom Agent <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 7 — BOTTOM CTA STRIP
        ============================================================== */}
        <section
          style={{
            background: 'linear-gradient(90deg, #E67E22 0%, #F5B041 50%, #E67E22 100%)',
            padding: '60px 32px',
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p
              className="font-display"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, color: '#080808', margin: '0 0 24px' }}
            >
              Not sure where to start?
            </p>
            <Link
              to="/builder"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                borderRadius: 10,
                background: '#080808',
                color: 'var(--fsi-gold, #F5B041)',
                fontWeight: 700,
                fontSize: 16,
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Start with AI Builder <ArrowRight size={16} />
            </Link>
          </motion.div>
        </section>
      </main>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Topic Pill — hover fill
// ---------------------------------------------------------------------------
function TopicPill({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '10px 22px',
        border: '1px solid var(--fsi-gold, #F5B041)',
        borderRadius: 999,
        fontSize: 14,
        fontWeight: 600,
        color: hovered ? '#080808' : 'var(--fsi-gold, #F5B041)',
        background: hovered ? 'var(--fsi-gold, #F5B041)' : 'transparent',
        cursor: 'default',
        transition: 'background 0.2s, color 0.2s',
      }}
    >
      {label}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Agent Card — 3D hover tilt
// ---------------------------------------------------------------------------
function AgentCard({
  letter,
  name,
  desc,
  avatarColor,
  price,
}: {
  letter: string
  name: string
  desc: string
  avatarColor: string
  price: string
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 200,
        minHeight: 220,
        background: 'var(--fsi-surface, #111111)',
        border: `1px solid ${hovered ? avatarColor + '55' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 16,
        padding: '28px 20px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 10,
        cursor: 'default',
        transition: 'transform 0.25s ease, border-color 0.25s, box-shadow 0.25s',
        transform: hovered
          ? 'perspective(800px) rotateY(8deg) rotateX(-4deg) translateY(-4px)'
          : 'perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0)',
        boxShadow: hovered
          ? `0 20px 60px rgba(0,0,0,0.5), 0 0 24px ${avatarColor}22`
          : '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: avatarColor + '22',
          border: `2px solid ${avatarColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          fontWeight: 800,
          color: avatarColor,
          fontFamily: 'Sora, sans-serif',
          flexShrink: 0,
        }}
      >
        {letter}
      </div>

      {/* Name */}
      <span
        className="font-display"
        style={{ fontSize: 15, fontWeight: 700, color: 'var(--fsi-text, #F4F6FA)', lineHeight: 1.2 }}
      >
        {name}
      </span>

      {/* Description */}
      <span style={{ fontSize: 12, color: 'var(--fsi-text-muted, #A7ACB8)', lineHeight: 1.5 }}>
        {desc}
      </span>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Price tag */}
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: avatarColor,
          background: avatarColor + '15',
          border: `1px solid ${avatarColor}33`,
          borderRadius: 6,
          padding: '4px 10px',
          alignSelf: 'flex-start',
        }}
      >
        {price}
      </span>
    </div>
  )
}
