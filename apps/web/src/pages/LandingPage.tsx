import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeDollarSign,
  Bot,
  Briefcase,
  Building2,
  CheckCircle2,
  CreditCard,
  FileText,
  Globe,
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  Store,
  Target,
  Users,
  Wrench,
  ShieldCheck,
} from 'lucide-react'
import { brand } from '@/config/brand'

const trustStrip = [
  'Supabase-backed customer portal',
  'Live AI diagnosis engine',
  'Manual order review active',
  'Support and requests live',
  'Private beta ready',
]

const audienceStrip = [
  'Local service businesses',
  'Agencies',
  'Coaches and consultants',
  'Online businesses',
  'Startup founders',
  'Growing teams',
]

const problems = [
  'No clear offer',
  'Not enough leads',
  'Sales process is messy',
  'Operations are scattered',
  'No CRM or follow-up system',
  'Need a launch plan',
]

const solutions = [
  'AI diagnosis for the real bottleneck',
  'Business blueprint for the next move',
  'Service request intake and tracking',
  'CRM and progress visibility',
  'Support tickets for operator follow-up',
  'Marketplace services with honest review',
]

const capabilities = [
  {
    icon: Sparkles,
    title: 'Business Blueprint Generator',
    text: 'Generate a clear offer, positioning, and next-step plan from the Create flow.',
    to: '/create',
  },
  {
    icon: Bot,
    title: 'Fixer Diagnosis Engine',
    text: 'Run a live diagnosis to identify the bottleneck and recommended action.',
    to: '/fixer',
  },
  {
    icon: Wrench,
    title: 'Service Request Portal',
    text: 'Submit a request for a done-for-you service pack or custom execution help.',
    to: '/requests',
  },
  {
    icon: LayoutDashboard,
    title: 'Run / CRM Dashboard',
    text: 'Track leads, progress, and active requests from the dashboard and run pages.',
    to: '/run',
  },
  {
    icon: Store,
    title: 'Marketplace Services',
    text: 'Browse the live service offers and choose the right execution pack.',
    to: '/marketplace',
  },
  {
    icon: MessageSquare,
    title: 'Support Tickets',
    text: 'Send a support request when the operator needs to review or follow up.',
    to: '/support',
  },
  {
    icon: CreditCard,
    title: 'Manual Payment / Order Review',
    text: 'Submit payment reference details while beta payments stay manual and honest.',
    to: '/payment',
  },
  {
    icon: Building2,
    title: 'Operator Overview',
    text: 'Admin and counts stay available for oversight, routing, and workflow handling.',
    to: '/admin',
  },
]

const servicePacks = [
  {
    name: 'Starter Growth Engine',
    outcome: 'A simple launch plan with offer clarity, positioning, and next steps.',
    bestFor: 'New founders who need structure fast.',
    price: '$199+',
    to: '/requests',
  },
  {
    name: 'Lead Flow Setup',
    outcome: 'A lead capture and follow-up system for turning interest into conversations.',
    bestFor: 'Teams that need more qualified leads.',
    price: '$299+',
    to: '/marketplace',
  },
  {
    name: 'Booked Calls System',
    outcome: 'A booking path with qualification and handoff steps for sales calls.',
    bestFor: 'Service businesses that close on calls.',
    price: '$399+',
    to: '/requests',
  },
  {
    name: 'Content Sprint Pack',
    outcome: 'A fast copy and creative bundle for launch, ads, or campaign support.',
    bestFor: 'Founders who need assets without delay.',
    price: '$149+',
    to: '/marketplace',
  },
  {
    name: 'AI Sales Assistant',
    outcome: 'AI-assisted follow-up and lead qualification workflow for sales support.',
    bestFor: 'Businesses that want a cleaner sales process.',
    price: 'Request quote',
    to: '/requests',
  },
]

const featureModules = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Sparkles, label: 'Create' },
  { icon: Bot, label: 'Fixer' },
  { icon: Users, label: 'Run / CRM' },
  { icon: Store, label: 'Marketplace' },
  { icon: MessageSquare, label: 'Support' },
  { icon: CreditCard, label: 'Manual Payment' },
  { icon: ShieldCheck, label: 'Admin Overview' },
]

const steps = [
  'Create your account',
  'Run a diagnosis or choose a service',
  'Submit your request or payment reference',
  'Track progress from your dashboard',
  'Get support and keep improving',
]

const systemStatus = [
  'Live AI diagnosis',
  'Secure customer records',
  'Support portal active',
  'Manual order review',
  'Private beta access',
]

const regions = [
  'American business owners first',
  'Global remote delivery is supported',
  'Built for local and service-led operators',
]

function ButtonLink({
  to,
  children,
  variant = 'primary',
}: {
  to: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5'
  const styles =
    variant === 'primary'
      ? 'bg-white text-slate-950 shadow-[0_18px_50px_rgba(255,255,255,0.12)]'
      : 'border border-white/15 bg-white/5 text-white hover:bg-white/10'

  return (
    <Link to={to} className={`${base} ${styles}`}>
      {children}
      <ArrowRight size={16} />
    </Link>
  )
}

function SectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string
  title: string
  text: string
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/90">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">{text}</p>
    </div>
  )
}

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden bg-[#05070d] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-12%] h-80 w-80 rounded-full bg-cyan-500/14 blur-3xl" />
        <div className="absolute right-[-8%] top-[10%] h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/90">
              <ShieldCheck size={14} />
              {brand.brandName}
            </div>
            <p className="mt-1 text-sm text-slate-400">{brand.tagline}</p>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <ButtonLink to="/login" variant="secondary">
              Login
            </ButtonLink>
            <ButtonLink to="/register">Create Account</ButtonLink>
          </div>
        </header>

        <section className="grid gap-10 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
              Private beta ready
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Build. Fix. Run. Grow. One Engine.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Not Real Engine helps business owners turn scattered ideas, broken processes, and growth problems into
              clear plans, service requests, CRM workflows, and AI-powered execution.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink to="/register">Create Your Account</ButtonLink>
              <ButtonLink to="/fixer" variant="secondary">
                Run a Business Diagnosis
              </ButtonLink>
              <ButtonLink to="/marketplace" variant="secondary">
                View Services
              </ButtonLink>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {trustStrip.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="rounded-[1.5rem] border border-white/10 bg-[#08111f] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">System status</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Live business engine</h2>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  Live
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {systemStatus.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <CheckCircle2 size={18} className="shrink-0 text-emerald-300" />
                    <span className="text-sm text-slate-200">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <Link to="/dashboard" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-slate-200 hover:bg-black/40">
                  Dashboard
                </Link>
                <Link to="/pricing" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-slate-200 hover:bg-black/40">
                  Pricing
                </Link>
                <Link to="/support" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-slate-200 hover:bg-black/40">
                  Support
                </Link>
                <Link to="/requests" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-slate-200 hover:bg-black/40">
                  Requests
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-14">
          <SectionTitle
            eyebrow="Who it is for"
            title="Built for business owners who want a simple operating engine."
            text="This beta is aimed at American small business owners, service businesses, agencies, coaches, consultants, online businesses, startup founders, and growing teams."
          />

          <div className="mt-8 flex flex-wrap gap-3">
            {audienceStrip.map((item) => (
              <div key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-14">
          <SectionTitle
            eyebrow="The problem"
            title="Most businesses do not have one clean system for growth."
            text="The platform is built to help with the real operational pain points that slow down owners and operators."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {problems.map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-14">
          <SectionTitle
            eyebrow="The solution"
            title="One operating layer for diagnosis, requests, CRM, support, and services."
            text="Not Real Engine gives business owners one place to move from idea to execution without adding another complicated tool."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {solutions.map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <CheckCircle2 size={18} className="text-emerald-300" />
                <p className="mt-4 text-sm leading-6 text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-14">
          <SectionTitle
            eyebrow="Feature modules"
            title="The public beta is organized around the work founders actually need."
            text="Each module is live, usable, and connected to a real customer action."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {capabilities.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.title}
                  to={item.to}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/8"
                >
                  <Icon className="text-cyan-200" size={22} />
                  <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="border-t border-white/10 py-14">
          <SectionTitle
            eyebrow="Service offers"
            title="Service packs are clear, conversion-friendly, and request ready."
            text="Some packs have a starting price. Others are request-quote only. Nothing here pretends to be instant checkout."
          />

          <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {servicePacks.map((pack) => (
              <div key={pack.name} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Service pack</p>
                    <h3 className="mt-3 text-xl font-semibold text-white">{pack.name}</h3>
                  </div>
                  <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-sm font-semibold text-white">
                    {pack.price}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">{pack.outcome}</p>
                <p className="mt-4 text-sm text-slate-400">
                  <span className="font-semibold text-slate-200">Best for:</span> {pack.bestFor}
                </p>
                <div className="mt-6">
                  <ButtonLink to={pack.to} variant="secondary">
                    Request / View Pack
                  </ButtonLink>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-14">
          <SectionTitle
            eyebrow="How it works"
            title="The beta flow is short and operational."
            text="The goal is to move users from interest to execution with the fewest steps."
          />

          <div className="mt-8 grid gap-4 lg:grid-cols-5">
            {steps.map((step, index) => (
              <div key={step} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-bold text-slate-950">
                  {index + 1}
                </div>
                <p className="mt-4 text-sm font-medium leading-6 text-slate-200">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-14">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/90">
                <BadgeDollarSign size={14} />
                Payment honesty
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-white">Stripe comes later. Manual order review is active now.</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Customers can submit a payment reference or order request. The operator reviews it, confirms activation,
                and keeps the beta honest while payment automation is added later.
              </p>
              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-300" />
                  Manual payment and order review stays active
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-300" />
                  No fake instant checkout is shown
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-300" />
                  Payment confirmation still unlocks execution
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/90">
                <Globe size={14} />
                Market positioning
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-white">US-first positioning with global delivery support.</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Not Real Engine is positioned for American business owners while still supporting remote digital delivery
                for founders and operators in other markets.
              </p>
              <div className="mt-6 space-y-3">
                {regions.map((point) => (
                  <div key={point} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle2 size={18} className="text-emerald-300" />
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-14">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-cyan-500/15 via-white/5 to-indigo-500/10 p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/90">Private beta ready</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                  Start with the landing page, then move into a live customer action.
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  A visitor can register, log in, run a fixer diagnosis, request a service, send a support ticket, and
                  continue into the dashboard without dead ends.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <ButtonLink to="/register">Create Account</ButtonLink>
                <ButtonLink to="/fixer" variant="secondary">
                  Run Fixer Diagnosis
                </ButtonLink>
                <ButtonLink to="/requests" variant="secondary">
                  Submit Service Request
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
