import { useState } from 'react'
import SectionCard from '../components/SectionCard'
import { useAppState } from '../lib/state'
import { clearState, exportState } from '../lib/storage'

export default function SettingsPage() {
  const { state, setState } = useAppState()
  const [name, setName] = useState(state.profile.name)
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings & Profile</h1>
      <SectionCard title="Profile">
        <input value={name} onChange={e => setName(e.target.value)} className="bg-slate-900 rounded p-2 w-full md:w-80" />
        <button className="ml-0 md:ml-2 mt-2 md:mt-0 bg-violet-600 px-3 py-2 rounded" onClick={() => setState({ ...state, profile: { ...state.profile, name }})}>Save</button>
      </SectionCard>
      <SectionCard title="Data">
        <button className="bg-cyan-700 px-3 py-2 rounded mr-2" onClick={() => {
          const blob = new Blob([exportState()], { type: 'application/json' })
          const a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          a.download = 'traders-mind-export.json'
          a.click()
        }}>Export JSON</button>
        <button className="bg-red-700 px-3 py-2 rounded" onClick={() => { clearState(); location.reload() }}>Clear all data</button>
      </SectionCard>
    </div>
  )
}
