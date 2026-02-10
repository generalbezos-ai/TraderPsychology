import clsx from 'clsx'
import { NavLink, Outlet } from 'react-router-dom'
import { AlertTriangle, BookOpen, Brain, Gauge, Home, Settings, Timer } from 'lucide-react'
import SOSButton from '../components/SOSButton'
import { useAppState } from '../lib/state'

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
  const { state } = useAppState()
  const panic = state.panicModeUntil && new Date(state.panicModeUntil).getTime() > Date.now()

  return (
    <div className="min-h-screen md:grid md:grid-cols-[278px_1fr]">
      <aside className="hidden md:flex flex-col border-r border-slate-700/30 p-4 gap-2 sticky top-0 h-screen bg-slate-950/70 backdrop-blur-xl">
        <div className="mb-5 rounded-2xl border border-slate-700/60 bg-slate-900/50 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-violet-300">Trader Psychology</p>
          <h1 className="mt-2 text-2xl font-bold">Trader&apos;s Mind</h1>
          <p className="mt-1 text-xs text-slate-300">Train composure. Execute with precision.</p>
        </div>
        <nav aria-label="Primary navigation" className="space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  'tap-target px-3 py-2.5 rounded-xl flex items-center gap-2 text-sm transition-all',
                  isActive
                    ? 'bg-violet-600/25 text-violet-50 border border-violet-300/40 shadow-[0_8px_24px_rgba(139,123,255,0.16)]'
                    : 'text-slate-200 hover:bg-slate-800/80 border border-transparent',
                )
              }
            >
              <Icon size={16} aria-hidden="true" /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="fade-in mx-auto w-full max-w-7xl p-4 pb-28 md:p-8 md:pb-10 space-y-4">
        {panic && <div className="surface-subtle rounded-xl border-red-400/45 bg-red-950/45 px-4 py-2 text-xs text-red-100">Panic mode is active. Focus on recovery protocols.</div>}
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
              clsx(
                'tap-target text-[11px] flex flex-col items-center rounded-lg px-1 py-1.5 transition-all',
                isActive ? 'text-violet-200 bg-violet-900/35' : 'text-slate-300',
              )
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
