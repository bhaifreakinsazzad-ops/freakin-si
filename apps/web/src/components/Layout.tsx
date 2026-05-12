import { useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Bell, Command, LayoutDashboard, Menu, Search, Shield, Sparkles, UserCog, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { notificationService } from '@/services'
import type { NotificationItem, UserRole } from '@/types/domain'

const baseNav = [
  { to: '/command', label: 'Command', icon: Command },
  { to: '/dashboard', label: 'AI CEO Dashboard', icon: LayoutDashboard },
  { to: '/journey', label: 'My 7-Step Journey', icon: Sparkles },
  { to: '/builder', label: 'Uncover My Gold', icon: Sparkles },
  { to: '/fixer', label: 'Fixer', icon: Sparkles },
  { to: '/run', label: 'Run / CRM', icon: LayoutDashboard },
  { to: '/modules', label: 'AI Module Library', icon: Command },
  { to: '/marketplace', label: 'Marketplace', icon: Search },
  { to: '/services', label: 'Build Request', icon: Search },
  { to: '/requests', label: 'Requests', icon: Search },
  { to: '/pricing', label: 'Pricing / Upgrade', icon: Search },
  { to: '/assets', label: 'Assets & Documents', icon: Search },
  { to: '/support', label: 'Support Requests', icon: Bell },
]

const adminNav = [
  { to: '/admin', label: 'Admin Command Center', icon: Shield },
  { to: '/super-admin', label: 'Platform Overview', icon: UserCog },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [role, setRole] = useState<UserRole>(user?.is_admin ? 'admin' : 'client')

  const crumbs = location.pathname.split('/').filter(Boolean)
  const nav = role === 'client' ? baseNav : [...baseNav, ...adminNav]

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  const openNotifications = async () => {
    if (!notifications.length) {
      const res = await notificationService.list()
      if (res.success) setNotifications(res.data)
    }
    setNotifOpen((v) => !v)
  }

  const onLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[var(--fsi-void)] text-[var(--fsi-text)]">
      <div className="flex min-h-screen">
        <aside className={`fixed z-40 md:static md:z-auto top-0 left-0 h-full w-72 bg-[rgba(12,12,16,0.98)] border-r border-[var(--fsi-border)] transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-4 border-b border-[var(--fsi-border)] flex items-center justify-between">
            <Link to="/dashboard" className="font-bold tracking-wider text-sm uppercase text-[var(--bs-gold)]">THE SHEEP</Link>
            <button className="md:hidden" onClick={() => setMobileOpen(false)}><X size={18} /></button>
          </div>
          <nav className="p-3 space-y-1">
            {nav.map((item) => {
              const Icon = item.icon
              const active = location.pathname.startsWith(item.to)
              return (
                <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? 'bg-[rgba(201,164,73,0.16)] text-[var(--bs-gold-soft)] border border-[rgba(201,164,73,0.35)]' : 'text-[var(--fsi-text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'}`}>
                  <Icon size={15} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
          <div className="mt-auto p-3 border-t border-[var(--fsi-border)]">
            <label className="text-[10px] uppercase tracking-widest text-[var(--fsi-text-dim)] block mb-1">Role Switcher</label>
            <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full rounded-lg bg-[var(--fsi-surface)] border border-[var(--fsi-border)] px-2 py-2 text-sm">
              <option value="client">Client / Entrepreneur</option>
              <option value="admin">Admin / Consultant</option>
              <option value="super_admin">Super Admin / Owner</option>
            </select>
            <button onClick={onLogout} className="mt-3 w-full rounded-lg border border-[var(--fsi-border)] px-3 py-2 text-xs uppercase tracking-wider text-[var(--fsi-text-muted)] hover:text-white">Logout</button>
          </div>
        </aside>

        <main className="flex-1 md:ml-0">
          <header className="sticky top-0 z-30 border-b border-[var(--fsi-border)] bg-[rgba(5,5,8,0.88)] backdrop-blur-xl">
            <div className="px-4 py-3 flex items-center gap-3">
              <button className="md:hidden" onClick={() => setMobileOpen(true)}><Menu size={18} /></button>
              <button onClick={() => setPaletteOpen(true)} className="flex-1 max-w-lg rounded-xl border border-[var(--fsi-border)] px-3 py-2 text-left text-sm text-[var(--fsi-text-muted)] hover:border-[var(--fsi-border-hover)]">
                Search pages, modules, actions...
              </button>
              <button onClick={() => setPaletteOpen(true)} className="rounded-lg border border-[var(--fsi-border)] p-2"><Command size={15} /></button>
              <button onClick={openNotifications} className="relative rounded-lg border border-[var(--fsi-border)] p-2">
                <Bell size={15} />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 text-[10px] rounded-full bg-[var(--bs-red)] px-1.5">{unreadCount}</span>}
              </button>
            </div>
            <div className="px-4 pb-3 flex items-center gap-2 text-xs text-[var(--fsi-text-dim)]">
              <Link to="/dashboard">Home</Link>
              {crumbs.map((c, i) => <span key={`${c}-${i}`}>/ {c.replace(/-/g, ' ')}</span>)}
            </div>
          </header>

          <section className="p-4 md:p-6">
            <Outlet />
          </section>
        </main>
      </div>

      {paletteOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setPaletteOpen(false)}>
          <div className="max-w-2xl mx-auto mt-20 rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold mb-3">Command Palette</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {nav.map((item) => <Link key={`cp-${item.to}`} to={item.to} onClick={() => setPaletteOpen(false)} className="rounded-lg border border-[var(--fsi-border)] p-3 text-sm hover:border-[var(--bs-gold)]">{item.label}</Link>)}
            </div>
          </div>
        </div>
      )}

      {notifOpen && (
        <div className="fixed right-4 top-20 z-50 w-[360px] max-w-[92vw] rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-3 shadow-2xl">
          <h3 className="text-sm font-semibold px-2 py-1">Notifications</h3>
          <div className="max-h-[380px] overflow-y-auto space-y-2 mt-1">
            {notifications.length === 0 && <p className="text-sm text-[var(--fsi-text-muted)] p-2">No notifications yet.</p>}
            {notifications.map((n) => (
              <button key={n.id} className={`text-left w-full rounded-lg border p-2 ${n.read ? 'border-[var(--fsi-border)]' : 'border-[rgba(201,164,73,0.45)] bg-[rgba(201,164,73,0.08)]'}`} onClick={async () => {
                await notificationService.markRead(n.id)
                setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
              }}>
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-[var(--fsi-text-muted)]">{n.body}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
