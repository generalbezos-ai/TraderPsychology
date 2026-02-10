import { Link } from 'react-router-dom'
import SectionCard from '../components/SectionCard'
import { emergencyTools, programs } from '../lib/sampleData'
import { useAppState } from '../lib/state'

export default function HomePage() {
  const { state } = useAppState()
  const last = state.sessions[0]
  const activeProgram = state.enrolledProgram ? programs.find((p) => p.id === state.enrolledProgram?.programId) : null
  const avgDiscipline =
    state.sessions.length > 0
      ? Math.round(state.sessions.reduce((sum, s) => sum + s.disciplineScore, 0) / state.sessions.length)
      : 0

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Welcome back, {state.profile.name}</h1>
      <div className="grid md:grid-cols-4 gap-4">
        <SectionCard title="Discipline Streak">
          <p className="text-4xl font-bold text-violet-300">{state.streak} days</p>
        </SectionCard>
        <SectionCard title="Avg Discipline">
          <p className="text-4xl font-bold text-cyan-300">{avgDiscipline || '--'}</p>
          <p className="text-xs text-slate-400 mt-1">Across {state.sessions.length} sessions</p>
        </SectionCard>
        <SectionCard title="Risk Rule">
          <p>{state.profile.riskRule}</p>
        </SectionCard>
        <SectionCard title="Daily Focus">
          <p>{state.profile.dailyTarget}</p>
        </SectionCard>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <SectionCard title="Quick Stats">
          <ul className="space-y-1 text-sm text-slate-200">
            <li>Sessions logged: {state.sessions.length}</li>
            <li>Emergency uses (7d): {state.emergencyUses.filter((u) => Date.now() - new Date(u.date).getTime() < 7 * 86400000).length}</li>
            <li>Subscription: {state.subscriptionTier}</li>
          </ul>
        </SectionCard>

        <SectionCard title="Emergency Quick Access">
          <ul className="space-y-2 text-sm">
            {emergencyTools.map((tool) => (
              <li key={tool.id} className="flex items-center justify-between">
                <span>{tool.name}</span>
                <Link className="text-red-300" to="/emergency">
                  Open
                </Link>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Active Program">
          {activeProgram ? (
            <>
              <p className="font-semibold">{activeProgram.name}</p>
              <p className="text-sm text-slate-300 mt-1">Day {state.enrolledProgram!.dayIndex + 1} / {activeProgram.durationDays}</p>
              <Link to="/programs" className="text-cyan-300 text-sm mt-2 inline-block">
                Continue program →
              </Link>
            </>
          ) : (
            <>
              <p className="text-slate-300">No active enrollment</p>
              <Link to="/programs" className="text-cyan-300 text-sm mt-2 inline-block">
                Enroll in a program →
              </Link>
            </>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Latest Session">
        {last ? (
          <p>
            {new Date(last.date).toLocaleDateString()}: {last.checkinMood}, score {last.disciplineScore}/100, PnL {last.pnl}
          </p>
        ) : (
          <p className="text-slate-400">No sessions yet.</p>
        )}
      </SectionCard>
    </div>
  )
}
