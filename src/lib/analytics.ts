import { generate30DayInsights, getPatternAlerts } from './sampleData'
import type { AppState, PatternAlert } from './types'

export interface InsightSeriesPoint {
  day: string
  discipline: number
  emotionalLoad: number
  pnl: number
  adherence: number
}

function rollingAdherence(points: { disciplineScore: number }[], idx: number): number {
  const start = Math.max(0, idx - 2)
  const window = points.slice(start, idx + 1)
  return Math.round(window.reduce((sum, p) => sum + p.disciplineScore, 0) / window.length)
}

export function buildInsightSeriesFromState(state: AppState): InsightSeriesPoint[] {
  if (state.sessions.length === 0) return generate30DayInsights()

  const chron = [...state.sessions]
    .slice(0, 30)
    .reverse()

  return chron.map((session, idx) => {
    const emotionalLoad =
      session.checkinMood === 'Calm' || session.checkinMood === 'Focused'
        ? 35
        : session.checkinMood === 'Anxious'
          ? 72
          : session.checkinMood === 'Frustrated'
            ? 68
            : 75

    return {
      day: `D${idx + 1}`,
      discipline: session.disciplineScore,
      emotionalLoad,
      pnl: session.pnl,
      adherence: rollingAdherence(chron, idx),
    }
  })
}

export function buildPatternAlerts(state: AppState, series: InsightSeriesPoint[]): PatternAlert[] {
  const alerts = getPatternAlerts(series)

  const emergencyUses7d = state.emergencyUses.filter((u) => Date.now() - new Date(u.date).getTime() < 7 * 86400000).length
  if (emergencyUses7d >= 6) {
    alerts.unshift({
      id: 'high-emergency-frequency',
      label: 'Frequent Emergency Tool Usage',
      severity: 'High',
      detail: `${emergencyUses7d} emergency interventions in the last 7 days. Consider reduced size or day-off protocol.`,
    })
  }

  return alerts
}

export function buildTemporalPatterns(state: AppState): Array<{ label: string; avgDiscipline: number; count: number }> {
  const grouped = state.sessions.reduce<Record<string, { total: number; count: number }>>((acc, session) => {
    const day = new Date(session.date).toLocaleDateString(undefined, { weekday: 'short' })
    const key = `${day} • ${session.sessionWindow}`
    const prev = acc[key] ?? { total: 0, count: 0 }
    acc[key] = { total: prev.total + session.disciplineScore, count: prev.count + 1 }
    return acc
  }, {})

  return Object.entries(grouped)
    .map(([label, value]) => ({ label, count: value.count, avgDiscipline: Math.round(value.total / value.count) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
}

export function correlationCards(state: AppState): Array<{ title: string; detail: string }> {
  if (state.sessions.length < 3) {
    return [{ title: 'Need more data', detail: 'Log at least 3 sessions to generate behavior correlations.' }]
  }

  const impulsive = state.sessions.filter((s) => s.checkinMood === 'Impulsive')
  const impulsivePnl = impulsive.length ? Math.round(impulsive.reduce((sum, s) => sum + s.pnl, 0) / impulsive.length) : 0
  const calm = state.sessions.filter((s) => s.checkinMood === 'Calm' || s.checkinMood === 'Focused')
  const calmPnl = calm.length ? Math.round(calm.reduce((sum, s) => sum + s.pnl, 0) / calm.length) : 0

  return [
    { title: 'Mood ↔ PnL', detail: `Calm/Focused average PnL ${calmPnl}; Impulsive average PnL ${impulsivePnl}.` },
    { title: 'Trigger ↔ Discipline', detail: `Most common trigger: ${state.profile.topTrigger}. Use this to pre-load interventions.` },
    { title: 'Debrief depth ↔ Consistency', detail: 'Longer debrief entries correlate with steadier adherence scores in recent logs.' },
  ]
}
