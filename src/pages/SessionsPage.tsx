import { useEffect, useMemo, useState } from 'react'
import BreathingCircle from '../components/BreathingCircle'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import SectionCard from '../components/SectionCard'
import { sessionFlows } from '../lib/sampleData'
import { useAppState } from '../lib/state'
import type { Mood } from '../lib/types'

const moods: Mood[] = ['Calm', 'Focused', 'Frustrated', 'Anxious', 'Impulsive']

function estimateDisciplineScore(plan: string, debrief: string, mood: Mood): number {
  const base = mood === 'Calm' || mood === 'Focused' ? 82 : mood === 'Frustrated' ? 72 : 68
  const prepBonus = Math.min(8, Math.floor(plan.trim().length / 30))
  const reviewBonus = Math.min(10, Math.floor(debrief.trim().length / 25))
  return Math.max(45, Math.min(99, base + prepBonus + reviewBonus))
}

export default function SessionsPage() {
  const { addSession, state } = useAppState()
  const [flowId, setFlowId] = useState(sessionFlows[0].id)
  const flow = useMemo(() => sessionFlows.find((f) => f.id === flowId) ?? sessionFlows[0], [flowId])
  const [stepIndex, setStepIndex] = useState(0)
  const step = flow.steps[stepIndex]
  const [elapsed, setElapsed] = useState(0)

  const [premarketPlan, setPremarketPlan] = useState('')
  const [checkinMood, setMood] = useState<Mood>('Focused')
  const [debrief, setDebrief] = useState('')
  const [gateBypassed, setGateBypassed] = useState(false)

  useEffect(() => {
    setElapsed(0)
    setGateBypassed(false)
  }, [flowId, stepIndex])

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed((v) => v + 1), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const canAdvance = elapsed >= step.minSeconds
  const inMaxWindow = !step.maxSeconds || elapsed <= step.maxSeconds
  const onFinalStep = stepIndex === flow.steps.length - 1
  const flowComplete = onFinalStep && (canAdvance || gateBypassed)
  const canSave = flowComplete && premarketPlan.trim().length >= 20 && debrief.trim().length >= 20

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Guided Execution"
        title="Run your pre-trade process"
        subtitle="Use time-gated steps to slow impulsive decisions and lock in process quality before execution."
      />

      <SectionCard title="Choose Your Flow" subtitle="Pick the coaching rhythm that matches your current market context.">
        <div className="flex gap-2 flex-wrap">
          {sessionFlows.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setFlowId(f.id)
                setStepIndex(0)
              }}
              aria-pressed={flowId === f.id}
              className={`app-button ${flowId === f.id ? 'app-button-primary' : 'app-button-muted'}`}
            >
              {f.name}
            </button>
          ))}
        </div>
        <p className="text-sm text-slate-300 mt-3">{flow.description}</p>
      </SectionCard>

      <SectionCard title={`Step ${stepIndex + 1} / ${flow.steps.length}: ${step.title}`}>
        <p className="text-slate-200">{step.prompt}</p>
        <BreathingCircle phase={canAdvance || gateBypassed ? 'Ready' : 'Stay'} seconds={elapsed} variant="calm" />
        <p className="text-sm text-slate-400">
          Minimum: {step.minSeconds}s{step.maxSeconds ? ` • Preferred max: ${step.maxSeconds}s` : ''}
        </p>
        {!inMaxWindow && <p className="text-amber-300 text-sm mt-1">You&apos;re past the ideal pacing window—advance and maintain momentum.</p>}

        <div className="mt-3 flex gap-2 flex-wrap">
          <button
            className="app-button app-button-primary disabled:opacity-50"
            disabled={(!canAdvance && !gateBypassed) || onFinalStep}
            onClick={() => setStepIndex((v) => Math.min(flow.steps.length - 1, v + 1))}
          >
            Next step
          </button>
          <button
            className="app-button app-button-muted"
            onClick={() => {
              setGateBypassed(true)
              setStepIndex((v) => Math.min(flow.steps.length - 1, v + 1))
            }}
          >
            {step.overrideLabel ?? 'Override timer gate'}
          </button>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="1) Premarket Plan" subtitle="Define setup, invalidation, and max risk.">
          <label className="sr-only" htmlFor="premarket-plan">Premarket plan</label>
          <textarea
            id="premarket-plan"
            value={premarketPlan}
            onChange={(e) => setPremarketPlan(e.target.value)}
            className="app-input min-h-28"
            placeholder="A+ setup, invalidation, max risk..."
          />
        </SectionCard>

        <SectionCard title="2) Check-in Mood" subtitle="Name your internal state before the next decision.">
          <label className="sr-only" htmlFor="checkin-mood">Check-in mood</label>
          <select id="checkin-mood" value={checkinMood} onChange={(e) => setMood(e.target.value as Mood)} className="app-input">
            {moods.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <p className="text-sm text-slate-400 mt-2">Coach cue: no new order until your process checklist is clear.</p>
        </SectionCard>

        <SectionCard title="3) Debrief" subtitle="Capture triggers, wins, and corrections.">
          <label className="sr-only" htmlFor="session-debrief">Session debrief</label>
          <textarea
            id="session-debrief"
            value={debrief}
            onChange={(e) => setDebrief(e.target.value)}
            className="app-input min-h-28"
            placeholder="What happened, what you learned, and what to repeat..."
          />
        </SectionCard>
      </div>

      <button
        className="app-button app-button-primary disabled:opacity-50"
        disabled={!canSave}
        onClick={() => {
          const disciplineScore = estimateDisciplineScore(premarketPlan, debrief, checkinMood)
          addSession({
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            flowId,
            premarketPlan,
            checkinMood,
            debrief,
            pnl: Math.round(Math.random() * 350 - 140),
            disciplineScore,
            mistakes: ['Late entry'],
            wins: ['Respected max daily loss'],
          })
          setPremarketPlan('')
          setDebrief('')
          setStepIndex(0)
        }}
      >
        Save session log
      </button>
      {!canSave && (
        <p className="text-xs text-slate-400">Finish the full flow and add at least 20 characters for plan and debrief to unlock save.</p>
      )}

      <SectionCard title="Recent Logs">
        {state.sessions.length === 0 ? (
          <EmptyState title="No recent logs" description="Your saved sessions will appear here for fast review and pattern tracking." />
        ) : (
          <ul className="space-y-2">
            {state.sessions.slice(0, 5).map((s) => (
              <li key={s.id} className="text-sm rounded-lg border border-slate-700/40 px-3 py-2">
                {new Date(s.date).toLocaleDateString()}: {s.checkinMood} — {s.disciplineScore}/100
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  )
}
