import { useEffect, useState } from 'react'
import BreathingCircle from '../components/BreathingCircle'
import SectionCard from '../components/SectionCard'
import { useAppState } from '../lib/state'

const tools = [
  { name: 'Impulse Stop', checklist: ['Step away from keyboard', 'Close chart 2 minutes', 'Read risk rule aloud'], sec: 120 },
  { name: 'Loss Spiral Reset', checklist: ['Label emotion', 'Drink water', 'Reduce size 50%'], sec: 180 },
  { name: 'FOMO Defuse', checklist: ['Market will open tomorrow', 'Missed trade ≠ missed career', 'Wait next setup'], sec: 90 },
  { name: 'Revenge Trade Blocker', checklist: ['No new position for timer', 'Journal urge trigger', 'One deep reset'], sec: 240 },
]

export default function EmergencyPage() {
  const { logEmergencyUse } = useAppState()
  const [active, setActive] = useState(0)
  const [remaining, setRemaining] = useState(tools[0].sec)

  useEffect(() => setRemaining(tools[active].sec), [active])
  useEffect(() => {
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-red-200">Emergency Regulation Tools</h1>
      <div className="flex flex-wrap gap-2">{tools.map((t, i) => <button key={t.name} onClick={() => { setActive(i); logEmergencyUse(t.name) }} className={`px-3 py-2 rounded ${i===active ? 'bg-red-600' : 'bg-slate-800'}`}>{t.name}</button>)}</div>
      <SectionCard title={tools[active].name}>
        <BreathingCircle phase={remaining % 8 < 4 ? 'Inhale' : 'Exhale'} seconds={remaining} />
        <ul className="list-disc pl-5">{tools[active].checklist.map(c => <li key={c}>{c}</li>)}</ul>
      </SectionCard>
    </div>
  )
}
