import { Link } from 'react-router-dom'
import { gates } from '@/config/gates'
import { disclaimers } from '@/config/disclaimers'
import { CheckCircle, ArrowRight, Shield } from 'lucide-react'

const T = {
  red: '#b5121b', redBright: '#ef233c', gold: '#c9a449', goldSoft: '#e0c878',
  silver: '#c9c9c9', ivory: '#f5f0e8', steel: '#8f9299',
  panel: '#17171d', panelSoft: '#1e1e26',
  border: 'rgba(201,201,201,0.18)', borderGold: 'rgba(201,164,73,0.38)',
  H: "'Playfair Display',serif", B: "'Inter','Manrope',sans-serif", M: "'Montserrat',sans-serif",
}

export default function ChooseYourGatePage() {
  return (
    <div style={{ minHeight:'100vh', background:'#050505', color:T.ivory, fontFamily:T.B }}>
      {/* Nav */}
      <nav style={{ borderBottom:`1px solid ${T.border}`, padding:'16px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', backdropFilter:'blur(20px)', position:'sticky', top:0, zIndex:50, background:'rgba(5,5,5,0.92)' }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'rgba(181,18,27,0.15)', border:'1px solid rgba(181,18,27,0.30)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontFamily:T.M, fontWeight:900, fontSize:13, color:T.red }}>BS</span>
          </div>
          <div>
            <div style={{ fontFamily:T.M, fontWeight:800, fontSize:13, color:T.red, letterSpacing:'0.08em', textTransform:'uppercase' }}>Black Sheep</div>
            <div style={{ fontSize:10, color:T.steel, letterSpacing:'0.10em', textTransform:'uppercase' }}>Divorcing The Game™</div>
          </div>
        </Link>
        <Link to="/apply" className="btn-primary" style={{ fontSize:12, padding:'10px 24px' }}>
          Apply as a Founder
        </Link>
      </nav>

      {/* Header */}
      <section style={{ textAlign:'center', padding:'96px 24px 64px', maxWidth:800, margin:'0 auto' }}>
        <div className="bs-badge" style={{ marginBottom:24, fontSize:11 }}>
          <Shield size={12} /> Strategy · Freedom · Legacy
        </div>
        <h1 style={{ fontFamily:T.H, fontSize:'clamp(2.4rem,5vw,4rem)', fontWeight:700, margin:'0 0 20px', lineHeight:1.15 }}>
          Choose Your Gate
        </h1>
        <p style={{ fontSize:'1.125rem', color:T.steel, maxWidth:560, margin:'0 auto 16px', lineHeight:1.7 }}>
          Every Black Sheep does not need the same door. Choose the level of structure, guidance, and support that fits your next move.
        </p>
        <p style={{ fontSize:13, color:T.gold, fontFamily:T.M, letterSpacing:'0.08em', textTransform:'uppercase' }}>
          Clarity before capital. Structure before scale.
        </p>
      </section>

      {/* Gate Cards */}
      <section style={{ padding:'0 24px 80px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:24 }}>
          {gates.map((gate, i) => {
            const isGold = gate.id === 'gold-gate'
            const isPlatinum = gate.id === 'platinum-gate'
            return (
              <div key={gate.id}
                className={isGold || isPlatinum ? 'bs-card-premium' : 'bs-card'}
                style={{ padding:32, position:'relative', border:gate.borderStyle }}
              >
                {/* Tier badge */}
                <div style={{ marginBottom:16 }}>
                  <span style={{
                    fontFamily:T.M, fontSize:10, fontWeight:700, letterSpacing:'0.14em',
                    textTransform:'uppercase', color:gate.colorHex,
                    background:`${gate.colorHex}18`, border:`1px solid ${gate.colorHex}30`,
                    borderRadius:999, padding:'4px 12px',
                  }}>{gate.label}</span>
                </div>

                <h2 style={{ fontFamily:T.H, fontSize:'1.6rem', fontWeight:700, margin:'0 0 10px', color:T.ivory }}>
                  {gate.name}
                </h2>
                <p style={{ fontSize:13, color:T.steel, marginBottom:24, lineHeight:1.6 }}>
                  {gate.bestFor}
                </p>

                {/* Includes */}
                <ul style={{ listStyle:'none', padding:0, margin:'0 0 28px', display:'flex', flexDirection:'column', gap:10 }}>
                  {gate.includes.map(item => (
                    <li key={item} style={{ display:'flex', alignItems:'flex-start', gap:10, fontSize:13, color:T.steel }}>
                      <CheckCircle size={14} style={{ color:gate.colorHex, marginTop:2, flexShrink:0 }} />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link to="/apply"
                  style={{
                    display:'inline-flex', alignItems:'center', gap:8, width:'100%', justifyContent:'center',
                    background: isGold || isPlatinum
                      ? `linear-gradient(135deg, ${gate.colorHex}22, ${gate.colorHex}08)`
                      : 'rgba(255,255,255,0.04)',
                    border: gate.borderStyle,
                    borderRadius:999, color:gate.colorHex,
                    fontFamily:T.M, fontSize:12, fontWeight:700, letterSpacing:'0.10em',
                    textTransform:'uppercase', textDecoration:'none', padding:'14px 24px',
                    transition:'all 220ms ease',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = `${gate.colorHex}22` }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = isGold || isPlatinum ? `${gate.colorHex}18` : 'rgba(255,255,255,0.04)' }}
                >
                  {gate.cta} <ArrowRight size={14} />
                </Link>
              </div>
            )
          })}
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop:56, padding:24, background:T.panelSoft, borderRadius:16, border:`1px solid ${T.border}` }}>
          <p style={{ fontSize:12, color:T.steel, lineHeight:1.8, margin:0 }}>
            <strong style={{ color:T.gold }}>Important:</strong> {disclaimers.funding}
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ textAlign:'center', padding:'64px 24px 96px', borderTop:`1px solid ${T.border}` }}>
        <p style={{ fontSize:13, color:T.steel, marginBottom:8 }}>Not sure which gate fits?</p>
        <h2 style={{ fontFamily:T.H, fontSize:'clamp(1.6rem,3vw,2.5rem)', fontWeight:700, margin:'0 0 24px', color:T.ivory }}>
          Uncover My Gold first.
        </h2>
        <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
          <Link to="/apply" className="btn-primary">Apply as a Black Sheep Founder</Link>
          <Link to="/" className="btn-secondary">← Back to Home</Link>
        </div>
      </section>
    </div>
  )
}
