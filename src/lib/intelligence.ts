import type { AppState, Mood, SessionLog } from './types'

interface AdaptivePrompt {
  title: string
  prompt: string
  intervention: string
}

const moodEnergy: Record<Mood, number> = {
  Calm: 20,
  Focused: 25,
  Frustrated: 60,
  Anxious: 70,
  Impulsive: 80,
}

export function computeBehaviorHeat(sessions: SessionLog[]): number {
  if (!sessions.length) return 40
  const recent = sessions.slice(0, 5)
  const avgMood = recent.reduce((sum, s) => sum + moodEnergy[s.checkinMood], 0) / recent.length
  const avgDiscipline = recent.reduce((sum, s) => sum + s.disciplineScore, 0) / recent.length
  const emergencyPenalty = recent.filter((s) => s.tags.includes('revenge') || s.tags.includes('fomo')).length * 4
  return Math.round(Math.min(95, Math.max(20, avgMood + (75 - avgDiscipline) + emergencyPenalty)))
}

export function getAdaptivePrompt(state: AppState): AdaptivePrompt {
  const heat = computeBehaviorHeat(state.sessions)
  const last = state.sessions[0]

  if (!last) {
    return {
      title: 'Build your first baseline',
      prompt: 'Run one guided session and log your top trigger so the coach can personalize interventions.',
      intervention: 'Start with 2-minute breath lock then write one A+ setup only.',
    }
  }

  if (heat >= 75) {
    return {
      title: 'High emotional load detected',
      prompt: `Recent pattern shows pressure around ${last.topTrigger || state.profile.topTrigger}. Reduce speed and size.`,
      intervention: 'Use Loss Spiral Reset, then trade half-size for next valid setup.',
    }
  }

  if (last.disciplineScore < 70) {
    return {
      title: 'Discipline dip pattern',
      prompt: 'Your last session slipped below your execution baseline. Re-center before open.',
      intervention: 'Read risk rule aloud twice and pre-commit to skipping one B setup.',
    }
  }

  return {
    title: 'Execution quality stable',
    prompt: 'Momentum is healthy. Keep process-first behavior and protect composure.',
    intervention: 'Do a short check-in every 90 minutes to prevent drift.',
  }
}

export function getEscalationRecommendation(state: AppState): string | null {
  const now = Date.now()
  const recentUses = state.emergencyUses.filter((u) => now - new Date(u.date).getTime() < 2 * 86400000)
  if (recentUses.length < 4) return null
  return 'Repeated trigger activity detected. Consider stopping for the day, reducing size tomorrow, and reviewing your journal highlight reel.'
}
