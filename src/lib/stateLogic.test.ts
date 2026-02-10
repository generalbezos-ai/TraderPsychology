import { canEnroll, nextStreak } from './stateLogic'
import { defaultState } from './storage'

describe('stateLogic', () => {
  it('increments streak for consecutive day', () => {
    const state = {
      ...defaultState,
      streak: 3,
      sessions: [
        {
          id: '1',
          date: '2026-02-09T12:00:00.000Z',
          flowId: 'premarket-core',
          premarketPlan: 'A+',
          checkinMood: 'Focused' as const,
          debrief: 'good',
          pnl: 10,
          disciplineScore: 80,
          mistakes: [],
          wins: [],
          tags: [],
          topTrigger: 'fomo',
          bestDecision: 'waited for setup',
          sessionWindow: 'NewYork' as const,
        },
      ],
    }

    expect(nextStreak(state, new Date('2026-02-10T12:00:00.000Z'))).toBe(4)
  })

  it('resets streak when gap is more than one day', () => {
    const state = {
      ...defaultState,
      streak: 5,
      sessions: [
        {
          id: '1',
          date: '2026-02-01T12:00:00.000Z',
          flowId: 'premarket-core',
          premarketPlan: 'A+',
          checkinMood: 'Focused' as const,
          debrief: 'good',
          pnl: 10,
          disciplineScore: 80,
          mistakes: [],
          wins: [],
          tags: [],
          topTrigger: 'fomo',
          bestDecision: 'waited for setup',
          sessionWindow: 'NewYork' as const,
        },
      ],
    }

    expect(nextStreak(state, new Date('2026-02-10T12:00:00.000Z'))).toBe(1)
  })

  it('blocks enroll when required session count is not met', () => {
    const state = { ...defaultState, sessions: [] }
    const result = canEnroll(state, 'discipline-21')
    expect(result.ok).toBe(false)
    expect(result.reason).toContain('Need')
  })
})
