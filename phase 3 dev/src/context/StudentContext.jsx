
import { createContext, useContext, useEffect, useState } from 'react'
import { sampleStudent } from '../data/sampleData'

const StudentContext = createContext(null)

const STORAGE_KEY = 'skillbridge-student'
const TOKEN_KEY = 'skillbridge-token'

export function StudentProvider({ children }) {
  const [student, setStudent] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...sampleStudent, ...JSON.parse(saved) } : sampleStudent
    } catch {
      return sampleStudent
    }
  })

  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_KEY)
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(student))
  }, [student])

  function register(details) {
    setStudent({
      ...sampleStudent,
      ...details,
      avatar: details.name
        .split(' ')
        .map(part => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      readiness: 0,
      skillsAssessed: 0,
      skillsToBuild: 0,
      learningStreak: 0,
    })
  }

  function setAuthenticatedUser(profile, accessToken, extraDetails = {}) {
    localStorage.setItem(TOKEN_KEY, accessToken)
    setToken(accessToken)

    setStudent(prev => ({
      ...sampleStudent,
      ...prev,
      ...profile,
      ...extraDetails,
      avatar: (profile.name || prev.name || 'Student')
        .split(' ')
        .map(part => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    }))
  }

  function saveAssessment(data) {
    setStudent(prev => ({
      ...prev,
      ...data,
      assessmentResults: data.assessmentResults,
    }))
  }

  function saveRoadmap(data) {
    setStudent(prev => ({
      ...prev,
      roadmap: data,
    }))
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(STORAGE_KEY)
    setToken(null)
    setStudent(sampleStudent)
  }

  return (
    <StudentContext.Provider
      value={{
        student,
        setStudent,
        register,
        setAuthenticatedUser,
        saveAssessment,
        saveRoadmap,
        logout,
        isAuthenticated: Boolean(token),
        token,
      }}
    >
      {children}
    </StudentContext.Provider>
  )
}

export function useStudent() {
  const value = useContext(StudentContext)

  if (!value) {
    throw new Error('useStudent must be used inside StudentProvider')
  }

  return value
}
