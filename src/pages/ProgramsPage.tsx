import SectionCard from '../components/SectionCard'
import { programs } from '../lib/sampleData'
import { useAppState } from '../lib/state'

export default function ProgramsPage() {
  const { state, enrollProgram, advanceProgramDay } = useAppState()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Programs</h1>
      <p className="text-slate-300">Enroll once enough session data exists. Only one active program at a time.</p>

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
                  className="mt-3 bg-violet-600 px-3 py-2 rounded disabled:opacity-50"
                  disabled={!canEnroll}
                  onClick={() => {
                    const result = enrollProgram(program.id)
                    if (!result.ok && result.reason) {
                      window.alert(result.reason)
                    }
                  }}
                >
                  Enroll
                </button>
              ) : (
                <button className="mt-3 bg-cyan-700 px-3 py-2 rounded" onClick={advanceProgramDay}>
                  Mark day complete
                </button>
              )}
            </SectionCard>
          )
        })}
      </div>

      <SectionCard title="21 Days to Discipline — First 3 Days (Detailed)">
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
      </SectionCard>
    </div>
  )
}
