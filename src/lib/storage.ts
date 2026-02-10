import type { AppState } from './types'

const KEY = 'traders-mind-state'
const VERSION = 2

const defaultState: AppState = {
  version: VERSION,
  profile: { name: 'Trader', riskRule: 'Max -1R/day', dailyTarget: 'A+ execution only' },
  sessions: [],
  emergencyUses: [],
  streak: 0,
}

function migrate(state: Partial<AppState> | null): AppState {
  if (!state) return defaultState
  const v = state.version ?? 1
  if (v === 1) {
    return { ...defaultState, ...state, version: VERSION, emergencyUses: state.emergencyUses ?? [] }
  }
  return { ...defaultState, ...state, version: VERSION }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    return migrate(raw ? JSON.parse(raw) : null)
  } catch {
    return defaultState
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(KEY, JSON.stringify({ ...state, version: VERSION }))
}

export function exportState() {
  return JSON.stringify(loadState(), null, 2)
}

export function clearState() {
  localStorage.removeItem(KEY)
}

export { defaultState }
