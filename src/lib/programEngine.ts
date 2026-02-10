import { programs } from './sampleData'
import type { AppState, Program } from './types'

export function getUnlockState(state: AppState, program: Program): { unlocked: boolean; reason?: string } {
  if (state.sessions.length < program.minSessionsRequired) {
    return { unlocked: false, reason: `Need ${program.minSessionsRequired - state.sessions.length} more sessions.` }
  }

  const avgDiscipline = state.sessions.length
    ? state.sessions.reduce((sum, s) => sum + s.disciplineScore, 0) / state.sessions.length
    : 0

  if (program.difficulty === 'Advanced' && avgDiscipline < 72) {
    return { unlocked: false, reason: 'Advanced tracks require 72+ average discipline.' }
  }

  return { unlocked: true }
}

export function getStreakReward(streak: number): string | null {
  if (streak >= 30) return 'Elite consistency badge unlocked.'
  if (streak >= 14) return 'Two-week lock-in reward: unlock bonus recovery audio.'
  if (streak >= 7) return '7-day streak reward: guided reset preset unlocked.'
  return null
}

export function getProgramTimeline(state: AppState): Array<{ day: number; status: 'Complete' | 'Current' | 'Locked' }> {
  const enrollment = state.enrolledProgram
  if (!enrollment) return []
  const program = programs.find((p) => p.id === enrollment.programId)
  if (!program) return []

  return Array.from({ length: Math.min(14, program.durationDays) }, (_, i) => {
    const day = i + 1
    if (enrollment.completedDays.includes(day)) return { day, status: 'Complete' }
    if (day === enrollment.dayIndex + 1) return { day, status: 'Current' }
    return { day, status: 'Locked' }
  })
}

export function getCompletionCertificate(state: AppState): string | null {
  if (!state.enrolledProgram) return null
  const program = programs.find((p) => p.id === state.enrolledProgram?.programId)
  if (!program) return null
  if (state.enrolledProgram.completedDays.length < program.durationDays) return null
  return `Certificate of Completion: ${state.profile.name} completed ${program.name}.`
}
