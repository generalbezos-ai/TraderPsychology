import { createContext, useContext, useMemo, useState } from 'react'
import { loadState, saveState } from './storage'
import type { AppState, SessionLog } from './types'

interface StateCtx {
  state: AppState
  setState: (next: AppState) => void
  addSession: (session: SessionLog) => void
  logEmergencyUse: (tool: string) => void
}

const Ctx = createContext<StateCtx | null>(null)

export function StateProvider({ children }: { children: React.ReactNode }) {
  const [state, setStateRaw] = useState<AppState>(loadState())
  const setState = (next: AppState) => {
    setStateRaw(next)
    saveState(next)
  }
  const value = useMemo(() => ({
    state,
    setState,
    addSession: (session: SessionLog) => setState({ ...state, sessions: [session, ...state.sessions], streak: state.streak + 1 }),
    logEmergencyUse: (tool: string) => setState({ ...state, emergencyUses: [{ tool, date: new Date().toISOString() }, ...state.emergencyUses] })
  }), [state])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAppState() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAppState must be used in provider')
  return ctx
}
