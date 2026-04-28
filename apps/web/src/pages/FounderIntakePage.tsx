import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, CheckCircle } from 'lucide-react'
import { disclaimers } from '@/config/disclaimers'

const T = {
  red: '#b5121b', redBright: '#ef233c', gold: '#c9a449', goldSoft: '#e0c878',
  silver: '#c9c9c9', ivory: '#f5f0e8', steel: '#8f9299',
  panel: '#17171d', panelSoft: '#1e1e26',
  border: 'rgba(201,201,201,0.18)', borderGold: 'rgba(201,164,73,0.38)',
  H: "'Playfair Display',serif", B: "'Inter','Manrope',sans-serif", M: "'Montserrat',sans-serif",
}

const STAGES = ['Idea only', 'Starting out', 'Early revenue', 'Established', 'Scaling']
const BLOCKERS = ['No capital / funding', 'No structure / clarity', 'No time', 'No team', 'Don\'t know where to start']
const GATES = ['Executive Blueprint', 'Silver Gate', 'Gold Gate', 'Platinum Gate', 'Scholarship']

export default function FounderIntakePage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', location: '',
    business_name: '', stage: '', vision: '', blocker: '',
    funding_interest: false, scholarship_interest: false,
    preferred_gate: '', consent: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Future: POST to backend or GHL webhook
    setSubmitted(true)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.045)',
    border: `1px solid ${T.border}`, borderRadius: 14,
    color: T.ivory, fontFamily: T.B, fontSize: 14,
    padding: '14px 16px', outline: 'none', transition: 'border-color 220ms',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 12, fontFamily: T.M,
    fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
    color: T.steel, marginBottom: 8,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: T.ivory, fontFamily: T.B }}>
      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${T.border}`, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backdropFilter: 'blur(20px)', background: 'rgba(5,5,5,0.92)', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(181,18,27,0.15)', border: '1px solid rgba(181,18,27,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: T.M, fontWeight: 900, fontSize: 13, color: T.red }}>BS</span>
          </div>
          <div>
            <div style={{ fontFamily: T.M, fontWeight: 800, fontSize: 13, color: T.red, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Black Sheep</div>
            <div style={{ fontSize: 10, color: T.steel, letterSpacing: '0.10em', textTransform: 'uppercase' }}>Divorcing The Game™</div>
          </div>
        </Link>
        <Link to="/choose-your-gate" style={{ fontSize: 12, color: T.gold, textDecoration: 'none', fontFamily: T.M, letterSpacing: '0.06em' }}>
          Choose Your Gate →
        </Link>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '72px 24px 96px' }}>
        {submitted ? (
          /* Success State */
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(61,220,151,0.12)', border: '1px solid rgba(61,220,151,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={32} style={{ color: '#3ddc97' }} />
            </div>
            <h1 style={{ fontFamily: T.H, fontSize: '2.2rem', fontWeight: 700, margin: '0 0 16px' }}>
              Your Intake Has Been Received.
            </h1>
            <p style={{ color: T.steel, fontSize: '1rem', lineHeight: 1.8, maxWidth: 480, margin: '0 auto 32px' }}>
              Your Founder Intake has been received. The next step is review, confirmation, or a Vision Call depending on your fit and readiness.
            </p>
            <Link to="/" className="btn-primary">Return Home</Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="bs-badge" style={{ marginBottom: 20 }}>
                <Shield size={11} /> Founder Intake
              </div>
              <h1 style={{ fontFamily: T.H, fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 700, margin: '0 0 16px' }}>
                Apply as a Black Sheep Founder
              </h1>
              <p style={{ color: T.steel, fontSize: '1rem', lineHeight: 1.7 }}>
                Tell us where you are, what you carry, and what you are ready to build.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {/* Personal */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }}>
                {[
                  { k: 'name', label: 'Full Name', placeholder: 'Your full name', required: true },
                  { k: 'email', label: 'Email', placeholder: 'your@email.com', required: true, type: 'email' },
                  { k: 'phone', label: 'Phone', placeholder: '+1 (555) 000-0000' },
                  { k: 'location', label: 'Location', placeholder: 'City, State or Country' },
                  { k: 'business_name', label: 'Business Name (if any)', placeholder: 'Leave blank if none' },
                ].map(({ k, label, placeholder, required, type }) => (
                  <div key={k}>
                    <label style={labelStyle}>{label} {required && <span style={{ color: T.red }}>*</span>}</label>
                    <input
                      type={type || 'text'} required={required}
                      placeholder={placeholder} value={(form as any)[k]}
                      onChange={e => set(k, e.target.value)}
                      style={inputStyle}
                      onFocus={e => { e.currentTarget.style.borderColor = T.gold }}
                      onBlur={e => { e.currentTarget.style.borderColor = T.border }}
                    />
                  </div>
                ))}
              </div>

              {/* Stage */}
              <div>
                <label style={labelStyle}>Business Stage <span style={{ color: T.red }}>*</span></label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {STAGES.map(s => (
                    <button type="button" key={s} onClick={() => set('stage', s)}
                      style={{
                        padding: '10px 20px', borderRadius: 999, fontSize: 13, fontFamily: T.M,
                        fontWeight: 600, cursor: 'pointer', transition: 'all 220ms',
                        background: form.stage === s ? 'rgba(181,18,27,0.15)' : 'rgba(255,255,255,0.04)',
                        border: form.stage === s ? `1px solid ${T.red}` : `1px solid ${T.border}`,
                        color: form.stage === s ? T.ivory : T.steel,
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vision */}
              <div>
                <label style={labelStyle}>Main Vision <span style={{ color: T.red }}>*</span></label>
                <textarea required value={form.vision} onChange={e => set('vision', e.target.value)}
                  placeholder="What are you trying to build? What life experience, skill, pain, or hustle shaped this idea?"
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => { e.currentTarget.style.borderColor = T.gold }}
                  onBlur={e => { e.currentTarget.style.borderColor = T.border }}
                />
              </div>

              {/* Blocker */}
              <div>
                <label style={labelStyle}>Main Blocker</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {BLOCKERS.map(b => (
                    <button type="button" key={b} onClick={() => set('blocker', b)}
                      style={{
                        padding: '10px 20px', borderRadius: 999, fontSize: 13, fontFamily: T.M,
                        fontWeight: 600, cursor: 'pointer', transition: 'all 220ms',
                        background: form.blocker === b ? 'rgba(201,164,73,0.12)' : 'rgba(255,255,255,0.04)',
                        border: form.blocker === b ? `1px solid ${T.gold}` : `1px solid ${T.border}`,
                        color: form.blocker === b ? T.gold : T.steel,
                      }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Gate */}
              <div>
                <label style={labelStyle}>Preferred Gate</label>
                <select value={form.preferred_gate} onChange={e => set('preferred_gate', e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Not sure yet — help me choose</option>
                  {GATES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              {/* Checkboxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { k: 'funding_interest', label: 'I am interested in funding pathways and business credit preparation.' },
                  { k: 'scholarship_interest', label: 'I would like to be considered for the Black Sheep Blueprint Scholarship.' },
                ].map(({ k, label }) => (
                  <label key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                    <input type="checkbox" checked={(form as any)[k]} onChange={e => set(k, e.target.checked)}
                      style={{ marginTop: 3, accentColor: T.gold, width: 16, height: 16 }} />
                    <span style={{ fontSize: 13, color: T.steel, lineHeight: 1.6 }}>{label}</span>
                  </label>
                ))}

                {/* Consent — required */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                  <input type="checkbox" required checked={form.consent} onChange={e => set('consent', e.target.checked)}
                    style={{ marginTop: 3, accentColor: T.red, width: 16, height: 16 }} />
                  <span style={{ fontSize: 13, color: T.steel, lineHeight: 1.6 }}>
                    <span style={{ color: T.red }}>* </span>
                    I consent to be contacted by the Black Sheep / Divorcing The Game™ team regarding my application and next steps.
                  </span>
                </label>
              </div>

              {/* Disclaimer */}
              <p style={{ fontSize: 11, color: T.steel, lineHeight: 1.7, padding: '16px 20px', background: T.panelSoft, borderRadius: 12, border: `1px solid ${T.border}` }}>
                {disclaimers.funding}
              </p>

              <button type="submit" className="btn-primary" style={{ fontSize: 14, padding: '18px 40px', width: '100%', justifyContent: 'center' }}>
                Submit Founder Intake →
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
