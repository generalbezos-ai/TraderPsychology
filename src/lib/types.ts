export type Mood = 'Calm' | 'Focused' | 'Frustrated' | 'Anxious' | 'Impulsive'

export interface SessionLog {
  id: string
  date: string
  flowId: string
  premarketPlan: string
  checkinMood: Mood
  debrief: string
  pnl: number
  disciplineScore: number
  mistakes: string[]
  wins: string[]
}

export interface SessionStep {
  id: string
  title: string
  prompt: string
  minSeconds: number
  maxSeconds?: number
  overrideLabel?: string
}

export interface SessionFlow {
  id: string
  name: string
  description: string
  steps: SessionStep[]
}

export interface EmergencyStep {
  id: string
  title: string
  script: string
  durationSeconds: number
}

export interface EmergencyTool {
  id: string
  name: string
  trigger: string
  steps: EmergencyStep[]
}

export interface EmergencyUse {
  toolId: string
  date: string
}

export interface ProgramDay {
  day: number
  theme: string
  checklist: string[]
  journaling: string
}

export interface Program {
  id: string
  name: string
  difficulty: 'Starter' | 'Core' | 'Advanced'
  durationDays: number
  minSessionsRequired: number
  maxActiveEnrollments: number
  objective: string
  dayStructure: string[]
  days: ProgramDay[]
}

export interface Enrollment {
  programId: string
  startedAt: string
  dayIndex: number
}

export interface LibraryTrack {
  id: string
  title: string
  category: 'Breathwork' | 'Visualization' | 'Self-Talk' | 'Recovery'
  lengthMin: number
  narrator: string
}

export interface PatternAlert {
  id: string
  label: string
  severity: 'Low' | 'Medium' | 'High'
  detail: string
}

export interface Notifications {
  premarketReminder: boolean
  checkinReminder: boolean
  debriefReminder: boolean
  emergencyNudge: boolean
}

export interface Profile {
  name: string
  riskRule: string
  dailyTarget: string
  timezone: string
}

export interface AppState {
  version: number
  profile: Profile
  notifications: Notifications
  sessions: SessionLog[]
  emergencyUses: EmergencyUse[]
  streak: number
  enrolledProgram: Enrollment | null
  favoriteLibraryIds: string[]
  subscriptionTier: 'Free' | 'Pro'
}