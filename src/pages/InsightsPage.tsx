import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import SectionCard from '../components/SectionCard'
import { buildInsightSeriesFromState, buildPatternAlerts } from '../lib/analytics'
import { useAppState } from '../lib/state'

export default function InsightsPage() {
  const { state } = useAppState()
  const data = buildInsightSeriesFromState(state)
  const alerts = buildPatternAlerts(state, data)

  const moodMix = state.sessions.reduce<Record<string, number>>((acc, session) => {
    acc[session.checkinMood] = (acc[session.checkinMood] ?? 0) + 1
    return acc
  }, {})
  const moodData = Object.entries(moodMix).map(([mood, count]) => ({ mood, count }))

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Insights</h1>

      <SectionCard title="30-Day Psychology Trends">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line dataKey="discipline" stroke="#a78bfa" strokeWidth={2} dot={false} />
              <Line dataKey="emotionalLoad" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line dataKey="adherence" stroke="#22d3ee" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <div className="grid md:grid-cols-2 gap-4">
        <SectionCard title="PnL vs Discipline">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.slice(-10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="pnl" fill="#34d399" />
                <Bar dataKey="discipline" fill="#a78bfa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Mood Distribution (Real Logs)">
          {moodData.length === 0 ? (
            <p className="text-slate-400 text-sm">Log sessions to unlock mood distribution chart.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="mood" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#22d3ee" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Pattern Alerts">
        <div className="grid md:grid-cols-3 gap-3">
          {alerts.map((alert) => (
            <article key={alert.id} className="rounded-lg border border-slate-700/60 bg-slate-900/40 p-3">
              <p className="font-semibold">{alert.label}</p>
              <p className="text-xs text-slate-400 mt-1">Severity: {alert.severity}</p>
              <p className="text-sm text-slate-200 mt-2">{alert.detail}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
