export type Mood = 'Calm' | 'Focused' | 'Frustrated' | 'Anxious' | 'Impulsive'

export interface SessionLog {
  id: string
  date: string
  premarketPlan: string
  checkinMood: Mood
  debrief: string
  pnl: number
  disciplineScore: number
}

export interface Profile {
  name: string
  riskRule: string
  dailyTarget: string
}

export interface AppState {
  version: number
  profile: Profile
  sessions: SessionLog[]
  emergencyUses: { tool: string; date: string }[]
  streak: number
}
