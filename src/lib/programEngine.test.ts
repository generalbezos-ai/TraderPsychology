import { getStreakReward, getUnlockState } from './programEngine'
import { programs } from './sampleData'
import { defaultState } from './storage'

describe('programEngine', () => {
  it('unlocks starter with enough sessions', () => {
    const state = {
      ...defaultState,
      sessions: Array.from({ length: 2 }, (_, i) => ({
        id: `${i}`,
        date: new Date().toISOString(),
        flowId: 'premarket-core',
        premarketPlan: 'plan',
        checkinMood: 'Focused' as const,
        debrief: 'done',
        pnl: 0,
        disciplineScore: 80,
        mistakes: [],
        wins: [],
        tags: [],
        topTrigger: 'fomo',
        bestDecision: '',
        sessionWindow: 'NewYork' as const,
      })),
    }
    expect(getUnlockState(state, programs[1]).unlocked).toBe(true)
  })

  it('returns reward milestone', () => {
    expect(getStreakReward(14)).toContain('Two-week')
  })
})
