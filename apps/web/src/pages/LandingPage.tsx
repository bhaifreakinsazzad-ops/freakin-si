/**
 * Freakin BI — Landing Page
 * "Unlock the Code to Billions" · Made in Bangladesh · Built for the World
 */
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight, CheckCircle, Sparkles, TrendingUp, Store,
  Briefcase, Globe, Zap, Shield, Code2, Star, Play,
} from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'
import { useRef, useState, useEffect } from 'react'

/* ── Animated counter ────────────────────────────────────────────────────── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let v = 0; const inc = target / (1500 / 16)
    const t = setInterval(() => { v += inc; if (v >= target) { setCount(target); clearInterval(t) } else setCount(Math.floor(v)) }, 16)
    return () => clearInterval(t)
  }, [inView, target])
  return <span ref={ref}>{count}{suffix}</span>
}

/* ── Hex grid SVG background ─────────────────────────────────────────────── */
function HexGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hex" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
          <polygon points="14,2 42,2 56,24 42,46 14,46 0,24" fill="none" stroke="#F5B041" strokeWidth="0.8"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex)"/>
    </svg>
  )
}

/* ── Main ────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const { t, lang, toggle } = useLang()

  const pillars = [
    { icon: Sparkles, label: 'CREATE', sub: 'AI-generate a full business blueprint in seconds', color: '#F5B041', to: '/register' },
    { icon: Play,     label: 'RUN',    sub: 'Hire expert help: ads, dev, design, copy, SEO', color: '#3B82F6', to: '/register' },
    { icon: Store,    label: 'SELL',   sub: 'List your blueprint on the F-Bi marketplace',    color: '#00C27A', to: '/register' },
    { icon: TrendingUp, label: 'GROW', sub: 'Scale revenue with your 4-phase roadmap',        color: '#8B5CF6', to: '/register' },
  ]

  const stats = [
    { n: 40, s: '+', label: lang === 'bn' ? 'AI মডেল' : 'AI Models' },
    { n: 20, s: '+', label: lang === 'bn' ? 'টুলস' : 'Tools' },
    { n: 3,  s: '',  label: lang === 'bn' ? 'ভাষা' : 'Languages' },
    { n: 100,s: '%', label: lang === 'bn' ? 'ফ্রি শুরু' : 'Free Start' },
  ]

  const features = [
    { icon: Zap,      color: '#F5B041', label: lang === 'bn' ? 'BI Blueprint Generator' : 'BI Blueprint Generator', desc: 'Full business plan with brand, offers, landing page copy & ad hooks — in under 60 seconds.' },
    { icon: Store,    color: '#00C27A', label: 'Marketplace',    desc: 'Buy and sell AI-built businesses. Verified listings, escrow-safe transactions.' },
    { icon: Briefcase,color: '#3B82F6', label: 'Expert Services', desc: 'On-demand ads, dev, design, SEO, and social — delivered in 24–72 hours.' },
    { icon: Globe,    color: '#8B5CF6', label: '3 Languages',    desc: 'Bengali, English & Hinglish. Real-time AI chat across all 6 specialized modes.' },
    { icon: Code2,    color: '#EC4899', label: '40+ AI Models',  desc: 'Groq LLaMA, Gemini, DeepSeek, Command A — always picking the best for your task.' },
    { icon: Shield,   color: '#00C27A', label: 'Secure & Private', desc: 'JWT auth, row-level security, Supabase-backed. Your data stays yours.' },
  ]

  const providers = [
    { name: 'Groq',       badge: '⚡ Ultra Fast',   models: ['LLaMA 3.3 70B', 'LLaMA 3.2 Vision', 'Mixtral 8x7B'], color: '#F5B041' },
    { name: 'Google',     badge: '🧠 Massive CTX',  models: ['Gemini 2.0 Flash', 'Gemini 1.5 Pro', 'Gemini 1.5 Flash'], color: '#3B82F6' },
    { name: 'OpenRouter', badge: '🆓 Verified Free', models: ['DeepSeek R1', 'Gemma 3 12B', 'Hermes 3 405B'], color: '#8B5CF6' },
    { name: 'Cohere',     badge: '📚 RAG Optimized', models: ['Command A (2025)', 'Command R+', 'Command R'], color: '#00C27A' },
  ]

  const plans = [
    { name: lang === 'bn' ? 'ফ্রি ট্রায়াল' : 'Free Trial', price: '৳0',    period: lang === 'bn' ? '৭ দিন' : '7 days',   features: ['20 messages/day', '5 images/day', '20+ tools', '1 BI Blueprint'], hot: false },
    { name: lang === 'bn' ? 'স্ট্যান্ডার্ড' : 'Standard',   price: '৳499',  period: '/month', features: ['100 messages/day', 'All free models', 'Image generation', '5 BI Blueprints/mo'], hot: false },
    { name: lang === 'bn' ? 'প্রিমিয়াম' : 'Premium',       price: '৳999',  period: '/month', features: ['Unlimited messages', 'Pro models (GPT-4o)', 'Priority speed', 'Unlimited BI Blueprints'], hot: true  },
    { name: lang === 'bn' ? 'এন্টারপ্রাইজ' : 'Enterprise',  price: '৳2499', period: '/month', features: ['Everything', 'API access', 'White-label', 'Dedicated support'], hot: false },
  ]

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#060810', color: '#F0F6FF' }}>

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto"
        style={{ background: 'rgba(6,8,16,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(245,176,65,0.1)' }}>
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl overflow-hidden" style={{ boxShadow: '0 0 14px rgba(245,176,65,0.5)' }}>
            <img src="/fsi-icon.svg" alt="F-Bi" className="w-full h-full" />
          </div>
          <div>
            <span className="font-display font-bold text-lg" style={{ color: '#F5B041' }}>Freakin BI</span>
            <span className="hidden sm:inline text-xs ml-2" style={{ color: 'rgba(245,176,65,0.5)' }}>F-Bi</span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="text-xs px-3 py-1.5 rounded-lg transition-all hidden sm:block"
            style={{ border: '1px solid rgba(245,176,65,0.15)', color: 'rgba(240,246,255,0.5)' }}>
            {lang === 'bn' ? '🇬🇧 EN' : '🇧🇩 বাং'}
          </button>
          <Link to="/login" className="text-sm px-4 py-2 rounded-xl transition-all"
            style={{ border: '1px solid rgba(245,176,65,0.2)', color: 'rgba(240,246,255,0.7)' }}>
            {t.login}
          </Link>
          <Link to="/register" className="btn-gold text-sm px-5 py-2 rounded-xl font-semibold">
            {lang === 'bn' ? 'শুরু করুন' : 'Start Free'} <ArrowRight size={14} className="inline ml-1" />
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        <HexGrid />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(245,176,65,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="max-w-4xl mx-auto text-center">

            {/* Made in BD badge */}
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-semibold tracking-wider uppercase"
              style={{ background: 'rgba(245,176,65,0.08)', border: '1px solid rgba(245,176,65,0.25)', color: '#F5B041' }}>
              🇧🇩 {lang === 'bn' ? 'বাংলাদেশে তৈরি — বিশ্বের জন্য' : 'Made in Bangladesh — Built for the World'}
            </motion.div>

            {/* F-Bi logo mark */}
            <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: 0.1 }}
              className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl overflow-hidden" style={{ boxShadow: '0 0 60px rgba(245,176,65,0.4), 0 0 120px rgba(245,176,65,0.15)' }}>
                  <img src="/fsi-logo.svg" alt="Freakin BI" className="w-full h-full" />
                </div>
                {/* Pulse ring */}
                <div className="absolute -inset-3 rounded-3xl border border-[rgba(245,176,65,0.2)] animate-pulse pointer-events-none" />
              </div>
            </motion.div>

            {/* Main headline */}
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="font-display font-black leading-[1.0] mb-6"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}>
              <span style={{ color: '#F0F6FF' }}>
                {lang === 'bn' ? 'বিলিয়নের' : 'UNLOCK THE'}
              </span>
              <br />
              <span style={{ background: 'linear-gradient(90deg, #F8C97A, #F5B041, #D4830A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {lang === 'bn' ? 'কোড আনলক করো' : 'CODE TO BILLIONS'}
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl mb-4 max-w-2xl mx-auto" style={{ color: 'rgba(240,246,255,0.65)' }}>
              {lang === 'bn'
                ? 'আপনার আইডিয়া দিন। ৬০ সেকেন্ডে পান সম্পূর্ণ ব্যবসায়িক ব্লুপ্রিন্ট — ব্র্যান্ড, অফার, ল্যান্ডিং পেজ, বিজ্ঞাপন ও রেভিনিউ রোডম্যাপ।'
                : 'Give us your idea. Get a complete business blueprint in 60 seconds — brand, offers, landing page copy, ad hooks & revenue roadmap.'}
            </motion.p>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
              className="text-sm mb-10 font-semibold tracking-widest uppercase" style={{ color: 'rgba(245,176,65,0.6)' }}>
              {lang === 'bn' ? 'আপনার ডেটা। আপনার সাম্রাজ্য।' : 'Your Data. Your Empire. Start Now.'}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-gold text-base px-8 py-4 rounded-2xl font-bold w-full sm:w-auto text-center"
                style={{ boxShadow: '0 0 40px rgba(245,176,65,0.35)' }}>
                {lang === 'bn' ? '🚀 ফ্রিতে শুরু করুন' : '🚀 Build My Blueprint Free'}
              </Link>
              <Link to="/money-machine" className="flex items-center justify-center gap-2 text-base px-8 py-4 rounded-2xl font-semibold w-full sm:w-auto"
                style={{ border: '1px solid rgba(245,176,65,0.25)', color: 'rgba(240,246,255,0.75)', background: 'rgba(245,176,65,0.04)' }}>
                <Play size={16} />
                {lang === 'bn' ? 'BI Builder দেখুন' : 'See BI Builder'}
              </Link>
            </motion.div>

            {/* Trust row */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs" style={{ color: 'rgba(240,246,255,0.35)' }}>
              {['✓ No credit card', '✓ 7-day free trial', '✓ bKash & Nagad accepted', '✓ Cancel anytime'].map(t2 => (
                <span key={t2}>{t2}</span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 px-6" style={{ borderTop: '1px solid rgba(245,176,65,0.08)', borderBottom: '1px solid rgba(245,176,65,0.08)', background: 'rgba(245,176,65,0.02)' }}>
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <p className="font-display font-black text-3xl sm:text-4xl" style={{ color: '#F5B041' }}>
                <Counter target={s.n} suffix={s.s} />
              </p>
              <p className="text-sm mt-1" style={{ color: 'rgba(240,246,255,0.45)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4 PILLARS ── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <HexGrid />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#F5B041' }}>THE FRAMEWORK</p>
            <h2 className="font-display font-black text-4xl sm:text-5xl" style={{ color: '#F0F6FF' }}>
              CREATE · RUN · SELL · GROW
            </h2>
            <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: 'rgba(240,246,255,0.5)' }}>
              {lang === 'bn' ? 'চারটি ধাপে আপনার সাম্রাজ্য গড়ুন' : 'Four steps to build, operate, monetize and scale any business'}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map(({ icon: Icon, label, sub, color, to }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Link to={to} className="block rounded-2xl p-6 h-full group transition-all hover:scale-[1.02]"
                  style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${color}15` }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <p className="font-display font-black text-xl mb-2" style={{ color }}>{label}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,246,255,0.55)' }}>{sub}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color }}>
                    {lang === 'bn' ? 'শুরু করুন' : 'Get started'} <ArrowRight size={12} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-6" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="font-display font-black text-4xl sm:text-5xl">
              <span style={{ color: '#F0F6FF' }}>{lang === 'bn' ? 'কেন ' : 'Why '}</span>
              <span style={{ background: 'linear-gradient(90deg, #F8C97A, #F5B041)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Freakin BI?</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, color, label, desc }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="rounded-2xl p-6" style={{ background: '#0C1220', border: '1px solid rgba(245,176,65,0.08)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}15` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: '#F0F6FF' }}>{label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,246,255,0.5)' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI MODELS ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#F5B041' }}>POWERED BY</p>
            <h2 className="font-display font-black text-4xl" style={{ color: '#F0F6FF' }}>
              {lang === 'bn' ? '৪০+ AI মডেল — এক প্ল্যাটফর্মে' : '40+ AI Models — One Platform'}
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {providers.map(({ name, badge, models, color }, i) => (
              <motion.div key={name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="rounded-2xl p-5" style={{ background: '#0C1220', border: `1px solid ${color}20` }}>
                <p className="font-bold text-base mb-1" style={{ color }}>{name}</p>
                <span className="text-xs px-2 py-0.5 rounded-full mb-3 inline-block" style={{ background: `${color}15`, color }}>{badge}</span>
                <ul className="space-y-1.5">
                  {models.map(m => (
                    <li key={m} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(240,246,255,0.55)' }}>
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                      {m}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-20 px-6 relative overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <HexGrid />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#F5B041' }}>PRICING</p>
            <h2 className="font-display font-black text-4xl sm:text-5xl" style={{ color: '#F0F6FF' }}>
              {lang === 'bn' ? 'BDT মূল্য' : 'BDT Pricing'}
            </h2>
            <p className="mt-3 text-base" style={{ color: 'rgba(240,246,255,0.5)' }}>
              {lang === 'bn' ? 'bKash ও Nagad-এ পেমেন্ট — কোনো ক্রেডিট কার্ড লাগবে না' : 'Pay via bKash & Nagad — no credit card needed'}
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map(({ name, price, period, features: fs, hot }, i) => (
              <motion.div key={name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="rounded-2xl p-6 relative" style={{
                  background: hot ? 'linear-gradient(135deg, rgba(245,176,65,0.1), rgba(212,131,10,0.06))' : '#0C1220',
                  border: `1px solid ${hot ? 'rgba(245,176,65,0.4)' : 'rgba(245,176,65,0.08)'}`,
                }}>
                {hot && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: '#F5B041', color: '#000' }}>★ POPULAR</div>}
                <p className="font-bold text-sm mb-3" style={{ color: hot ? '#F5B041' : 'rgba(240,246,255,0.7)' }}>{name}</p>
                <div className="flex items-end gap-1 mb-4">
                  <span className="font-display font-black text-3xl" style={{ color: '#F0F6FF' }}>{price}</span>
                  <span className="text-sm mb-1" style={{ color: 'rgba(240,246,255,0.4)' }}>{period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {fs.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs" style={{ color: 'rgba(240,246,255,0.6)' }}>
                      <CheckCircle size={13} className="shrink-0 mt-0.5" style={{ color: hot ? '#F5B041' : '#00C27A' }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={`block text-center py-2.5 rounded-xl text-sm font-semibold transition-all ${hot ? 'btn-gold' : ''}`}
                  style={hot ? {} : { border: '1px solid rgba(245,176,65,0.2)', color: 'rgba(240,246,255,0.7)' }}>
                  {lang === 'bn' ? 'শুরু করুন' : 'Get Started'}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-28 px-6 relative overflow-hidden text-center">
        <HexGrid />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(245,176,65,0.07) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10 max-w-3xl mx-auto">
          <div className="w-20 h-20 rounded-3xl overflow-hidden mx-auto mb-8" style={{ boxShadow: '0 0 60px rgba(245,176,65,0.4)' }}>
            <img src="/fsi-logo.svg" alt="Freakin BI" className="w-full h-full" />
          </div>
          <h2 className="font-display font-black leading-tight mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#F0F6FF' }}>
            {lang === 'bn' ? 'আপনার সাম্রাজ্য শুরু হোক আজ থেকে' : 'Your Empire Starts Today'}
          </h2>
          <p className="text-lg mb-10" style={{ color: 'rgba(240,246,255,0.5)' }}>
            {lang === 'bn' ? 'bhaifreakin.online — বিনামূল্যে শুরু, কোনো ক্রেডিট কার্ড নেই' : 'bhaifreakin.online — Free to start. No credit card required.'}
          </p>
          <Link to="/register" className="btn-gold text-lg px-10 py-5 rounded-2xl font-black inline-block"
            style={{ boxShadow: '0 0 60px rgba(245,176,65,0.4)' }}>
            🚀 {lang === 'bn' ? 'এখনই শুরু করুন — বিনামূল্যে' : 'Start Building Free Now'}
          </Link>
          <p className="mt-6 text-xs" style={{ color: 'rgba(245,176,65,0.4)' }}>
            {lang === 'bn' ? '🇧🇩 বাংলাদেশে তৈরি · সারা বিশ্বের জন্য · Freakin Studio' : '🇧🇩 Made in Bangladesh · Built for the World · Freakin Studio'}
          </p>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-6" style={{ borderTop: '1px solid rgba(245,176,65,0.08)', background: '#040608' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden">
              <img src="/fsi-icon.svg" alt="F-Bi" className="w-full h-full" />
            </div>
            <span className="font-display font-bold text-sm" style={{ color: '#F5B041' }}>Freakin BI</span>
            <span className="text-xs" style={{ color: 'rgba(245,176,65,0.35)' }}>by Freakin Studio</span>
          </div>
          <p className="text-xs" style={{ color: 'rgba(240,246,255,0.25)' }}>
            {`© 2025 Freakin BI — Freakin Business Intelligence`}
          </p>
          <div className="flex gap-5 text-xs" style={{ color: 'rgba(240,246,255,0.4)' }}>
            <Link to="/pricing" className="hover:text-[#F5B041] transition-colors">{lang === 'bn' ? 'মূল্য' : 'Pricing'}</Link>
            <Link to="/login"   className="hover:text-[#F5B041] transition-colors">{lang === 'bn' ? 'লগইন' : 'Login'}</Link>
            <Link to="/register" className="hover:text-[#F5B041] transition-colors">{lang === 'bn' ? 'রেজিস্ট্রেশন' : 'Register'}</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
