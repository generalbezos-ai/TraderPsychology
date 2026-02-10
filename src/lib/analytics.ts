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
