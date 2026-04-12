/**
 * Freakin BI — Landing Page v4.0
 * Electric Editorial · 1590px wide · US Market · Zero glass morphism
 * Design: Sharp color blocks, kinetic clip-reveal text, inverted gold section
 */
import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import {
  ArrowRight, Zap, Shield, TrendingUp, Code2, Palette,
  Globe, Target, Users, BarChart3, MessageSquare,
  CheckCircle, Star, ChevronRight, Play, Lock, Sparkles,
} from 'lucide-react'

/* ── Animated counter ─────────────────────────────────────────────────────── */
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

/* ── Left-edge scroll progress bar ───────────────────────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const h = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  return (
    <div className="fixed left-0 top-0 w-[3px] h-screen z-50 bg-white/5">
      <motion.div style={{ height: h, background: '#F5B041' }} className="w-full" />
    </div>
  )
}

/* ── Clip-reveal text animation ───────────────────────────────────────────── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <motion.div
        initial={{ y: '110%', opacity: 0 }}
        animate={inView ? { y: '0%', opacity: 1 } : {}}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}

/* ── Service card ─────────────────────────────────────────────────────────── */
interface SCardProps {
  icon: React.ElementType; name: string; desc: string
  price: string; color: string; badge?: string; delay?: number
}
function SCard({ icon: Icon, name, desc, price, color, badge, delay = 0 }: SCardProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group relative bg-[#0D0D0D] border border-white/8 p-6 cursor-pointer"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      {badge && (
        <span
          className="absolute top-4 right-4 text-[10px] font-bold tracking-widest px-2 py-0.5"
          style={{ background: color, color: '#000' }}
        >{badge}</span>
      )}
      <div
        className="w-10 h-10 flex items-center justify-center mb-4"
        style={{ background: color + '18', border: `1px solid ${color}30` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <h3 className="font-bold text-white mb-1.5 text-sm tracking-wide">{name}</h3>
      <p className="text-white/40 text-xs leading-relaxed mb-4">{desc}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold" style={{ color }}>From {price}</span>
        <ChevronRight size={14} className="text-white/20 group-hover:text-white/60 transition-colors" />
      </div>
    </motion.div>
  )
}

/* ── Live dashboard mockup ────────────────────────────────────────────────── */
function DashMockup() {
  const [live, setLive] = useState(4281)
  useEffect(() => {
    const t = setInterval(() => setLive(n => n + Math.floor(Math.random() * 3)), 2800)
    return () => clearInterval(t)
  }, [])
  const bars = [35, 55, 42, 78, 62, 88, 95]
  return (
    <div className="relative w-full max-w-[540px] ml-auto select-none">
      <div
        className="absolute inset-0 blur-[80px] opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F5B041 0%, #7B2FFF 60%, transparent 100%)' }}
      />
      <div className="relative bg-[#0A0A0A] border border-white/10" style={{ fontFamily: 'monospace' }}>
        {/* titlebar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          <span className="text-white/30 text-xs ml-2">freakin-bi — live dashboard</span>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF94] animate-pulse" />
            <span className="text-[10px] text-[#00FF94]">LIVE</span>
          </span>
        </div>
        <div className="p-4 space-y-3">
          {/* kpi row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Active Biz', val: live.toLocaleString(), color: '#F5B041' },
              { label: 'Revenue',    val: '$2.4M',               color: '#00FF94' },
              { label: 'AI Tasks',   val: '847K',                color: '#7B2FFF' },
            ].map(s => (
              <div key={s.label} className="bg-white/4 p-3 border border-white/6">
                <div className="text-[10px] text-white/40 mb-1">{s.label}</div>
                <div className="text-base font-bold" style={{ color: s.color }}>{s.val}</div>
              </div>
            ))}
          </div>
          {/* bar chart */}
          <div className="bg-white/4 border border-white/6 p-3">
            <div className="text-[10px] text-white/40 mb-3">Revenue · Last 7 Days</div>
            <div className="flex items-end gap-1.5 h-14">
              {bars.map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1"
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.6, delay: 0.08 * i }}
                  style={{
                    background: i === 6 ? '#F5B041' : `rgba(245,176,65,${0.12 + i * 0.1})`,
                    minWidth: 8,
                  }}
                />
              ))}
            </div>
          </div>
          {/* activity feed */}
          <div className="space-y-1.5">
            {[
              { type: 'Blueprint', name: 'FashionBD Dropship', status: '✓',  color: '#00FF94' },
              { type: 'AdScale',   name: 'FB Campaign live',   status: '→',  color: '#F5B041' },
              { type: 'Escrow',    name: '$240 deal secured',  status: '🔒', color: '#7B2FFF' },
            ].map(row => (
              <div key={row.name} className="flex items-center gap-3 text-[11px] bg-white/3 px-3 py-2">
                <span className="text-white/30 w-16 shrink-0">{row.type}</span>
                <span className="text-white/70 flex-1 truncate">{row.name}</span>
                <span style={{ color: row.color }}>{row.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Services list ────────────────────────────────────────────────────────── */
const SERVICES: SCardProps[] = [
  { icon: Sparkles,      name: 'AI Blueprint',       desc: 'Complete business plans, brand identity, offer structure & revenue model in minutes.',        price: 'Free',   color: '#F5B041', badge: 'POPULAR' },
  { icon: Target,        name: 'AdScale Engine',     desc: 'Facebook & Instagram ad management with live ROAS tracking, A/B testing, AI optimization.',    price: '$49/mo', color: '#EF4444', badge: 'HIGH ROI' },
  { icon: Palette,       name: 'Creative Engine',    desc: 'AI-powered graphics, video creatives, social posts and brand kits. Delivered in 24 hrs.',       price: '$19',    color: '#EC4899' },
  { icon: Code2,         name: 'Web Studio',         desc: 'Landing pages in 1 hr. E-commerce stores. Custom web apps. Mobile apps published.',            price: '$99',    color: '#3B82F6', badge: 'FAST' },
  { icon: Shield,        name: 'Secure Escrow',      desc: 'Safe transactions with dispute resolution. Pay only when delivered. Zero risk.',                price: '2% fee', color: '#00FF94', badge: 'NEW' },
  { icon: TrendingUp,    name: 'SEO & Content',      desc: 'Keyword-optimized posts and product descriptions. Rank on Google. Traffic that converts.',      price: '$29',    color: '#8B5CF6' },
  { icon: Users,         name: 'Social Management',  desc: 'Trained human team runs your pages. Under 5-min response. Comments, DMs, growth.',             price: '$79/mo', color: '#F97316' },
  { icon: BarChart3,     name: 'Growth Analytics',   desc: 'Revenue, leads, ROAS, conversion — all live in one dashboard updated in real-time.',           price: 'Pro',    color: '#06B6D4' },
  { icon: MessageSquare, name: 'AI Chat Agent',      desc: '24/7 AI handles your inbox, qualifies leads and books appointments. Never miss a customer.',    price: '$39/mo', color: '#F5B041' },
  { icon: Globe,         name: 'Marketplace',        desc: 'List and sell businesses or digital products to a global buyer pool. Free forever.',            price: 'Free',   color: '#10B981' },
]

/* ════════════════════════════ PAGE ═══════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <ScrollProgress />

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 border-b border-white/5"
        style={{ background: 'rgba(5,5,5,0.92)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-[1590px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/fsi-icon.svg" alt="F-Bi" className="w-7 h-7" />
            <span className="font-black text-sm tracking-widest" style={{ color: '#F5B041' }}>FREAKIN BI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[11px] text-white/50 font-semibold tracking-widest">
            {([['#services', 'SERVICES'], ['#growth', 'GROWTH CHECK'], ['#pricing', 'PRICING'], ['#escrow', 'ESCROW']] as const).map(([href, label]) => (
              <a key={href} href={href} className="hover:text-white transition-colors">{label}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-xs text-white/50 hover:text-white transition-colors tracking-wide">LOGIN</Link>
            <Link
              to="/register"
              className="text-xs font-black px-5 py-2.5 tracking-widest transition-all hover:opacity-90"
              style={{ background: '#F5B041', color: '#000' }}
            >START FREE →</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 max-w-[1590px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* left */}
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 border border-[#F5B041]/30 px-3 py-1 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF94] animate-pulse" />
                <span className="text-[10px] tracking-[0.3em] text-[#F5B041] font-bold">
                  AI BUSINESS INTELLIGENCE · 🇧🇩 MADE IN BANGLADESH · BUILT FOR THE WORLD
                </span>
              </div>
            </Reveal>

            <div className="space-y-0 mb-8">
              {(['BUILD YOUR', 'EMPIRE', 'WITH AI.'] as const).map((line, i) => (
                <Reveal key={line} delay={0.05 * i}>
                  <h1
                    className="font-black leading-none tracking-tight"
                    style={{
                      fontSize: 'clamp(52px, 6vw, 88px)',
                      color: i === 1 ? '#F5B041' : i === 2 ? 'rgba(250,250,250,0.15)' : '#FAFAFA',
                    }}
                  >{line}</h1>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <p className="text-white/50 text-base leading-relaxed mb-10 max-w-[440px]">
                The only platform combining AI business blueprints, digital services,
                secure escrow and growth analytics — for entrepreneurs who mean business.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 font-black text-sm tracking-widest transition-all hover:gap-4"
                  style={{ background: '#F5B041', color: '#000' }}
                >START FOR FREE <ArrowRight size={16} /></Link>
                <a
                  href="#services"
                  className="inline-flex items-center gap-2 px-8 py-4 font-bold text-sm tracking-widest border border-white/15 text-white/70 hover:border-white/40 hover:text-white transition-all"
                ><Play size={14} /> SEE SERVICES</a>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} fill="#F5B041" className="text-[#F5B041]" />
                ))}
                <span className="text-xs text-white/40 ml-1">4.9 · Trusted by 4,200+ businesses</span>
              </div>
            </Reveal>
          </div>

          {/* right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <DashMockup />
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
      <div className="border-y border-white/8 bg-[#080808]">
        <div className="max-w-[1590px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/8">
            {[
              { val: 4200, suf: '+',   label: 'Businesses Built',   color: '#F5B041' },
              { val: 2,    suf: 'M+',  label: 'Revenue Generated',  color: '#00FF94', pre: '$' },
              { val: 98,   suf: '%',   label: 'Client Satisfaction', color: '#7B2FFF' },
              { val: 24,   suf: ' hrs', label: 'Avg Delivery Time',  color: '#F5B041' },
            ].map((s, i) => (
              <div key={i} className="py-8 px-8 text-center">
                <div className="font-black text-3xl mb-1" style={{ color: s.color }}>
                  <Counter target={s.val} suffix={s.suf} prefix={s.pre} />
                </div>
                <div className="text-[11px] tracking-widest text-white/30 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section id="services" className="py-24 max-w-[1590px] mx-auto px-6">
        <div className="mb-16">
          <Reveal>
            <p className="text-[10px] tracking-[0.4em] text-[#F5B041] font-bold mb-4">EVERYTHING YOU NEED</p>
          </Reveal>
          <div className="flex items-end justify-between gap-8 flex-wrap">
            <Reveal delay={0.05}>
              <h2 className="font-black text-4xl md:text-5xl leading-none">
                10 SERVICES.<br /><span className="text-white/25">ONE PLATFORM.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link to="/services" className="text-xs text-white/40 hover:text-[#F5B041] transition-colors tracking-widest flex items-center gap-2">
                VIEW ALL <ArrowRight size={12} />
              </Link>
            </Reveal>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-px bg-white/5">
          {SERVICES.map((s, i) => <SCard key={s.name} {...s} delay={i * 0.04} />)}
        </div>
      </section>

      {/* ── GROWTH CHECK — INVERTED GOLD SECTION ─────────────────────────── */}
      <section id="growth" style={{ background: '#F5B041' }}>
        <div className="max-w-[1590px] mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] tracking-[0.4em] text-black/50 font-bold mb-4">FREE TOOL · 2 MINUTES</p>
              <h2
                className="font-black leading-none text-black mb-6"
                style={{ fontSize: 'clamp(40px, 5vw, 68px)' }}
              >WHAT IS YOUR<br />BUSINESS<br />SCORE?</h2>
              <p className="text-black/60 text-base mb-8 max-w-[400px]">
                Answer 8 questions. Get a personalized growth score, your top 3 bottlenecks,
                and an AI-generated action plan — free, instant, no BS.
              </p>
              <Link
                to="/growth-check"
                className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white font-black text-sm tracking-widest hover:gap-5 transition-all"
              >GET MY FREE SCORE <ArrowRight size={16} /></Link>
            </div>
            {/* score preview */}
            <div className="bg-black p-8 space-y-4">
              <div className="text-white/40 text-[10px] tracking-widest mb-4">SAMPLE REPORT</div>
              <div className="text-center py-6 border border-white/10">
                <div className="text-7xl font-black" style={{ color: '#F5B041' }}>74</div>
                <div className="text-white/40 text-[10px] tracking-widest mt-2">GROWTH SCORE / 100</div>
              </div>
              {[
                { label: 'Lead Generation', score: 82, color: '#00FF94' },
                { label: 'Conversion Rate', score: 61, color: '#F5B041' },
                { label: 'Content Quality', score: 74, color: '#7B2FFF' },
                { label: 'Ad Performance',  score: 45, color: '#EF4444' },
              ].map(item => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/50">{item.label}</span>
                    <span style={{ color: item.color }}>{item.score}</span>
                  </div>
                  <div className="h-1 bg-white/10">
                    <motion.div
                      className="h-full"
                      style={{ background: item.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ESCROW ───────────────────────────────────────────────────────── */}
      <section id="escrow" className="py-24 bg-[#080808]">
        <div className="max-w-[1590px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-1">
              {[
                { step: '01', label: 'Buyer creates deal and funds escrow',          Icon: Lock,        color: '#F5B041' },
                { step: '02', label: 'Seller delivers with proof of work',           Icon: CheckCircle, color: '#00FF94' },
                { step: '03', label: 'Buyer confirms — funds released instantly',    Icon: Zap,         color: '#7B2FFF' },
              ].map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-center gap-6 bg-[#0D0D0D] border border-white/6 p-6"
                  style={{ borderLeft: `3px solid ${row.color}` }}
                >
                  <span className="font-black text-2xl text-white/10 w-8 shrink-0">{row.step}</span>
                  <row.Icon size={20} style={{ color: row.color, flexShrink: 0 }} />
                  <span className="text-white/70 text-sm">{row.label}</span>
                </motion.div>
              ))}
              <div className="bg-[#00FF94]/8 border border-[#00FF94]/20 p-6 mt-4">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-[#00FF94] shrink-0" />
                  <div>
                    <div className="font-bold text-sm text-[#00FF94]">Dispute? We step in.</div>
                    <div className="text-xs text-white/40">Admin resolves every contested transaction. Always fair.</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.4em] text-[#00FF94] font-bold mb-4">SECURE DEALS · ZERO RISK</p>
              <h2 className="font-black text-4xl md:text-5xl leading-none mb-6">
                CLOSE DEALS<br /><span className="text-white/25">WITHOUT FEAR.</span>
              </h2>
              <p className="text-white/50 text-base mb-8 max-w-[420px]">
                Hiring a freelancer, buying a business, or closing a client —
                our escrow holds funds until both sides are satisfied. No scams. No disputes.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {['2% flat fee', 'Dispute resolution', 'Proof of delivery', 'Escrow chat', 'Instant release'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-white/50">
                    <CheckCircle size={11} className="text-[#00FF94] shrink-0" />{f}
                  </div>
                ))}
              </div>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 font-bold text-sm tracking-widest border border-[#00FF94]/30 text-[#00FF94] hover:bg-[#00FF94]/10 transition-all"
              >TRY ESCROW FREE <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-24 max-w-[1590px] mx-auto px-6">
        <div className="mb-16 text-center">
          <Reveal><p className="text-[10px] tracking-[0.4em] text-[#F5B041] font-bold mb-4">SIMPLE PROCESS</p></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-black text-4xl md:text-5xl">
              IDEA TO INCOME<br /><span className="text-white/20">IN 3 STEPS.</span>
            </h2>
          </Reveal>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-white/5">
          {[
            { n: '1', title: 'DESCRIBE YOUR BUSINESS', desc: 'Tell our AI your niche, audience and goals. Takes 90 seconds.', color: '#F5B041' },
            { n: '2', title: 'GET YOUR BLUEPRINT',     desc: 'Receive a complete strategy: brand, offer, landing page, ad plan, revenue model.', color: '#7B2FFF' },
            { n: '3', title: 'EXECUTE WITH US',        desc: 'Order ads, design, web or SEO directly. Track all results live in your dashboard.', color: '#00FF94' },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0D0D0D] p-10"
            >
              <div className="font-black text-[100px] leading-none mb-4" style={{ color: step.color, opacity: 0.1 }}>{step.n}</div>
              <h3 className="font-black text-lg mb-3" style={{ color: step.color }}>{step.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-[#080808]">
        <div className="max-w-[1590px] mx-auto px-6">
          <div className="mb-16">
            <Reveal><p className="text-[10px] tracking-[0.4em] text-[#F5B041] font-bold mb-4">TRANSPARENT PRICING</p></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-black text-4xl md:text-5xl">NO HIDDEN FEES.<br /><span className="text-white/20">EVER.</span></h2>
            </Reveal>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-white/5">
            {[
              {
                name: 'STARTER', price: 'Free', per: 'forever', color: '#ffffff',
                desc: 'Explore the full platform.',
                features: ['5 AI blueprints / mo', '1 active service', 'Basic analytics', 'Community support', 'Marketplace access'],
                highlight: false,
              },
              {
                name: 'PRO', price: '$29', per: '/month', color: '#F5B041',
                desc: 'For serious entrepreneurs.',
                features: ['Unlimited blueprints', '5 active services', 'Live dashboard', 'Priority support', 'Escrow included', 'AdScale access'],
                highlight: true,
              },
              {
                name: 'PREMIUM', price: '$79', per: '/month', color: '#7B2FFF',
                desc: 'For agencies and power users.',
                features: ['Everything in Pro', 'White-label reports', 'Dedicated manager', 'API access', 'Custom integrations', 'Team seats (5)'],
                highlight: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0D0D0D] p-10 relative"
                style={plan.highlight ? { borderTop: '3px solid #F5B041' } : {}}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-10 text-[10px] font-bold tracking-widest px-3 py-0.5 bg-[#F5B041] text-black">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-[10px] tracking-[0.3em] font-bold mb-4" style={{ color: plan.color }}>{plan.name}</div>
                <div className="mb-2">
                  <span className="font-black text-4xl text-white">{plan.price}</span>
                  <span className="text-white/30 text-sm">{plan.per}</span>
                </div>
                <p className="text-white/40 text-xs mb-8">{plan.desc}</p>
                <ul className="space-y-3 mb-10">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-white/60">
                      <CheckCircle size={13} style={{ color: plan.color, flexShrink: 0 }} />{f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className="block text-center py-3.5 font-bold text-sm tracking-widest transition-all hover:opacity-90"
                  style={plan.highlight
                    ? { background: '#F5B041', color: '#000' }
                    : { border: `1px solid ${plan.color}40`, color: plan.color }}
                >
                  {plan.name === 'STARTER' ? 'Start Free' : plan.name === 'PRO' ? 'Go Pro' : 'Go Premium'} →
                </Link>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-white/25 mt-6 tracking-wide">
            30-day money-back guarantee · No contracts · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-32 max-w-[1590px] mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_auto] gap-16 items-center border-t border-white/8 pt-24">
          <div>
            <Reveal>
              <h2 className="font-black leading-none mb-6" style={{ fontSize: 'clamp(52px, 7vw, 104px)' }}>
                READY TO<br /><span style={{ color: '#F5B041' }}>BUILD?</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-white/40 text-base max-w-[380px]">
                Join 4,200+ entrepreneurs. Start free. Upgrade when you grow.
              </p>
            </Reveal>
          </div>
          <div className="flex flex-col gap-4 min-w-[280px]">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 font-black text-sm tracking-widest transition-all hover:gap-5"
              style={{ background: '#F5B041', color: '#000' }}
            >CREATE FREE ACCOUNT <ArrowRight size={16} /></Link>
            <Link
              to="/growth-check"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 font-bold text-sm tracking-widest border border-white/10 text-white/50 hover:border-white/30 hover:text-white transition-all"
            >GET FREE BUSINESS SCORE</Link>
            <p className="text-center text-[10px] text-white/25 tracking-widest">NO CREDIT CARD REQUIRED</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/8 bg-[#030303]">
        <div className="max-w-[1590px] mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/fsi-icon.svg" alt="F-Bi" className="w-6 h-6" />
                <span className="font-black text-xs tracking-widest" style={{ color: '#F5B041' }}>FREAKIN BI</span>
              </div>
              <p className="text-white/30 text-xs leading-relaxed">
                Freakin Business Intelligence.<br />Made in Bangladesh.<br />Built for the World.
              </p>
            </div>
            {[
              { heading: 'PLATFORM', links: ['AI Blueprint', 'Services', 'Marketplace', 'Escrow', 'Dashboard'] },
              { heading: 'SERVICES', links: ['AdScale Engine', 'Creative Engine', 'Web Studio', 'SEO & Content', 'Social Management'] },
              { heading: 'COMPANY',  links: ['Growth Check', 'Pricing', 'Login', 'Register', 'Contact'] },
            ].map(col => (
              <div key={col.heading}>
                <p className="text-[10px] tracking-[0.3em] text-white/30 font-bold mb-4">{col.heading}</p>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" className="text-xs text-white/40 hover:text-white/80 transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-wrap items-center justify-between gap-4 text-[10px] text-white/20 tracking-widest">
            <span>{`\u00A9 ${new Date().getFullYear()} FREAKIN BI \u2014 FREAKIN BUSINESS INTELLIGENCE`}</span>
            <span>BHAIFREAKIN.ONLINE</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
