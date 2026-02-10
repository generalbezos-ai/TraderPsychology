import { useState } from 'react'
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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      <SectionCard title="Profile">
        <div className="grid md:grid-cols-4 gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-900 rounded p-2" placeholder="Name" />
          <input value={riskRule} onChange={(e) => setRiskRule(e.target.value)} className="bg-slate-900 rounded p-2" placeholder="Risk rule" />
          <input value={dailyTarget} onChange={(e) => setDailyTarget(e.target.value)} className="bg-slate-900 rounded p-2" placeholder="Daily target" />
          <input value={timezone} onChange={(e) => setTimezone(e.target.value)} className="bg-slate-900 rounded p-2" placeholder="Timezone (e.g. UTC)" />
        </div>
        <button
          className="mt-2 bg-violet-600 px-3 py-2 rounded"
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
            <label key={key} className="flex items-center gap-2">
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
          className="bg-cyan-700 px-3 py-2 rounded mr-2"
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
          className="bg-red-700 px-3 py-2 rounded"
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
          <button className="bg-slate-800 px-3 py-2 rounded" onClick={() => setState({ ...state, subscriptionTier: 'Free' })}>
            Free
          </button>
          <button className="bg-violet-700 px-3 py-2 rounded" onClick={() => setState({ ...state, subscriptionTier: 'Pro' })}>
            Upgrade to Pro
          </button>
        </div>
      </SectionCard>
    </div>
  )
}
