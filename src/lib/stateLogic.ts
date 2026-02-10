import { programs } from './sampleData'
import { getUnlockState } from './programEngine'
import type { AppState } from './types'

export function nextStreak(current: AppState, now = new Date()): number {
  const last = current.sessions[0]
  if (!last) return 1

  const lastDate = new Date(last.date)
  if (Number.isNaN(lastDate.getTime())) return 1

  const diff = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
  if (diff <= 1) return current.streak + 1
  return 1
}

export function canEnroll(state: AppState, programId: string): { ok: boolean; reason?: string } {
  const program = programs.find((p) => p.id === programId)
  if (!program) return { ok: false, reason: 'Program not found.' }

  if (state.enrolledProgram && state.enrolledProgram.programId !== programId) {
    return { ok: false, reason: 'Only one active program allowed.' }
  }

  const unlock = getUnlockState(state, program)
  if (!unlock.unlocked) return { ok: false, reason: unlock.reason }

  return { ok: true }
}
