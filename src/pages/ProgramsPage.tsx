import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import SectionCard from '../components/SectionCard'
import { programs } from '../lib/sampleData'
import { useAppState } from '../lib/state'

export default function ProgramsPage() {
  const { state, enrollProgram, advanceProgramDay } = useAppState()

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Structured Training"
        title="Coaching programs"
        subtitle="Commit to one program, execute daily, and build discipline that holds when volatility rises."
      />

      <div className="grid md:grid-cols-2 gap-4">
        {programs.map((program) => {
          const enrolled = state.enrolledProgram?.programId === program.id
          const canEnroll = state.sessions.length >= program.minSessionsRequired

          return (
            <SectionCard key={program.id} title={program.name}>
              <p className="text-sm text-slate-300">{program.objective}</p>
              <p className="text-sm mt-2">Difficulty: {program.difficulty} • {program.durationDays} days</p>
              <p className="text-xs text-slate-400 mt-1">Requires {program.minSessionsRequired} prior sessions.</p>

              <ul className="list-disc pl-5 mt-2 text-sm text-slate-300 space-y-1">
                {program.dayStructure.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              {!enrolled ? (
                <button
                  className="mt-3 app-button app-button-primary disabled:opacity-50"
                  disabled={!canEnroll}
                  onClick={() => {
                    const result = enrollProgram(program.id)
                    if (!result.ok && result.reason) {
                      window.alert(result.reason)
                    }
                  }}
                >
                  {canEnroll ? 'Enroll now' : 'Unlock by logging more sessions'}
                </button>
              ) : (
                <button className="mt-3 app-button app-button-primary" onClick={advanceProgramDay}>
                  Mark day complete
                </button>
              )}
            </SectionCard>
          )
        })}
      </div>

      <SectionCard title="21 Days to Discipline — First 3 Days">
        {programs[0].days.length === 0 ? (
          <EmptyState title="No curriculum loaded yet" description="Add day-by-day modules to make this program fully guided." />
        ) : (
          <div className="grid md:grid-cols-3 gap-3">
            {programs[0].days.map((d) => (
              <div key={d.day} className="rounded-lg border border-slate-700/60 p-3 bg-slate-900/40">
                <p className="font-semibold">Day {d.day}: {d.theme}</p>
                <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                  {d.checklist.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
                <p className="text-xs text-slate-300 mt-2">Journal: {d.journaling}</p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  )
}
