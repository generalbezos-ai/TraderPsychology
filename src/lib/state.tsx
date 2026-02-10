import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { loadState, saveState } from './storage'
import type { AppState, Enrollment, SessionLog } from './types'
import { canEnroll, nextStreak } from './stateLogic'

interface StateCtx {
  state: AppState
  setState: (next: AppState) => void
  addSession: (session: SessionLog) => void
  logEmergencyUse: (toolId: string) => void
  enrollProgram: (programId: string) => { ok: boolean; reason?: string }
  advanceProgramDay: () => void
  toggleFavoriteTrack: (trackId: string) => void
  importState: (next: AppState) => void
  setPanicMode: (minutes: number) => void
}

const Ctx = createContext<StateCtx | null>(null)

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
    const enrollment: Enrollment = {
      programId,
      startedAt: new Date().toISOString(),
      dayIndex: 0,
      completedDays: [],
      rewardsClaimed: [],
    }
    setState({ ...state, enrolledProgram: enrollment })
    return { ok: true }
  }, [setState, state])

  const advanceProgramDay = useCallback(() => {
    updateState((prev) => {
      if (!prev.enrolledProgram) return prev
      const day = prev.enrolledProgram.dayIndex + 1
      const completedDays = prev.enrolledProgram.completedDays.includes(day)
        ? prev.enrolledProgram.completedDays
        : [...prev.enrolledProgram.completedDays, day]
      return {
        ...prev,
        enrolledProgram: {
          ...prev.enrolledProgram,
          dayIndex: prev.enrolledProgram.dayIndex + 1,
          completedDays,
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

  const importState = useCallback((next: AppState) => {
    setState(next)
  }, [setState])

  const setPanicMode = useCallback((minutes: number) => {
    updateState((prev) => ({
      ...prev,
      panicModeUntil: new Date(Date.now() + minutes * 60000).toISOString(),
    }))
  }, [updateState])

  const value = useMemo<StateCtx>(() => ({
    state,
    setState,
    addSession,
    logEmergencyUse,
    enrollProgram,
    advanceProgramDay,
    toggleFavoriteTrack,
    importState,
    setPanicMode,
  }), [state, setState, addSession, logEmergencyUse, enrollProgram, advanceProgramDay, toggleFavoriteTrack, importState, setPanicMode])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAppState() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAppState must be used in provider')
  return ctx
}
