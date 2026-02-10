import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import SectionCard from '../components/SectionCard'
import { buildInsightSeriesFromState, buildPatternAlerts, buildTemporalPatterns, correlationCards } from '../lib/analytics'
import { useAppState } from '../lib/state'

export default function InsightsPage() {
  const { state } = useAppState()
  const data = buildInsightSeriesFromState(state)
  const alerts = buildPatternAlerts(state, data)
  const temporal = buildTemporalPatterns(state)
  const cards = correlationCards(state)

  const moodMix = state.sessions.reduce<Record<string, number>>((acc, session) => {
    acc[session.checkinMood] = (acc[session.checkinMood] ?? 0) + 1
    return acc
  }, {})
  const moodData = Object.entries(moodMix).map(([mood, count]) => ({ mood, count }))

  const week = data.slice(-7)
  const month = data.slice(-30)
  const weeklyAvg = week.length ? Math.round(week.reduce((s, d) => s + d.discipline, 0) / week.length) : 0
  const monthlyAvg = month.length ? Math.round(month.reduce((s, d) => s + d.discipline, 0) / month.length) : 0

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Performance Intelligence"
        title="Insights"
        subtitle="Review behavior trends, pressure patterns, and risk signals before they become expensive habits."
      />

      <div className="grid md:grid-cols-2 gap-4">
        <SectionCard title="Weekly Summary">
          <p className="text-4xl font-bold text-violet-300">{weeklyAvg || '--'}</p>
          <p className="text-xs text-slate-400 mt-1">Average discipline last 7 sessions</p>
        </SectionCard>
        <SectionCard title="Monthly Summary">
          <p className="text-4xl font-bold text-cyan-300">{monthlyAvg || '--'}</p>
          <p className="text-xs text-slate-400 mt-1">Average discipline last 30 sessions</p>
        </SectionCard>
      </div>

      <SectionCard title="30-Day Psychology Trends">
        <div className="h-72" aria-label="30 day psychology trend chart">
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
          <div className="h-64" aria-label="pnl versus discipline chart">
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

        <SectionCard title="Mood Distribution">
          {moodData.length === 0 ? (
            <EmptyState title="No mood data yet" description="Log sessions to unlock mood distribution and emotional state analytics." />
          ) : (
            <div className="h-64" aria-label="mood distribution chart">
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

      <SectionCard title="Pattern detection by day / time">
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          {temporal.map((item) => (
            <div key={item.label} className="rounded-lg border border-slate-700/60 p-3">
              <p className="font-semibold">{item.label}</p>
              <p className="text-slate-300 mt-1">Avg discipline {item.avgDiscipline} • Sessions {item.count}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Correlation cards">
        <div className="grid md:grid-cols-3 gap-3">
          {cards.map((card) => (
            <article key={card.title} className="rounded-lg border border-slate-700/60 bg-slate-900/40 p-3">
              <p className="font-semibold">{card.title}</p>
              <p className="text-sm text-slate-200 mt-2">{card.detail}</p>
            </article>
          ))}
        </div>
      </SectionCard>

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
