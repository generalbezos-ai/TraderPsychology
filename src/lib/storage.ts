import type { AppState, SessionLog } from './types'

const KEY = 'traders-mind-state'
const VERSION = 6

const defaultSession = (session: Partial<SessionLog>): SessionLog => ({
  id: session.id ?? crypto.randomUUID(),
  date: session.date ?? new Date().toISOString(),
  flowId: session.flowId ?? 'premarket-core',
  premarketPlan: session.premarketPlan ?? '',
  checkinMood: session.checkinMood ?? 'Focused',
  debrief: session.debrief ?? '',
  pnl: session.pnl ?? 0,
  disciplineScore: session.disciplineScore ?? 70,
  mistakes: session.mistakes ?? [],
  wins: session.wins ?? [],
  tags: session.tags ?? [],
  topTrigger: session.topTrigger ?? '',
  bestDecision: session.bestDecision ?? '',
  sessionWindow: session.sessionWindow ?? 'NewYork',
})

export const defaultState: AppState = {
  version: VERSION,
  profile: {
    name: 'Trader',
    riskRule: 'Max -1R/day, stop after breach',
    dailyTarget: 'A+ execution only',
    timezone: 'UTC',
    tradingStyle: 'Intraday',
    preferredSession: 'NewYork',
    topTrigger: 'Revenge trades after losses',
  },
  notifications: {
    premarketReminder: true,
    checkinReminder: true,
    debriefReminder: true,
    emergencyNudge: true,
  },
  reminders: {
    morningTime: '07:30',
    sessionTime: '09:20',
    debriefTime: '16:30',
  },
  onboarding: {
    completed: false,
    currentStep: 0,
  },
  privacy: {
    pinEnabled: false,
    pinHash: '',
    lockJournal: true,
    lockInsights: false,
  },
  localAccount: {
    enabled: false,
    accountName: '',
    emailHint: '',
    cloudAdapter: 'none',
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
    reminders: { ...defaultState.reminders },
    onboarding: { ...defaultState.onboarding },
    privacy: { ...defaultState.privacy },
    localAccount: { ...defaultState.localAccount },
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
  const reminders = isRecord(state.reminders) ? state.reminders : {}
  const onboarding = isRecord(state.onboarding) ? state.onboarding : {}
  const privacy = isRecord(state.privacy) ? state.privacy : {}
  const localAccount = isRecord(state.localAccount) ? state.localAccount : {}

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
    reminders: {
      ...base.reminders,
      ...reminders,
    },
    onboarding: {
      ...base.onboarding,
      ...onboarding,
    },
    privacy: {
      ...base.privacy,
      ...privacy,
    },
    localAccount: {
      ...base.localAccount,
      ...localAccount,
    },
    sessions: Array.isArray(state.sessions) ? state.sessions.map((s) => defaultSession(isRecord(s) ? s : {})) : [],
    emergencyUses: Array.isArray(state.emergencyUses) ? state.emergencyUses : [],
    favoriteLibraryIds: Array.isArray(state.favoriteLibraryIds)
      ? state.favoriteLibraryIds.filter((id): id is string => typeof id === 'string')
      : [],
    enrolledProgram: isEnrollment(state.enrolledProgram)
      ? {
        ...state.enrolledProgram,
        completedDays: Array.isArray(state.enrolledProgram.completedDays) ? state.enrolledProgram.completedDays : [],
        rewardsClaimed: Array.isArray(state.enrolledProgram.rewardsClaimed) ? state.enrolledProgram.rewardsClaimed : [],
      }
      : null,
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

export function importState(raw: unknown): AppState {
  return migrate(raw)
}

export function clearState(): void {
  localStorage.removeItem(KEY)
}
