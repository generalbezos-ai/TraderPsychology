import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import SectionCard from '../components/SectionCard'
import { generate30DayInsights } from '../lib/sampleData'

const data = generate30DayInsights()

export default function InsightsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Insights</h1>
      <SectionCard title="30-Day Psychology Trends">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line dataKey="discipline" stroke="#a78bfa" strokeWidth={3} dot={false} />
              <Line dataKey="emotion" stroke="#22d3ee" strokeWidth={2} dot={false} />
              <Line dataKey="pnl" stroke="#34d399" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  )
}
