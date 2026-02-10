import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import SectionCard from '../components/SectionCard'
import { getCompletionCertificate, getProgramTimeline, getStreakReward, getUnlockState } from '../lib/programEngine'
import { programs } from '../lib/sampleData'
import { useAppState } from '../lib/state'

export default function ProgramsPage() {
  const { state, enrollProgram, advanceProgramDay } = useAppState()
  const timeline = getProgramTimeline(state)
  const reward = getStreakReward(state.streak)
  const certificate = getCompletionCertificate(state)

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
          const unlock = getUnlockState(state, program)

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
                  disabled={!unlock.unlocked}
                  onClick={() => {
                    const result = enrollProgram(program.id)
                    if (!result.ok && result.reason) window.alert(result.reason)
                  }}
                >
                  {unlock.unlocked ? 'Enroll now' : unlock.reason}
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

      {reward && <SectionCard title="Streak rewards"><p className="text-cyan-200">{reward}</p></SectionCard>}

      <SectionCard title="Program timeline">
        {timeline.length === 0 ? <EmptyState title="No active timeline" description="Enroll in a program to unlock timeline progression." /> : (
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
            {timeline.map((item) => <div key={item.day} className="rounded-lg border border-slate-700/60 p-2 text-center text-xs">Day {item.day}<div className="mt-1 text-slate-300">{item.status}</div></div>)}
          </div>
        )}
      </SectionCard>

      {certificate && <SectionCard title="Completion Certificate"><p className="text-sm">{certificate}</p></SectionCard>}

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
