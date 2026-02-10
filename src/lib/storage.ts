import type { AppState } from './types'

const KEY = 'traders-mind-state'
const VERSION = 3

export const defaultState: AppState = {
  version: VERSION,
  profile: {
    name: 'Trader',
    riskRule: 'Max -1R/day, stop after breach',
    dailyTarget: 'A+ execution only',
    timezone: 'UTC',
  },
  notifications: {
    premarketReminder: true,
    checkinReminder: true,
    debriefReminder: true,
    emergencyNudge: true,
  },
  sessions: [],
  emergencyUses: [],
  streak: 0,
  enrolledProgram: null,
  favoriteLibraryIds: [],
  subscriptionTier: 'Free',
}

function migrate(state: Partial<AppState> | null): AppState {
  if (!state) return defaultState

  const merged: AppState = {
    ...defaultState,
    ...state,
    version: VERSION,
    profile: {
      ...defaultState.profile,
      ...(state.profile ?? {}),
    },
    notifications: {
      ...defaultState.notifications,
      ...(state.notifications ?? {}),
    },
    sessions: state.sessions ?? [],
    emergencyUses: state.emergencyUses ?? [],
    favoriteLibraryIds: state.favoriteLibraryIds ?? [],
    enrolledProgram: state.enrolledProgram ?? null,
    subscriptionTier: state.subscriptionTier ?? 'Free',
  }

  return merged
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    return migrate(raw ? (JSON.parse(raw) as Partial<AppState>) : null)
  } catch {
    return defaultState
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(KEY, JSON.stringify({ ...state, version: VERSION }))
}

export function exportState(): string {
  return JSON.stringify(loadState(), null, 2)
}

export function clearState(): void {
  localStorage.removeItem(KEY)
}
