import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './layout/AppShell'
import HomePage from './pages/HomePage'
import SessionsPage from './pages/SessionsPage'
import EmergencyPage from './pages/EmergencyPage'
import ProgramsPage from './pages/ProgramsPage'
import LibraryPage from './pages/LibraryPage'
import InsightsPage from './pages/InsightsPage'
import SettingsPage from './pages/SettingsPage'
import { StateProvider } from './lib/state'

export default function App() {
  return (
    <StateProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </StateProvider>
  )
}
