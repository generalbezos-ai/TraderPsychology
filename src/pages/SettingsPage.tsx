import { useState } from 'react'
import InstallPrompt from '../components/InstallPrompt'
import PageHeader from '../components/PageHeader'
import SectionCard from '../components/SectionCard'
import { hashPin, isPinValid } from '../lib/security'
import { importState as importStorageState, clearState, exportState } from '../lib/storage'
import { mockCloudAdapter, parseBackup, serializeBackup } from '../lib/sync'
import { useAppState } from '../lib/state'

export default function SettingsPage() {
  const { state, setState, importState } = useAppState()
  const [name, setName] = useState(state.profile.name)
  const [riskRule, setRiskRule] = useState(state.profile.riskRule)
  const [dailyTarget, setDailyTarget] = useState(state.profile.dailyTarget)
  const [timezone, setTimezone] = useState(state.profile.timezone)
  const [pinDraft, setPinDraft] = useState('')

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Control Room"
        title="Settings"
        subtitle="Profile, privacy, sync, reminders, and recovery controls."
      />

      <SectionCard title="Profile">
        <div className="grid md:grid-cols-4 gap-2">
          <input value={name} aria-label="Name" onChange={(e) => setName(e.target.value)} className="app-input" placeholder="Name" />
          <input value={riskRule} aria-label="Risk rule" onChange={(e) => setRiskRule(e.target.value)} className="app-input" placeholder="Risk rule" />
          <input value={dailyTarget} aria-label="Daily target" onChange={(e) => setDailyTarget(e.target.value)} className="app-input" placeholder="Daily target" />
          <input value={timezone} aria-label="Timezone" onChange={(e) => setTimezone(e.target.value)} className="app-input" placeholder="Timezone (e.g. UTC)" />
        </div>
        <button className="mt-3 app-button app-button-primary" onClick={() => setState({ ...state, profile: { ...state.profile, name, riskRule, dailyTarget, timezone } })}>Save profile</button>
      </SectionCard>

      <SectionCard title="Reminder scheduling">
        <div className="grid md:grid-cols-3 gap-2">
          <label className="text-xs text-slate-300">Morning
            <input type="time" className="app-input mt-1" value={state.reminders.morningTime} onChange={(e) => setState({ ...state, reminders: { ...state.reminders, morningTime: e.target.value } })} />
          </label>
          <label className="text-xs text-slate-300">Session prep
            <input type="time" className="app-input mt-1" value={state.reminders.sessionTime} onChange={(e) => setState({ ...state, reminders: { ...state.reminders, sessionTime: e.target.value } })} />
          </label>
          <label className="text-xs text-slate-300">Debrief
            <input type="time" className="app-input mt-1" value={state.reminders.debriefTime} onChange={(e) => setState({ ...state, reminders: { ...state.reminders, debriefTime: e.target.value } })} />
          </label>
        </div>
      </SectionCard>

      <SectionCard title="Notifications">
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          {Object.entries(state.notifications).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-900/30 px-3 py-2">
              <input type="checkbox" checked={value} onChange={(e) => setState({ ...state, notifications: { ...state.notifications, [key]: e.target.checked } })} />
              {key}
            </label>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Privacy dashboard + PIN lock">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={state.privacy.pinEnabled} onChange={(e) => setState({ ...state, privacy: { ...state.privacy, pinEnabled: e.target.checked } })} />
          Enable PIN gate
        </label>
        <div className="grid md:grid-cols-3 gap-2 mt-2">
          <input className="app-input" type="password" inputMode="numeric" placeholder="4-6 digit PIN" value={pinDraft} onChange={(e) => setPinDraft(e.target.value)} />
          <button className="app-button app-button-muted" onClick={() => {
            if (!isPinValid(pinDraft)) return window.alert('PIN must be 4 to 6 digits')
            setState({ ...state, privacy: { ...state.privacy, pinHash: hashPin(pinDraft), pinEnabled: true } })
            setPinDraft('')
          }}>Save PIN</button>
          <div className="text-xs text-slate-400 rounded-lg border border-slate-700/50 p-2">PIN is local-only and never leaves device.</div>
        </div>
        <div className="flex gap-4 mt-3 text-sm">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={state.privacy.lockJournal} onChange={(e) => setState({ ...state, privacy: { ...state.privacy, lockJournal: e.target.checked } })} />Lock journal</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={state.privacy.lockInsights} onChange={(e) => setState({ ...state, privacy: { ...state.privacy, lockInsights: e.target.checked } })} />Lock insights</label>
        </div>
      </SectionCard>

      <SectionCard title="Account + sync (local profile)">
        <div className="grid md:grid-cols-3 gap-2">
          <input className="app-input" placeholder="Account name" value={state.localAccount.accountName} onChange={(e) => setState({ ...state, localAccount: { ...state.localAccount, accountName: e.target.value, enabled: true } })} />
          <input className="app-input" placeholder="Email hint" value={state.localAccount.emailHint} onChange={(e) => setState({ ...state, localAccount: { ...state.localAccount, emailHint: e.target.value, enabled: true } })} />
          <select className="app-input" value={state.localAccount.cloudAdapter} onChange={(e) => setState({ ...state, localAccount: { ...state.localAccount, cloudAdapter: e.target.value as 'none' | 'mock-drive' } })}>
            <option value="none">No cloud adapter</option>
            <option value="mock-drive">Mock cloud adapter</option>
          </select>
        </div>
        <div className="mt-2 flex gap-2 flex-wrap">
          <button className="app-button app-button-muted" onClick={async () => {
            const stamp = await mockCloudAdapter.upload(serializeBackup(state))
            setState({ ...state, localAccount: { ...state.localAccount, lastBackupAt: stamp } })
          }}>Backup to mock cloud</button>
          <button className="app-button app-button-muted" onClick={async () => {
            const raw = await mockCloudAdapter.download()
            if (!raw) return window.alert('No backup in mock cloud yet')
            const parsed = parseBackup(raw)
            if (!parsed) return window.alert('Backup format invalid')
            importState(importStorageState(parsed))
          }}>Restore mock cloud</button>
        </div>
      </SectionCard>

      <SectionCard title="PWA / installability">
        <InstallPrompt />
      </SectionCard>

      <SectionCard title="Data Controls">
        <button className="app-button app-button-muted mr-2" onClick={() => {
          const blob = new Blob([exportState()], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'traders-mind-export.json'
          a.click()
          URL.revokeObjectURL(url)
        }}>Export JSON</button>
        <label className="app-button app-button-muted mr-2 cursor-pointer">
          Import JSON
          <input type="file" accept="application/json" className="hidden" onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            const text = await file.text()
            try {
              const parsed = parseBackup(text) ?? importStorageState(JSON.parse(text) as unknown)
              importState(parsed)
            } catch {
              window.alert('Invalid backup file')
            }
          }} />
        </label>
        <button className="app-button app-button-danger" onClick={() => { clearState(); window.location.reload() }}>Clear all data</button>
      </SectionCard>

      <SectionCard title="Subscription">
        <p className="text-sm text-slate-300">Current tier: {state.subscriptionTier}</p>
        <div className="mt-2 flex gap-2">
          <button className="app-button app-button-muted" onClick={() => setState({ ...state, subscriptionTier: 'Free' })}>Free</button>
          <button className="app-button app-button-primary" onClick={() => setState({ ...state, subscriptionTier: 'Pro' })}>Upgrade to Pro</button>
        </div>
      </SectionCard>
    </div>
  )
}
