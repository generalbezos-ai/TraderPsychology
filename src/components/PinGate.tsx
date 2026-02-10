import { useState } from 'react'
import { verifyPin } from '../lib/security'
import { useAppState } from '../lib/state'

export default function PinGate({ children, target }: { children: React.ReactNode; target: 'journal' | 'insights' }) {
  const { state } = useAppState()
  const [unlocked, setUnlocked] = useState(false)
  const [pin, setPin] = useState('')

  const locked = state.privacy.pinEnabled && ((target === 'journal' && state.privacy.lockJournal) || (target === 'insights' && state.privacy.lockInsights))

  if (!locked || unlocked) return <>{children}</>

  return (
    <div className="card p-6 max-w-md">
      <p className="text-sm text-slate-300">Protected section. Enter PIN to continue.</p>
      <input className="app-input mt-2" type="password" inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value)} />
      <button className="app-button app-button-primary mt-3" onClick={() => setUnlocked(verifyPin(pin, state.privacy.pinHash))}>Unlock</button>
    </div>
  )
}
