/**
 * Engine NotREAL — Interactive Business Machine
 * /command — config-driven simulator, zero backend dependency
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Activity, ArrowRight, BarChart3, Bot, BrainCircuit, BriefcaseBusiness,
  Building2, CheckCircle2, ChevronDown, ChevronRight, CreditCard,
  Database, FileText, Flame, Globe2, LineChart, MessageCircle, MessageSquare,
  Plus, Rocket, RotateCcw, Search, Server, ShieldCheck, ShoppingBag,
  Sparkles, Target, TimerReset, TrendingUp, UsersRound, WandSparkles,
  Wifi, WifiOff, X, Zap, Command, CheckSquare, Square, Clock,
} from 'lucide-react'

// ── Constants ─────────────────────────────────────────────────────────────────

const BUSINESS_TYPES = ['Digital Agency', 'Local Restaurant', 'E-commerce Brand', 'Coaching / Service', 'SaaS Idea', 'Real Estate', 'Custom Business']
const MARKETS = ['Bangladesh', 'United States', 'Global', 'Local City', 'Online-first']
const STAGES = ['Idea', 'Launching', 'Getting Leads', 'Sales Stuck', 'Operations Messy', 'Scaling']
const PROBLEMS = ['No clear offer', 'No leads', 'Low conversion', 'Messy operations', 'Need launch plan', 'Need automation', 'Need better content', 'Need sales system']
const BUDGETS = ['Low ($0–$500)', 'Medium ($500–$2K)', 'Growth ($2K–$10K)', 'Agency ($10K+)']

const SERVICE_PACKS = [
  {
    id: 'starter-growth', title: 'Starter Growth Engine', category: 'Launch', price: '$49+',
    signal: 'Best MVP entry', bestFor: 'New founders needing a first packaged offer',
    outcome: 'Clear offer + first 20 leads in 30 days',
    deliverables: ['Business positioning doc', 'Landing page copy', 'Lead capture setup', '30-day action map', 'Offer messaging guide'],
    timeline: '7–10 days', matchProblems: ['No clear offer', 'Need launch plan', 'No leads'],
  },
  {
    id: 'messenger-sales', title: 'Messenger Sales Machine', category: 'Sales', price: '$149+',
    signal: 'BD + local business', bestFor: 'Local businesses using WhatsApp / Messenger',
    outcome: 'Repeatable sales process from first DM to close',
    deliverables: ['Sales script library', 'Qualifier questions', 'Follow-up sequences', 'Objection handling doc', 'CRM stage map'],
    timeline: '5–7 days', matchProblems: ['Low conversion', 'Need sales system', 'No leads'],
  },
  {
    id: 'booked-calls', title: 'Booked Calls Funnel', category: 'Funnel', price: '$299+',
    signal: 'US/global ready', bestFor: 'Consultants and agencies selling high-ticket services',
    outcome: 'Automated booking pipeline with qualified prospects',
    deliverables: ['Lead magnet', 'Booking page copy', 'Qualification form', 'CRM stages', 'Call-prep sequence'],
    timeline: '10–14 days', matchProblems: ['Low conversion', 'Need sales system', 'No leads'],
  },
  {
    id: 'creative-sprint', title: 'Creative Sprint Pack', category: 'Content', price: '$99+',
    signal: 'Fast content', bestFor: 'Brands needing content without hiring a team',
    outcome: '30+ content pieces ready to publish in 48 hours',
    deliverables: ['Ad copy variants', 'Reel hooks (×10)', 'Carousel angles', 'Email sequences', 'Product messaging'],
    timeline: '2–3 days', matchProblems: ['Need better content', 'No leads'],
  },
  {
    id: 'ai-sales-assistant', title: 'AI Sales Assistant', category: 'AI Tool', price: '$499+',
    signal: 'Premium build', bestFor: 'Businesses wanting AI-powered sales automation',
    outcome: 'AI handles first response + qualification 24/7',
    deliverables: ['Custom AI assistant', 'Sales reply flows', 'Objection handling AI', 'CRM integration', 'Training & handoff'],
    timeline: '14–21 days', matchProblems: ['Need automation', 'Need sales system', 'Messy operations'],
  },
]

const AI_PROVIDERS = [
  { name: 'Groq', color: '#f97316', best: 'Ultra-fast inference', capability: 'Speed' },
  { name: 'OpenAI', color: '#10b981', best: 'Versatile reasoning', capability: 'Strategy' },
  { name: 'Anthropic', color: '#8b5cf6', best: 'Long-form writing', capability: 'Writing' },
  { name: 'Gemini', color: '#3b82f6', best: 'Multimodal tasks', capability: 'Research' },
  { name: 'Mistral', color: '#ef4444', best: 'European-grade data handling', capability: 'Analysis' },
  { name: 'Together', color: '#06b6d4', best: 'Open model hosting', capability: 'Custom' },
  { name: 'DeepSeek', color: '#22c55e', best: 'Code & logic tasks', capability: 'Coding' },
  { name: 'xAI', color: '#a855f7', best: 'Real-time data access', capability: 'Data' },
  { name: 'Perplexity', color: '#0ea5e9', best: 'Web search & research', capability: 'Search' },
]

const COMMAND_PALETTE_COMMANDS = [
  { id: 'scan', label: 'Run Business Scan', icon: Sparkles, action: 'scan' },
  { id: 'blueprint', label: 'View Blueprint', icon: FileText, action: 'mode:create' },
  { id: 'fixer', label: 'Open Fixer Mode', icon: WandSparkles, action: 'mode:fix' },
  { id: 'crm', label: 'Open CRM / Run', icon: BarChart3, action: 'mode:run' },
  { id: 'market', label: 'View Marketplace', icon: ShoppingBag, action: 'mode:sell' },
  { id: 'ai', label: 'Explore AI Mesh', icon: BrainCircuit, action: 'mode:ai-mesh' },
  { id: 'reset', label: 'Reset Simulation', icon: RotateCcw, action: 'reset' },
]

const ALL_ACTIONS = [
  'Clarify core offer', 'Write landing page copy', 'Launch lead magnet', 'Setup CRM pipeline',
  'Create 7-day content sprint', 'Start Messenger sales flow', 'Add service request form',
  'Build marketplace listing', 'Run follow-up campaign', 'Define target audience',
  'Create pricing tiers', 'Launch referral program', 'Setup email automation',
  'Record brand video', 'Build proposal template',
]

// ── Types ─────────────────────────────────────────────────────────────────────

type Mode = 'command' | 'create' | 'fix' | 'run' | 'sell' | 'ai-mesh'
type ActionStatus = 'todo' | 'doing' | 'done'

interface BusinessConfig {
  businessType: string; market: string; stage: string; problem: string; budget: string
}

interface ActionItem { id: string; label: string; status: ActionStatus }
interface Pack { id: string; title: string; category: string; price: string; signal: string; bestFor: string; outcome: string; deliverables: string[]; timeline: string; matchProblems: string[] }

// ── Dynamic Content Generators ───────────────────────────────────────────────

function getDiagnosis(cfg: BusinessConfig) {
  const d: Record<string, { diagnosis: string; rootCause: string; fixStrategy: string; priorityActions: string[]; urgency: 'Critical' | 'High' | 'Medium'; confidence: number; nextMove: string }> = {
    'No clear offer': {
      diagnosis: `Your ${cfg.businessType} is visible but not compelling to ${cfg.market} buyers.`,
      rootCause: 'Operating as a generalist. Buyers can\'t self-select or justify premium pricing without a named, specific outcome.',
      fixStrategy: 'Create 1 productized offer: specific outcome, named format, clear delivery timeline.',
      priorityActions: ['Name and price one specific offer', 'Write a 1-line outcome statement', 'Add a direct CTA to your most visited page'],
      urgency: 'High', confidence: 88,
      nextMove: 'Run the Starter Growth Engine to get your offer positioned in 7 days.',
    },
    'No leads': {
      diagnosis: `The ${cfg.businessType} isn't generating consistent inbound for the ${cfg.market} market.`,
      rootCause: `At the ${cfg.stage} stage, lead generation needs a deliberate channel — not hope. ${cfg.budget === 'Low ($0–$500)' ? 'With a lean budget, organic outreach is the fastest path.' : 'With your budget, a paid + organic hybrid can scale fast.'}`,
      fixStrategy: 'Pick 1 lead channel. Build a simple lead magnet. Start 20 outreach conversations this week.',
      priorityActions: ['Choose: inbound or outbound as primary channel', 'Create a simple lead magnet (checklist or guide)', 'Send 20 personalised outreach messages this week'],
      urgency: 'Critical', confidence: 91,
      nextMove: 'Messenger Sales Machine activates a repeatable outreach flow within 7 days.',
    },
    'Low conversion': {
      diagnosis: `Leads are coming in but the ${cfg.businessType} is losing them before close.`,
      rootCause: 'No structured follow-up, weak objection handling, or a CTA that asks too much too soon.',
      fixStrategy: 'Add a 3-touch follow-up sequence. Address top 3 objections in the sales flow.',
      priorityActions: ['Map the current sales journey from first contact to close', 'Write responses to top 3 objections', 'Add a lower-commitment middle CTA (call, demo, or audit)'],
      urgency: 'High', confidence: 85,
      nextMove: 'Booked Calls Funnel installs a qualification + booking system that converts browsers to buyers.',
    },
    'Messy operations': {
      diagnosis: `The ${cfg.businessType} is growing but internal execution is breaking down.`,
      rootCause: 'No documented processes, everything runs through one person, tasks fall through cracks.',
      fixStrategy: 'Document 3 core workflows. Assign ownership. Install one project tracking tool.',
      priorityActions: ['List every recurring task > 2hrs/week', 'Document the 3 most broken processes', 'Assign one owner to each operational area'],
      urgency: 'Medium', confidence: 82,
      nextMove: 'AI Sales Assistant can automate your most time-consuming client-facing operations.',
    },
    'Need launch plan': {
      diagnosis: `The ${cfg.businessType} idea is ready but there's no structured go-to-market for ${cfg.market}.`,
      rootCause: 'No sequenced launch plan means energy is wasted on non-essential tasks before revenue.',
      fixStrategy: 'Create a 30-day launch sequence: offer → outreach → CRM → first sale.',
      priorityActions: ['Lock the launch date (pick a date in 30 days)', 'Identify 50 potential first buyers', 'Write the launch announcement message'],
      urgency: 'High', confidence: 90,
      nextMove: 'Starter Growth Engine delivers a full launch blueprint in 10 days.',
    },
    'Need automation': {
      diagnosis: `The ${cfg.businessType} is manually doing work that should run on autopilot.`,
      rootCause: 'No automation means scaling requires proportionally more people and time.',
      fixStrategy: 'Identify the 3 highest-volume repetitive tasks and automate each with one tool.',
      priorityActions: ['Audit: what takes >3hrs/week that follows the same pattern?', 'Map the ideal automated flow for your top process', 'Choose automation tool: Zapier, Make, or custom AI'],
      urgency: 'Medium', confidence: 79,
      nextMove: 'AI Sales Assistant builds custom AI automation for your highest-value repetitive workflows.',
    },
    'Need better content': {
      diagnosis: `The ${cfg.businessType} content isn't generating attention or leads in ${cfg.market}.`,
      rootCause: 'Content lacks a specific POV, speaks too broadly, or isn\'t formatted for the right channel.',
      fixStrategy: 'Pick 1 content format. Produce 10 pieces with a consistent angle. Measure what works.',
      priorityActions: ['Define 1 content format to own (reels, newsletters, carousels)', 'Write 5 hooks for your core offer', 'Create a 7-day content calendar'],
      urgency: 'Medium', confidence: 84,
      nextMove: 'Creative Sprint Pack delivers 30+ content pieces in 48 hours.',
    },
    'Need sales system': {
      diagnosis: `The ${cfg.businessType} relies on ad-hoc selling — no repeatable system exists.`,
      rootCause: 'Each sale is custom, takes full attention, and can\'t be delegated or scaled.',
      fixStrategy: 'Build a documented sales playbook: from first contact to close to follow-up.',
      priorityActions: ['Write the 5-step sales conversation script', 'Create a standard proposal template', 'Build a simple CRM pipeline with 5 stages'],
      urgency: 'High', confidence: 87,
      nextMove: 'Messenger Sales Machine installs a full manual-to-automated sales system.',
    },
  }
  return d[cfg.problem] || d['No clear offer']
}

function getBlueprint(cfg: BusinessConfig) {
  const offerMap: Record<string, string> = {
    'Digital Agency': 'Done-for-you business systems sprint',
    'Local Restaurant': 'Online ordering + local delivery growth package',
    'E-commerce Brand': 'Conversion-focused product launch bundle',
    'Coaching / Service': '90-day transformation coaching program',
    'SaaS Idea': 'MVP validation and first 100 users sprint',
    'Real Estate': 'Lead generation + listing conversion system',
    'Custom Business': 'Custom business fix and growth sprint',
  }
  const audienceMap: Record<string, string> = {
    'Digital Agency': 'SME owners spending 20+ hrs/week on ops instead of clients',
    'Local Restaurant': 'Local food lovers who order 3+ times per week',
    'E-commerce Brand': 'Online shoppers comparing 3+ options before buying',
    'Coaching / Service': 'Ambitious professionals stuck at a specific life/career bottleneck',
    'SaaS Idea': 'Teams manually doing what software should automate',
    'Real Estate': 'Buyers and investors in a specific locality or asset class',
    'Custom Business': 'Target customers who have the problem you solve',
  }
  const pricingMap: Record<string, string> = {
    'Bangladesh': 'বিনামূল্যে শুরু → ৳5,000–৳25,000/mo',
    'United States': 'Free trial → $49–$499/month',
    'Global': 'Free → $49–$299/month (geo-adjusted)',
    'Local City': 'Free audit → $99–$499 one-time',
    'Online-first': 'Freemium → $29–$199/month',
  }
  const channelMap: Record<string, string> = {
    'Bangladesh': 'Facebook groups, WhatsApp outreach, local referrals',
    'United States': 'LinkedIn outreach, Google Ads, cold email',
    'Global': 'SEO content, YouTube, email newsletter',
    'Local City': 'Local SEO, referral loops, community events',
    'Online-first': 'Social media, influencer collab, content marketing',
  }
  const roadmap: Record<string, string[]> = {
    'Idea': ['Days 1–7: Validate with 10 conversations', 'Days 8–18: Build MVP offer & landing page', 'Days 19–30: Get first 3 paying customers'],
    'Launching': ['Days 1–7: Finalize offer & pricing', 'Days 8–18: Launch outreach to 50 prospects', 'Days 19–30: Convert first 10 clients'],
    'Getting Leads': ['Days 1–7: Optimize lead magnet', 'Days 8–18: Add follow-up automation', 'Days 19–30: Hit 50 qualified leads'],
    'Sales Stuck': ['Days 1–7: Fix the pitch deck + objection script', 'Days 8–18: Run 20 sales calls', 'Days 19–30: Close 5 new deals'],
    'Operations Messy': ['Days 1–7: Document 3 core workflows', 'Days 8–18: Delegate or automate 2 tasks', 'Days 19–30: Hire or tool to fill the gap'],
    'Scaling': ['Days 1–7: Identify the #1 bottleneck to scale', 'Days 8–18: Systematise and delegate', 'Days 19–30: Launch next growth channel'],
  }
  return {
    offer: offerMap[cfg.businessType] || offerMap['Custom Business'],
    audience: audienceMap[cfg.businessType] || audienceMap['Custom Business'],
    pricing: pricingMap[cfg.market] || pricingMap['Global'],
    channel: channelMap[cfg.market] || channelMap['Global'],
    cta: 'Book a free strategy call',
    roadmap: roadmap[cfg.stage] || roadmap['Idea'],
    nextActions: [
      `Publish the core offer page for ${cfg.businessType}`,
      `Run 20 outreach conversations in ${cfg.market}`,
      'Package 3 service tiers with clear pricing',
      'Track every lead in a CRM from day 1',
      'Convert top 3 service wins into marketplace listings',
    ],
  }
}

function getMatchedPacks(problem: string) {
  return SERVICE_PACKS.map(pack => ({
    ...pack,
    score: pack.matchProblems.includes(problem)
      ? pack.matchProblems.indexOf(problem) === 0 ? 95 : pack.matchProblems.indexOf(problem) === 1 ? 82 : 71
      : Math.floor(40 + Math.random() * 20),
  })).sort((a, b) => b.score - a.score)
}

function getDefaultActions(problem: string): ActionItem[] {
  const actionMap: Record<string, string[]> = {
    'No clear offer': ['Clarify core offer', 'Write landing page copy', 'Create pricing tiers'],
    'No leads': ['Launch lead magnet', 'Start Messenger sales flow', 'Define target audience'],
    'Low conversion': ['Create 7-day content sprint', 'Build proposal template', 'Add service request form'],
    'Messy operations': ['Setup CRM pipeline', 'Run follow-up campaign', 'Record brand video'],
    'Need launch plan': ['Write landing page copy', 'Define target audience', 'Launch lead magnet'],
    'Need automation': ['Setup email automation', 'Add service request form', 'Setup CRM pipeline'],
    'Need better content': ['Create 7-day content sprint', 'Record brand video', 'Launch referral program'],
    'Need sales system': ['Start Messenger sales flow', 'Build proposal template', 'Setup CRM pipeline'],
  }
  return (actionMap[problem] || actionMap['No clear offer']).map(label => ({
    id: label, label, status: 'todo' as ActionStatus,
  }))
}

// ── Utility ──────────────────────────────────────────────────────────────────

function cx(...c: (string | boolean | undefined | null)[]) { return c.filter(Boolean).join(' ') }
const ease = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } }

// ── UI Atoms ──────────────────────────────────────────────────────────────────

function Pill({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cx(
      'whitespace-nowrap rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-all duration-150',
      active ? 'border-indigo-400/50 bg-indigo-500/20 text-indigo-200' : 'border-white/[0.07] bg-white/[0.03] text-slate-400 hover:border-white/[0.14] hover:text-slate-200',
    )}>
      {children}
    </button>
  )
}

function Card({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={cx(
      'rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm',
      onClick && 'cursor-pointer transition-all hover:border-indigo-500/30 hover:bg-white/[0.05]',
      className,
    )}>
      {children}
    </div>
  )
}

function UrgencyBadge({ level }: { level: string }) {
  const colors = { Critical: 'bg-red-500/15 text-red-300 border-red-500/25', High: 'bg-amber-500/15 text-amber-300 border-amber-500/25', Medium: 'bg-blue-500/15 text-blue-300 border-blue-500/25' }
  return <span className={cx('rounded-md border px-2 py-0.5 text-[11px] font-semibold', colors[level as keyof typeof colors])}>{level}</span>
}

function StatusIcon({ status, onClick }: { status: ActionStatus; onClick: () => void }) {
  const s = { todo: <Square className="h-4 w-4 text-slate-500" />, doing: <Clock className="h-4 w-4 text-amber-400" />, done: <CheckSquare className="h-4 w-4 text-emerald-400" /> }
  return <button onClick={onClick} className="shrink-0">{s[status]}</button>
}

// ── Scan Progress ─────────────────────────────────────────────────────────────

const SCAN_STEPS = ['Reading business type', 'Mapping market conditions', 'Detecting bottleneck', 'Building fix plan', 'Matching service packs']

function ScanProgress({ step, done }: { step: number; done: boolean }) {
  if (done) return null
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <Card className="w-full max-w-sm p-6">
        <div className="mb-4 flex items-center gap-3">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
            <Sparkles className="h-5 w-5 text-indigo-400" />
          </motion.div>
          <span className="text-sm font-semibold text-white">Running Business Scan</span>
        </div>
        <div className="space-y-2.5">
          {SCAN_STEPS.map((s, i) => (
            <div key={s} className={cx('flex items-center gap-3 text-[13px] transition-all duration-300', i < step ? 'text-slate-300' : i === step ? 'text-indigo-300' : 'text-slate-600')}>
              {i < step ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" /> : i === step ? <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}><div className="h-4 w-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" /></motion.div> : <div className="h-4 w-4 shrink-0 rounded-full border border-slate-600" />}
              {s}
            </div>
          ))}
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" animate={{ width: `${(step / SCAN_STEPS.length) * 100}%` }} />
        </div>
      </Card>
    </motion.div>
  )
}

// ── Command Palette ───────────────────────────────────────────────────────────

function CommandPalette({ onClose, onCmd }: { onClose: () => void; onCmd: (action: string) => void }) {
  const [q, setQ] = useState('')
  const results = COMMAND_PALETTE_COMMANDS.filter(c => c.label.toLowerCase().includes(q.toLowerCase()))
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { ref.current?.focus() }, [])
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center pt-28 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ y: -12, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: -12, scale: 0.97 }} className="w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#0d0d17] shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3.5">
          <Search className="h-4 w-4 shrink-0 text-slate-500" />
          <input ref={ref} value={q} onChange={e => setQ(e.target.value)} placeholder="Type a command..." className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600" />
          <kbd className="rounded border border-white/[0.08] px-1.5 py-0.5 text-[10px] text-slate-500">ESC</kbd>
        </div>
        <div className="p-2">
          {results.map(cmd => (
            <button key={cmd.id} onClick={() => { onCmd(cmd.action); onClose() }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.05] hover:text-white">
              <cmd.icon className="h-4 w-4 text-indigo-400" /> {cmd.label}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Service Modal ─────────────────────────────────────────────────────────────

function ServiceModal({ pack, onClose, onRequest }: { pack: Pack; onClose: () => void; onRequest: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ y: 20, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.96 }} className="w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#0d0d17] p-6" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <span className="rounded-md border border-indigo-500/25 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-semibold text-indigo-300">{pack.category}</span>
            <h3 className="mt-3 text-2xl font-bold text-white">{pack.title}</h3>
          </div>
          <button onClick={onClose} className="rounded-lg bg-white/[0.05] p-2 transition hover:bg-white/[0.1]"><X className="h-4 w-4 text-slate-400" /></button>
        </div>
        <p className="text-sm leading-relaxed text-slate-400">Best for: {pack.bestFor}</p>
        <div className="mt-1 text-2xl font-bold text-indigo-400">{pack.price}</div>
        <div className="mt-4">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Deliverables</div>
          <div className="space-y-2">
            {pack.deliverables.map(d => (
              <div key={d} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" /> {d}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Card className="p-3"><div className="text-[10px] uppercase tracking-wider text-slate-500">Timeline</div><div className="mt-1 text-sm font-semibold text-white">{pack.timeline}</div></Card>
          <Card className="p-3"><div className="text-[10px] uppercase tracking-wider text-slate-500">Expected Outcome</div><div className="mt-1 text-sm font-semibold text-white">{pack.outcome}</div></Card>
        </div>
        <div className="mt-5 flex gap-3">
          <button onClick={onRequest} className="flex-1 rounded-xl bg-indigo-500 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400">Request This Service</button>
          <Link to="/fixer" className="rounded-xl border border-white/[0.1] px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.05]">Open Fixer</Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Configurator Panel ────────────────────────────────────────────────────────

function Configurator({ cfg, setCfg, onScan, scanning }: { cfg: BusinessConfig; setCfg: React.Dispatch<React.SetStateAction<BusinessConfig>>; onScan: () => void; scanning: boolean }) {
  const set = (k: keyof BusinessConfig) => (v: string) => setCfg(prev => ({ ...prev, [k]: v }))
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto">
      <div>
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Business type</div>
        <div className="flex flex-wrap gap-1.5">{BUSINESS_TYPES.map(x => <Pill key={x} active={cfg.businessType === x} onClick={() => set('businessType')(x)}>{x}</Pill>)}</div>
      </div>
      <div>
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Market</div>
        <div className="flex flex-wrap gap-1.5">{MARKETS.map(x => <Pill key={x} active={cfg.market === x} onClick={() => set('market')(x)}>{x}</Pill>)}</div>
      </div>
      <div>
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Stage</div>
        <div className="flex flex-wrap gap-1.5">{STAGES.map(x => <Pill key={x} active={cfg.stage === x} onClick={() => set('stage')(x)}>{x}</Pill>)}</div>
      </div>
      <div>
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Main problem</div>
        <div className="flex flex-wrap gap-1.5">{PROBLEMS.map(x => <Pill key={x} active={cfg.problem === x} onClick={() => set('problem')(x)}>{x}</Pill>)}</div>
      </div>
      <div>
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Budget</div>
        <div className="flex flex-wrap gap-1.5">{BUDGETS.map(x => <Pill key={x} active={cfg.budget === x} onClick={() => set('budget')(x)}>{x}</Pill>)}</div>
      </div>
      <button onClick={onScan} disabled={scanning} className="mt-auto w-full rounded-xl bg-indigo-500 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition hover:bg-indigo-400 disabled:opacity-50">
        <Sparkles className="mr-2 inline h-4 w-4" /> Run Business Scan
      </button>
    </div>
  )
}

// ── Screens ───────────────────────────────────────────────────────────────────

function CommandHome({ cfg, health, setMode }: { cfg: BusinessConfig; health: unknown; setMode: (m: Mode) => void }) {
  return (
    <motion.div key="cmd" {...ease} className="space-y-5">
      <Card className="relative overflow-hidden p-6 md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/[0.07] blur-3xl" />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-1.5 text-[12px] font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Engine Online — Pick selections → Run Scan
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
            Create. Fix. Run. Sell.{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">One AI Engine.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">
            Configure your business on the left → Run Scan → watch the engine generate your diagnosis, blueprint, CRM, and marketplace matches in real time.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {(['create', 'fix', 'run', 'sell'] as const).map(m => {
              const icons = { create: Rocket, fix: WandSparkles, run: BarChart3, sell: ShoppingBag } as const
              const labels = { create: 'Blueprint', fix: 'Fixer', run: 'CRM', sell: 'Marketplace' } as const
              const Icon = icons[m]
              return (
                <button key={m} onClick={() => setMode(m)} className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-200">
                  <Icon className="h-4 w-4" /> {labels[m]}
                </button>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Live config summary */}
      <Card className="p-4">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Current Business Config</div>
        <div className="flex flex-wrap gap-2">
          {[cfg.businessType, cfg.market, cfg.stage, cfg.problem, cfg.budget].map(v => (
            <span key={v} className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[12px] text-slate-300">{v}</span>
          ))}
        </div>
        <p className="mt-3 text-[13px] text-slate-500">← Change the selectors on the left to update all panels instantly.</p>
      </Card>

      {/* Status row */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'AI Mode', value: (health as any)?.ai?.demoMode === false ? 'Live' : 'Demo', icon: BrainCircuit },
          { label: 'Database', value: (health as any)?.database?.mode === 'supabase' ? 'Supabase' : 'Memory', icon: Database },
          { label: 'Backend', value: health ? 'Connected' : 'Offline', icon: Server },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <s.icon className="mb-1.5 h-4 w-4 text-indigo-400" />
            <div className="text-[10px] uppercase tracking-wider text-slate-500">{s.label}</div>
            <div className="mt-0.5 text-sm font-semibold text-white">{s.value}</div>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}

function CreateMode({ cfg, scanned }: { cfg: BusinessConfig; scanned: boolean }) {
  const bp = useMemo(() => getBlueprint(cfg), [cfg])
  return (
    <motion.div key="create" {...ease} className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Business Blueprint</div>
          <h2 className="mt-0.5 text-2xl font-bold text-white">{cfg.businessType} · {cfg.market}</h2>
        </div>
        {!scanned && <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-[12px] text-amber-300">← Run Scan to refine</div>}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { icon: Target, label: 'Core Offer', value: bp.offer },
          { icon: UsersRound, label: 'Target Audience', value: bp.audience },
          { icon: LineChart, label: 'Pricing Suggestion', value: bp.pricing },
          { icon: MessageCircle, label: 'Best Channel', value: bp.channel },
        ].map(c => (
          <Card key={c.label} className="p-4">
            <c.icon className="mb-2 h-4 w-4 text-indigo-400" />
            <div className="text-[10px] uppercase tracking-wider text-slate-500">{c.label}</div>
            <div className="mt-1 text-sm font-medium text-white">{c.value}</div>
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">30-Day Roadmap — {cfg.stage} stage</div>
        <div className="grid gap-3 md:grid-cols-3">
          {bp.roadmap.map((r, i) => (
            <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="text-sm font-semibold text-indigo-400">{r.split(':')[0]}</div>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{r.split(':')[1]}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-5">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Next 5 Actions</div>
        <div className="space-y-2">
          {bp.nextActions.map((a, i) => (
            <div key={a} className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] p-3 text-sm text-slate-300">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-500/20 text-[11px] font-bold text-indigo-300">{i + 1}</span>
              {a}
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

function FixMode({ cfg, scanned }: { cfg: BusinessConfig; scanned: boolean }) {
  const diag = useMemo(() => getDiagnosis(cfg), [cfg])
  return (
    <motion.div key="fix" {...ease} className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Fixer Diagnosis</div>
          <h2 className="mt-0.5 text-2xl font-bold text-white">{cfg.problem}</h2>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <UrgencyBadge level={diag.urgency} />
          <span className="text-[12px] font-semibold text-emerald-400">{diag.confidence}% confident</span>
        </div>
      </div>
      <Card className="border-l-2 border-l-indigo-500 p-5">
        <div className="text-[10px] uppercase tracking-wider text-slate-500">Diagnosis</div>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-200">{diag.diagnosis}</p>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="p-4">
          <Database className="mb-2 h-4 w-4 text-indigo-400" />
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Root Cause</div>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{diag.rootCause}</p>
        </Card>
        <Card className="p-4">
          <WandSparkles className="mb-2 h-4 w-4 text-indigo-400" />
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Fix Strategy</div>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{diag.fixStrategy}</p>
        </Card>
      </div>
      <Card className="p-5">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Priority Actions</div>
        <div className="space-y-2">
          {diag.priorityActions.map((a, i) => (
            <div key={a} className="flex items-start gap-3 text-sm text-slate-300">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/25 text-[10px] font-bold text-indigo-300">{i + 1}</span>
              {a}
            </div>
          ))}
        </div>
      </Card>
      <Card className="border border-indigo-500/20 bg-indigo-500/[0.06] p-4">
        <Rocket className="mb-1.5 h-4 w-4 text-indigo-400" />
        <div className="text-[10px] uppercase tracking-wider text-indigo-400">Next Best Move</div>
        <p className="mt-1 text-sm text-slate-200">{diag.nextMove}</p>
      </Card>
      {!scanned && <p className="text-center text-[12px] text-slate-600">Run Scan to sharpen the diagnosis based on your full config.</p>}
    </motion.div>
  )
}

function RunMode({ cfg, requestStack, setRequestStack }: { cfg: BusinessConfig; requestStack: string[]; setRequestStack: React.Dispatch<React.SetStateAction<string[]>> }) {
  const leads = cfg.market === 'Bangladesh' ? 47 : cfg.market === 'United States' ? 128 : 83
  const pipeline = cfg.stage === 'Scaling' ? '$24K' : cfg.stage === 'Getting Leads' ? '$3.2K' : '$8.7K'
  return (
    <motion.div key="run" {...ease} className="space-y-4">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Run / CRM</div>
        <h2 className="mt-0.5 text-2xl font-bold text-white">Pipeline Control Room</h2>
        <p className="mt-0.5 text-[13px] text-slate-500">Simulated for {cfg.businessType} · {cfg.market}</p>
      </div>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {[
          { icon: UsersRound, label: 'Leads', value: String(leads) },
          { icon: Activity, label: 'Active', value: '17' },
          { icon: CreditCard, label: 'Pipeline', value: pipeline },
          { icon: Globe2, label: 'Markets', value: '3' },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <s.icon className="mb-1.5 h-4 w-4 text-indigo-400" />
            <div className="text-[10px] uppercase tracking-wider text-slate-500">{s.label}</div>
            <div className="mt-0.5 text-xl font-bold text-white">{s.value}</div>
          </Card>
        ))}
      </div>
      <div className="space-y-2">
        {[
          { lead: `${cfg.businessType} — Lead 1`, stage: 'Fixer Diagnosis', value: cfg.market === 'Bangladesh' ? '৳18K' : '$350', health: 83 },
          { lead: `${cfg.market} Prospect`, stage: 'Proposal Sent', value: cfg.market === 'Bangladesh' ? '৳60K' : '$1,200', health: 71 },
          { lead: 'Repeat Client', stage: 'Blueprint Ready', value: cfg.market === 'Bangladesh' ? '৳40K' : '$790', health: 92 },
        ].map(item => (
          <Card key={item.lead} className="p-4" onClick={undefined}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">{item.lead}</div>
                <div className="text-[12px] text-slate-500">{item.stage}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right"><div className="text-[10px] text-slate-600">Value</div><div className="text-sm font-bold text-indigo-400">{item.value}</div></div>
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${item.health}%` }} /></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {requestStack.length > 0 && (
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Active Request Stack</div>
            <button onClick={() => setRequestStack([])} className="text-[11px] text-slate-600 hover:text-slate-400">Clear</button>
          </div>
          <div className="space-y-2">
            {requestStack.map((r, i) => (
              <div key={`${r}-${i}`} className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] p-3 text-sm text-slate-300">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/20 text-[11px] font-bold text-indigo-300">{i + 1}</span>
                {r} <ArrowRight className="ml-auto h-3.5 w-3.5 text-slate-600" />
              </div>
            ))}
          </div>
        </Card>
      )}
    </motion.div>
  )
}

function SellMode({ cfg, onSelectPack }: { cfg: BusinessConfig; onSelectPack: (pack: Pack) => void }) {
  const [q, setQ] = useState('')
  const matched = useMemo(() => getMatchedPacks(cfg.problem).filter(p => p.title.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase())), [cfg.problem, q])
  return (
    <motion.div key="sell" {...ease} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Marketplace</div>
          <h2 className="mt-0.5 text-2xl font-bold text-white">Matched Service Packs</h2>
          <p className="text-[13px] text-slate-500">Sorted by match for: {cfg.problem}</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search services..." className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] py-2.5 pl-9 pr-4 text-[13px] text-white outline-none transition focus:border-indigo-500/40 sm:w-64" />
        </div>
      </div>
      <div className="space-y-3">
        {matched.map(pack => (
          <Card key={pack.id} className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">{pack.category}</span>
                  <div className={cx('flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold', pack.score >= 85 ? 'bg-emerald-500/15 text-emerald-300' : pack.score >= 70 ? 'bg-amber-500/15 text-amber-300' : 'bg-slate-500/15 text-slate-400')}>
                    {pack.score}% match
                  </div>
                </div>
                <h3 className="mt-2 text-base font-semibold text-white">{pack.title}</h3>
                <p className="mt-1 text-[13px] text-slate-500">{pack.bestFor}</p>
                <div className="mt-2 text-sm font-bold text-indigo-400">{pack.price}</div>
              </div>
              <button onClick={() => onSelectPack(pack)} className="shrink-0 rounded-xl bg-indigo-500/15 px-4 py-2 text-[13px] font-medium text-indigo-300 transition hover:bg-indigo-500/25">
                View →
              </button>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}

function ActionStackMode({ actions, setActions, cfg }: { actions: ActionItem[]; setActions: React.Dispatch<React.SetStateAction<ActionItem[]>>; cfg: BusinessConfig }) {
  const cycle = (id: string) => setActions(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'todo' ? 'doing' : a.status === 'doing' ? 'done' : 'todo' } : a))
  const addAction = (label: string) => { if (!actions.find(a => a.label === label)) setActions(prev => [...prev, { id: label, label, status: 'todo' }]) }
  const remove = (id: string) => setActions(prev => prev.filter(a => a.id !== id))
  const avail = ALL_ACTIONS.filter(a => !actions.find(x => x.label === a))
  return (
    <motion.div key="stack" {...ease} className="space-y-4">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Action Stack</div>
        <h2 className="mt-0.5 text-2xl font-bold text-white">Build Your Execution Plan</h2>
        <p className="text-[13px] text-slate-500">Click status icon to cycle: To Do → Doing → Done</p>
      </div>
      <div className="space-y-2">
        <AnimatePresence>
          {actions.map(a => (
            <motion.div key={a.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <Card className={cx('flex items-center gap-3 p-3.5', a.status === 'done' && 'opacity-50')}>
                <StatusIcon status={a.status} onClick={() => cycle(a.id)} />
                <span className={cx('flex-1 text-sm', a.status === 'done' ? 'line-through text-slate-500' : 'text-slate-200')}>{a.label}</span>
                <button onClick={() => remove(a.id)} className="rounded p-1 text-slate-600 transition hover:text-slate-400"><X className="h-3.5 w-3.5" /></button>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {avail.length > 0 && (
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-600">Add actions</div>
          <div className="flex flex-wrap gap-2">
            {avail.slice(0, 8).map(a => (
              <button key={a} onClick={() => addAction(a)} className="flex items-center gap-1.5 rounded-lg border border-dashed border-white/[0.1] px-3 py-1.5 text-[12px] text-slate-500 transition hover:border-indigo-500/30 hover:text-slate-300">
                <Plus className="h-3 w-3" /> {a}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-3 gap-3 pt-2">
        {(['todo', 'doing', 'done'] as ActionStatus[]).map(s => (
          <Card key={s} className="p-3 text-center">
            <div className="text-2xl font-bold text-white">{actions.filter(a => a.status === s).length}</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 capitalize">{s}</div>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}

function AIMeshMode() {
  const [active, setActive] = useState(AI_PROVIDERS[0])
  return (
    <motion.div key="ai" {...ease} className="space-y-4">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">AI Mesh</div>
        <h2 className="mt-0.5 text-2xl font-bold text-white">Provider-Ready Architecture</h2>
        <p className="text-[13px] text-slate-500">40+ model-ready design. Connect live providers through environment keys.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {AI_PROVIDERS.map(p => (
          <button key={p.name} onClick={() => setActive(p)} className={cx('rounded-lg border px-3.5 py-2 text-sm font-medium transition', active.name === p.name ? 'border-indigo-400/40 bg-indigo-500/15 text-white' : 'border-white/[0.07] bg-white/[0.02] text-slate-400 hover:text-slate-200')}>
            <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: p.color }} />{p.name}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={active.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm text-white" style={{ background: active.color + '25', border: `1px solid ${active.color}40` }}>
                {active.name[0]}
              </div>
              <div>
                <div className="text-base font-bold text-white">{active.name}</div>
                <div className="text-[12px] text-slate-500">Best for: {active.best}</div>
              </div>
              <span className="ml-auto rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-semibold text-indigo-300">{active.capability}</span>
            </div>
            <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-[12px] text-slate-500">
              Connect via <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[11px] text-slate-300">{active.name.toUpperCase()}_API_KEY</code> in <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[11px] text-slate-300">apps/backend/.env</code>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
      <Card className="p-5">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">All Providers</div>
        <div className="grid gap-2 sm:grid-cols-3">
          {AI_PROVIDERS.map(p => (
            <div key={p.name} className="flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] p-2.5">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: p.color }} />
              <div>
                <div className="text-[12px] font-medium text-slate-300">{p.name}</div>
                <div className="text-[10px] text-slate-600">{p.capability}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

// ── Engine Health ─────────────────────────────────────────────────────────────

function useEngineHealth() {
  const [health, setHealth] = useState<unknown>(null)
  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
    fetch(`${base}/health`, { signal: AbortSignal.timeout(3000) }).then(r => r.json()).then(setHealth).catch(() => {})
  }, [])
  return health
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function CommandPage() {
  const [mode, setMode] = useState<Mode>('command')
  const [cfg, setCfg] = useState<BusinessConfig>({ businessType: 'Digital Agency', market: 'Bangladesh', stage: 'Getting Leads', problem: 'Low conversion', budget: 'Medium ($500–$2K)' })
  const [scanned, setScanned] = useState(false)
  const [scanStep, setScanStep] = useState(-1)
  const [scanning, setScanning] = useState(false)
  const [palOpen, setPalOpen] = useState(false)
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null)
  const [requestStack, setRequestStack] = useState<string[]>([])
  const [actions, setActions] = useState<ActionItem[]>(() => getDefaultActions('Low conversion'))
  const [cfgOpen, setCfgOpen] = useState(true)
  const health = useEngineHealth()

  // Keep actions in sync with problem
  useEffect(() => {
    setActions(getDefaultActions(cfg.problem))
  }, [cfg.problem])

  const runScan = useCallback(() => {
    if (scanning) return
    setScanning(true)
    setScanStep(0)
    let step = 0
    const interval = setInterval(() => {
      step++
      setScanStep(step)
      if (step >= SCAN_STEPS.length) {
        clearInterval(interval)
        setTimeout(() => { setScanning(false); setScanStep(-1); setScanned(true) }, 400)
      }
    }, 360)
  }, [scanning])

  // Command palette keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === '/' && !e.ctrlKey && !e.metaKey) || ((e.ctrlKey || e.metaKey) && e.key === 'k')) {
        e.preventDefault(); setPalOpen(v => !v)
      }
      if (e.key === 'Escape') setPalOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleCmd = (action: string) => {
    if (action === 'scan') { runScan(); return }
    if (action === 'reset') { setCfg({ businessType: 'Digital Agency', market: 'Bangladesh', stage: 'Getting Leads', problem: 'Low conversion', budget: 'Medium ($500–$2K)' }); setScanned(false); return }
    if (action.startsWith('mode:')) setMode(action.slice(5) as Mode)
  }

  const MODES: [Mode, string, React.ElementType][] = [
    ['command', 'Home', Sparkles],
    ['create', 'Blueprint', Rocket],
    ['fix', 'Fixer', WandSparkles],
    ['run', 'CRM', BarChart3],
    ['sell', 'Market', ShoppingBag],
    ['ai-mesh', 'AI Mesh', BrainCircuit],
  ]

  const MOBILE_MODES: [Mode, string, React.ElementType][] = [
    ['command', 'Home', Sparkles],
    ['create', 'Create', Rocket],
    ['fix', 'Fix', WandSparkles],
    ['run', 'Run', BarChart3],
    ['sell', 'Sell', ShoppingBag],
  ]

  return (
    <div className="min-h-screen bg-[#09090f] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(99,102,241,0.10),transparent)]" />

      <div className="relative flex h-screen flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-white/[0.06] bg-[#09090f]/80 px-4 py-3 backdrop-blur-md">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10">
            <Command className="h-4 w-4 text-indigo-400" />
          </div>
          <span className="text-sm font-bold text-white hidden sm:block">Engine NotREAL</span>
          <div className="hidden gap-1 md:flex">
            {MODES.map(([m, label, Icon]) => (
              <button key={m} onClick={() => setMode(m)} className={cx('flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition', mode === m ? 'bg-indigo-500/15 text-indigo-300' : 'text-slate-500 hover:text-slate-300')}>
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setPalOpen(true)} className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-[12px] text-slate-500 transition hover:text-slate-300">
              <Search className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Commands</span> <kbd className="rounded border border-white/[0.08] px-1.5 py-0.5 text-[10px] hidden sm:inline">/</kbd>
            </button>
            <div className="h-4 w-px bg-white/[0.06]" />
            <div className={cx('flex items-center gap-1.5 text-[12px]', health ? 'text-emerald-400' : 'text-slate-600')}>
              {health ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Configurator sidebar */}
          <div className={cx('hidden md:flex flex-col border-r border-white/[0.06] bg-white/[0.01] transition-all duration-200', cfgOpen ? 'w-72' : 'w-0 overflow-hidden')}>
            <div className="flex h-full flex-col p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Business Config</span>
                <button onClick={() => setCfgOpen(false)} className="text-slate-600 hover:text-slate-400"><X className="h-3.5 w-3.5" /></button>
              </div>
              <Configurator cfg={cfg} setCfg={setCfg} onScan={runScan} scanning={scanning} />
            </div>
          </div>

          {/* Toggle sidebar button */}
          {!cfgOpen && (
            <button onClick={() => setCfgOpen(true)} className="hidden md:flex w-8 items-center justify-center border-r border-white/[0.06] bg-white/[0.01] text-slate-600 transition hover:text-slate-400 hover:bg-white/[0.03]">
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          {/* Main content */}
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl p-4 pb-24 md:p-6 md:pb-8">
              {/* Mobile configurator (collapsible) */}
              <div className="mb-4 md:hidden">
                <button onClick={() => setCfgOpen(v => !v)} className="flex w-full items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm font-medium text-slate-300">
                  <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-indigo-400" /> Business Config — {cfg.problem}</span>
                  <ChevronDown className={cx('h-4 w-4 transition', cfgOpen && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {cfgOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="rounded-b-xl border border-t-0 border-white/[0.07] bg-white/[0.02] p-4">
                        <Configurator cfg={cfg} setCfg={setCfg} onScan={runScan} scanning={scanning} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Screen */}
              <AnimatePresence mode="wait">
                {mode === 'command' && <CommandHome key="command" cfg={cfg} health={health} setMode={setMode} />}
                {mode === 'create' && <CreateMode key="create" cfg={cfg} scanned={scanned} />}
                {mode === 'fix' && <FixMode key="fix" cfg={cfg} scanned={scanned} />}
                {mode === 'run' && <RunMode key="run" cfg={cfg} requestStack={requestStack} setRequestStack={setRequestStack} />}
                {mode === 'sell' && <SellMode key="sell" cfg={cfg} onSelectPack={setSelectedPack} />}
                {mode === 'ai-mesh' && <AIMeshMode key="ai-mesh" />}
                {mode as string === 'actions' && <ActionStackMode key="actions" actions={actions} setActions={setActions} cfg={cfg} />}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-2 bottom-2 z-40 grid grid-cols-5 rounded-2xl border border-white/[0.08] bg-[#0c0c15]/95 p-1.5 backdrop-blur-xl md:hidden">
        {MOBILE_MODES.map(([m, label, Icon]) => (
          <button key={m} onClick={() => setMode(m)} className={cx('flex flex-col items-center gap-0.5 rounded-xl py-2 text-[10px] font-medium transition', mode === m ? 'bg-indigo-500/15 text-indigo-300' : 'text-slate-500')}>
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </nav>

      {/* Overlays */}
      <AnimatePresence>
        {scanning && scanStep >= 0 && <ScanProgress key="scan" step={scanStep} done={!scanning} />}
        {palOpen && <CommandPalette key="palette" onClose={() => setPalOpen(false)} onCmd={handleCmd} />}
        {selectedPack && (
          <ServiceModal
            key="modal"
            pack={selectedPack}
            onClose={() => setSelectedPack(null)}
            onRequest={() => {
              setRequestStack(prev => [selectedPack.title, ...prev.slice(0, 4)])
              setSelectedPack(null)
              setMode('run')
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
