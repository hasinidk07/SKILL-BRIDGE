
import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

const StudentContext = createContext(null)

const STORAGE_KEY = 'skillbridge-student'
const TOKEN_KEY = 'skillbridge-token'
const API_URL = 'http://127.0.0.1:8000'

function createAvatar(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function StudentProvider({ children }) {
  const [student, setStudent] = useState(null)

  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY)
  )

  const [loading, setLoading] = useState(true)

  // Restore the authenticated student when the app loads.
  useEffect(() => {
    let active = true

    async function restoreSession() {
      const savedToken = localStorage.getItem(TOKEN_KEY)

      if (!savedToken) {
        if (active) {
          setStudent(null)
          setToken(null)
          setLoading(false)
        }
        return
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${savedToken}`
          }
        })

        if (response.status === 401) {
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(STORAGE_KEY)

          if (active) {
            setStudent(null)
            setToken(null)
          }

          return
        }

        if (!response.ok) {
          throw new Error('Unable to restore student session')
        }

        const data = await response.json()

        const savedProfile = JSON.parse(
          localStorage.getItem(STORAGE_KEY) || '{}'
        )

        const name = data.student.name

        const restoredStudent = {
          ...savedProfile,
          ...data.student,
          targetCareer:
            savedProfile.targetCareer ||
            data.student.career ||
            'Software Developer',
          avatar: createAvatar(name)
        }

        if (active) {
          setStudent(restoredStudent)
          setToken(savedToken)
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(restoredStudent)
          )
        }
      } catch (error) {
        console.error('Session restoration error:', error)

        // Keep the saved session if the backend is temporarily unavailable.
        const savedProfile = JSON.parse(
          localStorage.getItem(STORAGE_KEY) || 'null'
        )

        if (active && savedProfile) {
          setStudent(savedProfile)
          setToken(savedToken)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      active = false
    }
  }, [])

  // Save the authenticated student after login or registration.
  function setAuthenticatedUser(
    studentData,
    accessToken,
    profileDetails = {}
  ) {
    if (!accessToken) {
      throw new Error('Authentication token is missing')
    }

    const name = profileDetails.name || studentData.name

    const updatedStudent = {
      ...studentData,
      ...profileDetails,
      name,
      targetCareer:
        profileDetails.targetCareer ||
        studentData.career ||
        'Software Developer',
      avatar: createAvatar(name)
    }

    localStorage.setItem(TOKEN_KEY, accessToken)
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedStudent)
    )

    setToken(accessToken)
    setStudent(updatedStudent)
    setLoading(false)
  }

  // Retain compatibility with existing registration code.
  function register(details) {
    const name = details.name || 'Student'

    setStudent({
      ...details,
      name,
      avatar: createAvatar(name),
      readiness: 0,
      skillsAssessed: 0,
      skillsToBuild: 0,
      learningStreak: 0
    })
  }

  // Update assessment information.
  function saveAssessment(results) {
    setStudent((currentStudent) => {
      if (!currentStudent) return currentStudent

      const updatedStudent = {
        ...currentStudent,
        ...results
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedStudent)
      )

      return updatedStudent
    })
  }
  // Save roadmap tasks and preserve them in local storage.
function saveRoadmap(tasks) {
  setStudent((currentStudent) => {
    if (!currentStudent) return currentStudent

    const updatedStudent = {
      ...currentStudent,
      roadmap: tasks
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedStudent)
    )

    return updatedStudent
  })
}

  // Clear the session during logout.
  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(STORAGE_KEY)

    setStudent(null)
    setToken(null)
  }

  return (
    <StudentContext.Provider
      value={{
        student,
        setStudent,
        token,
        loading,
        isAuthenticated: Boolean(token && student),
        register,
        setAuthenticatedUser,
        saveAssessment,
        saveRoadmap,
        logout
      }}
    >
      {children}
    </StudentContext.Provider>
  )
}

export function useStudent() {
  const value = useContext(StudentContext)

  if (!value) {
    throw new Error(
      'useStudent must be used inside StudentProvider'
    )
  }

  return value
}
