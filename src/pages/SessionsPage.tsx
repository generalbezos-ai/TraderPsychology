import { useState } from 'react'
import SectionCard from '../components/SectionCard'
import { useAppState } from '../lib/state'
import type { Mood } from '../lib/types'

const moods: Mood[] = ['Calm','Focused','Frustrated','Anxious','Impulsive']

export default function SessionsPage() {
  const { addSession, state } = useAppState()
  const [premarketPlan, setPremarketPlan] = useState('')
  const [checkinMood, setMood] = useState<Mood>('Focused')
  const [debrief, setDebrief] = useState('')

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Session Flow</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <SectionCard title="1) Premarket (5m)"><textarea value={premarketPlan} onChange={e => setPremarketPlan(e.target.value)} className="w-full bg-slate-900 rounded p-2 min-h-28" placeholder="A+ setups, invalidation, max risk..."/></SectionCard>
        <SectionCard title="2) Mid-session Check-in (90s)">
          <select value={checkinMood} onChange={e => setMood(e.target.value as Mood)} className="w-full bg-slate-900 rounded p-2">{moods.map(m => <option key={m}>{m}</option>)}</select>
          <p className="text-slate-400 mt-2 text-sm">Pause, 3 breaths, verify process &gt; PnL.</p>
        </SectionCard>
        <SectionCard title="3) Debrief (7m)"><textarea value={debrief} onChange={e => setDebrief(e.target.value)} className="w-full bg-slate-900 rounded p-2 min-h-28" placeholder="What triggered emotion? what to repeat?"/></SectionCard>
      </div>
      <button className="bg-violet-600 px-4 py-2 rounded font-semibold" onClick={() => addSession({ id: crypto.randomUUID(), date: new Date().toLocaleDateString(), premarketPlan, checkinMood, debrief, pnl: Math.round(Math.random()*300-100), disciplineScore: Math.round(Math.random()*25+70) })}>Save Session</button>
      <SectionCard title="Recent logs"><ul className="space-y-2">{state.sessions.slice(0,5).map(s => <li key={s.id} className="text-sm">{s.date}: {s.checkinMood} — {s.disciplineScore}/100</li>)}</ul></SectionCard>
    </div>
  )
}
