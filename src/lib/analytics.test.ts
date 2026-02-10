import { buildInsightSeriesFromState, buildPatternAlerts, correlationCards } from './analytics'
import { defaultState } from './storage'

describe('analytics', () => {
  it('uses real session data when sessions exist', () => {
    const state = {
      ...defaultState,
      sessions: [
        {
          id: 's2',
          date: '2026-02-10T12:00:00.000Z',
          flowId: 'premarket-core',
          premarketPlan: 'Plan',
          checkinMood: 'Frustrated' as const,
          debrief: 'Debrief',
          pnl: -50,
          disciplineScore: 66,
          mistakes: [],
          wins: [],
          tags: ['fomo'],
          topTrigger: 'fomo',
          bestDecision: 'stopped out quickly',
          sessionWindow: 'NewYork' as const,
        },
      ],
    }

    const series = buildInsightSeriesFromState(state)
    expect(series).toHaveLength(1)
    expect(series[0].discipline).toBe(66)
    expect(series[0].pnl).toBe(-50)
    expect(series[0].emotionalLoad).toBe(68)
  })

  it('adds high-emergency-frequency alert', () => {
    const now = Date.now()
    const state = {
      ...defaultState,
      emergencyUses: Array.from({ length: 6 }, (_, i) => ({
        toolId: 'impulse-stop',
        date: new Date(now - i * 3600000).toISOString(),
      })),
      sessions: [],
    }

    const series = buildInsightSeriesFromState(state)
    const alerts = buildPatternAlerts(state, series)
    expect(alerts.some((a) => a.id === 'high-emergency-frequency')).toBe(true)
  })

  it('builds fallback correlation card with low data', () => {
    expect(correlationCards(defaultState)[0].title).toContain('Need more data')
  })
})
