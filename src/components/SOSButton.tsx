import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SOSButton() {
  const [open, setOpen] = useState(false)
  return (
    <div className="fixed right-4 bottom-20 md:bottom-6 z-50">
      {open && (
        <div id="emergency-quick-actions" className="card p-3 mb-2 w-60 text-sm fade-in" role="dialog" aria-label="Emergency quick actions">
          <p className="font-semibold text-red-200">Need immediate reset?</p>
          <p className="text-slate-400 mt-1">Launch your protocol in under 10 seconds.</p>
          <Link to="/emergency" className="mt-2 inline-block text-cyan-300 hover:text-cyan-200" onClick={() => setOpen(false)}>
            Open emergency tools
          </Link>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="app-button rounded-full bg-red-500 hover:bg-red-400 px-4 py-3 font-bold shadow-lg"
        aria-expanded={open}
        aria-controls="emergency-quick-actions"
        aria-label="Toggle emergency quick actions"
      >
        SOS
      </button>
    </div>
  )
}
