import { useEffect, useMemo, useState } from 'react'
import BreathingCircle from '../components/BreathingCircle'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import SectionCard from '../components/SectionCard'
import { haptic } from '../lib/haptics'
import { sessionFlows } from '../lib/sampleData'
import { useAppState } from '../lib/state'
import type { Mood, SessionLog } from '../lib/types'

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
  const [tagsRaw, setTagsRaw] = useState('process, patience')
  const [topTrigger, setTopTrigger] = useState(state.profile.topTrigger)
  const [bestDecision, setBestDecision] = useState('')
  const [historyFilter, setHistoryFilter] = useState('')

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

  const filteredHistory = state.sessions.filter((s) => {
    if (!historyFilter.trim()) return true
    const key = historyFilter.toLowerCase()
    return s.tags.join(' ').toLowerCase().includes(key) || s.debrief.toLowerCase().includes(key)
  })

  const highlightReel: SessionLog[] = [...state.sessions]
    .filter((s) => s.bestDecision.trim().length > 0)
    .sort((a, b) => b.disciplineScore - a.disciplineScore)
    .slice(0, 3)

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
        <p className="text-slate-100">{step.prompt}</p>
        <BreathingCircle phase={canAdvance || gateBypassed ? 'Ready' : 'Stay'} seconds={elapsed} variant="calm" />
        <p className="text-sm text-slate-300">
          Minimum: {step.minSeconds}s{step.maxSeconds ? ` • Preferred max: ${step.maxSeconds}s` : ''}
        </p>
        {!inMaxWindow && <p className="text-amber-200 text-sm mt-1">You&apos;re past the ideal pacing window—advance and maintain momentum.</p>}

        <div className="mt-3 flex gap-2 flex-wrap">
          <button
            className="app-button app-button-primary"
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
          <textarea value={premarketPlan} onChange={(e) => setPremarketPlan(e.target.value)} className="app-input min-h-28" placeholder="A+ setup, invalidation, max risk..." />
          <input value={tagsRaw} onChange={(e) => setTagsRaw(e.target.value)} className="app-input mt-2" placeholder="Tags: process, fomo, discipline" />
        </SectionCard>

        <SectionCard title="2) Check-in Mood" subtitle="Name your internal state before the next decision.">
          <select value={checkinMood} onChange={(e) => setMood(e.target.value as Mood)} className="app-input">
            {moods.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <input className="app-input mt-2" value={topTrigger} onChange={(e) => setTopTrigger(e.target.value)} placeholder="Top trigger today" />
        </SectionCard>

        <SectionCard title="3) Debrief" subtitle="Capture triggers, wins, and corrections.">
          <textarea value={debrief} onChange={(e) => setDebrief(e.target.value)} className="app-input min-h-28" placeholder="What happened, what you learned, and what to repeat..." />
          <input className="app-input mt-2" value={bestDecision} onChange={(e) => setBestDecision(e.target.value)} placeholder="Best decision highlight" />
        </SectionCard>
      </div>

      <button
        className="app-button app-button-primary"
        disabled={!canSave}
        onClick={() => {
          const disciplineScore = estimateDisciplineScore(premarketPlan, debrief, checkinMood)
          haptic('success')
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
            tags: tagsRaw.split(',').map((tag) => tag.trim()).filter(Boolean),
            topTrigger,
            bestDecision,
            sessionWindow: state.profile.preferredSession,
          })
          setPremarketPlan('')
          setDebrief('')
          setBestDecision('')
          setStepIndex(0)
        }}
      >
        Save session log
      </button>

      <SectionCard title="Journal Search + Filter">
        <input className="app-input" value={historyFilter} onChange={(e) => setHistoryFilter(e.target.value)} placeholder="Search by tag or notes" />
      </SectionCard>

      <SectionCard title="Best-decision highlight reel">
        {highlightReel.length === 0 ? <EmptyState title="No highlights yet" description="Log your best decisions to build a confidence reel." /> : (
          <ul className="space-y-2">
            {highlightReel.map((s) => <li key={s.id} className="list-item text-sm">{s.bestDecision} • score {s.disciplineScore}</li>)}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="Recent Logs">
        {filteredHistory.length === 0 ? (
          <EmptyState title="No matching logs" description="Try another query or create your first session." />
        ) : (
          <ul className="space-y-2">
            {filteredHistory.slice(0, 7).map((s) => (
              <li key={s.id} className="list-item text-sm">
                {new Date(s.date).toLocaleDateString()}: {s.checkinMood} — {s.disciplineScore}/100 • {s.tags.join(', ')}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  )
}
