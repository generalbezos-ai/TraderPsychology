import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
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
    <div className="space-y-5">
      <PageHeader
        eyebrow="Daily Command Center"
        title={`Good to see you, ${state.profile.name}.`}
        subtitle="Your edge is consistency under pressure. Let today be process-first, calm, and intentional."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SectionCard title="Discipline Streak">
          <p className="text-4xl font-bold text-violet-300">{state.streak} days</p>
          <p className="mt-1 text-xs text-slate-400">Protect the streak by executing your plan before reacting to price.</p>
        </SectionCard>
        <SectionCard title="Average Discipline">
          <p className="text-4xl font-bold text-cyan-300">{avgDiscipline || '--'}</p>
          <p className="text-xs text-slate-400 mt-1">Based on {state.sessions.length} logged sessions</p>
        </SectionCard>
        <SectionCard title="Risk Rule">
          <p className="text-slate-100">{state.profile.riskRule}</p>
        </SectionCard>
        <SectionCard title="Today&apos;s Focus">
          <p className="text-slate-100">{state.profile.dailyTarget}</p>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Quick Snapshot">
          <ul className="space-y-2 text-sm text-slate-200">
            <li>Sessions logged: {state.sessions.length}</li>
            <li>Emergency resets (7d): {state.emergencyUses.filter((u) => Date.now() - new Date(u.date).getTime() < 7 * 86400000).length}</li>
            <li>Current tier: {state.subscriptionTier}</li>
          </ul>
        </SectionCard>

        <SectionCard title="Emergency Shortcuts" subtitle="If your edge starts slipping, reset immediately.">
          <ul className="space-y-2 text-sm">
            {emergencyTools.map((tool) => (
              <li key={tool.id} className="flex items-center justify-between rounded-xl border border-slate-700/50 px-3 py-2">
                <span>{tool.name}</span>
                <Link className="text-red-300 hover:text-red-200" to="/emergency">
                  Launch
                </Link>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Active Program">
          {activeProgram ? (
            <>
              <p className="font-semibold">{activeProgram.name}</p>
              <p className="text-sm text-slate-300 mt-1">
                Day {state.enrolledProgram!.dayIndex + 1} / {activeProgram.durationDays}
              </p>
              <Link to="/programs" className="text-cyan-300 text-sm mt-3 inline-block hover:text-cyan-200">
                Continue program →
              </Link>
            </>
          ) : (
            <EmptyState
              title="No active program yet"
              description="Enroll in a program to turn your routine into a structured coaching path."
              action={
                <Link to="/programs" className="text-cyan-300 text-sm hover:text-cyan-200">
                  Browse programs →
                </Link>
              }
            />
          )}
        </SectionCard>
      </div>

      <SectionCard title="Latest Session">
        {last ? (
          <p className="text-slate-200">
            {new Date(last.date).toLocaleDateString()}: {last.checkinMood}, discipline {last.disciplineScore}/100, PnL {last.pnl}
          </p>
        ) : (
          <EmptyState title="No sessions logged yet" description="Run your first guided session to establish your baseline and start tracking growth." />
        )}
      </SectionCard>
    </div>
  )
}
