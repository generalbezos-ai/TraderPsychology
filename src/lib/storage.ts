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

function cloneDefaultState(): AppState {
  return {
    ...defaultState,
    profile: { ...defaultState.profile },
    notifications: { ...defaultState.notifications },
    sessions: [],
    emergencyUses: [],
    favoriteLibraryIds: [],
    enrolledProgram: null,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isEnrollment(value: unknown): value is NonNullable<AppState['enrolledProgram']> {
  if (!isRecord(value)) return false
  return typeof value.programId === 'string' && typeof value.startedAt === 'string' && typeof value.dayIndex === 'number'
}

function migrate(state: unknown): AppState {
  if (!isRecord(state)) return cloneDefaultState()
  const base = cloneDefaultState()

  const profile = isRecord(state.profile) ? state.profile : {}
  const notifications = isRecord(state.notifications) ? state.notifications : {}

  return {
    ...base,
    ...state,
    version: VERSION,
    profile: {
      ...base.profile,
      ...profile,
    },
    notifications: {
      ...base.notifications,
      ...notifications,
    },
    sessions: Array.isArray(state.sessions) ? state.sessions : [],
    emergencyUses: Array.isArray(state.emergencyUses) ? state.emergencyUses : [],
    favoriteLibraryIds: Array.isArray(state.favoriteLibraryIds)
      ? state.favoriteLibraryIds.filter((id): id is string => typeof id === 'string')
      : [],
    enrolledProgram: isEnrollment(state.enrolledProgram) ? state.enrolledProgram : null,
    subscriptionTier: state.subscriptionTier === 'Pro' ? 'Pro' : 'Free',
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    return migrate(raw ? JSON.parse(raw) : null)
  } catch {
    return cloneDefaultState()
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
