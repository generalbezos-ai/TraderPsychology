import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SOSButton() {
  const [open, setOpen] = useState(false)
  return (
    <div className="fixed right-4 bottom-20 md:bottom-6 z-50">
      {open && (
        <div className="card p-3 mb-2 w-56 text-sm">
          <p className="font-semibold text-red-300">Emergency access</p>
          <Link to="/emergency" className="block mt-2 text-cyan-300" onClick={() => setOpen(false)}>Open tools now</Link>
          <p className="text-slate-400 mt-1">2 taps max to intervention.</p>
        </div>
      )}
      <button onClick={() => setOpen(v => !v)} className="rounded-full bg-red-500 hover:bg-red-400 px-4 py-3 font-bold shadow-lg">SOS</button>
    </div>
  )
}
