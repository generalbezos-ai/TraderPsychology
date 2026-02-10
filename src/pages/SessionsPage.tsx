import { useEffect, useMemo, useState } from 'react'
import SectionCard from '../components/SectionCard'
import BreathingCircle from '../components/BreathingCircle'
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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Guided Session Flow</h1>
      <SectionCard title="Flow Selection">
        <div className="flex gap-2 flex-wrap">
          {sessionFlows.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setFlowId(f.id)
                setStepIndex(0)
              }}
              className={`px-3 py-2 rounded ${flowId === f.id ? 'bg-violet-600' : 'bg-slate-800'}`}
            >
              {f.name}
            </button>
          ))}
        </div>
        <p className="text-sm text-slate-300 mt-2">{flow.description}</p>
      </SectionCard>

      <SectionCard title={`Step ${stepIndex + 1} / ${flow.steps.length}: ${step.title}`}>
        <p className="text-slate-200">{step.prompt}</p>
        <BreathingCircle phase={canAdvance || gateBypassed ? 'Ready' : 'Stay'} seconds={elapsed} variant="calm" />
        <p className="text-sm text-slate-400">
          Minimum: {step.minSeconds}s{step.maxSeconds ? ` • Preferred max: ${step.maxSeconds}s` : ''}
        </p>
        {!inMaxWindow && <p className="text-amber-300 text-sm mt-1">You are beyond the preferred time window. Move to next step.</p>}

        <div className="mt-3 flex gap-2 flex-wrap">
          <button
            className="bg-violet-600 px-4 py-2 rounded disabled:opacity-50"
            disabled={(!canAdvance && !gateBypassed) || onFinalStep}
            onClick={() => setStepIndex((v) => Math.min(flow.steps.length - 1, v + 1))}
          >
            Next step
          </button>
          <button
            className="bg-slate-700 px-4 py-2 rounded"
            onClick={() => {
              setGateBypassed(true)
              setStepIndex((v) => Math.min(flow.steps.length - 1, v + 1))
            }}
          >
            {step.overrideLabel ?? 'Override time gate'}
          </button>
        </div>
      </SectionCard>

      <div className="grid md:grid-cols-3 gap-4">
        <SectionCard title="1) Premarket Plan">
          <textarea
            value={premarketPlan}
            onChange={(e) => setPremarketPlan(e.target.value)}
            className="w-full bg-slate-900 rounded p-2 min-h-28"
            placeholder="A+ setup, invalidation, max risk..."
          />
        </SectionCard>

        <SectionCard title="2) Check-in Mood">
          <select value={checkinMood} onChange={(e) => setMood(e.target.value as Mood)} className="w-full bg-slate-900 rounded p-2">
            {moods.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <p className="text-sm text-slate-400 mt-2">Pause and verify process before any new order.</p>
        </SectionCard>

        <SectionCard title="3) Debrief">
          <textarea
            value={debrief}
            onChange={(e) => setDebrief(e.target.value)}
            className="w-full bg-slate-900 rounded p-2 min-h-28"
            placeholder="Triggers, wins, corrections..."
          />
        </SectionCard>
      </div>

      <button
        className="bg-violet-600 px-4 py-2 rounded font-semibold disabled:opacity-50"
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
        Save Session
      </button>
      {!canSave && (
        <p className="text-xs text-slate-400">
          Complete the flow and add at least 20 characters each for Premarket Plan and Debrief before saving.
        </p>
      )}

      <SectionCard title="Recent Logs">
        <ul className="space-y-2">
          {state.sessions.slice(0, 5).map((s) => (
            <li key={s.id} className="text-sm">
              {new Date(s.date).toLocaleDateString()}: {s.checkinMood} — {s.disciplineScore}/100
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  )
}
