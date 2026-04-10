import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useLang } from '@/contexts/LanguageContext'
import { Eye, EyeOff, UserPlus, TrendingUp, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const { register } = useAuth()
  const { t, lang, toggle } = useLang()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError(t.pwMismatch); return }
    if (form.password.length < 6) { setError(t.pwTooShort); return }
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password, phone: form.phone })
      navigate('/chat')
    } catch (err: any) {
      setError(err.response?.data?.error || t.registerError)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'var(--fsi-surface)',
    border: '1px solid var(--fsi-border)',
    color: 'var(--fsi-text)',
  }
  const inputClass = 'w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors'

  const field = (key: keyof typeof form, label: string, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm mb-1.5" style={{ color: 'var(--fsi-text-muted)' }}>{label}</label>
      <input
        type={type}
        required={key !== 'phone'}
        value={form[key]}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        className={inputClass}
        style={inputStyle}
        onFocus={e => e.currentTarget.style.borderColor = 'var(--fsi-border-hover)'}
        onBlur={e => e.currentTarget.style.borderColor = 'var(--fsi-border)'}
        placeholder={placeholder}
      />
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--fsi-void)' }}>

      {/* Aurora orbs */}
      <div className="aurora-orb-1" />
      <div className="aurora-orb-3" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex flex-col items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center"
              style={{ boxShadow: '0 0 24px rgba(245,176,65,0.35)' }}>
              <img src="/fsi-icon.svg" alt="F-Bi Logo" className="w-full h-full" />
            </div>
            <div className="font-display text-xl font-bold" style={{ color: 'var(--fsi-text)' }}>
              BhaiFreakin'<span style={{ color: 'var(--fsi-gold)' }}>sBI</span>
            </div>
          </Link>
          <p className="text-xs mt-1" style={{ color: 'var(--fsi-text-muted)' }}>{t.registerSubtitle}</p>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <CheckCircle size={13} style={{ color: 'var(--fsi-gold)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--fsi-gold)' }}>{t.registerFreeTag}</span>
          </div>
          <button
            onClick={toggle}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs transition-all"
            style={{ border: '1px solid var(--fsi-border)', color: 'var(--fsi-text-muted)' }}
          >
            {lang === 'bn' ? '🇬🇧 Switch to English' : '🇧🇩 বাংলায় দেখুন'}
          </button>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-7" style={{ border: '1px solid var(--fsi-border-hover)' }}>
          <h2 className="font-display text-lg font-semibold mb-5" style={{ color: 'var(--fsi-text)' }}>
            {t.registerBtn}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {field('name', t.nameLabel, 'text', t.namePlaceholder)}
            {field('email', t.emailReq, 'email', 'example@gmail.com')}
            {field('phone', t.phoneLabel, 'tel', t.phonePlaceholder)}

            <div>
              <label className="block text-sm mb-1.5" style={{ color: 'var(--fsi-text-muted)' }}>{t.passwordReq}</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className={inputClass + ' pr-12'}
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = 'var(--fsi-border-hover)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--fsi-border)'}
                  placeholder={t.passwordMin}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--fsi-text-muted)' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1.5" style={{ color: 'var(--fsi-text-muted)' }}>{t.confirmPassword}</label>
              <input
                type="password"
                required
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                className={inputClass}
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--fsi-border-hover)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--fsi-border)'}
                placeholder={t.confirmPlaceholder}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-50 mt-1"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> {t.registering}</>
              ) : (
                <><UserPlus size={16} /> {t.registerBtn}</>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: 'var(--fsi-text-muted)' }}>
            {t.haveAccount}{' '}
            <Link to="/login" className="font-medium hover:opacity-80 transition-colors" style={{ color: 'var(--fsi-gold)' }}>
              {t.loginLink}
            </Link>
          </p>
        </div>

        <p className="text-center text-xs mt-5" style={{ color: 'var(--fsi-text-dim)' }}>
          Powered by 40+ AI Models · Free to Start
        </p>
      </div>
    </div>
  )
}
