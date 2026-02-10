import clsx from 'clsx'
import { NavLink, Outlet } from 'react-router-dom'
import { AlertTriangle, BookOpen, Brain, Gauge, Home, Settings, Timer } from 'lucide-react'
import SOSButton from '../components/SOSButton'

const links = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/sessions', icon: Timer, label: 'Sessions' },
  { to: '/emergency', icon: AlertTriangle, label: 'Emergency' },
  { to: '/programs', icon: Brain, label: 'Programs' },
  { to: '/library', icon: BookOpen, label: 'Library' },
  { to: '/insights', icon: Gauge, label: 'Insights' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function AppShell() {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[262px_1fr]">
      <aside className="hidden md:flex flex-col border-r border-slate-700/30 p-4 gap-2 sticky top-0 h-screen bg-slate-950/70 backdrop-blur-xl">
        <div className="mb-5 rounded-xl border border-slate-700/60 bg-slate-900/50 p-3">
          <p className="text-xs uppercase tracking-[0.22em] text-violet-300">Trader Psychology</p>
          <h1 className="mt-1 text-2xl font-bold">Trader&apos;s Mind</h1>
          <p className="mt-1 text-xs text-slate-400">Train composure. Execute with precision.</p>
        </div>
        <nav aria-label="Primary navigation" className="space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  'px-3 py-2.5 rounded-lg flex items-center gap-2 text-sm transition-colors',
                  isActive ? 'bg-violet-600/25 text-violet-100 border border-violet-300/30' : 'text-slate-300 hover:bg-slate-800/80',
                )
              }
            >
              <Icon size={16} aria-hidden="true" /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="fade-in mx-auto w-full max-w-7xl p-4 pb-28 md:p-8">
        <Outlet />
      </main>
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 inset-x-0 bg-slate-950/95 border-t border-slate-700/40 grid grid-cols-7 p-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] backdrop-blur"
      >
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
            className={({ isActive }) =>
              clsx('text-[11px] flex flex-col items-center rounded-md px-1 py-1.5 transition-colors', isActive ? 'text-violet-300 bg-violet-900/30' : 'text-slate-400')
            }
          >
            <Icon size={16} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <SOSButton />
    </div>
  )
}
