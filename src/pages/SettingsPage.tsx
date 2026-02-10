import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import SectionCard from '../components/SectionCard'
import { useAppState } from '../lib/state'
import { clearState, exportState } from '../lib/storage'

export default function SettingsPage() {
  const { state, setState } = useAppState()
  const [name, setName] = useState(state.profile.name)
  const [riskRule, setRiskRule] = useState(state.profile.riskRule)
  const [dailyTarget, setDailyTarget] = useState(state.profile.dailyTarget)
  const [timezone, setTimezone] = useState(state.profile.timezone)

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Control Room"
        title="Settings"
        subtitle="Keep your profile, notifications, and data controls clean so your workflow stays frictionless."
      />

      <SectionCard title="Profile">
        <div className="grid md:grid-cols-4 gap-2">
          <input value={name} aria-label="Name" onChange={(e) => setName(e.target.value)} className="app-input" placeholder="Name" />
          <input value={riskRule} aria-label="Risk rule" onChange={(e) => setRiskRule(e.target.value)} className="app-input" placeholder="Risk rule" />
          <input value={dailyTarget} aria-label="Daily target" onChange={(e) => setDailyTarget(e.target.value)} className="app-input" placeholder="Daily target" />
          <input value={timezone} aria-label="Timezone" onChange={(e) => setTimezone(e.target.value)} className="app-input" placeholder="Timezone (e.g. UTC)" />
        </div>
        <button
          className="mt-3 app-button app-button-primary"
          onClick={() =>
            setState({
              ...state,
              profile: { ...state.profile, name, riskRule, dailyTarget, timezone },
            })
          }
        >
          Save profile
        </button>
      </SectionCard>

      <SectionCard title="Notifications">
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          {Object.entries(state.notifications).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-900/30 px-3 py-2">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) =>
                  setState({
                    ...state,
                    notifications: { ...state.notifications, [key]: e.target.checked },
                  })
                }
              />
              {key}
            </label>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Data Controls">
        <button
          className="app-button app-button-muted mr-2"
          onClick={() => {
            const blob = new Blob([exportState()], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'traders-mind-export.json'
            a.click()
            URL.revokeObjectURL(url)
          }}
        >
          Export JSON
        </button>
        <button
          className="app-button app-button-danger"
          onClick={() => {
            clearState()
            window.location.reload()
          }}
        >
          Clear all data
        </button>
      </SectionCard>

      <SectionCard title="Subscription">
        <p className="text-sm text-slate-300">Current tier: {state.subscriptionTier}</p>
        <div className="mt-2 flex gap-2">
          <button className="app-button app-button-muted" onClick={() => setState({ ...state, subscriptionTier: 'Free' })}>
            Free
          </button>
          <button className="app-button app-button-primary" onClick={() => setState({ ...state, subscriptionTier: 'Pro' })}>
            Upgrade to Pro
          </button>
        </div>
      </SectionCard>
    </div>
  )
}
