import SectionCard from '../components/SectionCard'

const soundscapes = ['Focus Rain 30m', 'Calm Pulse 10m', 'Deep Reset 5m']
const wisdom = ['"Protect your mind before your capital."', '"A missed trade is tuition saved."', '"Discipline compounds faster than PnL."']

export default function LibraryPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Mental Library</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <SectionCard title="Audio Resets & Players"><ul className="space-y-2">{soundscapes.map(s => <li key={s} className="flex justify-between"><span>{s}</span><button className="text-cyan-300">Play</button></li>)}</ul></SectionCard>
        <SectionCard title="Wisdom Vault"><ul className="space-y-2 text-slate-200">{wisdom.map(w => <li key={w}>{w}</li>)}</ul></SectionCard>
      </div>
    </div>
  )
}
