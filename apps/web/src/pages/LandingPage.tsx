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

const trustStrip = [
  'Supabase-backed customer portal',
  'Live AI fixer',
  'Manual payment review active',
  'DhandaBuzz execution support',
  'Private beta ready',
]

const capabilities = [
  {
    icon: Sparkles,
    title: 'Create a business blueprint',
    text: 'Generate a clearer offer, position it, and turn the idea into a launch-ready direction.',
    to: '/create',
  },
  {
    icon: Bot,
    title: 'Diagnose business problems',
    text: 'Run a live fixer diagnosis to uncover what is blocking growth, sales, or execution.',
    to: '/fixer',
  },
  {
    icon: MessageSquare,
    title: 'Request support',
    text: 'Submit a support ticket when a customer or operator needs a fast follow-up.',
    to: '/support',
  },
  {
    icon: Wrench,
    title: 'Submit service requests',
    text: 'Request a done-for-you pack or custom service through the live request flow.',
    to: '/requests',
  },
  {
    icon: LayoutDashboard,
    title: 'Track projects and CRM',
    text: 'Monitor progress, leads, and execution from the dashboard and run pages.',
    to: '/dashboard',
  },
  {
    icon: Store,
    title: 'Browse marketplace services',
    text: 'Explore the current service offers and choose the right execution pack.',
    to: '/marketplace',
  },
  {
    icon: CreditCard,
    title: 'Create manual payment or order requests',
    text: 'Submit payment reference details while manual review stays active in beta.',
    to: '/payment',
  },
  {
    icon: Building2,
    title: 'Manage from dashboard and admin',
    text: 'Operator and admin views stay available for oversight, counts, and workflow handling.',
    to: '/admin',
  },
]

const servicePacks = [
  {
    name: 'Starter Growth Engine',
    outcome: 'A simple growth plan with offer, positioning, and next steps.',
    bestFor: 'New founders who need structure fast.',
    price: '$199',
    to: '/requests',
  },
  {
    name: 'Messenger Sales Machine',
    outcome: 'Sales scripts and a follow-up path for WhatsApp or Messenger leads.',
    bestFor: 'Teams selling through chat and DMs.',
    price: '$299',
    to: '/marketplace',
  },
  {
    name: 'Booked Calls Funnel',
    outcome: 'Lead capture, qualification, and call-booking flow.',
    bestFor: 'Service businesses that close on calls.',
    price: '$399',
    to: '/requests',
  },
  {
    name: 'Creative Sprint Pack',
    outcome: 'A fast copy + creative bundle for launch or campaign support.',
    bestFor: 'Founders who need assets without delay.',
    price: '$149',
    to: '/marketplace',
  },
  {
    name: 'AI Sales Assistant',
    outcome: 'Automated follow-up support and lead qualification workflow.',
    bestFor: 'Businesses that want AI-assisted selling.',
    price: 'Request quote',
    to: '/requests',
  },
]

const modules = [
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
  'Create account',
  'Run diagnosis or choose a service',
  'Submit request or payment reference',
  'DhandaBuzz reviews and activates work',
  'Track progress from the dashboard or run page',
]

const regionalPoints = [
  'Bangladesh-ready manual payment and support flow',
  'US and global service workflow for remote execution',
  'Built for founders, operators, and small teams',
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
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-300/90">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">{text}</p>
    </div>
  )
}

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden bg-[#05070d] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-12%] h-80 w-80 rounded-full bg-rose-500/15 blur-3xl" />
        <div className="absolute right-[-8%] top-[10%] h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-300/90">
              <ShieldCheck size={14} />
              DhandaBuzz
            </div>
            <p className="mt-1 text-sm text-slate-400">Engine NotREAL business execution system</p>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <ButtonLink to="/login" variant="secondary">
              Login
            </ButtonLink>
            <ButtonLink to="/register">Start Free</ButtonLink>
          </div>
        </header>

        <section className="grid gap-10 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-rose-200">
              Private beta ready
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Create. Fix. Run. Sell. One Business Machine.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              DhandaBuzz powers an AI business operating system where founders and businesses can create offers,
              fix bottlenecks, request services, manage projects, and move from idea to execution.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/register">Start Free / Create Account</ButtonLink>
              <ButtonLink to="/fixer" variant="secondary">
                Run Fixer Diagnosis
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
                  <h2 className="mt-2 text-2xl font-semibold text-white">Live beta control room</h2>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  Live
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  'Supabase-backed customer portal',
                  'Groq fixer and workflow engine',
                  'Manual payment review active',
                  'Support, requests, and marketplace live',
                ].map((item) => (
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
            eyebrow="What you can do"
            title="The public beta is built around real customer actions."
            text="Each path below goes to a live part of the platform. Nothing here is decorative only."
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
                  <Icon className="text-rose-200" size={22} />
                  <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="border-t border-white/10 py-14">
          <SectionTitle
            eyebrow="Service packs"
            title="Offer packages are simple, clear, and request-friendly."
            text="The beta keeps pricing honest. Some packs have a starting price, and some are request-quote only."
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
            eyebrow="Feature modules"
            title="The current product surface is organized around the work founders actually need."
            text="These modules are live, usable, and aligned with the platform's customer journey."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {modules.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <Icon size={20} className="text-cyan-200" />
                  <p className="mt-4 text-base font-semibold text-white">{item.label}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="border-t border-white/10 py-14">
          <SectionTitle
            eyebrow="How it works"
            title="The beta flow is short and operational."
            text="The goal is not complex onboarding. The goal is to get users from interest to execution with the fewest steps."
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
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-rose-300/90">
                <BadgeDollarSign size={14} />
                Pricing honesty
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-white">Stripe comes later. Manual payment is active now.</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Clients can submit a payment reference or order request. The operator reviews it, confirms activation,
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
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-rose-300/90">
                <Globe size={14} />
                Bangladesh + global
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-white">Built for local support and remote delivery.</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                DhandaBuzz can support Bangladesh-ready manual payment flows while staying useful for US and global
                founders who want a remote digital business execution team.
              </p>
              <div className="mt-6 space-y-3">
                {regionalPoints.map((point) => (
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
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-rose-500/15 via-white/5 to-cyan-500/10 p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-300/90">Client beta ready</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                  Start with the landing page, then move straight into a live customer action.
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  The beta is set up so a visitor can register, log in, run a fixer diagnosis, request a service, send
                  a support ticket, and continue into the dashboard without dead ends.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <ButtonLink to="/register">Create Account</ButtonLink>
                <ButtonLink to="/requests" variant="secondary">
                  Submit Service Request
                </ButtonLink>
                <ButtonLink to="/support" variant="secondary">
                  Contact Support
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
