
import { useCallback, useEffect, useState } from 'react'
import {
  Activity,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  FolderKanban,
  LoaderCircle,
  Target,
  TrendingUp
} from 'lucide-react'
import { useStudent } from '../context/StudentContext'

const API_URL = 'https://skill-bridge-y9zr.onrender.com'

function StatCard({ title, value, note, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <Icon size={19} className="text-cyan-700" />
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
    </div>
  )
}

export default function ProgressPage() {
  const { student } = useStudent()
  const [data, setData] = useState(null)
  const [passport, setPassport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const studentKey = (
    student.email || student.name || 'student'
  ).trim().toLowerCase()

  const loadProgress = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [dashboardResponse, passportResponse] = await Promise.all([
        fetch(`${API_URL}/api/dashboard/${encodeURIComponent(studentKey)}`),
        fetch(`${API_URL}/api/passport/${encodeURIComponent(studentKey)}`)
      ])

      if (!dashboardResponse.ok || !passportResponse.ok) {
        throw new Error('Unable to load your progress data.')
      }

      const dashboardData = await dashboardResponse.json()
      const passportData = await passportResponse.json()

      setData(dashboardData)
      setPassport(passportData)
    } catch (err) {
      setError(err.message || 'Could not connect to SkillBridge backend.')
    } finally {
      setLoading(false)
    }
  }, [studentKey])

  useEffect(() => {
    loadProgress()
  }, [loadProgress])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-slate-500">
        <LoaderCircle className="animate-spin" />
        Loading your progress...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
        <p className="font-bold text-rose-800">Progress data unavailable</p>
        <p className="mt-2 text-sm text-rose-700">{error}</p>
        <button
          onClick={loadProgress}
          className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    )
  }

  const totalTasks = data?.total_tasks || 0
  const completedTasks = data?.completed_tasks || 0
  const pendingTasks = data?.pending_tasks || 0
  const progress = data?.roadmap_progress || 0

  const quizzes = passport?.quiz_records || []
  const projects = passport?.projects || []
  const achievements = passport?.achievements || []

  const averageQuizScore = quizzes.length
    ? Math.round(
        quizzes.reduce((sum, quiz) => sum + Number(quiz.score || 0), 0) /
        quizzes.length
      )
    : 0

  return (
    <div className="mx-auto max-w-6xl space-y-6">

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.15em] text-cyan-700">
            Your learning journey
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Progress tracking
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Track your learning milestones, assessments and achievements.
          </p>
        </div>

        <button
          onClick={loadProgress}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          Refresh progress
        </button>
      </div>

      {/* Main progress */}
      <section className="rounded-2xl bg-[#101827] p-6 text-white">
        <div className="flex items-center gap-2">
          <Activity size={20} className="text-cyan-300" />
          <p className="text-sm font-semibold text-slate-300">
            Overall roadmap progress
          </p>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-5xl font-bold">{progress}%</p>
            <p className="mt-2 text-sm text-slate-400">
              {completedTasks} of {totalTasks} learning tasks completed
            </p>
          </div>
          <Target size={42} className="text-cyan-300" />
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-cyan-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Completed tasks"
          value={completedTasks}
          note="Roadmap tasks finished"
          icon={CheckCircle2}
        />
        <StatCard
          title="Pending tasks"
          value={pendingTasks}
          note="Tasks remaining"
          icon={Clock}
        />
        <StatCard
          title="Quizzes attempted"
          value={quizzes.length}
          note={`Average score: ${averageQuizScore}%`}
          icon={BookOpen}
        />
        <StatCard
          title="Projects recorded"
          value={projects.length}
          note="Portfolio projects"
          icon={FolderKanban}
        />
      </section>

      {/* Learning activity */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-cyan-700" />
            <h3 className="font-bold text-slate-900">Quiz performance</h3>
          </div>

          {quizzes.length ? (
            <div className="mt-4 space-y-3">
              {quizzes.map((quiz, index) => (
                <div
                  key={`${quiz.skill}-${index}`}
                  className="rounded-xl bg-slate-50 p-3"
                >
                  <div className="flex justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-800">
                      {quiz.skill}
                    </span>
                    <span className="text-sm font-bold text-cyan-700">
                      {quiz.score}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {quiz.correct_answers} correct out of {quiz.total_questions}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              No quiz attempts recorded yet. Complete a quiz to see your performance.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Award size={20} className="text-amber-600" />
            <h3 className="font-bold text-slate-900">Achievements</h3>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Your earned SkillBridge badges.
          </p>

          {achievements.length ? (
            <div className="mt-4 space-y-3">
              {achievements.map((badge, index) => (
                <div
                  key={`${badge.title}-${index}`}
                  className="flex items-center gap-3 rounded-xl bg-amber-50 p-3"
                >
                  <div className="rounded-xl bg-white p-2 text-amber-600">
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {badge.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      {badge.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              Your achievements will appear here as you complete activities.
            </p>
          )}
        </div>
      </section>

      {/* Projects */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <FolderKanban size={20} className="text-cyan-700" />
          <h3 className="font-bold text-slate-900">Project activity</h3>
        </div>

        {projects.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-slate-100 p-4"
              >
                <p className="font-semibold text-slate-800">{project.title}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {project.description || 'No description provided.'}
                </p>
                <span className="mt-3 inline-block rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700">
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            No projects recorded yet. Add a project to your SkillBridge portfolio.
          </p>
        )}
      </section>

      <p className="text-center text-xs text-slate-400">
        Your progress is based on activities saved to your SkillBridge account.
      </p>
    </div>
  )
}
