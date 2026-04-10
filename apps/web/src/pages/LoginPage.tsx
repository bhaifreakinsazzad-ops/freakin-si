import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useLang } from '@/contexts/LanguageContext'
import { Eye, EyeOff, LogIn, TrendingUp } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const { t, lang, toggle } = useLang()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/chat')
    } catch (err: any) {
      setError(err.response?.data?.error || t.loginError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--fsi-void)' }}>

      {/* Aurora background orbs */}
      <div className="aurora-orb-1" />
      <div className="aurora-orb-2" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-3 group">
            <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center"
              style={{ boxShadow: '0 0 30px rgba(245,176,65,0.35)' }}>
              <img src="/fsi-icon.svg" alt="F-Bi Logo" className="w-full h-full" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold" style={{ color: 'var(--fsi-text)' }}>
                <span style={{ color: 'var(--fsi-gold)' }}>Freakin BI</span>
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--fsi-text-muted)' }}>
                Freakin Business Intelligence
              </p>
            </div>
          </Link>
          <button
            onClick={toggle}
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
            style={{ border: '1px solid var(--fsi-border)', color: 'var(--fsi-text-muted)' }}
          >
            {lang === 'bn' ? '🇬🇧 Switch to English' : '🇧🇩 বাংলায় দেখুন'}
          </button>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8" style={{ border: '1px solid var(--fsi-border-hover)' }}>
          <h2 className="font-display text-lg font-semibold mb-6" style={{ color: 'var(--fsi-text)' }}>
            {t.loginBtn}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--fsi-text-muted)' }}>{t.emailLabel}</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                style={{
                  background: 'var(--fsi-surface)',
                  border: '1px solid var(--fsi-border)',
                  color: 'var(--fsi-text)',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--fsi-border-hover)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--fsi-border)'}
                placeholder={t.emailPlaceholder}
              />
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--fsi-text-muted)' }}>{t.passwordLabel}</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none transition-colors"
                  style={{
                    background: 'var(--fsi-surface)',
                    border: '1px solid var(--fsi-border)',
                    color: 'var(--fsi-text)',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'var(--fsi-border-hover)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--fsi-border)'}
                  placeholder={t.passwordPlaceholder}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--fsi-text-muted)' }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> {t.loggingIn}</>
              ) : (
                <><LogIn size={16} /> {t.loginBtn}</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--fsi-text-muted)' }}>
              {t.noAccount}{' '}
              <Link to="/register" className="font-medium transition-colors hover:opacity-80" style={{ color: 'var(--fsi-gold)' }}>
                {t.registerFree}
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="text-center text-xs mt-6" style={{ color: 'var(--fsi-text-dim)' }}>
          Powered by 40+ AI Models · Free to Start
        </p>
      </div>
    </div>
  )
}
