import { createContext, useContext, useEffect, useState } from 'react'
import { sampleStudent } from '../data/sampleData'

const StudentContext = createContext(null)
const STORAGE_KEY = 'skillbridge-student'

export function StudentProvider({ children }) {
  const [student, setStudent] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : sampleStudent
    } catch { return sampleStudent }
  })

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(student)) }, [student])

  function register(details) {
    setStudent({
      ...sampleStudent, ...details,
      avatar: details.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase(),
      readiness: 0, skillsAssessed: 0, skillsToBuild: 0, learningStreak: 0,
    })
  }

  return <StudentContext.Provider value={{ student, setStudent, register }}>{children}</StudentContext.Provider>
}

export function useStudent() {
  const value = useContext(StudentContext)
  if (!value) throw new Error('useStudent must be used inside StudentProvider')
  return value
}