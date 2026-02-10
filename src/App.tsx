import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import OnboardingWizard from './components/OnboardingWizard'
import PinGate from './components/PinGate'
import AppShell from './layout/AppShell'
import { StateProvider } from './lib/state'

const HomePage = lazy(() => import('./pages/HomePage'))
const SessionsPage = lazy(() => import('./pages/SessionsPage'))
const EmergencyPage = lazy(() => import('./pages/EmergencyPage'))
const ProgramsPage = lazy(() => import('./pages/ProgramsPage'))
const LibraryPage = lazy(() => import('./pages/LibraryPage'))
const InsightsPage = lazy(() => import('./pages/InsightsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

export default function App() {
  return (
    <StateProvider>
      <OnboardingWizard />
      <Suspense fallback={<div className="p-6 text-slate-300" role="status" aria-live="polite">Loading your coaching dashboard…</div>}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/sessions" element={<PinGate target="journal"><SessionsPage /></PinGate>} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/insights" element={<PinGate target="insights"><InsightsPage /></PinGate>} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </StateProvider>
  )
}
