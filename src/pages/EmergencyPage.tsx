import { useEffect, useMemo, useState } from 'react'
import BreathingCircle from '../components/BreathingCircle'
import SectionCard from '../components/SectionCard'
import { emergencyTools } from '../lib/sampleData'
import { useAppState } from '../lib/state'

export default function EmergencyPage() {
  const { logEmergencyUse } = useAppState()
  const [activeToolId, setActiveToolId] = useState(emergencyTools[0].id)
  const [stepIndex, setStepIndex] = useState(0)
  const [started, setStarted] = useState(false)
  const tool = useMemo(() => emergencyTools.find((t) => t.id === activeToolId) ?? emergencyTools[0], [activeToolId])
  const step = tool.steps[stepIndex]
  const [remaining, setRemaining] = useState(step.durationSeconds)

  useEffect(() => {
    setStepIndex(0)
    setRemaining(tool.steps[0].durationSeconds)
    setStarted(false)
  }, [tool.id, tool.steps])

  useEffect(() => {
    setRemaining(step.durationSeconds)
  }, [step.durationSeconds])

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!started) return
      setRemaining((r) => Math.max(0, r - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [started])

  const canNext = remaining === 0

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-red-200">Emergency Regulation Tools</h1>
      <div className="flex flex-wrap gap-2">
        {emergencyTools.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveToolId(t.id)}
            className={`px-3 py-2 rounded ${t.id === activeToolId ? 'bg-red-600' : 'bg-slate-800'}`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <SectionCard title={tool.name}>
        <p className="text-sm text-red-200/90 mb-3">Trigger: {tool.trigger}</p>
        <p className="font-semibold mb-2">Step {stepIndex + 1} / {tool.steps.length}: {step.title}</p>
        <p className="text-slate-200">{step.script}</p>
        <BreathingCircle phase={canNext ? 'Complete' : 'Stay'} seconds={remaining} variant="emergency" />

        {!started ? (
          <button
            className="bg-red-600 px-4 py-2 rounded"
            onClick={() => {
              setStarted(true)
              logEmergencyUse(tool.id)
            }}
          >
            Start protocol
          </button>
        ) : (
          <div className="flex gap-2 flex-wrap">
            <button
              className="bg-red-600 px-4 py-2 rounded disabled:opacity-50"
              disabled={!canNext || stepIndex === tool.steps.length - 1}
              onClick={() => setStepIndex((v) => Math.min(tool.steps.length - 1, v + 1))}
            >
              Next (gated)
            </button>
            <button
              className="bg-slate-700 px-4 py-2 rounded"
              onClick={() => setStepIndex((v) => Math.max(0, v - 1))}
              disabled={stepIndex === 0}
            >
              Back
            </button>
            <button
              className="bg-slate-700 px-4 py-2 rounded"
              onClick={() => setStepIndex((v) => Math.min(tool.steps.length - 1, v + 1))}
            >
              Override now
            </button>
          </div>
        )}
      </SectionCard>
    </div>
  )
}
