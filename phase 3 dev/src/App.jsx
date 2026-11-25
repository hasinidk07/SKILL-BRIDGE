
import { Routes, Route, Navigate } from 'react-router-dom'
import { StudentProvider, useStudent } from './context/StudentContext'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import AssessmentPage from './pages/AssessmentPage'
import SkillGapsPage from './pages/SkillGapsPage'

import AppLayout from './components/AppLayout'
import PlaceholderPage from './pages/PlaceholderPage'

function ProtectedLayout() {
  const { isAuthenticated } = useStudent()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <AppLayout />
}

function GuestOnly({ children }) {
  const { isAuthenticated } = useStudent()

  return isAuthenticated
    ? <Navigate to="/dashboard" replace />
    : children
}

function App() {
  return (
    <StudentProvider>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/login"
          element={
            <GuestOnly>
              <LoginPage />
            </GuestOnly>
          }
        />

        <Route
          path="/register"
          element={
            <GuestOnly>
              <RegisterPage />
            </GuestOnly>
          }
        />

        {/* Protected application pages */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/skill-gaps" element={<SkillGapsPage />} />

          {[
            'careers',
            'roadmap',
            'passport',
            'compare',
            'projects',
            'progress',
            'settings',
          ].map(path => (
            <Route
              key={path}
              path={`/${path}`}
              element={<PlaceholderPage />}
            />
          ))}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </StudentProvider>
  )
}

export default App
