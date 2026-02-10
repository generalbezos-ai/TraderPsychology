import type { EmergencyTool, LibraryTrack, PatternAlert, Program, SessionFlow } from './types'

export interface InsightPoint {
  day: string
  discipline: number
  emotionalLoad: number
  pnl: number
  adherence: number
}

export const sessionFlows: SessionFlow[] = [
  {
    id: 'premarket-core',
    name: 'Premarket Prime (12m)',
    description: 'Set process, invalidate weak impulses, and define one executable plan.',
    steps: [
      {
        id: 'scan',
        title: 'Market Scan',
        prompt: 'Name primary trend, key levels, and one no-trade zone.',
        minSeconds: 120,
        maxSeconds: 240,
        overrideLabel: 'Market open soon: move ahead',
      },
      {
        id: 'risk-commitment',
        title: 'Risk Commitment',
        prompt: 'Say your max daily loss and max position risk aloud. Type it exactly.',
        minSeconds: 90,
        maxSeconds: 180,
      },
      {
        id: 'execution-intent',
        title: 'Execution Intent',
        prompt: 'Write one A+ setup and the exact invalidation trigger.',
        minSeconds: 120,
        maxSeconds: 240,
      },
      {
        id: 'breath-lock',
        title: 'Breath Lock',
        prompt: 'Use 4-2-6 breathing for calm focus before first order.',
        minSeconds: 90,
        maxSeconds: 180,
      },
    ],
  },
  {
    id: 'mid-session-reset',
    name: 'Mid-Session Reset (6m)',
    description: 'Interrupt drift and reset process under pressure.',
    steps: [
      {
        id: 'label-state',
        title: 'Label Current State',
        prompt: 'Choose mood + identify single biggest urge.',
        minSeconds: 60,
        maxSeconds: 120,
      },
      {
        id: 'body-reset',
        title: 'Body Reset',
        prompt: 'Drop shoulders, unclench jaw, and exhale longer than inhale.',
        minSeconds: 90,
        maxSeconds: 180,
      },
      {
        id: 'rules-check',
        title: 'Rules Check',
        prompt: 'Confirm next trade must meet A+ checklist, or skip.',
        minSeconds: 90,
        maxSeconds: 180,
      },
    ],
  },
]

export const emergencyTools: EmergencyTool[] = [
  {
    id: 'impulse-stop',
    name: 'Impulse Stop',
    trigger: 'For sudden urge to click in without edge.',
    steps: [
      { id: 'hands-off', title: 'Hands Off', script: 'Take hands off keyboard and mouse. Feet flat. Eyes away from DOM for 15 seconds.', durationSeconds: 45 },
      { id: 'name-urge', title: 'Name the Urge', script: 'Say: “This is impulse, not signal. I do not trade impulses.”', durationSeconds: 60 },
      { id: 'risk-read', title: 'Read Risk Rule', script: 'Read your risk rule out loud exactly, then repeat once slower.', durationSeconds: 60 },
      { id: 'permission', title: 'Re-entry Permission', script: 'Only continue if next setup matches your A+ checklist.', durationSeconds: 45 },
    ],
  },
  {
    id: 'loss-spiral-reset',
    name: 'Loss Spiral Reset',
    trigger: 'After consecutive losses and rising emotional heat.',
    steps: [
      { id: 'hard-pause', title: 'Hard Pause', script: 'No new orders. Stand up, step back from the screen.', durationSeconds: 60 },
      { id: 'hydrate', title: 'Hydrate + Reset', script: 'Take 6 slow breaths while drinking water.', durationSeconds: 90 },
      { id: 'size-cut', title: 'Size Reduction', script: 'Commit to 50% size for next qualifying trade.', durationSeconds: 45 },
      { id: 'journal-line', title: 'One-Line Journal', script: 'Write: trigger, thought, and safer response.', durationSeconds: 75 },
    ],
  },
  {
    id: 'fomo-defuse',
    name: 'FOMO Defuse',
    trigger: 'When chasing after a missed move.',
    steps: [
      { id: 'reframe', title: 'Reframe', script: 'Say: “Missed trade is not missed career.”', durationSeconds: 45 },
      { id: 'chart-clean', title: 'Chart Clean', script: 'Hide lower timeframe and zoom out to structure.', durationSeconds: 60 },
      { id: 'next-plan', title: 'Next Valid Plan', script: 'Define next valid entry location with invalidation.', durationSeconds: 75 },
      { id: 'timer-lock', title: 'Two-Minute Lock', script: 'No order for full timer. Let urgency pass.', durationSeconds: 120 },
    ],
  },
  {
    id: 'revenge-blocker',
    name: 'Revenge Trade Blocker',
    trigger: 'When urge to win it back appears after loss.',
    steps: [
      { id: 'accountability', title: 'Accountability Statement', script: 'Say: “My job is execution, not emotional recovery.”', durationSeconds: 60 },
      { id: 'cooldown', title: 'Mandatory Cooldown', script: 'No new positions. Breathe 4-4-8 for full cooldown.', durationSeconds: 120 },
      { id: 'micro-review', title: 'Micro Review', script: 'Identify whether last loss was setup or behavior error.', durationSeconds: 90 },
      { id: 'go-no-go', title: 'Go / No-Go Gate', script: 'If emotional intensity > 6/10, stop trading for session.', durationSeconds: 60 },
    ],
  },
]

export const programs: Program[] = [
  {
    id: 'discipline-21',
    name: '21 Days to Discipline',
    difficulty: 'Core',
    durationDays: 21,
    minSessionsRequired: 3,
    maxActiveEnrollments: 1,
    objective: 'Build a repeatable process-first identity and reduce impulsive execution.',
    dayStructure: ['Morning priming', 'Live execution checkpoint', 'Post-session debrief'],
    days: [
      {
        day: 1,
        theme: 'Awareness Audit',
        checklist: [
          'Track every emotional trigger during live session',
          'Tag each trade: planned vs reactive',
          'Run 2-minute breath reset before open',
        ],
        journaling: 'Where did emotion hijack process today?',
      },
      {
        day: 2,
        theme: 'Execution Over Outcome',
        checklist: [
          'Grade each trade only by rule quality',
          'Intentionally skip one B setup',
          'Read risk rule before first and third trade',
        ],
        journaling: 'How did process scoring change decision quality?',
      },
      {
        day: 3,
        theme: 'Loss Response Protocol',
        checklist: [
          'Run Loss Spiral Reset after red trade cluster',
          'Mandatory 5-minute cooldown after 2 losses',
          'Rewrite one negative self-talk loop',
        ],
        journaling: 'What did disciplined recovery feel like in the body?',
      },
    ],
  },
  {
    id: 'consistency-sprint',
    name: 'Consistency Sprint',
    difficulty: 'Starter',
    durationDays: 14,
    minSessionsRequired: 1,
    maxActiveEnrollments: 1,
    objective: 'Stabilize routines and remove random behavior.',
    dayStructure: ['10-min prep', 'one-rule focus', '5-min review'],
    days: [],
  },
  {
    id: 'pressure-proof',
    name: 'Pressure Proof Execution',
    difficulty: 'Advanced',
    durationDays: 30,
    minSessionsRequired: 15,
    maxActiveEnrollments: 1,
    objective: 'Maintain discipline in fast markets and after drawdowns.',
    dayStructure: ['stress inoculation', 'volatility protocol', 'night recalibration'],
    days: [],
  },
]

export const libraryTracks: LibraryTrack[] = [
  { id: 'breath-5', title: 'Five Minute Box Breathing', category: 'Breathwork', lengthMin: 5, narrator: 'Coach Aria' },
  { id: 'visual-open', title: 'Open Bell Visualization', category: 'Visualization', lengthMin: 7, narrator: 'Coach Aria' },
  { id: 'selftalk-reset', title: 'Self-Talk Reset Script', category: 'Self-Talk', lengthMin: 4, narrator: 'Coach Sol' },
  { id: 'recovery-close', title: 'After-Loss Recovery Audio', category: 'Recovery', lengthMin: 9, narrator: 'Coach Sol' },
]

export const mindsetQuotes: string[] = [
  'Protect your psychology before your capital.',
  'A missed trade is often discipline paying you quietly.',
  'Consistency is emotional regulation repeated daily.',
]

export function generate30DayInsights(): InsightPoint[] {
  return Array.from({ length: 30 }, (_, i) => {
    const x = i + 1
    return {
      day: `D${x}`,
      discipline: Math.round(68 + Math.sin(i / 4) * 14 + (i % 4)),
      emotionalLoad: Math.round(48 + Math.cos(i / 3) * 18),
      pnl: Math.round(Math.sin(i / 5) * 180 + 55),
      adherence: Math.round(70 + Math.sin(i / 7) * 12 + (i % 3) * 2),
    }
  })
}

export function getPatternAlerts(data: InsightPoint[]): PatternAlert[] {
  const avgDiscipline = data.reduce((sum, d) => sum + d.discipline, 0) / data.length
  const lowDisciplineDays = data.filter((d) => d.discipline < 62).length
  const highEmoDays = data.filter((d) => d.emotionalLoad > 63).length

  const alerts: PatternAlert[] = []
  if (avgDiscipline < 70) {
    alerts.push({ id: 'discipline-drift', label: 'Discipline Drift', severity: 'High', detail: 'Average discipline is below launch threshold (70).' })
  }
  if (lowDisciplineDays >= 4) {
    alerts.push({ id: 'weak-days', label: 'Weak Process Days', severity: 'Medium', detail: `${lowDisciplineDays} sessions dropped below 62 discipline.` })
  }
  if (highEmoDays >= 6) {
    alerts.push({ id: 'emotion-load', label: 'Elevated Emotional Load', severity: 'Medium', detail: `${highEmoDays} days showed high emotional pressure.` })
  }
  if (!alerts.length) {
    alerts.push({ id: 'stable', label: 'Stable Execution Pattern', severity: 'Low', detail: 'No acute risk flags. Maintain current cadence.' })
  }

  return alerts
}
