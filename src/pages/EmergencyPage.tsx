import { useEffect, useMemo, useState } from 'react'
import BreathingCircle from '../components/BreathingCircle'
import PageHeader from '../components/PageHeader'
import SectionCard from '../components/SectionCard'
import { haptic } from '../lib/haptics'
import { getEscalationRecommendation } from '../lib/intelligence'
import { emergencyTools } from '../lib/sampleData'
import { useAppState } from '../lib/state'

export default function EmergencyPage() {
  const { logEmergencyUse, state, setPanicMode } = useAppState()
  const [activeToolId, setActiveToolId] = useState(emergencyTools[0].id)
  const [stepIndex, setStepIndex] = useState(0)
  const [started, setStarted] = useState(false)
  const [voiceGuided, setVoiceGuided] = useState(false)
  const tool = useMemo(() => emergencyTools.find((t) => t.id === activeToolId) ?? emergencyTools[0], [activeToolId])
  const step = tool.steps[stepIndex]
  const [remaining, setRemaining] = useState(step.durationSeconds)
  const escalation = getEscalationRecommendation(state)

  useEffect(() => {
    setStepIndex(0)
    setRemaining(tool.steps[0].durationSeconds)
    setStarted(false)
  }, [tool.id, tool.steps])

  useEffect(() => {
    setRemaining(step.durationSeconds)
    if (voiceGuided && 'speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(step.script)
      utter.rate = 0.95
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utter)
    }
  }, [step, voiceGuided])

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!started) return
      setRemaining((r) => Math.max(0, r - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [started])

  const canNext = remaining === 0

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Rapid Stabilization"
        title="Emergency regulation tools"
        subtitle="When intensity spikes, follow the protocol exactly. Reset physiology first, then decide."
      />

      <SectionCard title="Global panic mode">
        <p className="text-sm text-slate-300">One-tap lock to force a cooling-off window across the app.</p>
        <button className="app-button app-button-danger mt-2" onClick={() => { haptic('warning'); setPanicMode(20) }}>Activate 20-min panic lock</button>
      </SectionCard>

      <div className="flex flex-wrap gap-2">
        {emergencyTools.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveToolId(t.id)}
            aria-pressed={t.id === activeToolId}
            className={`app-button ${t.id === activeToolId ? 'app-button-danger' : 'app-button-muted'}`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <SectionCard title={tool.name} subtitle={`Trigger: ${tool.trigger}`}>
        <div className="mb-3">
          <label className="inline-flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={voiceGuided} onChange={(e) => setVoiceGuided(e.target.checked)} />
            Voice-guided protocol (speechSynthesis fallback)
          </label>
        </div>
        <p className="font-semibold mb-2">Step {stepIndex + 1} / {tool.steps.length}: {step.title}</p>
        <p className="text-slate-200">{step.script}</p>
        <BreathingCircle phase={canNext ? 'Complete' : 'Stay'} seconds={remaining} variant="emergency" />

        {!started ? (
          <button
            className="app-button app-button-danger"
            onClick={() => {
              setStarted(true)
              haptic('warning')
              logEmergencyUse(tool.id)
            }}
          >
            Start protocol
          </button>
        ) : (
          <div className="flex gap-2 flex-wrap">
            <button
              className="app-button app-button-danger disabled:opacity-50"
              disabled={!canNext || stepIndex === tool.steps.length - 1}
              onClick={() => setStepIndex((v) => Math.min(tool.steps.length - 1, v + 1))}
            >
              Next (timer gated)
            </button>
            <button className="app-button app-button-muted" onClick={() => setStepIndex((v) => Math.max(0, v - 1))} disabled={stepIndex === 0}>Back</button>
            <button className="app-button app-button-muted" onClick={() => setStepIndex((v) => Math.min(tool.steps.length - 1, v + 1))}>Override now</button>
          </div>
        )}
      </SectionCard>

      {escalation && <SectionCard title="Escalation recommendation"><p className="text-amber-200 text-sm">{escalation}</p></SectionCard>}
    </div>
  )
}
