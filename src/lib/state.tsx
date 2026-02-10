import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { loadState, saveState } from './storage'
import type { AppState, Enrollment, SessionLog } from './types'
import { programs } from './sampleData'

interface StateCtx {
  state: AppState
  setState: (next: AppState) => void
  addSession: (session: SessionLog) => void
  logEmergencyUse: (toolId: string) => void
  enrollProgram: (programId: string) => { ok: boolean; reason?: string }
  advanceProgramDay: () => void
  toggleFavoriteTrack: (trackId: string) => void
}

const Ctx = createContext<StateCtx | null>(null)

function nextStreak(current: AppState): number {
  const last = current.sessions[0]
  if (!last) return 1
  const lastDate = new Date(last.date)
  const now = new Date()
  const diff = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
  if (diff <= 1) return current.streak + 1
  return 1
}

function canEnroll(state: AppState, programId: string): { ok: boolean; reason?: string } {
  const program = programs.find((p) => p.id === programId)
  if (!program) return { ok: false, reason: 'Program not found.' }
  if (state.enrolledProgram && state.enrolledProgram.programId !== programId) {
    return { ok: false, reason: 'Only one active program allowed.' }
  }
  if (state.sessions.length < program.minSessionsRequired) {
    return { ok: false, reason: `Need ${program.minSessionsRequired} logged sessions before enrolling.` }
  }
  return { ok: true }
}

export function StateProvider({ children }: { children: React.ReactNode }) {
  const [state, setStateRaw] = useState<AppState>(loadState())

  const setState = useCallback((next: AppState) => {
    setStateRaw(next)
    saveState(next)
  }, [])

  const updateState = useCallback((updater: (prev: AppState) => AppState) => {
    setStateRaw((prev) => {
      const next = updater(prev)
      saveState(next)
      return next
    })
  }, [])

  const addSession = useCallback((session: SessionLog) => {
    updateState((prev) => ({ ...prev, sessions: [session, ...prev.sessions], streak: nextStreak(prev) }))
  }, [updateState])

  const logEmergencyUse = useCallback((toolId: string) => {
    updateState((prev) => ({ ...prev, emergencyUses: [{ toolId, date: new Date().toISOString() }, ...prev.emergencyUses] }))
  }, [updateState])

  const enrollProgram = useCallback((programId: string) => {
    const check = canEnroll(state, programId)
    if (!check.ok) return check
    const enrollment: Enrollment = { programId, startedAt: new Date().toISOString(), dayIndex: 0 }
    setState({ ...state, enrolledProgram: enrollment })
    return { ok: true }
  }, [setState, state])

  const advanceProgramDay = useCallback(() => {
    updateState((prev) => {
      if (!prev.enrolledProgram) return prev
      return {
        ...prev,
        enrolledProgram: {
          ...prev.enrolledProgram,
          dayIndex: prev.enrolledProgram.dayIndex + 1,
        },
      }
    })
  }, [updateState])

  const toggleFavoriteTrack = useCallback((trackId: string) => {
    updateState((prev) => {
      const exists = prev.favoriteLibraryIds.includes(trackId)
      return {
        ...prev,
        favoriteLibraryIds: exists
          ? prev.favoriteLibraryIds.filter((id) => id !== trackId)
          : [...prev.favoriteLibraryIds, trackId],
      }
    })
  }, [updateState])

  const value = useMemo<StateCtx>(() => ({
    state,
    setState,
    addSession,
    logEmergencyUse,
    enrollProgram,
    advanceProgramDay,
    toggleFavoriteTrack,
  }), [state, setState, addSession, logEmergencyUse, enrollProgram, advanceProgramDay, toggleFavoriteTrack])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAppState() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAppState must be used in provider')
  return ctx
}
