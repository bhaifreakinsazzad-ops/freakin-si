import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
// DESIGN.md source of truth applied — see brand.ts, gates.ts, disclaimers.ts

/* ══════════════════════════════════════════════════════
   DESIGN TOKENS
══════════════════════════════════════════════════════ */
// DESIGN.md §6 — Color tokens
const T = {
  red:      '#b5121b',   // --bs-red
  redDeep:  '#7f0b12',   // --bs-red-deep
  redBright:'#ef233c',   // --bs-red-bright
  redGlow:  'rgba(239,35,60,0.32)',
  gold:     '#c9a449',   // --bs-gold
  goldSoft: '#e0c878',   // --bs-gold-soft
  silver:   '#c9c9c9',   // --bs-silver
  steel:    '#8f9299',   // --bs-steel
  ivory:    '#f5f0e8',   // --bs-ivory
  ink:      '#050505',   // --bs-black
  ink2:     '#08080b',   // --bs-void
  panel:    '#17171d',   // --bs-panel
  bone:     '#f5f0e8',
  dim:      '#8f9299',
  lineDark: 'rgba(255,255,255,0.12)',
  lineLight:'rgba(10,10,10,0.12)',
  // DESIGN.md §7 — Typography
  H: "'Playfair Display','Sora',serif",       // Premium serif headings
  M: "'Montserrat','Space Grotesk',sans-serif", // Display labels/buttons
  B: "'Inter','Manrope',sans-serif",            // Body
}

/* ══════════════════════════════════════════════════════
   RESPONSIVE CSS
══════════════════════════════════════════════════════ */
const RESPONSIVE_CSS = `
  .dtg-nav-links { display: flex; }
  .dtg-nav-cta { display: block; }
  .dtg-hero-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; }
  .dtg-gates-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
  .dtg-wwd-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
  .dtg-founder-grid { display: grid; grid-template-columns: 360px 1fr; gap: 80px; align-items: center; }
  .dtg-manifesto-grid { display: grid; grid-template-columns: 1fr 1fr; min-height: 600px; }
  .dtg-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 56px; }
  .dtg-community-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; max-width: 700px; margin: 0 auto; text-align: left; }
  .dtg-apply-cta-bar { display: none; }
  .dtg-ticker { display: flex; }
  @media (max-width: 1100px) {
    .dtg-gates-grid { grid-template-columns: repeat(2,1fr); }
  }
  @media (max-width: 900px) {
    .dtg-nav-links { display: none; }
    .dtg-wwd-grid { grid-template-columns: repeat(2,1fr); }
    .dtg-founder-grid { grid-template-columns: 1fr; gap: 48px; text-align: center; }
    .dtg-manifesto-grid { grid-template-columns: 1fr; }
    .dtg-footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
    .dtg-manifesto-content { padding: 64px 32px !important; }
  }
  @media (max-width: 600px) {
    .dtg-gates-grid { grid-template-columns: 1fr; }
    .dtg-wwd-grid { grid-template-columns: 1fr; }
    .dtg-footer-grid { grid-template-columns: 1fr; }
    .dtg-community-grid { grid-template-columns: 1fr; }
    .dtg-hero-actions { flex-direction: column; align-items: stretch; }
    .dtg-hero-actions a { justify-content: center; }
    .dtg-nav-cta { display: none; }
    .dtg-apply-cta-bar { display: flex; }
    .dtg-scholarship-box { padding: 36px 20px !important; }
    .dtg-apply-box { padding: 48px 24px !important; }
  }
  @keyframes dtg-ticker-scroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes dtg-fade-up {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes dtg-pulse-red {
    0%, 100% { box-shadow: 0 0 0 0 rgba(200,16,46,0.4); }
    50%       { box-shadow: 0 0 0 10px rgba(200,16,46,0); }
  }
  @keyframes dtg-quiz-in {
    from { opacity: 0; transform: scale(0.96) translateY(16px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes dtg-slide-up {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }
  /* DESIGN.md §10.2 — Primary Button: red gradient, gold border, pill */
  .dtg-btn-red {
    display: inline-flex; align-items: center; gap: 12px;
    background: linear-gradient(135deg, #ef233c 0%, #b5121b 45%, #050505 100%);
    border: 1px solid rgba(201,164,73,0.55);
    box-shadow: 0 0 32px rgba(239,35,60,0.24);
    border-radius: 999px;
    color: #fff; padding: 20px 44px;
    font-family: 'Montserrat',sans-serif;
    font-size: 13px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.12em; text-decoration: none;
    cursor: pointer; transition: all 220ms ease; position: relative;
  }
  .dtg-btn-red:hover {
    box-shadow: 0 0 48px rgba(239,35,60,0.42);
    border-color: rgba(201,164,73,0.85);
    transform: translateY(-2px);
  }
  /* DESIGN.md §10.2 — Secondary Button: charcoal transparent */
  .dtg-btn-outline-white {
    display: inline-flex; align-items: center; gap: 12px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.22);
    border-radius: 999px; color: #f5f0e8;
    padding: 20px 44px; font-family: 'Montserrat',sans-serif;
    font-size: 13px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.12em; text-decoration: none; cursor: pointer; transition: all 220ms ease;
  }
  .dtg-btn-outline-white:hover { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.42); transform: translateY(-1px); }
`

/* ══════════════════════════════════════════════════════
   SWASH UNDERLINE
══════════════════════════════════════════════════════ */
function Swash({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ position:'relative', display:'inline-block', whiteSpace:'nowrap' }}>
      {children}
      <svg viewBox="0 0 300 14" xmlns="http://www.w3.org/2000/svg"
        style={{ position:'absolute', left:'-4%', bottom:'-8px', width:'108%', height:'14px', pointerEvents:'none', overflow:'visible' }}>
        <path d="M2 8 Q 40 2, 80 6 T 160 5 T 240 7 T 298 4" stroke={T.red} strokeWidth="3" fill="none" strokeLinecap="round"/>
      </svg>
    </span>
  )
}

/* ══════════════════════════════════════════════════════
   FADE SECTION (scroll-triggered)
══════════════════════════════════════════════════════ */
function FadeSection({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)' }
    }, { threshold: 0.08 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={className}
      style={{ opacity:0, transform:'translateY(28px)', transition:'opacity 0.9s cubic-bezier(.22,1,.36,1), transform 0.9s cubic-bezier(.22,1,.36,1)', ...style }}>
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   SECTION LABEL
══════════════════════════════════════════════════════ */
function Label({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:10, fontFamily:T.H, fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.24em', color: dark ? T.red : T.dim, marginBottom:20 }}>
      <span style={{ width:6, height:6, background:T.red, borderRadius:'50%', display:'inline-block', flexShrink:0 }} />
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   SOCIAL PROOF TICKER
══════════════════════════════════════════════════════ */
const TICKER_ITEMS = [
  '🖤 Darius R. from Chicago just applied',
  '⚡ Montoiya W. received her Platinum Blueprint™',
  '🔥 14 Black Sheep joined this week',
  '💰 $250K funding pathway opened for Antione T.',
  '🏆 Kristian enrolled in Silver Gate today',
  '📋 Marcus B. received his Custom Blueprint',
  '🚀 Only 3 spots remaining this month',
  '✅ Elevated Minds™ Inc. officially launched',
  '🖤 Shanice R. started her Vision Call',
  '⚡ New cohort forming — limited seats',
]

function SocialProofTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div style={{ background:'#000', borderBottom:`1px solid rgba(200,16,46,0.25)`, overflow:'hidden', padding:'10px 0' }}>
      <div style={{ display:'flex', animation:'dtg-ticker-scroll 40s linear infinite', width:'max-content' }}>
        {items.map((item, i) => (
          <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:8, fontFamily:T.H, fontSize:12, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.12em', color:'rgba(255,255,255,0.75)', whiteSpace:'nowrap', padding:'0 40px' }}>
            {item}
            <span style={{ color:T.red, marginLeft:8, opacity:0.5 }}>•</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   BLACK SHEEP QUIZ (Lead Capture + Qualification)
══════════════════════════════════════════════════════ */
const QUIZ_STEPS = [
  {
    q: 'Where are you right now?',
    sub: 'Be honest. This helps us find your exact gate.',
    options: [
      { label: 'Survival mode — just getting by', icon: '🔥', value: 'survival' },
      { label: 'Hustling hard but stuck in circles', icon: '🔄', value: 'stuck' },
      { label: 'Have a vision — no structure yet', icon: '💡', value: 'vision' },
      { label: 'Building — need capital & direction', icon: '🚀', value: 'building' },
    ],
  },
  {
    q: "What's your biggest blocker?",
    sub: "We've seen it all. Pick what hits closest.",
    options: [
      { label: "No structure — it's all in my head", icon: '🧠', value: 'structure' },
      { label: "No funding — can't access capital", icon: '💰', value: 'funding' },
      { label: "No direction — don't know where to start", icon: '🧭', value: 'direction' },
      { label: 'All of the above — I need everything', icon: '🖤', value: 'all' },
    ],
  },
  {
    q: "What's your #1 goal in 12 months?",
    sub: 'Your answer determines your gate.',
    options: [
      { label: 'Own a real, legitimate business', icon: '🏢', value: 'business' },
      { label: 'Access real funding ($50K–$250K)', icon: '💳', value: 'funding' },
      { label: 'Build a legacy for my family', icon: '👑', value: 'legacy' },
      { label: 'Get off survival mode — for good', icon: '✊', value: 'freedom' },
    ],
  },
]

function getGateRecommendation(answers: string[]): { gate: string; price: string; desc: string; cta: string } {
  if (answers.includes('building') || answers[1] === 'funding') {
    return { gate:'Gold Gate', price:'$4,497', desc:"You're ready to move. You need strategic guidance, credit access, and a real growth plan.", cta:'Enter Gold Gate' }
  }
  if (answers[0] === 'vision' || answers.includes('all')) {
    return { gate:'Silver Gate', price:'$3,497', desc:"You have the vision. Now you need the structure, corporate setup, and funding pathway.", cta:'Enter Silver Gate' }
  }
  return { gate:'Black Sheep Executive Blueprint', price:'$499', desc:"Start here. Clarity before capital. Get your custom blueprint and income path first.", cta:'Get The Blueprint' }
}

function BlackSheepQuiz({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0) // 0=intro, 1-3=questions, 4=capture, 5=result
  const [answers, setAnswers] = useState<string[]>([])
  const [selected, setSelected] = useState<string|null>(null)
  const [form, setForm] = useState({ name:'', email:'', phone:'' })
  const [formError, setFormError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const rec = getGateRecommendation(answers)
  const totalSteps = QUIZ_STEPS.length

  const handleOption = (val: string) => {
    setSelected(val)
    setTimeout(() => {
      const newAnswers = [...answers, val]
      setAnswers(newAnswers)
      setSelected(null)
      if (step < totalSteps) setStep(step + 1)
      else setStep(4) // go to capture
    }, 350)
  }

  const handleCapture = () => {
    if (!form.name.trim() || !form.email.trim()) { setFormError('Name and email are required.'); return }
    if (!/\S+@\S+\.\S+/.test(form.email)) { setFormError('Please enter a valid email.'); return }
    setFormError('')
    setSubmitted(true)
    setStep(5)
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.82)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background:'#111', border:`1px solid rgba(200,16,46,0.3)`, maxWidth:620, width:'100%', position:'relative', animation:'dtg-quiz-in 0.4s cubic-bezier(.22,1,.36,1) both', maxHeight:'90vh', overflowY:'auto' }}>
        {/* Red top bar */}
        <div style={{ height:4, background:T.red, width:'100%' }} />
        {/* Close */}
        <button onClick={onClose} style={{ position:'absolute', top:16, right:20, background:'none', border:'none', color:'rgba(255,255,255,0.5)', fontSize:24, cursor:'pointer', lineHeight:1, zIndex:2 }} aria-label="Close">×</button>

        {/* INTRO */}
        {step === 0 && (
          <div style={{ padding:'48px 48px 40px', textAlign:'center' }}>
            <div style={{ display:'inline-block', background:'rgba(200,16,46,0.1)', border:'1px solid rgba(200,16,46,0.25)', padding:'6px 16px', fontFamily:T.H, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.2em', color:T.red, marginBottom:24 }}>
              60-Second Assessment
            </div>
            <h2 style={{ fontFamily:T.H, fontSize:'clamp(24px,4vw,36px)', fontWeight:900, color:'#fff', marginBottom:16, lineHeight:1.1 }}>
              Discover Your<br /><Swash>Black Sheep Score</Swash>
            </h2>
            <p style={{ fontSize:17, color:'rgba(255,255,255,0.65)', lineHeight:1.65, marginBottom:32, maxWidth:440, margin:'0 auto 32px' }}>
              Answer 3 quick questions. We'll identify exactly which gate fits you and your next step to exit survival mode.
            </p>
            <button onClick={() => setStep(1)} style={{ display:'inline-flex', alignItems:'center', gap:12, background:T.red, color:'#fff', padding:'18px 44px', fontFamily:T.H, fontSize:14, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.14em', border:'none', cursor:'pointer', transition:'background 0.3s', animation:'dtg-pulse-red 2s infinite' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background=T.redDeep }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background=T.red }}>
              Find My Gate →
            </button>
            <div style={{ marginTop:20, display:'flex', justifyContent:'center', gap:24, fontFamily:T.H, fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.12em', color:'rgba(255,255,255,0.35)' }}>
              <span>Free</span><span>•</span><span>60 seconds</span><span>•</span><span>No fluff</span>
            </div>
          </div>
        )}

        {/* QUESTIONS 1–3 */}
        {step >= 1 && step <= totalSteps && (
          <div style={{ padding:'40px 40px 36px' }}>
            {/* Progress */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} style={{ flex:1, height:3, background: i < step ? T.red : 'rgba(255,255,255,0.1)', transition:'background 0.4s', borderRadius:2 }} />
              ))}
              <span style={{ fontFamily:T.H, fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.12em', whiteSpace:'nowrap' }}>{step}/{totalSteps}</span>
            </div>
            <div style={{ fontFamily:T.H, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.2em', color:T.red, marginBottom:12 }}>Question {step}</div>
            <h3 style={{ fontFamily:T.H, fontSize:'clamp(20px,3vw,28px)', fontWeight:800, color:'#fff', marginBottom:8, lineHeight:1.2 }}>
              {QUIZ_STEPS[step-1].q}
            </h3>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.5)', marginBottom:28 }}>{QUIZ_STEPS[step-1].sub}</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {QUIZ_STEPS[step-1].options.map(opt => (
                <button key={opt.value} onClick={() => handleOption(opt.value)}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'16px 20px', background: selected===opt.value ? T.red : 'rgba(255,255,255,0.04)', border:`1px solid ${selected===opt.value ? T.red : 'rgba(255,255,255,0.1)'}`, color: selected===opt.value ? '#fff' : 'rgba(255,255,255,0.8)', fontFamily:T.H, fontSize:14, fontWeight:600, cursor:'pointer', transition:'all 0.25s', textAlign:'left', borderRadius:2 }}
                  onMouseEnter={e => { if (selected !== opt.value) { const el=e.currentTarget as HTMLButtonElement; el.style.borderColor='rgba(200,16,46,0.5)'; el.style.background='rgba(200,16,46,0.06)' } }}
                  onMouseLeave={e => { if (selected !== opt.value) { const el=e.currentTarget as HTMLButtonElement; el.style.borderColor='rgba(255,255,255,0.1)'; el.style.background='rgba(255,255,255,0.04)' } }}>
                  <span style={{ fontSize:22, flexShrink:0 }}>{opt.icon}</span>
                  <span style={{ lineHeight:1.35 }}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CAPTURE */}
        {step === 4 && (
          <div style={{ padding:'40px 40px 36px' }}>
            <div style={{ fontFamily:T.H, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.2em', color:T.red, marginBottom:12 }}>Almost There</div>
            <h3 style={{ fontFamily:T.H, fontSize:'clamp(20px,3vw,26px)', fontWeight:800, color:'#fff', marginBottom:8 }}>
              Where should we send your results?
            </h3>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.5)', marginBottom:28 }}>We'll show you your gate recommendation and how to claim your spot.</p>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <input placeholder="Your First Name *" value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))}
                style={{ padding:'14px 18px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.15)', color:'#fff', fontFamily:T.B, fontSize:15, outline:'none', borderRadius:2, transition:'border-color 0.3s' }}
                onFocus={e => { (e.currentTarget as HTMLInputElement).style.borderColor = T.red }}
                onBlur={e => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.15)' }} />
              <input placeholder="Your Email Address *" type="email" value={form.email} onChange={e => setForm(f => ({...f, email:e.target.value}))}
                style={{ padding:'14px 18px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.15)', color:'#fff', fontFamily:T.B, fontSize:15, outline:'none', borderRadius:2, transition:'border-color 0.3s' }}
                onFocus={e => { (e.currentTarget as HTMLInputElement).style.borderColor = T.red }}
                onBlur={e => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.15)' }} />
              <input placeholder="Phone Number (optional)" type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone:e.target.value}))}
                style={{ padding:'14px 18px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.15)', color:'#fff', fontFamily:T.B, fontSize:15, outline:'none', borderRadius:2, transition:'border-color 0.3s' }}
                onFocus={e => { (e.currentTarget as HTMLInputElement).style.borderColor = T.red }}
                onBlur={e => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.15)' }} />
              {formError && <p style={{ color:'#ef4444', fontSize:13, margin:0 }}>{formError}</p>}
              <button onClick={handleCapture}
                style={{ padding:'18px', background:T.red, color:'#fff', fontFamily:T.H, fontSize:14, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.14em', border:'none', cursor:'pointer', transition:'background 0.3s', marginTop:4 }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background=T.redDeep }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background=T.red }}>
                Reveal My Gate →
              </button>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.3)', textAlign:'center', margin:0 }}>No spam. No games. Just your path.</p>
            </div>
          </div>
        )}

        {/* RESULT */}
        {step === 5 && (
          <div style={{ padding:'40px 40px 36px', textAlign:'center' }}>
            <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:72, height:72, background:'rgba(200,16,46,0.1)', border:`2px solid ${T.red}`, borderRadius:'50%', margin:'0 auto 24px', fontSize:32 }}>🖤</div>
            <div style={{ fontFamily:T.H, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.2em', color:T.red, marginBottom:12 }}>Your Gate Is Confirmed</div>
            <h3 style={{ fontFamily:T.H, fontSize:'clamp(22px,3vw,30px)', fontWeight:900, color:'#fff', marginBottom:8, lineHeight:1.1 }}>
              {submitted ? `Welcome, ${form.name.split(' ')[0]}.` : 'Here is your result.'}
            </h3>
            <div style={{ background:'rgba(200,16,46,0.06)', border:'1px solid rgba(200,16,46,0.25)', padding:'28px 32px', margin:'24px 0', textAlign:'left' }}>
              <div style={{ fontFamily:T.H, fontSize:13, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.16em', color:T.red, marginBottom:8 }}>Recommended Gate</div>
              <div style={{ fontFamily:T.H, fontSize:24, fontWeight:900, color:'#fff', marginBottom:8 }}>{rec.gate}</div>
              <div style={{ fontFamily:T.H, fontSize:20, fontWeight:700, color:'rgba(255,255,255,0.6)', marginBottom:16 }}>{rec.price}</div>
              <p style={{ fontSize:16, color:'rgba(255,255,255,0.7)', lineHeight:1.6, margin:0 }}>{rec.desc}</p>
            </div>
            <a href="#dtg-apply" onClick={onClose}
              style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, background:T.red, color:'#fff', padding:'20px', fontFamily:T.H, fontSize:14, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.14em', textDecoration:'none', transition:'background 0.3s', marginBottom:16 }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background=T.redDeep }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background=T.red }}>
              {rec.cta} — Book Your Vision Call
              <svg viewBox="0 0 18 12" fill="none" style={{ width:18, height:12 }}><path d="M1 6H17M17 6L12 1M17 6L12 11" stroke="currentColor" strokeWidth="1.8"/></svg>
            </a>
            <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', fontSize:13, cursor:'pointer', fontFamily:T.H }}>Maybe later</button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   STICKY BOTTOM CTA BAR
══════════════════════════════════════════════════════ */
function StickyApplyCTA({ onQuizOpen }: { onQuizOpen: () => void }) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handler = () => { setVisible(window.scrollY > 500) }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (!visible || dismissed) return null
  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:998, background:'rgba(5,5,5,0.97)', backdropFilter:'blur(20px)', borderTop:`1px solid rgba(181,18,27,0.50)`, padding:'14px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, animation:'dtg-slide-up 0.4s cubic-bezier(.22,1,.36,1)' }}>
      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
        <span style={{ fontFamily:T.H, fontWeight:700, fontSize:14, color:T.ivory, fontStyle:'italic' }}>Survival mode is over.</span>
        <span style={{ fontFamily:T.M, fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.14em', color:T.steel }}>Strategy · Freedom · Legacy</span>
      </div>
      <div style={{ display:'flex', gap:10, alignItems:'center', flexShrink:0 }}>
        <button onClick={onQuizOpen}
          style={{ padding:'10px 20px', background:'transparent', border:`1px solid rgba(201,201,201,0.22)`, color:'rgba(255,255,255,0.7)', fontFamily:T.M, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.10em', cursor:'pointer', borderRadius:999, transition:'all 220ms' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor='rgba(201,201,201,0.50)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor='rgba(201,201,201,0.22)' }}>
          Find My Gate
        </button>
        <Link to="/apply"
          style={{ padding:'12px 24px', background:'linear-gradient(135deg,#ef233c,#b5121b)', color:'#fff', fontFamily:T.M, fontSize:12, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.10em', textDecoration:'none', borderRadius:999, border:'1px solid rgba(201,164,73,0.45)', transition:'all 220ms' }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow='0 0 24px rgba(239,35,60,0.35)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow='none' }}>
          Uncover My Gold →
        </Link>
        <button onClick={() => setDismissed(true)}
          style={{ background:'none', border:'none', color:'rgba(255,255,255,0.3)', fontSize:20, cursor:'pointer', padding:'4px 8px', lineHeight:1 }} aria-label="Dismiss">×</button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   EXIT INTENT HOOK
══════════════════════════════════════════════════════ */
function useExitIntent(callback: () => void) {
  const fired = useRef(false)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 10 && !fired.current) {
        fired.current = true
        setTimeout(callback, 300)
      }
    }
    document.addEventListener('mouseleave', handler)
    return () => document.removeEventListener('mouseleave', handler)
  }, [callback])
}

/* ══════════════════════════════════════════════════════
   MAIN LANDING PAGE
══════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [quizOpen, setQuizOpen] = useState(false)
  const [gateHover, setGateHover] = useState<number|null>(null)
  const openQuiz = useCallback(() => setQuizOpen(true), [])

  // Exit intent → quiz
  useExitIntent(openQuiz)

  // Auto-open quiz after 45s of being on page
  useEffect(() => {
    const t = setTimeout(() => setQuizOpen(true), 45000)
    return () => clearTimeout(t)
  }, [])

  const gates = [
    { icon:'🖤', name:'Black Sheep Executive Blueprint', tagline:'Where hidden vision becomes a real company.', featured:true, strike:'$1,497', amount:'$499', plan:'Or 2 Payments of $299', items:['Private 1-on-1 Vision Extraction','Deep Strategy Session','Custom Black Sheep Executive Blueprint','Clear Business Layout of Your Vision','Income Path Strategy','Offer + Brand Direction','30-Day Execution Roadmap','Kingdom Training Zoom Calls (Wed & Sun)'], best:'Best for: Those who need clarity before capital.', cta:'Get The Blueprint' },
    { icon:'🥈', name:'Silver Gate', tagline:'For the builder ready to move now.', featured:false, amount:'$3,497', plan:'Or 2 Payments of $1,997', items:['Everything in Executive Blueprint','Corporate structure for funding','EIN setup support','Business Credit DIY Portal','Fundability DIY Portal','D&B Mentoring','Tax, Accounting & Bookkeeping Resources','Kingdom Alignment Mentorship'], best:'Up to $250K funding · 3–12 months · Guaranteed or money back', cta:'Enter Silver Gate' },
    { icon:'🥇', name:'Gold Gate', tagline:'For the builder who values guidance and speed.', featured:false, amount:'$4,497', plan:'Or 2 Payments of $2,497', items:['Everything in Silver Gate','Private Strategic Guidance','12 Months Business Credit Consulting','12 Months Funding Mentorship','12 Months Premium Growth Strategy','Done-With-You Momentum Help','Priority Direction Access','Member Portal Access'], best:'Up to $250K funding · 3–12 months · Guaranteed or money back', cta:'Enter Gold Gate' },
    { icon:'👑', name:'Platinum Gate', tagline:'For the serious builder creating something significant.', featured:false, amount:'$9,497', plan:'Or 2 Payments of $5,297', items:['Everything in Gold Gate','Private Consulting Support','Website for Your Business','CRM + Automation Setup','AI Business Systems Support','Mobile App for Your Business','12 Months Funding Mentorship','Ongoing Technical Support'], best:'Up to $250K funding · 3–12 months · Guaranteed or money back', cta:'Enter Platinum Gate' },
  ]

  return (
    <>
      <style>{RESPONSIVE_CSS}</style>

      {/* QUIZ MODAL */}
      {quizOpen && <BlackSheepQuiz onClose={() => setQuizOpen(false)} />}

      {/* STICKY BOTTOM CTA */}
      <StickyApplyCTA onQuizOpen={openQuiz} />

      <div style={{ background:T.ink, color:'#fff', fontFamily:T.B, fontSize:18, lineHeight:1.65, WebkitFontSmoothing:'antialiased', overflowX:'hidden' }}>

        {/* ══ SOCIAL PROOF TICKER ══ */}
        <SocialProofTicker />

        {/* ══ NAV — DESIGN.md §10.1 ══ */}
        <nav style={{ position:'sticky', top:0, zIndex:100, padding:'14px 40px', display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(5,5,5,0.95)', backdropFilter:'blur(20px)', borderBottom:`1px solid rgba(201,201,201,0.12)` }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'rgba(181,18,27,0.15)', border:'1px solid rgba(181,18,27,0.30)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontFamily:T.M, fontWeight:900, fontSize:13, color:T.red }}>BS</span>
            </div>
            <div>
              <div style={{ fontFamily:T.M, fontWeight:800, fontSize:13, color:T.red, letterSpacing:'0.08em', textTransform:'uppercase', lineHeight:1 }}>Black Sheep</div>
              <div style={{ fontSize:9, color:T.steel, letterSpacing:'0.12em', textTransform:'uppercase' }}>Divorcing The Game™</div>
            </div>
          </div>
          {/* DESIGN.md §10.1 Landing nav */}
          <div className="dtg-nav-links" style={{ gap:28, fontFamily:T.M, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.10em' }}>
            {[['Movement','#dtg-about'],['The Gates','#dtg-offer'],['Apply','/apply'],['Login','/login']].map(([lbl,href]) => (
              href.startsWith('/') ?
                <Link key={lbl} to={href} style={{ color:'rgba(255,255,255,0.65)', textDecoration:'none', transition:'color 220ms' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color=T.goldSoft }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color='rgba(255,255,255,0.65)' }}>
                  {lbl}
                </Link>
              :
                <a key={lbl} href={href} style={{ color:'rgba(255,255,255,0.65)', textDecoration:'none', transition:'color 220ms' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color=T.goldSoft }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color='rgba(255,255,255,0.65)' }}>
                  {lbl}
                </a>
            ))}
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <button onClick={openQuiz}
              style={{ padding:'9px 18px', background:'transparent', border:`1px solid rgba(201,164,73,0.35)`, color:T.gold, fontFamily:T.M, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.10em', cursor:'pointer', borderRadius:999, transition:'all 220ms' }}
              onMouseEnter={e => { const el=e.currentTarget as HTMLButtonElement; el.style.background='rgba(201,164,73,0.12)'; el.style.borderColor='rgba(201,164,73,0.65)' }}
              onMouseLeave={e => { const el=e.currentTarget as HTMLButtonElement; el.style.background='transparent'; el.style.borderColor='rgba(201,164,73,0.35)' }}>
              Find My Gate
            </button>
            <Link to="/apply" className="dtg-nav-cta"
              style={{ background:'linear-gradient(135deg,#ef233c,#b5121b)', color:'#fff', padding:'10px 22px', fontFamily:T.M, fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.10em', textDecoration:'none', borderRadius:999, border:'1px solid rgba(201,164,73,0.40)', transition:'all 220ms' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow='0 0 24px rgba(239,35,60,0.35)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow='none' }}>
              Uncover My Gold
            </Link>
          </div>
        </nav>

        {/* ══ URGENCY BAR ══ */}
        <div style={{ background:'rgba(181,18,27,0.10)', borderBottom:`1px solid rgba(181,18,27,0.22)`, padding:'10px 24px', textAlign:'center', fontFamily:T.M, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.18em', color:T.red }}>
          🔥 &nbsp;New cohort forming now — <span style={{ color:'#fff', fontWeight:900 }}>limited applications accepted</span> &nbsp;·&nbsp; <Link to="/apply" style={{ color:T.goldSoft, textDecoration:'underline' }}>Apply as a Founder →</Link>
        </div>

        {/* ══ HERO ══ */}
        <section style={{ minHeight:'90vh', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'120px 24px 100px', overflow:'hidden', background:T.ink }}>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(10,10,10,0.78)0%,rgba(10,10,10,0.55)40%,rgba(10,10,10,0.9)100%)', zIndex:2 }} />
          <div style={{ position:'absolute', inset:0, zIndex:1, backgroundImage:"url('https://assets.cdn.filesafe.space/JSFItdgeUTehgA826XWZ/media/69dd5db2328c56e1a04494c0.jpg')", backgroundSize:'cover', backgroundPosition:'center' }} />
          <div style={{ position:'absolute', inset:0, zIndex:2, background:'radial-gradient(ellipse 50% 40% at 50% 60%, rgba(200,16,46,0.07) 0%, transparent 60%)', pointerEvents:'none' }} />
          <div style={{ position:'relative', zIndex:3, maxWidth:900, margin:'0 auto' }}>
            {/* DESIGN.md §10.4 Badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(181,18,27,0.10)', border:'1px solid rgba(201,164,73,0.30)', color:'#e0c878', borderRadius:999, fontSize:11, fontFamily:T.M, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', padding:'6px 18px', marginBottom:32 }}>
              🖤 &nbsp;A Movement, Not A Course &nbsp;·&nbsp; Strategy · Freedom · Legacy
            </div>
            {/* DESIGN.md §11.1 Hero headline */}
            <p style={{ fontFamily:T.M, fontSize:13, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.22em', color:'rgba(255,255,255,0.65)', marginBottom:16 }}>
              Welcome Home, Black Sheep.
            </p>
            <h1 style={{ fontFamily:T.H, fontSize:'clamp(38px,6.5vw,82px)', fontWeight:800, lineHeight:1.06, letterSpacing:'-0.01em', color:'#fff', marginBottom:24 }}>
              Turn buried vision into<br /><Swash>business structure</Swash>,<br />capital pathways, and legacy.
            </h1>
            <p style={{ fontFamily:T.B, fontSize:'clamp(16px,1.8vw,20px)', lineHeight:1.65, color:'rgba(255,255,255,0.75)', maxWidth:640, margin:'0 auto 16px' }}>
              Divorcing The Game™ helps overlooked builders move from survival mode into structure, ownership, and strategy.
            </p>
            <p style={{ fontFamily:T.H, fontSize:'clamp(16px,1.6vw,20px)', fontWeight:700, color:'#fff', fontStyle:'italic', marginBottom:40 }}>
              You are not broken. You are <Swash>buried gold</Swash>.
            </p>
            {/* DESIGN.md §11.1 — Primary CTA: Uncover My Gold */}
            <div className="dtg-hero-actions" style={{ marginBottom:24 }}>
              <Link to="/apply" className="dtg-btn-red">
                Uncover My Gold
                <svg viewBox="0 0 18 12" fill="none" style={{ width:18, height:12 }}><path d="M1 6H17M17 6L12 1M17 6L12 11" stroke="currentColor" strokeWidth="1.8"/></svg>
              </Link>
              <button onClick={openQuiz} className="dtg-btn-outline-white">
                Choose My Gate ✦
              </button>
            </div>
            <div style={{ fontFamily:T.M, fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.20em', color:'rgba(255,255,255,0.45)' }}>
              Built for the overlooked &nbsp;·&nbsp; Made for the Black Sheep
            </div>
          </div>
        </section>

        {/* ══ TRUST STATS — DESIGN.md §11.1 ══ */}
        <section style={{ background:T.panel, padding:'36px 24px', borderBottom:`1px solid rgba(201,164,73,0.15)`, borderTop:`1px solid rgba(201,164,73,0.15)` }}>
          <div style={{ maxWidth:900, margin:'0 auto', display:'flex', justifyContent:'center', gap:'5vw', flexWrap:'wrap' }}>
            {[['500+','Black Sheep Builders'],['$250K','Capital Pathway Access'],['14 Days','To Your Blueprint'],['100%','Satisfaction Guarantee']].map(([num, lbl]) => (
              <div key={lbl} style={{ textAlign:'center', padding:'8px 0' }}>
                <div style={{ fontFamily:T.H, fontSize:'clamp(24px,4vw,42px)', fontWeight:800, color:T.red, lineHeight:1, marginBottom:6 }}>{num}</div>
                <div style={{ fontFamily:T.M, fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.18em', color:T.steel }}>{lbl}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ BLACK SHEEP IF (LIGHT) ══ */}
        <section style={{ padding:'130px 24px', background:T.bone, color:T.ink }}>
          <FadeSection>
            <div style={{ textAlign:'center', maxWidth:820, margin:'0 auto 76px' }}>
              <Label>The Black Sheep Test</Label>
              <h2 style={{ fontFamily:T.H, fontSize:'clamp(32px,5vw,60px)', fontWeight:800, lineHeight:1.08, letterSpacing:'-0.02em', color:T.ink, marginBottom:0 }}>
                You're a <Swash>Black Sheep</Swash> if…
              </h2>
            </div>
            <ul style={{ listStyle:'none', maxWidth:900, margin:'0 auto', padding:0 }}>
              {['You had to survive while others had support.','You learned life the hard way.',"You've been judged by your past but know there's more in you.","You're strong for everybody else but carry your own weight alone.","You've got hustle, ideas, and talent — but no clear structure.","You're tired of surviving and ready to build something real.",'You know you carry greatness, but life hasn\'t matched it yet.'].map((item,i,arr) => (
                <li key={i} style={{ display:'flex', gap:20, alignItems:'baseline', padding:'20px 0', borderBottom: i<arr.length-1 ? `1px dashed ${T.lineLight}` : 'none', fontSize:20, lineHeight:1.55, color:T.ink, transition:'padding-left 0.3s', cursor:'default' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLLIElement).style.paddingLeft='16px' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLLIElement).style.paddingLeft='0' }}>
                  <span style={{ width:8, height:8, background:T.red, borderRadius:'50%', flexShrink:0, marginTop:10, display:'inline-block' }} />
                  {item}
                </li>
              ))}
            </ul>
            <div style={{ textAlign:'center', marginTop:56, fontFamily:T.H, fontSize:'clamp(20px,3vw,32px)', fontWeight:800, color:T.ink }}>
              If this sounds like you… <Swash>welcome home</Swash>.
            </div>
            {/* Bridge text */}
            <div style={{ maxWidth:860, margin:'48px auto 0', padding:'40px 48px', background:'#fff', borderLeft:`4px solid ${T.red}`, boxShadow:'0 8px 40px -16px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize:20, color:'#4a4a4a', lineHeight:1.7, marginBottom:12 }}>
                <strong style={{ color:T.ink, fontSize:22 }}>You're not broken. You're unstructured.</strong>
              </p>
              <p style={{ fontSize:20, color:'#4a4a4a', lineHeight:1.7, margin:0 }}>
                If you've got hustle, pain, ideas, and real life experience but no clear structure to turn it into a business — we help you extract it, build it into a custom blueprint, and position you for funding, growth, and legacy.
              </p>
            </div>
            {/* DESIGN.md §13 — Conversion Flow CTA */}
            <div style={{ textAlign:'center', marginTop:48, display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
              <button onClick={openQuiz} className="dtg-btn-red">
                Find My Gate ✦
              </button>
              <Link to="/apply" className="dtg-btn-outline-white" style={{ color:T.ink, borderColor:T.red }}>
                Apply as a Black Sheep Founder
              </Link>
            </div>
          </FadeSection>
        </section>

        {/* ══ MOTIVATION (DARK) ══ */}
        <section style={{ padding:'130px 24px', background:'#050505', borderTop:`1px solid ${T.lineDark}`, borderBottom:`1px solid ${T.lineDark}` }}>
          <FadeSection>
            <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
              <Label dark>A Truth We Honor</Label>
              <h2 style={{ fontFamily:T.H, fontSize:'clamp(32px,5vw,60px)', fontWeight:900, color:'#fff', marginBottom:48 }}>
                You don't need more <Swash>motivation</Swash>.<br />You need a real path.
              </h2>
              <ul style={{ listStyle:'none', maxWidth:700, margin:'0 auto', padding:0 }}>
                {[<>You don't need another speech.</>,<>You don't need more hype.</>,<>You don't need to keep carrying it alone.</>,<>You need <strong style={{ color:'#fff', fontWeight:800 }}>clarity</strong>.</>,<>You need <strong style={{ color:'#fff', fontWeight:800 }}>structure</strong>.</>,<>You need someone who can see the <strong style={{ color:'#fff', fontWeight:800 }}>gold in you</strong> and help you build with it.</>].map((line,i,arr) => (
                  <li key={i} style={{ fontFamily:T.H, fontSize:'clamp(17px,2.4vw,26px)', fontWeight:600, color:'rgba(255,255,255,0.65)', padding:'16px 0', borderBottom: i<arr.length-1 ? `1px solid ${T.lineDark}` : 'none', lineHeight:1.35 }}>{line}</li>
                ))}
              </ul>
            </div>
          </FadeSection>
        </section>

        {/* ══ WHAT WE DO (LIGHT) ══ */}
        <section style={{ padding:'130px 24px', background:T.bone, color:T.ink }}>
          <FadeSection>
            <div style={{ textAlign:'center', maxWidth:820, margin:'0 auto 76px' }}>
              <Label>What We Do</Label>
              <h2 style={{ fontFamily:T.H, fontSize:'clamp(28px,4.5vw,56px)', fontWeight:800, lineHeight:1.08, letterSpacing:'-0.02em', color:T.ink }}>
                We help Black Sheep turn pain, hustle, and life experience into <Swash>real futures</Swash>.
              </h2>
            </div>
            <div className="dtg-wwd-grid" style={{ maxWidth:1200, margin:'0 auto' }}>
              {[{t:'Real Businesses',d:'Not side hustles. Real, structured businesses you can grow and sustain.'},{t:'Clear Structure',d:'No more chaos. A clear direction you can rely on every single day.'},{t:'Funding Pathways',d:'Access to trusted funding partners and business credit channels.'},{t:'Business Credit',d:'Positioning you to access real credit and real capital for growth.'},{t:'Confidence + Direction',d:'No more guessing. Know exactly what to do and why it matters.'},{t:'Ownership + New Futures',d:"Build something that's yours. A future you designed, not one forced on you."}].map((card,i) => (
                <div key={i} style={{ background:'#fff', border:`1px solid ${T.lineLight}`, padding:'40px 32px', transition:'border-color 0.4s, transform 0.4s, box-shadow 0.4s', cursor:'default' }}
                  onMouseEnter={e => { const el=e.currentTarget as HTMLDivElement; el.style.borderColor=T.red; el.style.transform='translateY(-4px)'; el.style.boxShadow='0 20px 40px -20px rgba(0,0,0,0.12)' }}
                  onMouseLeave={e => { const el=e.currentTarget as HTMLDivElement; el.style.borderColor=T.lineLight; el.style.transform='translateY(0)'; el.style.boxShadow='none' }}>
                  <div style={{ width:44, height:4, background:T.red, marginBottom:24 }} />
                  <h3 style={{ fontFamily:T.H, fontSize:20, fontWeight:800, marginBottom:10, color:T.ink }}>{card.t}</h3>
                  <p style={{ fontSize:16, color:'#4a4a4a', lineHeight:1.65, margin:0 }}>{card.d}</p>
                </div>
              ))}
            </div>
          </FadeSection>
        </section>

        {/* ══ HOW IT WORKS (DARK) ══ */}
        <section style={{ padding:'130px 24px', background:'#050505', borderTop:`1px solid ${T.lineDark}`, borderBottom:`1px solid ${T.lineDark}` }}>
          <FadeSection>
            <div style={{ textAlign:'center', maxWidth:820, margin:'0 auto 76px' }}>
              <Label dark>How It Works</Label>
              <h2 style={{ fontFamily:T.H, fontSize:'clamp(28px,4.5vw,56px)', fontWeight:800, lineHeight:1.08, letterSpacing:'-0.02em', color:'#fff' }}>
                From survival to <Swash>structure</Swash>.
              </h2>
            </div>
            <div style={{ maxWidth:1000, margin:'0 auto' }}>
              {[{n:'1.',t:'Uncover My Gold',d:'Answer a few focused questions and turn your story, skill, pain, or hustle into a structured business direction.'},{n:'2.',t:'Black Sheep Blueprint',d:'You receive a custom Blueprint built around your exact vision — not a template.'},{n:'3.',t:'Choose Your Gate',d:'The platform recommends the right gate for your readiness, resources, and goals.'},{n:'4.',t:'Founder Intake',d:'Submit your Founder Intake or schedule a Vision Call to get your roadmap confirmed.'},{n:'5.',t:'Build Different',d:'Enter the Legacy Dashboard. Structure is yours. No more carrying it alone.'}].map((step,i,arr) => (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'72px 1fr', gap:24, padding:'36px 0', borderBottom: i<arr.length-1 ? `1px solid ${T.lineDark}` : 'none', alignItems:'start', transition:'padding-left 0.3s', cursor:'default' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.paddingLeft='12px' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.paddingLeft='0' }}>
                  <div style={{ fontFamily:T.H, fontSize:44, fontWeight:900, color:T.red, lineHeight:1 }}>{step.n}</div>
                  <div>
                    <h3 style={{ fontFamily:T.H, fontSize:'clamp(20px,2.6vw,30px)', fontWeight:800, color:'#fff', marginBottom:8 }}>{step.t}</h3>
                    <p style={{ fontSize:17, color:'rgba(255,255,255,0.65)', margin:0 }}>{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeSection>
        </section>

        {/* ══ MEET THE FOUNDER (LIGHT) ══ */}
        <section id="dtg-about" style={{ padding:'130px 24px', background:T.bone, color:T.ink }}>
          <FadeSection>
            <div className="dtg-founder-grid" style={{ maxWidth:1200, margin:'0 auto' }}>
              <div style={{ aspectRatio:'4/5', position:'relative', overflow:'hidden', border:`1px solid ${T.lineLight}`, boxShadow:'0 30px 60px -30px rgba(0,0,0,0.25)', background:'#0a0a0a', maxWidth:400 }}>
                <img src="https://assets.cdn.filesafe.space/JSFItdgeUTehgA826XWZ/media/69de2508190683601a06c609.jpeg" alt="Ashley IsReal Thomas"
                  style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', filter:'grayscale(15%) contrast(1.05)' }} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,transparent 40%,rgba(10,10,10,0.85) 100%)', zIndex:2 }} />
                <div style={{ position:'absolute', top:20, left:20, width:40, height:40, borderTop:`2px solid ${T.red}`, borderLeft:`2px solid ${T.red}`, zIndex:3 }} />
                <div style={{ position:'absolute', bottom:20, left:20, right:20, padding:'14px 18px', background:'rgba(10,10,10,0.85)', backdropFilter:'blur(6px)', border:`1px solid ${T.lineDark}`, display:'flex', justifyContent:'space-between', alignItems:'center', fontFamily:T.H, fontSize:10, textTransform:'uppercase', letterSpacing:'0.15em', zIndex:4, color:'#fff' }}>
                  <span>Ashley "IsReal" Thomas</span><span style={{ opacity:0.55 }}>Founder</span>
                </div>
              </div>
              <div>
                <Label>Meet The Founder</Label>
                <h2 style={{ fontFamily:T.H, fontSize:'clamp(28px,4vw,50px)', fontWeight:800, marginBottom:12, color:T.ink }}>Ashley <Swash>"IsReal" Thomas</Swash></h2>
                <div style={{ fontFamily:T.H, fontSize:12, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.18em', color:T.dim, marginBottom:28 }}>Founder, Author &amp; Visionary of Divorcing the Game™</div>
                {['Ashley "IsReal" Thomas is a Black Sheep who made it through the gate, came back with the key, and now opens doors for others.','She built Divorcing the Game™ for the overlooked, the misread, and the ones carrying hidden gold the world never knew how to recognize.','Now she helps Black Sheep uncover the gold inside them and turn it into real businesses, real structure, and funded futures.'].map((p,i) => (
                  <p key={i} style={{ color:'#4a4a4a', marginBottom:20, fontSize:17, lineHeight:1.65 }}>{p}</p>
                ))}
                <a href="https://www.amazon.com/dp/0578369311" target="_blank" rel="noopener noreferrer"
                  style={{ display:'inline-flex', alignItems:'center', gap:10, fontFamily:T.H, fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.14em', color:T.red, textDecoration:'none', borderBottom:`1px solid ${T.red}`, paddingBottom:4 }}>
                  Get Her Book on Amazon →
                </a>
              </div>
            </div>
          </FadeSection>
        </section>

        {/* ══ MANIFESTO / QUOTE ══ */}
        <section style={{ background:T.bone, overflow:'hidden', borderTop:`1px solid ${T.lineLight}`, borderBottom:`1px solid ${T.lineLight}` }}>
          <div className="dtg-manifesto-grid">
            <div style={{ position:'relative', overflow:'hidden', background:'#0a0a0a', minHeight:440 }}>
              <img src="https://assets.cdn.filesafe.space/JSFItdgeUTehgA826XWZ/media/69de253580b446d0fb59331a.jpeg" alt="Ashley IsReal Thomas"
                style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }} />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(10,10,10,0.25)0%,transparent 50%,rgba(200,16,46,0.12)100%)', zIndex:2 }} />
              <div style={{ position:'absolute', bottom:30, right:30, width:60, height:60, borderBottom:`2px solid ${T.red}`, borderRight:`2px solid ${T.red}`, zIndex:3 }} />
            </div>
            <div className="dtg-manifesto-content" style={{ padding:'100px 80px', display:'flex', flexDirection:'column', justifyContent:'center', background:T.bone }}>
              <span style={{ fontFamily:T.H, fontSize:100, fontWeight:900, lineHeight:0.6, color:T.red, marginBottom:16, display:'block' }}>"</span>
              <blockquote style={{ fontFamily:T.H, fontSize:'clamp(20px,2.4vw,32px)', fontWeight:700, lineHeight:1.25, letterSpacing:'-0.015em', color:T.ink, marginBottom:32 }}>
                Your vision is not a dream. It is the <Swash>business</Swash>. It's just unorganized.
                <em style={{ fontStyle:'normal', color:T.ink, opacity:0.55, display:'block', marginTop:8 }}>That's why you feel stuck — and that's exactly what we fix.</em>
              </blockquote>
              <div style={{ display:'flex', alignItems:'center', gap:16, paddingTop:24, borderTop:`1px solid ${T.lineLight}` }}>
                <div style={{ width:32, height:2, background:T.red, flexShrink:0 }} />
                <div style={{ fontFamily:T.H, fontSize:13, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', color:T.ink }}>
                  Ashley "IsReal" Thomas
                  <span style={{ display:'block', fontSize:11, fontWeight:500, color:T.dim, marginTop:4, letterSpacing:'0.14em' }}>Founder · Divorcing The Game</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ TESTIMONIAL (LIGHT) ══ */}
        <section style={{ padding:'130px 24px', background:T.bone, borderTop:`1px solid ${T.lineLight}`, borderBottom:`1px solid ${T.lineLight}` }}>
          <FadeSection>
            <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
              <Label>Real Results</Label>
              <span style={{ fontFamily:T.H, fontSize:100, fontWeight:900, lineHeight:0.5, color:T.red, display:'block', marginBottom:24, opacity:0.2 }}>"</span>
              <blockquote style={{ fontFamily:T.B, fontSize:'clamp(18px,2.2vw,24px)', fontWeight:400, lineHeight:1.65, color:T.ink, fontStyle:'italic', marginBottom:36, maxWidth:800, marginLeft:'auto', marginRight:'auto' }}>
                Before receiving my Black Sheep Platinum Blueprint™, my vision felt like it was just sitting in my head. Seeing it brought to life on paper made me feel seen and heard for the first time, like my story finally had a voice and my vision was real. It gave me clarity, direction, and relief — and now knowing the money door is open that provides me up to $250,000 in funding made me feel ready to build.
              </blockquote>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <span style={{ fontFamily:T.H, fontSize:16, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.12em', color:T.ink }}>Montoiya Williams</span>
                <span style={{ fontFamily:T.H, fontSize:12, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.16em', color:T.dim }}>Founder of Elevated Minds™ Inc.</span>
              </div>
            </div>
          </FadeSection>
        </section>

        {/* ══ CHOOSE YOUR GATE (DARK) ══ */}
        <section id="dtg-offer" style={{ padding:'130px 24px', background:'#050505', borderTop:`1px solid ${T.lineDark}` }}>
          <FadeSection>
            <div style={{ textAlign:'center', maxWidth:820, margin:'0 auto 76px' }}>
              <Label dark>Choose Your Gate</Label>
              <h2 style={{ fontFamily:T.H, fontSize:'clamp(28px,5vw,60px)', fontWeight:800, color:'#fff', lineHeight:1.08, letterSpacing:'-0.02em', marginBottom:22 }}>
                Survival mode is <Swash>over</Swash>.
              </h2>
              <p style={{ fontSize:18, color:'rgba(255,255,255,0.65)', maxWidth:660, margin:'0 auto' }}>
                We help turn buried vision into business, premium positioning, capital access, and legacy. Private access. Clean strategy. Elite execution.
              </p>
              <p style={{ color:'rgba(255,255,255,0.45)', fontFamily:T.H, fontSize:12, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.16em', marginTop:16 }}>
                In-House Financing Available · Reserved for the Black Sheep
              </p>
              <button onClick={openQuiz} style={{ marginTop:24, display:'inline-flex', alignItems:'center', gap:10, background:'transparent', border:`1px solid rgba(200,16,46,0.4)`, color:T.red, padding:'12px 28px', fontFamily:T.H, fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.14em', cursor:'pointer', transition:'all 0.3s' }}
                onMouseEnter={e => { const el=e.currentTarget as HTMLButtonElement; el.style.background='rgba(200,16,46,0.1)'; el.style.borderColor=T.red }}
                onMouseLeave={e => { const el=e.currentTarget as HTMLButtonElement; el.style.background='transparent'; el.style.borderColor='rgba(200,16,46,0.4)' }}>
                Not sure? Find your gate → Free 60-sec quiz
              </button>
            </div>
            <div className="dtg-gates-grid" style={{ maxWidth:1300, margin:'0 auto' }}>
              {gates.map((gate,i) => (
                <div key={i}
                  style={{ background:'linear-gradient(180deg,#111 0%,#080808 100%)', border:`1px solid ${gate.featured ? T.red : gateHover===i ? 'rgba(255,255,255,0.22)' : T.lineDark}`, position:'relative', overflow:'hidden', display:'flex', flexDirection:'column', transition:'border-color 0.4s, transform 0.4s, box-shadow 0.4s', transform: gateHover===i ? 'translateY(-6px)' : 'translateY(0)', boxShadow: gateHover===i ? '0 24px 60px -20px rgba(200,16,46,0.2)' : 'none' }}
                  onMouseEnter={() => setGateHover(i)} onMouseLeave={() => setGateHover(null)}>
                  {gate.featured && <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:T.red, zIndex:2 }} />}
                  <div style={{ padding:'28px 24px 20px', textAlign:'center', borderBottom:`1px dashed ${T.lineDark}` }}>
                    <span style={{ fontSize:26, marginBottom:10, display:'block' }}>{gate.icon}</span>
                    <div style={{ fontFamily:T.H, fontSize:14, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', color:'#fff', marginBottom:8 }}>{gate.name}</div>
                    <div style={{ fontSize:14, color:'rgba(255,255,255,0.5)', fontStyle:'italic', lineHeight:1.4 }}>{gate.tagline}</div>
                  </div>
                  <div style={{ padding:'20px 24px', textAlign:'center', borderBottom:`1px dashed ${T.lineDark}` }}>
                    {gate.strike && <div style={{ fontFamily:T.H, fontSize:13, color:'rgba(255,255,255,0.4)', textDecoration:'line-through', marginBottom:2 }}>{gate.strike}</div>}
                    <div style={{ fontFamily:T.H, fontSize:'clamp(28px,4vw,44px)', fontWeight:900, color:'#fff', letterSpacing:'-0.03em', lineHeight:1 }}>{gate.amount}</div>
                    <div style={{ fontFamily:T.H, fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(255,255,255,0.4)', marginTop:6 }}>{gate.plan}</div>
                  </div>
                  <div style={{ padding:'20px 24px', flex:1 }}>
                    <ul style={{ listStyle:'none', padding:0, margin:0 }}>
                      {gate.items.map((item,j) => (
                        <li key={j} style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'7px 0', fontSize:14, color:'rgba(255,255,255,0.78)', lineHeight:1.5 }}>
                          <span style={{ color:T.red, fontWeight:700, flexShrink:0, marginTop:2, fontSize:12 }}>✓</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ padding:'0 24px 12px', fontFamily:T.H, fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:T.red, lineHeight:1.5 }}>{gate.best}</div>
                  <div style={{ padding:'12px 24px 24px' }}>
                    <a href="#dtg-apply" style={{ display:'block', textAlign:'center', background:T.red, color:'#fff', padding:'15px 20px', fontFamily:T.H, fontSize:12, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.12em', textDecoration:'none', transition:'background 0.3s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background=T.redDeep }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background=T.red }}>
                      {gate.cta}
                    </a>
                  </div>
                </div>
              ))}
            </div>
            {/* Scholarship */}
            <div className="dtg-scholarship-box" style={{ maxWidth:900, margin:'80px auto 0', background:'rgba(200,16,46,0.04)', border:'1px solid rgba(200,16,46,0.2)', padding:'48px 56px', textAlign:'center' }}>
              <Label dark>Scholarship Opportunity</Label>
              <h3 style={{ fontFamily:T.H, fontSize:'clamp(20px,3vw,30px)', fontWeight:800, color:'#fff', marginBottom:16 }}>
                Black Sheep Blueprint <Swash>Scholarship</Swash>
              </h3>
              <p style={{ fontSize:17, color:'rgba(255,255,255,0.65)', maxWidth:600, margin:'0 auto 28px' }}>
                We select one person every 90 days to receive a full Blueprint experience. If you're ready but finances are a barrier, apply below.
              </p>
              <Link to="/apply" className="dtg-btn-outline-white">
                Apply For Scholarship →
              </Link>
            </div>
          </FadeSection>
        </section>

        {/* ══ COMMUNITY (LIGHT) ══ */}
        <section style={{ padding:'130px 24px', background:T.bone, borderTop:`1px solid ${T.lineLight}`, borderBottom:`1px solid ${T.lineLight}` }}>
          <FadeSection>
            <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
              <Label>Private Community Included</Label>
              <h2 style={{ fontFamily:T.H, fontSize:'clamp(26px,4vw,46px)', fontWeight:800, color:T.ink, marginBottom:24 }}>
                When you enter, you do not <Swash>build alone</Swash>.
              </h2>
              <p style={{ fontSize:18, color:'#4a4a4a', maxWidth:620, margin:'0 auto 48px' }}>
                Every gate includes access to the private Black Sheep community — your builder network, your accountability, your growth environment.
              </p>
              <div className="dtg-community-grid">
                {['Member Portal','Kingdom Training Zoom Calls','Hidden Biblical Business Wisdom','Builder Community','Accountability','Growth Environment','Real Relationships','Ongoing Momentum'].map((item,i) => (
                  <div key={i} style={{ display:'flex', gap:14, alignItems:'center', padding:'18px 22px', background:'#fff', border:`1px solid ${T.lineLight}`, fontFamily:T.H, fontSize:15, fontWeight:600, color:T.ink, transition:'border-color 0.3s', cursor:'default' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor=T.red }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor=T.lineLight }}>
                    <span style={{ color:T.red, fontSize:12, flexShrink:0 }}>✦</span>{item}
                  </div>
                ))}
              </div>
            </div>
          </FadeSection>
        </section>

        {/* ══ FINAL CTA (DARK) ══ */}
        <section style={{ padding:'160px 24px', textAlign:'center', position:'relative', overflow:'hidden', background:T.ink }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 50% at 50% 50%,rgba(200,16,46,0.10)0%,transparent 60%)' }} />
          <FadeSection style={{ position:'relative', zIndex:2 }}>
            <div style={{ maxWidth:820, margin:'0 auto' }}>
              <Label dark>The Gold Is Still There</Label>
              <h2 style={{ fontFamily:T.H, fontSize:'clamp(36px,6vw,76px)', fontWeight:800, lineHeight:1.05, marginBottom:20, color:'#fff' }}>
                The gate is <Swash>open</Swash>.
              </h2>
              <p style={{ fontSize:20, color:'rgba(255,255,255,0.75)', margin:'0 auto 48px', maxWidth:600, fontFamily:T.B, lineHeight:1.7 }}>
                Survival mode is over. From survival to structure. Build Different.
              </p>
              <div className="dtg-hero-actions">
                <Link to="/apply" className="dtg-btn-red">
                  Uncover My Gold
                  <svg viewBox="0 0 18 12" fill="none" style={{ width:18, height:12 }}><path d="M1 6H17M17 6L12 1M17 6L12 11" stroke="currentColor" strokeWidth="1.8"/></svg>
                </Link>
                <button onClick={openQuiz} className="dtg-btn-outline-white">
                  Choose My Gate ✦
                </button>
              </div>
            </div>
          </FadeSection>
        </section>

        {/* ══ APPLY SECTION — DESIGN.md §11.7 Founder Intake ══ */}
        <section id="dtg-apply" style={{ padding:'130px 24px', background:T.panel, borderTop:`1px solid rgba(201,164,73,0.15)` }}>
          <FadeSection>
            <div style={{ textAlign:'center', maxWidth:820, margin:'0 auto 56px' }}>
              <Label dark>Founder Intake</Label>
              <h2 style={{ fontFamily:T.H, fontSize:'clamp(28px,5vw,56px)', fontWeight:800, lineHeight:1.08, color:'#fff', marginBottom:22 }}>
                Apply as a <Swash>Black Sheep Founder</Swash>.
              </h2>
              <p style={{ fontSize:18, color:T.steel, maxWidth:660, margin:'0 auto', lineHeight:1.7 }}>
                Tell us where you are, what you carry, and what you are ready to build.
              </p>
            </div>
            <div className="dtg-apply-box bs-card-premium" style={{ maxWidth:800, margin:'0 auto', padding:'64px 56px', textAlign:'center' }}>
              <p style={{ fontFamily:T.H, fontSize:'1.1rem', fontWeight:600, color:T.ivory, marginBottom:12, fontStyle:'italic' }}>
                "You are not broken. You are unstructured."
              </p>
              <p style={{ fontSize:15, color:T.steel, maxWidth:480, margin:'0 auto 36px', lineHeight:1.7 }}>
                Your Founder Intake is free. No pressure. We want to see the gold and find your gate.
              </p>
              <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap', marginBottom:36 }}>
                <Link to="/apply" className="dtg-btn-red">
                  Submit Founder Intake
                  <svg viewBox="0 0 18 12" fill="none" style={{ width:18, height:12 }}><path d="M1 6H17M17 6L12 1M17 6L12 11" stroke="currentColor" strokeWidth="1.8"/></svg>
                </Link>
                <Link to="/choose-your-gate" className="dtg-btn-outline-white">
                  Choose Your Gate First
                </Link>
              </div>
              <div style={{ display:'flex', justifyContent:'center', gap:28, flexWrap:'wrap', fontFamily:T.M, fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.16em', color:T.steel }}>
                {['Founder Intake Required','Limited Applications','Free Vision Call'].map((item,i) => (
                  <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
                    <span style={{ width:5, height:5, background:T.red, borderRadius:'50%', display:'inline-block' }} />{item}
                  </span>
                ))}
              </div>
            </div>
          </FadeSection>
        </section>

        {/* ══ BLACK SHEEP PLATFORM STRIP — DESIGN.md §11.2 ══ */}
        <section style={{ padding:'80px 24px', background:T.ink2, borderTop:`1px solid rgba(201,164,73,0.14)` }}>
          <FadeSection>
            <div style={{ maxWidth:1100, margin:'0 auto', textAlign:'center' }}>
              <Label dark>Black Sheep Platform</Label>
              <h2 style={{ fontFamily:T.H, fontSize:'clamp(22px,3.5vw,40px)', fontWeight:800, color:'#fff', lineHeight:1.15, marginBottom:16 }}>
                Black Sheep is where <span style={{ color:T.gold, fontStyle:'italic' }}>vision becomes structure</span>.
              </h2>
              <p style={{ fontFamily:T.B, fontSize:16, color:T.steel, maxWidth:580, margin:'0 auto 40px', lineHeight:1.7 }}>
                A premium platform for founders ready to uncover their gold, build their blueprint, and move through the right gate.
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:16, maxWidth:900, margin:'0 auto 40px' }}>
                {[
                  { label:'Uncover My Gold',     to:'/builder',    color:T.gold },
                  { label:'Black Sheep Blueprint',to:'/builder',    color:T.silver },
                  { label:'Choose Your Gate',     to:'/choose-your-gate', color:T.goldSoft },
                  { label:'Founder Intake',       to:'/apply',      color:T.red },
                  { label:'Build Request',        to:'/services',   color:T.silver },
                  { label:'Legacy Dashboard',     to:'/dashboard',  color:T.steel },
                ].map(({ label, to, color }) => (
                  <Link key={label} to={to} style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'14px 16px', background:'rgba(255,255,255,0.04)', border:`1px solid rgba(201,201,201,0.12)`, borderRadius:12, fontFamily:T.M, fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color, textDecoration:'none', transition:'all 220ms' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background='rgba(255,255,255,0.08)'; (e.currentTarget as HTMLAnchorElement).style.borderColor=color+'55' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background='rgba(255,255,255,0.04)'; (e.currentTarget as HTMLAnchorElement).style.borderColor='rgba(201,201,201,0.12)' }}>
                    {label}
                  </Link>
                ))}
              </div>
              <div className="dtg-hero-actions">
                <Link to="/register" className="dtg-btn-red">
                  Access the Platform
                </Link>
                <Link to="/hub" className="dtg-btn-outline-white">
                  Explore Business Hub
                </Link>
              </div>
            </div>
          </FadeSection>
        </section>

        {/* ══ FOOTER ══ */}
        <footer style={{ background:'#050505', borderTop:`1px solid ${T.lineDark}`, padding:'72px 48px 40px' }}>
          <div style={{ maxWidth:1300, margin:'0 auto' }}>
            <div className="dtg-footer-grid" style={{ paddingBottom:48, borderBottom:`1px solid ${T.lineDark}`, marginBottom:32 }}>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <span style={{ fontFamily:T.H, fontWeight:900, fontSize:20, color:'#fff' }}>Divorcing The Game™</span>
                <p style={{ fontSize:15, color:'rgba(255,255,255,0.55)', maxWidth:360, lineHeight:1.6, margin:0 }}>
                  Helping Black Sheep, street-minded hustlers, and overlooked builders exit survival mode and build real businesses.
                </p>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.28)', lineHeight:1.6, margin:0 }}>
                  Funding access of up to $250,000 is facilitated through third-party lenders. Results vary by individual qualifications. Not a guarantee of funding. US-based applicants only.
                </p>
              </div>
              <div>
                <h5 style={{ fontFamily:T.H, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.18em', color:'rgba(255,255,255,0.45)', marginBottom:20 }}>Program</h5>
                {/* DESIGN.md §10.1 Landing nav */}
                {[['#dtg-about','The Movement'],['#dtg-offer','Choose Your Gate'],['/apply','Founder Intake'],['https://www.amazon.com/dp/0578369311','Get The Book']].map(([href,lbl]) => (
                  href.startsWith('/') || href.startsWith('#') ?
                    (href.startsWith('/') ?
                      <Link key={lbl} to={href} style={{ display:'block', fontSize:14, color:'rgba(255,255,255,0.60)', marginBottom:10, textDecoration:'none', transition:'color 220ms' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color=T.goldSoft }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color='rgba(255,255,255,0.60)' }}>{lbl}</Link>
                      :
                      <a key={lbl} href={href} style={{ display:'block', fontSize:14, color:'rgba(255,255,255,0.60)', marginBottom:10, textDecoration:'none', transition:'color 220ms' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color=T.goldSoft }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color='rgba(255,255,255,0.60)' }}>{lbl}</a>
                    )
                  :
                  <a key={lbl} href={href} target="_blank" rel="noopener noreferrer" style={{ display:'block', fontSize:14, color:'rgba(255,255,255,0.60)', marginBottom:10, textDecoration:'none', transition:'color 220ms' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color=T.goldSoft }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color='rgba(255,255,255,0.60)' }}>{lbl}</a>
                ))}
              </div>
              <div>
                <h5 style={{ fontFamily:T.M, fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.18em', color:T.steel, marginBottom:20 }}>Black Sheep Platform</h5>
                {[['/', 'Home'],['/hub','Business Hub'],['/the-gate','The Gate'],['/choose-your-gate','Choose Your Gate'],['/login','Sign In'],['/register','Join Now']].map(([to,lbl]) => (
                  <Link key={lbl} to={to} style={{ display:'block', fontSize:14, color:'rgba(255,255,255,0.60)', marginBottom:10, textDecoration:'none', transition:'color 220ms' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color=T.goldSoft }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color='rgba(255,255,255,0.60)' }}>{lbl}</Link>
                ))}
              </div>
            </div>
            {/* DESIGN.md footer line */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontFamily:T.M, fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.12em', color:'rgba(255,255,255,0.28)', flexWrap:'wrap', gap:12 }}>
              <span>© {new Date().getFullYear()} Divorcing The Game™ · Ashley "IsReal" Thomas. All Rights Reserved.</span>
              <span style={{ color:T.gold }}>Built for the overlooked. Made for the Black Sheep.</span>
            </div>
          </div>
        </footer>

        {/* Bottom padding for sticky CTA */}
        <div style={{ height:72 }} />

      </div>
    </>
  )
}
