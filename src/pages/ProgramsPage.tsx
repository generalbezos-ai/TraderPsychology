import SectionCard from '../components/SectionCard'

const days = [
  { day: 'Day 1: Awareness Audit', tasks: ['Track every emotional trigger', 'No trades outside plan', '10-min night review'] },
  { day: 'Day 2: Execution over Outcome', tasks: ['Grade each trade by rule quality', 'One intentional skipped trade', 'Breath reset before each order'] },
  { day: 'Day 3: Loss Response Protocol', tasks: ['Use stop script after red trade', '5-min cooldown after two losses', 'Journal self-talk rewrites'] },
]

export default function ProgramsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">21 Days to Discipline</h1>
      <p className="text-slate-300">Structured progression program. Detailed first 3 days included.</p>
      <div className="grid md:grid-cols-3 gap-4">{days.map(d => <SectionCard key={d.day} title={d.day}><ul className="list-disc pl-5 space-y-1">{d.tasks.map(t => <li key={t}>{t}</li>)}</ul></SectionCard>)}</div>
    </div>
  )
}
