import SectionCard from '../components/SectionCard'
import { useAppState } from '../lib/state'

export default function HomePage() {
  const { state } = useAppState()
  const last = state.sessions[0]
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Welcome back, {state.profile.name}</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <SectionCard title="Discipline Streak"><p className="text-4xl font-bold text-violet-300">{state.streak} days</p></SectionCard>
        <SectionCard title="Risk Rule"><p>{state.profile.riskRule}</p></SectionCard>
        <SectionCard title="Daily Focus"><p>{state.profile.dailyTarget}</p></SectionCard>
      </div>
      <SectionCard title="Latest Session">
        {last ? <p>{last.date}: {last.checkinMood}, score {last.disciplineScore}/100, PnL {last.pnl}</p> : <p className="text-slate-400">No sessions yet.</p>}
      </SectionCard>
    </div>
  )
}
