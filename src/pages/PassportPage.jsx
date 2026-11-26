
import { useCallback, useEffect, useState } from 'react'
import {
  Award,
  BookOpen,
  Briefcase,
  ExternalLink,
  GraduationCap,
  LoaderCircle,
  RefreshCw,
  Trophy,
  CalendarDays,
  Target
} from 'lucide-react'
import { useStudent } from '../context/StudentContext'

const API_URL = 'http://127.0.0.1:8000'

function formatDate(value) {
  if (!value) return 'Date unavailable'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Date unavailable'

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function PassportPage() {
  const { student } = useStudent()

  const studentKey = (
    student?.email || student?.name || 'student'
  ).trim().toLowerCase()

  const [passport, setPassport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadPassport = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${API_URL}/api/passport/${encodeURIComponent(studentKey)}`
      )

      if (!response.ok) {
        const result = await response.json().catch(() => ({}))
        throw new Error(result.detail || 'Unable to load your Skill Passport.')
      }

      const data = await response.json()
      setPassport(data)
    } catch (err) {
      setError(err.message || 'Backend connection failed.')
    } finally {
      setLoading(false)
    }
  }, [studentKey])

  useEffect(() => {
    loadPassport()
  }, [loadPassport])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <LoaderCircle className="w-9 h-9 animate-spin text-indigo-600" />
        <p className="text-slate-500">Loading your Skill Passport...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-16 bg-white border border-slate-200 rounded-2xl p-8 text-center">
        <Award className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900">
          Passport unavailable
        </h2>
        <p className="text-slate-500 mt-2">{error}</p>
        <button
          onClick={loadPassport}
          className="mt-6 inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700"
        >
          <RefreshCw size={17} />
          Try again
        </button>
      </div>
    )
  }

  const profile = passport?.student || {}
  const quizzes = passport?.quiz_records || []
  const projects = passport?.projects || []
  const achievements = passport?.achievements || []

  const averageScore = quizzes.length
    ? Math.round(
        quizzes.reduce((sum, quiz) => sum + Number(quiz.score || 0), 0) /
        quizzes.length
      )
    : 0

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-indigo-600 mb-2">
            STUDENT PORTFOLIO
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            My Skill Passport
          </h1>
          <p className="text-slate-500 mt-2">
            Your learning journey, achievements and projects in one place.
          </p>
        </div>

        <button
          onClick={loadPassport}
          className="inline-flex items-center justify-center gap-2 border border-slate-200 bg-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Student Profile */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-7 sm:p-9 text-white shadow-lg">
        <div className="absolute -right-10 -top-16 w-64 h-64 rounded-full bg-white/10" />
        <div className="absolute right-28 -bottom-28 w-64 h-64 rounded-full bg-white/10" />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center">
            <GraduationCap size={42} />
          </div>

          <div className="flex-1">
            <p className="text-indigo-100 text-sm">SkillBridge Student</p>
            <h2 className="text-3xl font-bold mt-1">
              {profile.name || student?.name || 'Student'}
            </h2>
            <div className="flex items-center gap-2 mt-3 text-indigo-100">
              <Target size={17} />
              <span>{profile.career || student?.career || 'Career not selected'}</span>
            </div>
          </div>

          <div className="bg-white/15 border border-white/20 rounded-2xl p-4 min-w-36">
            <p className="text-sm text-indigo-100">Quizzes attempted</p>
            <p className="text-3xl font-bold mt-1">{quizzes.length}</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <BookOpen size={23} />
            </div>
            <span className="text-xs text-slate-400">LEARNING</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-5">
            {quizzes.length}
          </p>
          <p className="text-sm text-slate-500 mt-1">Quizzes completed</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-violet-50 rounded-xl text-violet-600">
              <Briefcase size={23} />
            </div>
            <span className="text-xs text-slate-400">EXPERIENCE</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-5">
            {projects.length}
          </p>
          <p className="text-sm text-slate-500 mt-1">Projects recorded</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <Trophy size={23} />
            </div>
            <span className="text-xs text-slate-400">ACHIEVEMENTS</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-5">
            {achievements.length}
          </p>
          <p className="text-sm text-slate-500 mt-1">Badges earned</p>
        </div>
      </div>

      {/* Quiz History */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <BookOpen size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Quiz History</h2>
            <p className="text-sm text-slate-500">
              Your recorded skill assessments
            </p>
          </div>
        </div>

        {quizzes.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <BookOpen size={35} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">No quiz records yet</p>
            <p className="text-sm mt-1">
              Your quiz results will appear here when recorded.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {quizzes.map((quiz, index) => (
              <div
                key={`${quiz.skill}-${index}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl"
              >
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {quiz.skill}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDate(quiz.attempted_at)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-500">
                    {quiz.correct_answers ?? 0}/{quiz.total_questions ?? 0} correct
                  </span>
                  <span className="font-bold text-indigo-600">
                    {quiz.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {quizzes.length > 0 && (
          <div className="mt-5 p-4 rounded-xl bg-indigo-50 flex justify-between items-center">
            <span className="text-sm font-medium text-indigo-900">
              Average quiz score
            </span>
            <span className="text-xl font-bold text-indigo-700">
              {averageScore}%
            </span>
          </div>
        )}
      </section>

      {/* Projects */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl">
            <Briefcase size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">My Projects</h2>
            <p className="text-sm text-slate-500">
              Practical work and experience
            </p>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <Briefcase size={35} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">No projects added yet</p>
            <p className="text-sm mt-1">
              Your projects will be displayed here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(project => (
              <div
                key={project.id}
                className="border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition"
              >
                <div className="flex justify-between items-start gap-3">
                  <h3 className="font-bold text-slate-900">
                    {project.title}
                  </h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
                    {project.status}
                  </span>
                </div>

                <p className="text-sm text-slate-500 mt-3">
                  {project.description || 'No description provided.'}
                </p>

                {project.skills_used && (
                  <div className="mt-4">
                    <p className="text-xs text-slate-400 mb-1">SKILLS USED</p>
                    <p className="text-sm text-indigo-600">
                      {project.skills_used}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-400">
                    {formatDate(project.created_at)}
                  </span>

                  {project.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-indigo-600 font-medium flex items-center gap-1"
                    >
                      View project <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Achievements */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Award size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Achievements</h2>
            <p className="text-sm text-slate-500">
              Milestones earned on your learning journey
            </p>
          </div>
        </div>

        {achievements.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <Trophy size={35} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">No badges earned yet</p>
            <p className="text-sm mt-1">
              Keep learning and completing tasks to earn achievements.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((badge, index) => (
              <div
                key={`${badge.title}-${index}`}
                className="rounded-xl border border-amber-100 bg-amber-50/60 p-5"
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Award size={26} />
                </div>
                <h3 className="font-bold text-slate-900 mt-4">
                  {badge.title}
                </h3>
                <p className="text-sm text-slate-500 mt-2">
                  {badge.description}
                </p>
                <p className="flex items-center gap-2 text-xs text-slate-400 mt-4">
                  <CalendarDays size={14} />
                  {formatDate(badge.earned_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}

export default PassportPage
