import { useMemo, useState, type ElementType } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  BadgeCheck,
  Bot,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Command,
  Globe2,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TimerReset,
  UsersRound,
  WandSparkles,
  X,
} from 'lucide-react'

type Screen = 'command' | 'create' | 'fixer' | 'run' | 'market' | 'pricing'

type Blueprint = {
  businessName: string
  offer: string
  audience: string
  mvp: string
  contentAngles: string[]
  roadmap: string[]
}

type Pack = {
  id: string
  title: string
  category: string
  price: string
  signal: string
  desc: string
  features: string[]
}

type Plan = {
  name: string
  price: string
  cta: string
  features: string[]
  highlight?: boolean
  href: string
  note: string
}

const BUSINESS_TYPES = ['Digital Agency', 'Local Service', 'E-commerce', 'SaaS MVP', 'Creator Brand', 'Consulting']
const COUNTRIES = ['Bangladesh', 'United States', 'Global', 'UAE', 'UK']
const PROBLEMS = ['No clear offer', 'Low leads', 'Sales stuck', 'Ops messy', 'Need launch plan', 'Need automation']
const STAGES = ['Idea', 'Pre-launch', 'Launched', 'Scaling']
const BUDGETS = ['Bootstrap', 'Lean', 'Growth', 'Agency']

const MESH_MODELS = [
  'Groq', 'OpenAI', 'Anthropic', 'Gemini', 'Mistral', 'Together', 'DeepSeek', 'xAI', 'Perplexity', 'Cohere',
  'Router A', 'Router B', 'Vision', 'Planner', 'Copy Chief', 'CRM Analyst', 'Pricing Brain', 'Market Scout', 'Offer Builder', 'Ad Writer',
  'SEO Agent', 'Proposal Agent', 'Funding Agent', 'Legal Draft', 'Ops Agent', 'QA Agent', 'Data Agent', 'Support Agent', 'Marketplace Agent', 'Funnel Agent',
  'Brand Agent', 'Roadmap Agent', 'Risk Agent', 'BD Market', 'US Market', 'Email Agent', 'Chat Agent', 'Fixer Core', 'Sales Brain', 'Launch Brain',
]

const SERVICE_PACKS: Pack[] = [
  {
    id: 'starter-growth-engine',
    title: 'Starter Growth Engine',
    category: 'Launch',
    price: '$49+',
    signal: 'Best MVP entry',
    desc: 'Offer, audience, landing copy, starter funnel, and a 30-day action map for a new business.',
    features: ['Offer clarity', 'Launch copy', 'MVP roadmap', 'Manual request flow'],
  },
  {
    id: 'messenger-sales-machine',
    title: 'Messenger Sales Machine',
    category: 'Sales',
    price: '$149+',
    signal: 'BD + local business',
    desc: 'Inbox scripts, lead qualification, follow-up flow, and a manual closing system.',
    features: ['Inbox scripts', 'Lead triage', 'Follow-up flow', 'CRM handoff'],
  },
  {
    id: 'booked-calls-funnel',
    title: 'Booked Calls Funnel',
    category: 'Funnel',
    price: '$299+',
    signal: 'US/global ready',
    desc: 'Lead magnet, booking page, qualification questions, and a call-prep workflow.',
    features: ['Booking flow', 'Qualification', 'Call prep', 'Pipeline staging'],
  },
  {
    id: 'creative-sprint-pack',
    title: 'Creative Sprint Pack',
    category: 'Content',
    price: '$99+',
    signal: 'Fast content',
    desc: 'Ads, hooks, carousel angles, email copy, and product messaging in one sprint.',
    features: ['Ad angles', 'Hook bank', 'Email copy', 'Content sprint'],
  },
  {
    id: 'ai-sales-assistant',
    title: 'AI Sales Assistant',
    category: 'AI Tool',
    price: '$499+',
    signal: 'Provider-ready build',
    desc: 'Custom AI assistant flow for replies, objections, offers, and CRM notes.',
    features: ['Reply handling', 'Objection map', 'Offer prompts', 'CRM notes'],
  },
]

const PLANS: Plan[] = [
  {
    name: 'Starter',
    price: '$0',
    cta: 'Start Free',
    href: '/register',
    note: 'Best for testing the engine and browsing the system.',
    features: ['Public command page', 'Demo blueprint mode', 'Marketplace preview', 'Limited support'],
  },
  {
    name: 'Growth',
    price: '$49/mo',
    cta: 'Continue to Payment',
    href: '/payment',
    note: 'Manual activation for MVP. Stripe comes later.',
    highlight: true,
    features: ['Priority blueprint flow', 'CRM tools', 'Service requests', 'Marketplace access'],
  },
  {
    name: 'Agency',
    price: '$149/mo',
    cta: 'Continue to Payment',
    href: '/payment',
    note: 'For operators running multiple businesses.',
    features: ['Multi-project handling', 'Advanced support', 'Service request stack', 'Execution tooling'],
  },
]

const PROBLEM_MAP: Record<string, { diagnosis: string; rootCause: string; priorityActions: string[]; service: string; nextStep: string }> = {
  'No clear offer': {
    diagnosis: 'The market does not yet understand what this business solves.',
    rootCause: 'The offer is too broad and the buyer outcome is not specific enough.',
    priorityActions: ['Define the buyer outcome', 'Write a one-line offer', 'Add a single conversion CTA'],
    service: 'Starter Growth Engine',
    nextStep: 'Start Building',
  },
  'Low leads': {
    diagnosis: 'You need a stronger traffic and outreach path.',
    rootCause: 'The business is not getting enough qualified attention from the right market.',
    priorityActions: ['Pick one traffic channel', 'Write 3 lead hooks', 'Add a follow-up loop'],
    service: 'Messenger Sales Machine',
    nextStep: 'Open Fixer Mode',
  },
  'Sales stuck': {
    diagnosis: 'Interest exists, but the sales process is leaking.',
    rootCause: 'The pipeline is missing qualification, trust, or clear next steps.',
    priorityActions: ['Qualify faster', 'Add proof and urgency', 'Shorten the close path'],
    service: 'Booked Calls Funnel',
    nextStep: 'Run CRM',
  },
  'Ops messy': {
    diagnosis: 'Execution is scattered across too many manual steps.',
    rootCause: 'There is no single command layer for tracking requests and projects.',
    priorityActions: ['Create a request stack', 'Define status stages', 'Assign one owner per task'],
    service: 'AI Sales Assistant',
    nextStep: 'Run CRM',
  },
  'Need launch plan': {
    diagnosis: 'The business needs a simple 30-day launch path.',
    rootCause: 'There is no structured roadmap to move from idea to first revenue.',
    priorityActions: ['Clarify the MVP', 'List launch actions', 'Set a week-by-week path'],
    service: 'Starter Growth Engine',
    nextStep: 'Start Building',
  },
  'Need automation': {
    diagnosis: 'The business is ready for repeatable execution.',
    rootCause: 'Manual handling is slowing response time and consistency.',
    priorityActions: ['Automate intake', 'Centralize follow-up', 'Use provider-ready AI routing'],
    service: 'AI Sales Assistant',
    nextStep: 'View Marketplace',
  },
}

const BLUEPRINT_STYLE: Record<string, Blueprint> = {
  'Digital Agency': {
    businessName: 'Signal Forge Studio',
    offer: 'Done-for-you growth systems for service businesses',
    audience: 'Founders who need leads, follow-up, and conversion support',
    mvp: 'Landing page, lead form, follow-up scripts, and one core service offer',
    contentAngles: ['Before/after transformation', 'Lead cost reduction', 'Execution clarity'],
    roadmap: ['Week 1 - define offer', 'Week 2 - publish landing page', 'Week 3 - start outreach', 'Week 4 - close first clients'],
  },
  'Local Service': {
    businessName: 'North Star Service Co.',
    offer: 'Local booking and demand generation engine',
    audience: 'Nearby buyers who want fast, reliable service',
    mvp: 'Google profile, booking CTA, testimonials, and messaging flow',
    contentAngles: ['Speed and trust', 'Local proof', 'Problem-solution content'],
    roadmap: ['Week 1 - refine offer', 'Week 2 - publish booking page', 'Week 3 - collect reviews', 'Week 4 - run outreach'],
  },
  'E-commerce': {
    businessName: 'Launch Cart Lab',
    offer: 'Product positioning and conversion support for a single hero product',
    audience: 'Online shoppers who buy when the offer is clear and the trust is strong',
    mvp: 'Hero product page, ad angles, email capture, and checkout clarity',
    contentAngles: ['Product urgency', 'Bundle value', 'Problem awareness'],
    roadmap: ['Week 1 - tighten product story', 'Week 2 - build landing page', 'Week 3 - test ads', 'Week 4 - optimize conversion'],
  },
  'SaaS MVP': {
    businessName: 'Command Stack OS',
    offer: 'A focused business engine with one clear workflow',
    audience: 'Founders who want faster execution and less manual admin',
    mvp: 'One core feature, one onboarding flow, one retention hook',
    contentAngles: ['Speed', 'structure', 'provider-ready architecture'],
    roadmap: ['Week 1 - define feature', 'Week 2 - ship MVP', 'Week 3 - onboard users', 'Week 4 - improve retention'],
  },
  'Creator Brand': {
    businessName: 'Audience Engine',
    offer: 'Content and monetization system for a personal brand',
    audience: 'Creators who want offers, structure, and repeatable publishing',
    mvp: 'Offer page, lead magnet, content calendar, and call-to-action flow',
    contentAngles: ['Identity', 'authority', 'audience growth'],
    roadmap: ['Week 1 - define promise', 'Week 2 - create content bank', 'Week 3 - publish offer', 'Week 4 - convert audience'],
  },
  Consulting: {
    businessName: 'Insight Relay',
    offer: 'Premium advisory and implementation support',
    audience: 'Operators who will pay for clarity and speed',
    mvp: 'Discovery call, diagnosis deck, service plan, and follow-up sequence',
    contentAngles: ['Expertise', 'outcomes', 'speed to implementation'],
    roadmap: ['Week 1 - clarify niche', 'Week 2 - write service menu', 'Week 3 - collect leads', 'Week 4 - close engagements'],
  },
}

const COUNTRY_SIGNAL: Record<string, string> = {
  Bangladesh: 'BD-ready payments and local service delivery',
  'United States': 'US market framing and pricing',
  Global: 'Provider-ready and market-agnostic',
  UAE: 'High-ticket service positioning',
  UK: 'Premium buyer clarity and trust building',
}

function shell(cls: string) {
  return `rounded-3xl border border-white/10 bg-white/[0.045] backdrop-blur-xl ${cls}`
}

function Pill({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active ? 'border-cyan-300/60 bg-cyan-400/15 text-cyan-100' : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-300/30 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

function Stat({ title, value, sub, icon: Icon, pulse }: { title: string; value: string; sub: string; icon: ElementType; pulse?: boolean }) {
  return (
    <div className={`${shell('p-4')} relative overflow-hidden`}>
      {pulse && <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(74,222,128,.8)]" />}
      <Icon className="mb-3 h-5 w-5 text-cyan-300" />
      <div className="text-xs uppercase tracking-[0.25em] text-slate-500">{title}</div>
      <div className="mt-1 text-2xl font-black text-white">{value}</div>
      <div className="mt-1 text-xs text-slate-400">{sub}</div>
    </div>
  )
}

function SectionTitle({ kicker, title, sub }: { kicker: string; title: string; sub: string }) {
  return (
    <div className="space-y-2">
      <div className="text-[11px] font-bold uppercase tracking-[0.35em] text-cyan-300">{kicker}</div>
      <h2 className="text-3xl font-black tracking-[-0.04em] text-white md:text-4xl">{title}</h2>
      <p className="max-w-2xl text-sm leading-7 text-slate-400">{sub}</p>
    </div>
  )
}

export default function CommandPage() {
  const [screen, setScreen] = useState<Screen>('command')
  const [businessType, setBusinessType] = useState('Digital Agency')
  const [country, setCountry] = useState('Bangladesh')
  const [problem, setProblem] = useState('Low leads')
  const [stage, setStage] = useState('Idea')
  const [budget, setBudget] = useState('Lean')
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null)
  const [blueprintOpen, setBlueprintOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [meshSpin, setMeshSpin] = useState(0)
  const [stack, setStack] = useState<string[]>(['Offer audit', 'Fixer diagnosis', 'Marketplace match'])

  const activeBlueprint = BLUEPRINT_STYLE[businessType] ?? BLUEPRINT_STYLE['Digital Agency']
  const activeFix = PROBLEM_MAP[problem] ?? PROBLEM_MAP['Low leads']

  const liveBlueprint = useMemo(() => {
    const suffix = country === 'Bangladesh' ? 'BD' : country === 'United States' ? 'US' : 'Global'
    return {
      businessName: `${activeBlueprint.businessName} ${suffix}`,
      offer: activeBlueprint.offer,
      audience: activeBlueprint.audience,
      mvp: activeBlueprint.mvp,
      contentAngles: activeBlueprint.contentAngles,
      roadmap: activeBlueprint.roadmap,
    }
  }, [activeBlueprint, country])

  const filteredPacks = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SERVICE_PACKS
    return SERVICE_PACKS.filter((pack) => [pack.title, pack.category, pack.signal, pack.desc, ...pack.features].join(' ').toLowerCase().includes(q))
  }, [query])

  const runScan = (nextProblem = problem) => {
    setProblem(nextProblem)
    setMeshSpin((v) => v + 7)
    setStack((prev) => [nextProblem, activeFix.service, 'Execution pack', ...prev.slice(0, 2)])
  }

  const commandStats = [
    { title: 'AI Mesh', value: '40+', sub: 'Provider-ready nodes', icon: Bot, pulse: true },
    { title: 'Market Signal', value: country === 'Bangladesh' ? 'BD' : country === 'United States' ? 'US' : 'Global', sub: COUNTRY_SIGNAL[country], icon: Globe2 },
    { title: 'Roadmap', value: '30D', sub: 'Execution path', icon: TimerReset },
    { title: 'Fallback', value: 'Demo Safe', sub: 'No backend required', icon: ShieldCheck },
  ]

  const navItems: Array<{ id: Screen; label: string; icon: ElementType }> = [
    { id: 'command', label: 'Command', icon: Command },
    { id: 'create', label: 'Create', icon: Rocket },
    { id: 'fixer', label: 'Fixer', icon: WandSparkles },
    { id: 'run', label: 'Run', icon: BarChart3 },
    { id: 'market', label: 'Market', icon: ShoppingBag },
  ]

  return (
    <div className="min-h-screen overflow-hidden bg-[#030712] text-slate-100">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_10%_12%,rgba(34,211,238,.18),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(79,70,229,.20),transparent_26%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,.10),transparent_30%),linear-gradient(180deg,#020617,#050816_45%,#020617)]" />
      <div className="fixed inset-0 opacity-[.10]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.10) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.10) 1px,transparent 1px)', backgroundSize: '46px 46px' }} />

      <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-4 md:px-8">
        <header className={`${shell('mb-6 flex items-center justify-between p-4 shadow-[0_0_60px_rgba(15,23,42,.55)]')} gap-4`}>
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-400/30 bg-slate-950 shadow-[0_0_35px_rgba(34,211,238,.2)]">
              <Command className="h-6 w-6 text-cyan-300" />
            </div>
            <div>
              <div className="text-xl font-black tracking-[0.12em] text-white">ENGINE NOTREAL</div>
              <div className="text-[10px] font-bold tracking-[0.36em] text-cyan-300">AI BUSINESS ENGINE</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setScreen(item.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${screen === item.id ? 'bg-cyan-400/15 text-cyan-100' : 'text-slate-400 hover:bg-white/[.05] hover:text-white'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setBlueprintOpen(true)}
            className="rounded-2xl border border-cyan-300/25 bg-cyan-400/10 px-4 py-3 text-sm font-black text-cyan-100"
          >
            <Sparkles className="mr-2 inline h-4 w-4" /> Live Blueprint
          </button>
        </header>

        <AnimatePresence mode="wait">
          {screen === 'command' && (
            <motion.main key="command" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="grid gap-6 lg:grid-cols-[1.08fr_.92fr]">
              <section className="relative overflow-hidden rounded-[2.3rem] border border-cyan-300/20 bg-slate-950/65 p-6 shadow-[0_0_80px_rgba(34,211,238,.10)] backdrop-blur-xl md:p-10">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-4 py-2 text-xs font-bold text-emerald-100">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> DhandaBuzz execution backbone connected
                </div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300">
                  <BadgeCheck className="h-4 w-4 text-cyan-300" /> Demo mode works with no backend or AI keys
                </div>
                <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-[-0.05em] text-white md:text-7xl">
                  Create. Fix. Run. Sell. <span className="text-cyan-300">One AI Engine.</span>
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                  Engine NotREAL turns messy business problems into structured blueprints, service requests, CRM actions, marketplace offers, and AI-powered execution plans.
                </p>
                <div className="mt-8 grid gap-3 md:grid-cols-3">
                  <Link to="/builder" className="rounded-3xl bg-cyan-400 px-6 py-5 text-left font-black text-slate-950 shadow-[0_0_38px_rgba(34,211,238,.45)] transition hover:scale-[1.02]">
                    <Rocket className="mb-3 h-6 w-6" /> Build a business
                  </Link>
                  <button onClick={() => setScreen('fixer')} className="rounded-3xl border border-white/10 bg-white/[.05] px-6 py-5 text-left font-black text-white transition hover:border-cyan-300/40">
                    <WandSparkles className="mb-3 h-6 w-6 text-cyan-300" /> Diagnose a problem
                  </button>
                  <Link to="/marketplace" className="rounded-3xl border border-white/10 bg-white/[.05] px-6 py-5 text-left font-black text-white transition hover:border-cyan-300/40">
                    <ShoppingBag className="mb-3 h-6 w-6 text-cyan-300" /> Find a service
                  </Link>
                </div>
                <div className="mt-9 grid gap-3 sm:grid-cols-4">
                  {commandStats.map((stat) => <Stat key={stat.title} {...stat} />)}
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  <Link to="/builder" className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100">Start Building</Link>
                  <Link to="/services" className="rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm font-semibold text-slate-200">Open Fixer Mode</Link>
                  <Link to="/dashboard" className="rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm font-semibold text-slate-200">Run CRM</Link>
                  <Link to="/marketplace" className="rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm font-semibold text-slate-200">View Marketplace</Link>
                  <Link to="/pricing" className="rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm font-semibold text-slate-200">See Pricing</Link>
                </div>
              </section>

              <section className="relative min-h-[560px] overflow-hidden rounded-[2.3rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
                <div className="absolute inset-0 p-6">
                  <div className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/15" />
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 36, repeat: Infinity, ease: 'linear' }} className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 54, repeat: Infinity, ease: 'linear' }} className="absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-indigo-300/15" />
                  <div className="absolute left-1/2 top-1/2 grid h-40 w-40 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[2rem] border border-cyan-300/25 bg-slate-950/80 text-center shadow-[0_0_70px_rgba(34,211,238,.16)]">
                    <Bot className="h-10 w-10 text-cyan-300" />
                    <div className="mt-2 text-sm font-black text-white">40+ AI Mesh</div>
                    <div className="mt-1 text-[11px] text-slate-400">Provider-ready architecture</div>
                  </div>
                  <div className="absolute left-1/2 top-1/2 grid w-[520px] max-w-full -translate-x-1/2 -translate-y-1/2 grid-cols-4 gap-2 md:grid-cols-5">
                    {MESH_MODELS.map((model, index) => {
                      const angle = (index / MESH_MODELS.length) * Math.PI * 2
                      const radius = index % 2 === 0 ? 220 : 170
                      const x = Math.cos(angle) * radius
                      const y = Math.sin(angle) * radius
                      const active = (meshSpin + index) % 7 === 0
                      return (
                        <motion.button
                          key={model}
                          onClick={() => setMeshSpin((v) => v + 1)}
                          animate={{ x, y, scale: active ? 1.08 : 1, opacity: active ? 1 : 0.78 }}
                          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                          className={`absolute left-1/2 top-1/2 rounded-full border px-3 py-2 text-[11px] font-bold backdrop-blur-xl ${active ? 'border-cyan-300 bg-cyan-400/20 text-cyan-100' : 'border-white/10 bg-white/[.05] text-slate-300'}`}
                        >
                          {model}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
                <div className="absolute inset-x-6 bottom-6 rounded-[1.7rem] border border-cyan-300/20 bg-slate-950/75 p-5 backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.32em] text-slate-500">Current command</div>
                      <div className="mt-1 text-2xl font-black text-white">Fix {problem} for a {businessType}</div>
                      <div className="mt-1 text-sm text-slate-400">{COUNTRY_SIGNAL[country]}</div>
                    </div>
                    <button onClick={() => runScan()} className="rounded-2xl bg-cyan-400 px-4 py-3 font-black text-slate-950">Run Scan</button>
                  </div>
                </div>
              </section>
            </motion.main>
          )}

          {screen === 'create' && (
            <motion.section key="create" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="grid gap-6 lg:grid-cols-[.92fr_1.08fr]">
              <div className={`${shell('p-6 md:p-8')} relative overflow-hidden`}>
                <SectionTitle kicker="Create" title="Business Input Panel" sub="Set the business type, market, bottleneck, stage, and budget. The preview updates from local state only." />
                <div className="mt-8 space-y-5">
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.28em] text-slate-500">Business type</label>
                    <div className="flex flex-wrap gap-2">
                      {BUSINESS_TYPES.map((item) => <Pill key={item} active={businessType === item} onClick={() => setBusinessType(item)}>{item}</Pill>)}
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.28em] text-slate-500">Market / country</label>
                    <div className="flex flex-wrap gap-2">
                      {COUNTRIES.map((item) => <Pill key={item} active={country === item} onClick={() => setCountry(item)}>{item}</Pill>)}
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.28em] text-slate-500">Main bottleneck</label>
                    <div className="flex flex-wrap gap-2">
                      {PROBLEMS.map((item) => <Pill key={item} active={problem === item} onClick={() => { setProblem(item); setScreen('fixer') }}>{item}</Pill>)}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.28em] text-slate-500">Growth stage</label>
                      <select value={stage} onChange={(e) => setStage(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none">
                        {STAGES.map((item) => <option key={item}>{item}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.28em] text-slate-500">Budget level</label>
                      <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none">
                        {BUDGETS.map((item) => <option key={item}>{item}</option>)}
                      </select>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[.04] p-4">
                      <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Status</div>
                      <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Demo ready</div>
                      <div className="mt-2 text-xs text-slate-400">Stage: {stage}</div>
                      <div className="mt-1 text-xs text-slate-400">Budget: {budget}</div>
                      <div className="mt-2 text-xs text-slate-500">No backend required for this page.</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => runScan(problem)} className="rounded-2xl bg-cyan-400 px-5 py-3 font-black text-slate-950">Generate Blueprint</button>
                    <button onClick={() => setBlueprintOpen(true)} className="rounded-2xl border border-white/10 bg-white/[.04] px-5 py-3 font-semibold text-slate-200">Preview Blueprint</button>
                  </div>
                </div>
              </div>

              <div className={`${shell('p-6 md:p-8')} relative overflow-hidden`}>
                <SectionTitle kicker="Blueprint" title={`${liveBlueprint.businessName}`} sub="A structured output preview that adapts to the current selections." />
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                    <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Offer</div>
                    <div className="mt-2 text-lg font-black text-white">{liveBlueprint.offer}</div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                    <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Audience</div>
                    <div className="mt-2 text-lg font-black text-white">{liveBlueprint.audience}</div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4 md:col-span-2">
                    <div className="text-xs uppercase tracking-[0.28em] text-slate-500">MVP plan</div>
                    <div className="mt-2 text-lg font-black text-white">{liveBlueprint.mvp}</div>
                  </div>
                </div>
                <div className="mt-6 rounded-3xl border border-white/10 bg-white/[.04] p-5">
                  <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Content and ad angles</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {liveBlueprint.contentAngles.map((item) => <span key={item} className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-100">{item}</span>)}
                  </div>
                </div>
                <div className="mt-6 rounded-3xl border border-white/10 bg-white/[.04] p-5">
                  <div className="text-xs uppercase tracking-[0.28em] text-slate-500">30-day roadmap preview</div>
                  <div className="mt-3 space-y-2">
                    {liveBlueprint.roadmap.map((item) => (
                      <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-200">
                        <span>{item}</span>
                        <ChevronRight className="h-4 w-4 text-cyan-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {screen === 'fixer' && (
            <motion.section key="fixer" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="grid gap-6 lg:grid-cols-[.88fr_1.12fr]">
              <div className={`${shell('p-6 md:p-8')}`}>
                <SectionTitle kicker="Fixer" title="Diagnosis Engine" sub="Bring the problem. Leave with the plan. The diagnosis updates instantly from the selected bottleneck." />
                <div className="mt-6 flex flex-wrap gap-2">
                  {PROBLEMS.map((item) => <Pill key={item} active={problem === item} onClick={() => runScan(item)}>{item}</Pill>)}
                </div>
                <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-5">
                  <div className="text-xs uppercase tracking-[0.28em] text-cyan-200">Diagnosis</div>
                  <div className="mt-2 text-2xl font-black text-white">{activeFix.diagnosis}</div>
                  <div className="mt-4 text-sm leading-7 text-slate-300">Root cause: {activeFix.rootCause}</div>
                </div>
              </div>
              <div className={`${shell('p-6 md:p-8')}`}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-5">
                    <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Priority actions</div>
                    <div className="mt-3 space-y-3">
                      {activeFix.priorityActions.map((item) => (
                        <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[.04] p-3 text-sm text-slate-200">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-5">
                    <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Recommended service</div>
                    <div className="mt-3 text-xl font-black text-white">{activeFix.service}</div>
                    <button onClick={() => setSelectedPack(SERVICE_PACKS.find((p) => p.title === activeFix.service) || SERVICE_PACKS[0])} className="mt-4 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950">View service pack</button>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/[.04] p-5 md:col-span-2">
                    <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Execution order</div>
                    <div className="mt-3 grid gap-2 md:grid-cols-3">
                      {['Diagnose', 'Fix', 'Execute'].map((item, index) => (
                        <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                          <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Step {index + 1}</div>
                          <div className="mt-1 font-black text-white">{item}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">Next step CTA: {activeFix.nextStep}</div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {screen === 'run' && (
            <motion.section key="run" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="grid gap-6 lg:grid-cols-[.88fr_1.12fr]">
              <div className={`${shell('p-6 md:p-8')}`}>
                <SectionTitle kicker="Run" title="CRM and Request Stack" sub="Track leads, service requests, and project status in one control room." />
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Stat title="Active leads" value="18" sub="In the pipeline" icon={UsersRound} />
                  <Stat title="Requests" value={stack.length.toString()} sub="Open actions" icon={ClipboardList} pulse />
                  <Stat title="Pipeline" value="$8.7K" sub="Projected value" icon={CircleDollarSign} />
                  <Stat title="Markets" value="3" sub="BD / US / Global" icon={Globe2} />
                </div>
              </div>
              <div className={`${shell('p-6 md:p-8')}`}>
                <div className="grid gap-3">
                  {[
                    { lead: 'Dhaka Restaurant Group', stage: 'Fixer Diagnosis', value: '$350', health: 83 },
                    { lead: 'NYC Cleaning Startup', stage: 'Proposal Sent', value: '$1,200', health: 71 },
                    { lead: 'Creator Course Brand', stage: 'Blueprint Ready', value: '$790', health: 92 },
                    { lead: 'Local Real Estate Team', stage: 'Booked Call', value: '$2,400', health: 64 },
                  ].map((item) => (
                    <div key={item.lead} className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="font-black text-white">{item.lead}</div>
                          <div className="text-sm text-slate-400">{item.stage}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-xs text-slate-500">Value</div>
                            <div className="font-black text-cyan-300">{item.value}</div>
                          </div>
                          <div className="h-2 w-28 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full rounded-full bg-cyan-400" style={{ width: `${item.health}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-3xl border border-white/10 bg-white/[.04] p-5">
                  <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Live request stack</div>
                  <div className="mt-3 space-y-2">
                    {stack.map((item, index) => (
                      <div key={`${item}-${index}`} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-slate-200">
                        <span>{index + 1}. {item}</span>
                        <ArrowRight className="h-4 w-4 text-cyan-300" />
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setStack((prev) => ['Manual checkout', ...prev.slice(0, 4)])} className="mt-4 w-full rounded-2xl border border-cyan-300/25 bg-cyan-400/10 py-3 text-sm font-black text-cyan-100">Add manual checkout step</button>
                </div>
              </div>
            </motion.section>
          )}

          {screen === 'market' && (
            <motion.section key="market" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
              <div className={`${shell('p-6 md:p-8')}`}>
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <SectionTitle kicker="Marketplace" title="Service Packs" sub="Productized DhandaBuzz and Engine NotREAL delivery packs with honest MVP CTAs." />
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search launch, sales, AI, funnel..." className="w-full rounded-2xl border border-white/10 bg-white/[.05] py-4 pl-12 pr-4 text-white outline-none focus:border-cyan-300" />
                  </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredPacks.map((pack) => (
                    <motion.button key={pack.id} whileHover={{ y: -6, scale: 1.01 }} onClick={() => setSelectedPack(pack)} className="rounded-[2rem] border border-white/10 bg-white/[.045] p-5 text-left backdrop-blur-xl transition hover:border-cyan-300/40 hover:shadow-[0_0_44px_rgba(34,211,238,.10)]">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-100">{pack.category}</div>
                        <div className="text-xl font-black text-cyan-300">{pack.price}</div>
                      </div>
                      <h3 className="text-2xl font-black tracking-[-0.04em] text-white">{pack.title}</h3>
                      <p className="mt-3 min-h-[84px] leading-7 text-slate-400">{pack.desc}</p>
                      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/45 p-3 text-sm text-slate-300">
                        <Sparkles className="mr-2 inline h-4 w-4 text-cyan-300" /> {pack.signal}
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-300">
                        {pack.features.slice(0, 4).map((feature) => <div key={feature} className="rounded-2xl border border-white/10 bg-white/[.04] px-3 py-2">{feature}</div>)}
                      </div>
                      <div className="mt-5 rounded-2xl bg-cyan-400 py-4 text-center font-black text-slate-950">View offer</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {screen === 'pricing' && (
            <motion.section key="pricing" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
              <div className={`${shell('p-6 md:p-8')}`}>
                <SectionTitle kicker="Pricing" title="Honest MVP pricing" sub="No fake Stripe checkout. Growth and Agency point to the manual payment flow until automation is live." />
                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  {PLANS.map((plan) => (
                    <div key={plan.name} className={`rounded-[2rem] border p-6 backdrop-blur-xl ${plan.highlight ? 'border-cyan-300/35 bg-cyan-400/10 shadow-[0_0_55px_rgba(34,211,238,.13)]' : 'border-white/10 bg-white/[.045]'}`}>
                      {plan.highlight && <div className="mb-4 inline-flex rounded-full border border-cyan-300/25 bg-cyan-400/15 px-3 py-1 text-xs font-bold text-cyan-200">Most Popular</div>}
                      <div className="text-sm font-bold uppercase tracking-[0.28em] text-cyan-300">{plan.name}</div>
                      <div className="mt-4 text-5xl font-black text-white">{plan.price}</div>
                      <p className="mt-3 text-slate-400">{plan.note}</p>
                      <div className="mt-6 space-y-3">
                        {plan.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                            <CheckCircle2 className="h-5 w-5 text-emerald-300" /> {feature}
                          </div>
                        ))}
                      </div>
                      <Link to={plan.href} className={`mt-7 block w-full rounded-2xl py-4 text-center font-black ${plan.highlight ? 'bg-cyan-400 text-slate-950' : 'border border-white/10 bg-white/[.05] text-white'}`}>
                        {plan.cta}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <nav className="fixed inset-x-4 bottom-4 z-40 mx-auto grid max-w-lg grid-cols-5 rounded-[1.7rem] border border-white/10 bg-slate-950/85 p-2 backdrop-blur-2xl md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = screen === item.id
          return (
            <button key={item.id} onClick={() => setScreen(item.id)} className={`rounded-2xl p-3 text-xs font-bold ${active ? 'bg-cyan-400 text-slate-950' : 'text-slate-400'}`}>
              <Icon className="mx-auto mb-1 h-5 w-5" />{item.label}
            </button>
          )
        })}
      </nav>

      <AnimatePresence>
        {selectedPack && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-slate-950/85 p-4 backdrop-blur-xl">
            <motion.div initial={{ y: 30, scale: 0.94 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, scale: 0.94 }} className="w-full max-w-xl rounded-[2rem] border border-cyan-300/20 bg-[#050816] p-6 shadow-[0_0_80px_rgba(34,211,238,.14)]">
              <button onClick={() => setSelectedPack(null)} className="float-right rounded-full bg-white/10 p-2">
                <X className="h-5 w-5 text-white" />
              </button>
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4 text-sm font-bold text-cyan-100">{selectedPack.signal}</div>
              <h3 className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">{selectedPack.title}</h3>
              <p className="mt-3 leading-7 text-slate-300">{selectedPack.desc}</p>
              <div className="mt-5 text-4xl font-black text-cyan-300">{selectedPack.price}</div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {selectedPack.features.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/[.04] p-3 text-sm text-slate-300">
                    <CheckCircle2 className="mr-2 inline h-4 w-4 text-emerald-300" /> {item}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <Link
                  to="/services"
                  className="flex-1 rounded-2xl bg-cyan-400 py-4 text-center font-black text-slate-950"
                  onClick={() => setStack((prev) => [selectedPack.title, ...prev.slice(0, 4)])}
                >
                  Request This Service
                </Link>
                <button onClick={() => setSelectedPack(null)} className="rounded-2xl border border-white/10 bg-white/[.05] px-5 py-4 font-semibold text-white">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {blueprintOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-slate-950/85 p-4 backdrop-blur-xl">
            <motion.div initial={{ y: 24, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 24, scale: 0.96 }} className="w-full max-w-3xl rounded-[2rem] border border-cyan-300/20 bg-[#050816] p-6 shadow-[0_0_90px_rgba(34,211,238,.16)]">
              <button onClick={() => setBlueprintOpen(false)} className="float-right rounded-full bg-white/10 p-2">
                <X className="h-5 w-5 text-white" />
              </button>
              <h3 className="text-4xl font-black tracking-[-0.05em] text-white">Live Engine Blueprint</h3>
              <p className="mt-2 text-slate-400">A generated preview of how Engine NotREAL thinks across Create, Fix, Run, and Sell.</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/[.04] p-4">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Business</div>
                  <div className="mt-2 font-black text-white">{liveBlueprint.businessName} - {country}</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/[.04] p-4">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Problem</div>
                  <div className="mt-2 font-black text-white">{problem}</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/[.04] p-4">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Next offer</div>
                  <div className="mt-2 font-black text-white">{activeFix.service}</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/[.04] p-4">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Next action</div>
                  <div className="mt-2 font-black text-white">{activeFix.nextStep}</div>
                </div>
              </div>
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/[.04] p-5">
                <div className="text-sm uppercase tracking-[0.28em] text-slate-500">30-day roadmap</div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {liveBlueprint.roadmap.map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-300">{item}</div>)}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
