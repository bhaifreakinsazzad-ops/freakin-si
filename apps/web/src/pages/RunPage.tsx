/**
 * Engine NotREAL — Run / CRM
 * Lightweight business operations dashboard: leads, projects, requests
 */
import { useState } from 'react'
import {
  Users, Briefcase, CheckCircle, Clock, AlertCircle,
  Plus, Search, MoreHorizontal, TrendingUp, Target,
  Phone, Mail, Globe, Edit3, Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Status = 'active' | 'pending' | 'completed' | 'paused'
type Priority = 'high' | 'medium' | 'low'

interface Lead {
  id: string; name: string; business: string; email: string
  phone: string; status: Status; value: string; source: string; notes: string
}

interface Project {
  id: string; title: string; client: string; status: Status
  priority: Priority; dueDate: string; progress: number; service: string
}

const SAMPLE_LEADS: Lead[] = [
  { id: '1', name: 'Sarah M.', business: 'Bloom Candles', email: 'sarah@bloomco.com', phone: '+1 555 0101', status: 'active', value: '$2,400', source: 'Referral', notes: 'Needs brand kit + website' },
  { id: '2', name: 'Rahim A.', business: 'SwiftDelivery BD', email: 'rahim@swift.com.bd', phone: '+880 171 0001', status: 'pending', value: '$800', source: 'Marketplace', notes: 'Interested in ads package' },
  { id: '3', name: 'Marcus J.', business: 'FitPro Studio', email: 'marcus@fitpro.io', phone: '+1 555 0202', status: 'completed', value: '$5,000', source: 'Direct', notes: 'Full launch done — follow up Q2' },
  { id: '4', name: 'Nadia K.', business: 'LegalEase', email: 'nadia@legalease.co', phone: '+44 7700 0001', status: 'active', value: '$3,200', source: 'Instagram', notes: 'Phase 2 scope in discussion' },
]

const SAMPLE_PROJECTS: Project[] = [
  { id: '1', title: 'Brand Identity — Bloom Candles', client: 'Sarah M.', status: 'active', priority: 'high', dueDate: '2026-05-25', progress: 65, service: 'Design' },
  { id: '2', title: 'Facebook Ad Campaign', client: 'Rahim A.', status: 'pending', priority: 'medium', dueDate: '2026-06-01', progress: 10, service: 'Ads' },
  { id: '3', title: 'Website + SEO', client: 'Nadia K.', status: 'active', priority: 'high', dueDate: '2026-05-20', progress: 45, service: 'Web' },
]

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
  active:    { label: 'Active',     color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  pending:   { label: 'Pending',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  completed: { label: 'Completed',  color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  paused:    { label: 'Paused',     color: '#64748b', bg: 'rgba(100,116,139,0.12)' },
}

const PRIORITY_CONFIG: Record<Priority, { color: string }> = {
  high:   { color: '#ef4444' },
  medium: { color: '#f59e0b' },
  low:    { color: '#10b981' },
}

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className="px-2 py-0.5 rounded-md text-xs font-medium" style={{ color: cfg.color, background: cfg.bg }}>
      {cfg.label}
    </span>
  )
}

export default function RunPage() {
  const [tab,    setTab]    = useState<'leads' | 'projects'>('leads')
  const [search, setSearch] = useState('')
  const [leads]             = useState<Lead[]>(SAMPLE_LEADS)
  const [projects]          = useState<Project[]>(SAMPLE_PROJECTS)

  const filteredLeads    = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.business.toLowerCase().includes(search.toLowerCase())
  )
  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.client.toLowerCase().includes(search.toLowerCase())
  )

  const activeLeads    = leads.filter(l => l.status === 'active').length
  const totalValue     = leads.reduce((sum, l) => sum + parseFloat(l.value.replace(/[$,]/g, '')), 0)
  const activeProjects = projects.filter(p => p.status === 'active').length

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}
            >
              <TrendingUp size={18} style={{ color: '#22d3ee' }} />
            </div>
            <div>
              <h1 className="font-bold text-xl" style={{ color: 'var(--fsi-text)', fontFamily: "'Space Grotesk',sans-serif" }}>
                Run / CRM
              </h1>
              <p className="text-sm" style={{ color: 'var(--fsi-text-muted)' }}>
                Leads, projects, and pipeline at a glance
              </p>
            </div>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff' }}
          >
            <Plus size={15} /> Add {tab === 'leads' ? 'Lead' : 'Project'}
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Active Leads', value: activeLeads,                 icon: Users,     color: '#22d3ee' },
            { label: 'Pipeline Value', value: `$${totalValue.toLocaleString()}`, icon: Target,    color: '#10b981' },
            { label: 'Active Projects', value: activeProjects,           icon: Briefcase, color: '#818cf8' },
            { label: 'Completed',    value: leads.filter(l => l.status === 'completed').length, icon: CheckCircle, color: '#f59e0b' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-xl p-4"
              style={{ background: 'var(--fsi-surface-2)', border: '1px solid var(--fsi-border)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} style={{ color }} />
                <span className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>{label}</span>
              </div>
              <p className="text-2xl font-bold" style={{ color, fontFamily: "'Space Grotesk',sans-serif" }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs + Search */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--fsi-surface-2)' }}>
            {(['leads', 'projects'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all"
                style={{
                  background: tab === t ? 'rgba(99,102,241,0.2)' : 'transparent',
                  color: tab === t ? '#818cf8' : 'var(--fsi-text-muted)',
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--fsi-text-dim)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-9 pr-4 py-2 rounded-xl text-sm outline-none w-48"
              style={{ background: 'var(--fsi-surface-2)', border: '1px solid var(--fsi-border)', color: 'var(--fsi-text)' }}
            />
          </div>
        </div>

        {/* Leads Table */}
        {tab === 'leads' && (
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--fsi-border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--fsi-surface-2)', borderBottom: '1px solid var(--fsi-border)' }}>
                    {['Name / Business', 'Contact', 'Status', 'Value', 'Source', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-medium" style={{ color: 'var(--fsi-text-muted)', fontSize: 11 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, i) => (
                    <tr
                      key={lead.id}
                      style={{
                        background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                        borderBottom: '1px solid var(--fsi-border)',
                      }}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-semibold" style={{ color: 'var(--fsi-text)' }}>{lead.name}</p>
                        <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>{lead.business}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--fsi-text-muted)' }}>
                            <Mail size={10} /> {lead.email}
                          </span>
                          <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--fsi-text-muted)' }}>
                            <Phone size={10} /> {lead.phone}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                      <td className="px-4 py-3 font-semibold" style={{ color: '#10b981' }}>{lead.value}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--fsi-text-muted)' }}>{lead.source}</td>
                      <td className="px-4 py-3">
                        <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" style={{ color: 'var(--fsi-text-muted)' }}>
                          <MoreHorizontal size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Projects Table */}
        {tab === 'projects' && (
          <div className="space-y-3">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className="rounded-xl p-4 transition-all hover:border-[rgba(99,102,241,0.3)]"
                style={{ background: 'var(--fsi-surface-2)', border: '1px solid var(--fsi-border)' }}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold" style={{ color: 'var(--fsi-text)' }}>{project.title}</h3>
                      <StatusBadge status={project.status} />
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium capitalize"
                        style={{ color: PRIORITY_CONFIG[project.priority].color, background: `${PRIORITY_CONFIG[project.priority].color}18` }}
                      >
                        {project.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 text-xs" style={{ color: 'var(--fsi-text-muted)' }}>
                      <span className="flex items-center gap-1"><Users size={10} /> {project.client}</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> Due {project.dueDate}</span>
                      <span className="flex items-center gap-1"><Briefcase size={10} /> {project.service}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" style={{ color: 'var(--fsi-text-muted)' }}>
                      <Edit3 size={14} />
                    </button>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>Progress</span>
                    <span className="text-xs font-semibold" style={{ color: '#818cf8' }}>{project.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--fsi-surface)' }}>
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${project.progress}%`, background: 'linear-gradient(90deg, #6366f1, #22d3ee)' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs pb-4" style={{ color: 'var(--fsi-text-dim)' }}>
          Sample data shown. Connect Supabase to persist your real CRM data.
        </p>
      </div>
    </div>
  )
}
