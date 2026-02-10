import { useMemo, useState } from 'react'
import { useAppState } from '../lib/state'

const styles = ['Scalper', 'Intraday', 'Swing'] as const
const sessions = ['London', 'NewYork', 'Asia', 'Custom'] as const

export default function OnboardingWizard() {
  const { state, setState } = useAppState()
  const [step, setStep] = useState(state.onboarding.currentStep)
  const [form, setForm] = useState({
    name: state.profile.name,
    tradingStyle: state.profile.tradingStyle,
    preferredSession: state.profile.preferredSession,
    riskRule: state.profile.riskRule,
    topTrigger: state.profile.topTrigger,
  })

  const progress = useMemo(() => `${Math.round(((step + 1) / 4) * 100)}%`, [step])

  if (state.onboarding.completed) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="card max-w-2xl w-full p-6 space-y-4">
        <p className="badge">60-second setup • {progress}</p>
        <h2 className="text-2xl font-bold md:text-3xl">Personalize your coaching cockpit</h2>
        <p className="text-sm text-slate-300">Build your baseline now so each module can adapt with precision.</p>

        {step === 0 && (
          <div>
            <label className="text-sm text-slate-200">Name</label>
            <input className="app-input mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
        )}

        {step === 1 && (
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="text-sm text-slate-200">Style
              <select className="app-input mt-1" value={form.tradingStyle} onChange={(e) => setForm({ ...form, tradingStyle: e.target.value as (typeof styles)[number] })}>
                {styles.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="text-sm text-slate-200">Session
              <select className="app-input mt-1" value={form.preferredSession} onChange={(e) => setForm({ ...form, preferredSession: e.target.value as (typeof sessions)[number] })}>
                {sessions.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="text-sm text-slate-200">Risk rule</label>
            <textarea className="app-input min-h-24 mt-1" value={form.riskRule} onChange={(e) => setForm({ ...form, riskRule: e.target.value })} />
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="text-sm text-slate-200">Top emotional trigger</label>
            <textarea className="app-input min-h-24 mt-1" value={form.topTrigger} onChange={(e) => setForm({ ...form, topTrigger: e.target.value })} />
          </div>
        )}

        <div className="flex justify-between gap-2">
          <button className="app-button app-button-muted" disabled={step === 0} onClick={() => setStep((v) => Math.max(0, v - 1))}>Back</button>
          <button
            className="app-button app-button-primary"
            onClick={() => {
              if (step < 3) {
                const nextStep = step + 1
                setStep(nextStep)
                setState({ ...state, onboarding: { ...state.onboarding, currentStep: nextStep } })
                return
              }
              setState({
                ...state,
                profile: {
                  ...state.profile,
                  name: form.name || state.profile.name,
                  tradingStyle: form.tradingStyle,
                  preferredSession: form.preferredSession,
                  riskRule: form.riskRule,
                  topTrigger: form.topTrigger,
                },
                onboarding: { completed: true, currentStep: 3, completedAt: new Date().toISOString() },
              })
            }}
          >
            {step < 3 ? 'Next' : 'Complete setup'}
          </button>
        </div>
      </div>
    </div>
  )
}
