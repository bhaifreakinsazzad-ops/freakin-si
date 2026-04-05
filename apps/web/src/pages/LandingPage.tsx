import { Link } from 'react-router-dom'
import { motion, useMotionValue, useTransform, useSpring, useInView } from 'framer-motion'
import {
  MessageSquare, Image as ImageIcon, Wrench, Zap, Shield, Globe,
  ArrowRight, CheckCircle, Code2, Languages, Calculator, PenLine, Palette,
  Cpu, Star, ChevronRight,
} from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'
import { useRef, useState, useEffect, MouseEvent } from 'react'
import { CHAT_MODES } from '@/contexts/ChatModeContext'

function cn(...a: (string | undefined | null | boolean)[]) { return a.filter(Boolean).join(' ') }

/* ── Animated counter ─────────────────────────────────── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref    = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let v = 0
    const inc = target / (1800 / 16)
    const t = setInterval(() => {
      v += inc
      if (v >= target) { setCount(target); clearInterval(t) } else setCount(Math.floor(v))
    }, 16)
    return () => clearInterval(t)
  }, [inView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

/* ── 3D Tilt card ─────────────────────────────────────── */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref  = useRef<HTMLDivElement>(null)
  const x    = useMotionValue(0)
  const y    = useMotionValue(0)
  const rx   = useTransform(y, [-0.5, 0.5], [8, -8])
  const ry   = useTransform(x, [-0.5, 0.5], [-8, 8])
  const srx  = useSpring(rx, { stiffness: 200, damping: 20 })
  const sry  = useSpring(ry, { stiffness: 200, damping: 20 })
  const move = (e: MouseEvent<HTMLDivElement>) => {
    const r = ref.current!.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top)  / r.height - 0.5)
  }
  return (
    <motion.div ref={ref} style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
      onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0) }}
      whileHover={{ scale: 1.03, z: 20 }} className={cn('cursor-default', className)}>
      {children}
    </motion.div>
  )
}

/* ── Floating particle ────────────────────────────────── */
function Particle({ style }: { style: React.CSSProperties }) {
  return <div className="particle" style={style} />
}

/* ── Typewriter demo ──────────────────────────────────── */
const DEMO_TEXT = "Bangladesh-এর top AI platform — 40+ models, সব বাংলায় 🇧🇩"
function TypewriterDemo() {
  const [text, setText] = useState('')
  const [i, setI] = useState(0)
  useEffect(() => {
    if (i >= DEMO_TEXT.length) return
    const t = setTimeout(() => { setText(DEMO_TEXT.slice(0, i + 1)); setI(i + 1) }, 45)
    return () => clearTimeout(t)
  }, [i])
  return (
    <div className="glass rounded-2xl p-4 max-w-sm text-left" style={{ borderColor: 'rgba(255,182,40,0.2)' }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
          style={{ background: 'rgba(255,182,40,0.2)', color: 'var(--fsi-gold)' }}>SI</div>
        <span className="text-xs font-medium" style={{ color: 'var(--fsi-gold)' }}>Freakin SI</span>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--fsi-text)' }}>
        {text}<span className="stream-cursor" />
      </p>
    </div>
  )
}

/* ── Main Landing Page ────────────────────────────────── */
export default function LandingPage() {
  const { t, lang } = useLang()

  const features = [
    { icon: MessageSquare, color: '#FFB628', label: lang === 'bn' ? 'স্মার্ট চ্যাট'    : 'Smart Chat',    desc: lang === 'bn' ? '৪০+ মডেলে যেকোনো প্রশ্নের উত্তর পান'   : 'Answer any question with 40+ models' },
    { icon: ImageIcon,     color: '#8B5CF6', label: lang === 'bn' ? 'ছবি তৈরি'        : 'Image Gen',     desc: lang === 'bn' ? 'টেক্সট থেকে অসাধারণ ছবি তৈরি করুন'    : 'Create stunning images from text' },
    { icon: Wrench,        color: '#00E676', label: lang === 'bn' ? '২০+ টুলস'        : '20+ Tools',     desc: lang === 'bn' ? 'কোড, লেখা, অনুবাদ সব এক জায়গায়'      : 'Code, write, translate — all in one' },
    { icon: Globe,         color: '#3B82F6', label: lang === 'bn' ? '৩ ভাষা'         : '3 Languages',   desc: lang === 'bn' ? 'বাংলা, English ও Hinglish সাপোর্ট'    : 'Bengali, English & Hinglish support' },
    { icon: Zap,           color: '#F59E0B', label: lang === 'bn' ? 'লাইভ স্ট্রিমিং' : 'Live Streaming', desc: lang === 'bn' ? 'ChatGPT-এর মতো রিয়েল-টাইম আউটপুট'   : 'Real-time token streaming output' },
    { icon: Shield,        color: '#EC4899', label: lang === 'bn' ? 'নিরাপদ'         : 'Secure',        desc: lang === 'bn' ? 'আপনার ডেটা সুরক্ষিত ও প্রাইভেট থাকে' : 'Your data stays private and secure' },
  ]

  const providers = [
    { name: 'Groq',       badge: '⚡ Ultra Fast',  models: ['LLaMA 3.3 70B', 'LLaMA 3.2 11B Vision', 'Mixtral 8x7B', 'Gemma 2 9B'], color: '#FFB628' },
    { name: 'Google',     badge: '🧠 Massive CTX', models: ['Gemini 2.0 Flash', 'Gemini 1.5 Pro', 'Gemini 1.5 Flash'], color: '#3B82F6' },
    { name: 'OpenRouter', badge: '🆓 Verified Free',models: ['DeepSeek R1', 'Gemma 3 12B', 'Hermes 3 405B', 'Dolphin 24B'], color: '#8B5CF6' },
    { name: 'Cohere',     badge: '📚 RAG Optimized',models: ['Command A (2025)', 'Command R+', 'Command R'], color: '#00E676' },
  ]

  const plans = [
    { name: 'Free Trial',  price: '৳0',   period: '7 days',  features: ['20 messages/day', '5 images/day', 'Free models', '20+ tools'], highlight: false },
    { name: 'Standard',    price: '৳499', period: '/month',   features: ['100 messages/day', 'All free models', 'Image generation', 'All tools'],   highlight: false },
    { name: 'Premium',     price: '৳999', period: '/month',   features: ['Unlimited messages', 'Pro models (GPT-4o)', 'Priority speed', 'All features'], highlight: true  },
    { name: 'Enterprise',  price: '৳2499',period: '/month',   features: ['Everything', 'API access', 'White-label', 'Dedicated support'],  highlight: false },
  ]

  const modeIcons: Record<string, React.ElementType> = {
    chat: MessageSquare, code: Code2, creative: Palette,
    math: Calculator, translate: Languages, write: PenLine,
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--fsi-void)', color: 'var(--fsi-text)' }}>

      {/* ── Aurora background ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="aurora-orb-1" style={{ top: '-100px', left: '-100px' }} />
        <div className="aurora-orb-2" style={{ bottom: '0px', right: '-100px' }} />
        <div className="aurora-orb-3" style={{ top: '50%', left: '50%' }} />
        <div className="grid-pattern absolute inset-0 opacity-70" />
      </div>

      {/* ── Navbar ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--fsi-gold), #FFA000)', boxShadow: '0 0 16px rgba(255,182,40,0.5)' }}>
            <Zap size={18} fill="black" color="black" />
          </div>
          <span className="font-display font-bold text-lg" style={{ color: 'var(--fsi-gold)' }}>Freakin SI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/pricing" className="text-sm hidden sm:block" style={{ color: 'var(--fsi-text-muted)' }}>
            {lang === 'bn' ? 'মূল্য' : 'Pricing'}
          </Link>
          <Link to="/login" className="text-sm px-4 py-2 rounded-xl border transition-all"
            style={{ borderColor: 'var(--fsi-border)', color: 'var(--fsi-text-muted)' }}>
            {t.login}
          </Link>
          <Link to="/register" className="btn-gold text-sm px-4 py-2 rounded-xl">
            {lang === 'bn' ? 'শুরু করুন' : 'Get Started'}
            <ArrowRight size={14} className="inline ml-1" />
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative z-10 pt-12 pb-24 px-6 text-center max-w-7xl mx-auto">
        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <Particle key={i} style={{
              left:         `${10 + i * 8}%`,
              bottom:       '20%',
              animationDelay:    `${i * 0.4}s`,
              animationDuration: `${3 + (i % 3)}s`,
              opacity:      0.5,
            }} />
          ))}
        </div>

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8"
          style={{ borderColor: 'rgba(255,182,40,0.3)' }}>
          <Star size={13} style={{ color: 'var(--fsi-gold)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--fsi-gold)' }}>
            {lang === 'bn' ? 'বাংলাদেশের প্রথম Synthetic Intelligence Platform' : "South Asia's #1 Synthetic Intelligence Platform"}
          </span>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          {/* Left: Text */}
          <div className="flex-1 max-w-xl text-left lg:text-left">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
              <span style={{ color: 'var(--fsi-text)' }}>The </span>
              <span className="gradient-text">Synthetic</span>
              <br />
              <span className="gradient-text-violet">Intelligence</span>
              <br />
              <span style={{ color: 'var(--fsi-text)' }}>Platform</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-base sm:text-lg mb-8 leading-relaxed" style={{ color: 'var(--fsi-text-muted)' }}>
              {lang === 'bn'
                ? '৪০+ AI মডেল, ২০+ স্পেশালাইজড টুলস, বাংলা ও English সাপোর্ট। ChatGPT-এর মতো live streaming — সম্পূর্ণ বিনামূল্যে শুরু করুন।'
                : '40+ AI models, 20+ specialized tools, Bengali & English. Live streaming like ChatGPT — free to start today.'
              }
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3">
              <Link to="/register" className="btn-gold flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold">
                {lang === 'bn' ? 'বিনামূল্যে শুরু করুন' : 'Start Free — No Card Needed'}
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm border transition-all"
                style={{ borderColor: 'var(--fsi-border)', color: 'var(--fsi-text-muted)' }}>
                {lang === 'bn' ? 'লগইন করুন' : 'Sign In'} <ChevronRight size={15} />
              </Link>
            </motion.div>

            {/* Demo typewriter */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-8">
              <TypewriterDemo />
            </motion.div>
          </div>

          {/* Right: FSI Sphere */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
            className="relative flex-shrink-0 float-anim">
            <div className="fsi-sphere">
              <div className="fsi-sphere-ring-1" />
              <div className="fsi-sphere-ring-2" />
              <div className="fsi-sphere-ring-3" />
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(255,182,40,0.3), rgba(139,92,246,0.2))', border: '1px solid rgba(255,182,40,0.3)' }}>
                  <Cpu size={32} style={{ color: 'var(--fsi-gold)' }} />
                </div>
              </div>
              {/* Orbiting dots */}
              {['#FFB628','#8B5CF6','#00E676'].map((c, i) => (
                <div key={i} className="absolute" style={{ inset: `${-20 + i * 25}px`, animation: `ring-rotate ${14 + i * 6}s linear ${i % 2 === 0 ? '' : 'reverse'} infinite` }}>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[
            { n: 40,  s: '+', label: lang === 'bn' ? 'AI মডেল'   : 'AI Models' },
            { n: 20,  s: '+', label: lang === 'bn' ? 'স্পেশাল টুলস' : 'Tools' },
            { n: 3,   s: '',  label: lang === 'bn' ? 'ভাষা'       : 'Languages' },
            { n: 100, s: '%', label: lang === 'bn' ? 'ফ্রি শুরু'  : 'Free Start' },
          ].map(({ n, s, label }) => (
            <div key={label} className="fsi-card p-4 text-center">
              <div className="font-display font-bold text-2xl gradient-text">
                <Counter target={n} suffix={s} />
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--fsi-text-muted)' }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Chat Modes Section ── */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            <span style={{ color: 'var(--fsi-text)' }}>{lang === 'bn' ? '৬টি ' : '6 '}</span>
            <span className="gradient-text">{lang === 'bn' ? 'স্পেশালাইজড মোড' : 'Specialized Modes'}</span>
          </h2>
          <p style={{ color: 'var(--fsi-text-muted)' }}>
            {lang === 'bn' ? 'প্রতিটি কাজের জন্য আলাদা AI মোড — সেরা ফলাফলের জন্য অপ্টিমাইজড' : 'Each task gets its own AI mode — optimized for best results'}
          </p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CHAT_MODES.map((mode, i) => {
            const Icon = modeIcons[mode.id] || MessageSquare
            return (
              <motion.div key={mode.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <TiltCard className="fsi-card shimmer-card p-5 text-center h-full">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3"
                    style={{ background: mode.color + '18', border: `1px solid ${mode.color}30` }}>
                    {mode.icon}
                  </div>
                  <div className="font-semibold text-sm mb-1" style={{ color: mode.color }}>
                    {lang === 'bn' ? mode.labelBn : mode.label}
                  </div>
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--fsi-text-muted)' }}>
                    {mode.systemPrompt.split('.')[0]}
                  </p>
                </TiltCard>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            {lang === 'bn' ? 'কেন ' : 'Why '}
            <span className="gradient-text">Freakin SI?</span>
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <TiltCard className="fsi-card shimmer-card p-6 h-full">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: f.color + '18', border: `1px solid ${f.color}30` }}>
                  <f.icon size={22} style={{ color: f.color }} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2" style={{ color: f.color }}>{f.label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--fsi-text-muted)' }}>{f.desc}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Models Section ── */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            <span className="gradient-text">40+ AI Models</span>
            {lang === 'bn' ? ' — একটি প্ল্যাটফর্মে' : ' — One Platform'}
          </h2>
          <p style={{ color: 'var(--fsi-text-muted)' }}>
            {lang === 'bn' ? 'বিশ্বের সেরা AI মডেলগুলো একসাথে — বেছে নিন আপনার পছন্দমতো' : "World's best AI models together — pick what suits you"}
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {providers.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="fsi-card p-5 h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display font-bold text-lg" style={{ color: p.color }}>{p.name}</span>
                  <span className="text-xs px-2 py-1 rounded-lg" style={{ background: p.color + '18', color: p.color }}>{p.badge}</span>
                </div>
                <ul className="space-y-2">
                  {p.models.map(m => (
                    <li key={m} className="flex items-center gap-2 text-sm" style={{ color: 'var(--fsi-text-muted)' }}>
                      <CheckCircle size={13} style={{ color: p.color, flexShrink: 0 }} />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            {lang === 'bn' ? 'বাংলাদেশি ' : 'BDT '}
            <span className="gradient-text">{lang === 'bn' ? 'মূল্য তালিকা' : 'Pricing'}</span>
          </h2>
          <p style={{ color: 'var(--fsi-text-muted)' }}>
            {lang === 'bn' ? 'bKash ও Nagad দিয়ে পেমেন্ট — কোনো ক্রেডিট কার্ড লাগবে না' : 'Pay via bKash & Nagad — no credit card needed'}
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className={cn('fsi-card p-6 h-full flex flex-col', plan.highlight && 'fsi-card-active pulse-glow')}
                style={plan.highlight ? { borderColor: 'rgba(255,182,40,0.5)' } : {}}>
                {plan.highlight && (
                  <div className="text-xs px-2 py-0.5 rounded-full self-start mb-3 font-bold"
                    style={{ background: 'var(--fsi-gold)', color: '#000' }}>
                    ⭐ POPULAR
                  </div>
                )}
                <h3 className="font-display font-bold text-lg mb-1" style={{ color: plan.highlight ? 'var(--fsi-gold)' : 'var(--fsi-text)' }}>
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold" style={{ color: 'var(--fsi-text)' }}>{plan.price}</span>
                  <span className="text-sm ml-1" style={{ color: 'var(--fsi-text-muted)' }}>{plan.period}</span>
                </div>
                <ul className="space-y-2 flex-1 mb-5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--fsi-text-muted)' }}>
                      <CheckCircle size={13} style={{ color: plan.highlight ? 'var(--fsi-gold)' : 'var(--fsi-green)' }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={cn('w-full py-2.5 rounded-xl text-sm font-semibold text-center block transition-all border',
                  plan.highlight ? 'btn-gold' : '')}
                  style={plan.highlight ? {} : { borderColor: 'var(--fsi-border)', color: 'var(--fsi-text-muted)' }}>
                  {lang === 'bn' ? 'শুরু করুন' : 'Get Started'}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative z-10 py-20 px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass rounded-3xl p-12"
          style={{ borderColor: 'rgba(255,182,40,0.25)', boxShadow: '0 0 60px rgba(255,182,40,0.08)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, var(--fsi-gold), #FFA000)', boxShadow: '0 0 30px rgba(255,182,40,0.5)' }}>
            <Zap size={30} fill="black" color="black" />
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            <span className="gradient-text">{lang === 'bn' ? 'আজই শুরু করুন' : 'Start Today'}</span>
          </h2>
          <p className="text-base mb-8" style={{ color: 'var(--fsi-text-muted)' }}>
            {lang === 'bn'
              ? '৭ দিনের ফ্রি ট্রায়াল — কোনো ক্রেডিট কার্ড লাগবে না। OpenAI, Anthropic, Google-কে চ্যালেঞ্জ করার মতো AI platform।'
              : '7-day free trial, no credit card. An AI platform bold enough to challenge OpenAI, Anthropic & Google.'}
          </p>
          <Link to="/register" className="btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold">
            {lang === 'bn' ? 'ফ্রি অ্যাকাউন্ট খুলুন' : 'Create Free Account'}
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-8 px-6 border-t" style={{ borderColor: 'var(--fsi-border)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--fsi-gold), #FFA000)' }}>
              <Zap size={14} fill="black" color="black" />
            </div>
            <span className="font-display font-bold" style={{ color: 'var(--fsi-gold)' }}>Freakin SI</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>
            {lang === 'bn' ? '© ২০২৫ Freakin SI — Synthetic Intelligence Platform' : '© 2025 Freakin SI — Synthetic Intelligence Platform'}
          </p>
          <div className="flex gap-4 text-xs" style={{ color: 'var(--fsi-text-muted)' }}>
            <Link to="/pricing">{lang === 'bn' ? 'মূল্য' : 'Pricing'}</Link>
            <Link to="/login">{lang === 'bn' ? 'লগইন' : 'Login'}</Link>
            <Link to="/register">{lang === 'bn' ? 'রেজিস্ট্রেশন' : 'Register'}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
