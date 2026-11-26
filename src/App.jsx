
import { Routes, Route, Navigate } from 'react-router-dom'
import { StudentProvider, useStudent } from './context/StudentContext'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

import DashboardPage from './pages/DashboardPage'
import AssessmentPage from './pages/AssessmentPage'
import SkillGapsPage from './pages/SkillGapsPage'
import CareersPage from './pages/CareersPage'
import RoadmapPage from './pages/RoadmapPage'
import ComparePage from './pages/ComparePage'
import PassportPage from './pages/PassportPage'
import ProjectsPage from './pages/ProjectsPage'
import ProgressPage from './pages/ProgressPage'
import SettingsPage from './pages/SettingsPage'

import AppLayout from './components/AppLayout'

function ProtectedRoute({ children }) {
  const { student, loading } = useStudent()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading your account...
      </div>
    )
  }

  if (!student) {
    return <Navigate to="/login" replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected pages */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/skill-gaps" element={<SkillGapsPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/passport" element={<PassportPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <StudentProvider>
      <AppRoutes />
    </StudentProvider>
  )
}

export default App
