import { useState } from 'react'
import { onboardingService } from '@/services'

const steps = [
  'Basic Profile',
  'Business Idea',
  'Target Audience',
  'Location / U.S. Setup Needs',
  'Budget / Funding Situation',
  'Brand Style Preferences',
  'Launch Timeline',
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [value, setValue] = useState('')
  const [saved, setSaved] = useState(false)

  const save = async () => {
    await onboardingService.saveStep(step, { value })
    setSaved(true)
    setTimeout(() => setSaved(false), 1200)
  }

  return (
    <div className="max-w-3xl mx-auto rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--bs-gold)]">Onboarding Wizard</p>
      <h1 className="text-2xl font-semibold mt-2">{step}. {steps[step - 1]}</h1>
      <textarea value={value} onChange={(e) => setValue(e.target.value)} className="w-full min-h-[180px] rounded-xl mt-4 bg-black/30 border border-[var(--fsi-border)] p-3 text-sm" placeholder="Answer this guided question..." />
      <div className="flex gap-2 mt-3">
        <button disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))} className="rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm">Previous</button>
        <button onClick={save} className="rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm">Save</button>
        <button disabled={step === 7} onClick={() => setStep((s) => Math.min(7, s + 1))} className="rounded-lg bg-[var(--bs-red)] px-4 py-2 text-sm font-semibold">Next</button>
      </div>
      {saved && <p className="text-xs text-[var(--bs-gold-soft)] mt-2">Saved step {step}.</p>}
    </div>
  )
}
