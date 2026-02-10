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
    <div className="min-h-screen md:grid md:grid-cols-[250px_1fr]">
      <aside className="hidden md:flex flex-col border-r border-slate-700/40 p-4 gap-2 sticky top-0 h-screen bg-slate-950/70 backdrop-blur">
        <h1 className="text-xl font-bold mb-4">Trader's Mind</h1>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `px-3 py-2 rounded-lg flex items-center gap-2 ${isActive ? 'bg-violet-600/30 text-violet-200' : 'text-slate-300 hover:bg-slate-800'}`}>
            <Icon size={16} /> {label}
          </NavLink>
        ))}
      </aside>
      <main className="p-4 pb-24 md:p-8"><Outlet /></main>
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-slate-950/95 border-t border-slate-700/40 grid grid-cols-7 p-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `text-[11px] flex flex-col items-center p-1 ${isActive ? 'text-violet-300' : 'text-slate-400'}`}>
            <Icon size={16} /><span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <SOSButton />
    </div>
  )
}
