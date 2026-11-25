
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Brain,
  Flame,
  Target,
  TrendingUp,
  LockKeyhole,
  Play,
  Sparkles,
  CheckCircle2,
  Award,
  ClipboardList,
  Loader2,
  AlertCircle,
} from 'lucide-react'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'

import { useStudent } from '../context/StudentContext'
import {
  roadmap,
  skillProgress,
  weeklyActivity,
} from '../data/sampleData'

import StatCard from '../components/StatCard'

const API_URL = 'http://127.0.0.1:8000'

// Reusable section heading
function SectionTitle({ title, action, to }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-sm font-bold text-slate-900">
        {title}
      </h2>

      {action && (
        <Link
          to={to}
          className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-700 hover:text-cyan-900"
        >
          {action}
          <ArrowRight size={13} />
        </Link>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { student } = useStudent()

  const firstName = (student.name || 'Student').split(' ')[0]

  const career =
    student.targetCareer ||
    student.career ||
    'Software Developer'

  const studentKey = (
    student.email || student.name || 'student'
  ).trim().toLowerCase()

  // Backend dashboard data
  const [dashboardData, setDashboardData] = useState(null)
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [dashboardError, setDashboardError] = useState('')

  // Fetch real dashboard data
  useEffect(() => {
    let active = true

    async function fetchDashboard() {
      try {
        setDashboardLoading(true)
        setDashboardError('')

        const response = await fetch(
          `${API_URL}/api/dashboard/${encodeURIComponent(studentKey)}`
        )

        if (!response.ok) {
          throw new Error(
            `Unable to load dashboard (${response.status})`
          )
        }

        const data = await response.json()

        if (active) {
          setDashboardData(data)
        }

      } catch (error) {
        if (active) {
          setDashboardError(
            error.message || 'Could not connect to backend.'
          )
        }

      } finally {
        if (active) {
          setDashboardLoading(false)
        }
      }
    }

    fetchDashboard()

    return () => {
      active = false
    }
  }, [studentKey])

  const isAssessed =
    student.readiness !== undefined &&
    student.skillsAssessed > 0

  const readiness = student.readiness || 0

  const totalTasks = dashboardData?.total_tasks ?? 0
  const completedTasks = dashboardData?.completed_tasks ?? 0
  const pendingTasks = dashboardData?.pending_tasks ?? 0
  const roadmapProgress = dashboardData?.roadmap_progress ?? 0

  return (
    <div className="space-y-6">

      {/* ================================= */}
      {/* WELCOME SECTION */}
      {/* ================================= */}

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#10243b] via-[#12334a] to-[#12516a] p-6 text-white sm:p-8">

        <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />

        <div className="absolute right-28 top-20 h-24 w-24 rounded-full bg-cyan-300/10 blur-2xl" />

        <div className="relative max-w-2xl">

          <p className="text-xs font-semibold text-cyan-200">
            WEDNESDAY, NOVEMBER 25, 2026
          </p>

          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
            Welcome back, {firstName}! ✨
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
            Every skill you build brings your career goal closer.
            Here's what your journey looks like today.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-200"
            >
              Continue assessment
              <ArrowRight size={15} />
            </Link>

            <Link
              to="/roadmap"
              className="rounded-xl border border-white/20 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10"
            >
              View my roadmap
            </Link>

          </div>
        </div>
      </section>

      {/* ================================= */}
      {/* STUDENT STATISTICS */}
      {/* ================================= */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Career readiness"
          value={`${readiness}%`}
          note={
            isAssessed
              ? 'Based on your assessed skills'
              : 'Complete an assessment to begin'
          }
          icon={Target}
          tone="cyan"
        />

        <StatCard
          label="Skills assessed"
          value={student.skillsAssessed || 0}
          note="Knowledge areas evaluated"
          icon={Brain}
          tone="violet"
        />

        <StatCard
          label="Skills to strengthen"
          value={student.skillsToBuild || 0}
          note="Identified for your career goal"
          icon={TrendingUp}
          tone="amber"
        />

        <StatCard
          label="Learning streak"
          value={`${student.learningStreak || 0} days`}
          note="Keep your momentum going"
          icon={Flame}
          tone="emerald"
        />

      </section>

      {/* ================================= */}
      {/* LIVE BACKEND STATISTICS */}
      {/* ================================= */}

      <section>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Your learning progress
          </h2>

          <span className="text-xs text-green-600">
            {dashboardLoading
              ? 'Loading...'
              : 'Live backend data'}
          </span>
        </div>

        {dashboardError && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} />
            {dashboardError}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Roadmap progress */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">
                Roadmap progress
              </p>

              <Target size={19} className="text-cyan-600" />
            </div>

            <p className="mt-3 text-3xl font-bold text-cyan-700">
              {dashboardLoading
                ? '...'
                : `${roadmapProgress}%`}
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                style={{
                  width: `${roadmapProgress}%`,
                }}
              />
            </div>

            <p className="mt-2 text-[11px] text-slate-400">
              Overall task completion
            </p>

          </div>

          {/* Completed tasks */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">
                Completed tasks
              </p>

              <CheckCircle2 size={19} className="text-green-600" />
            </div>

            <p className="mt-3 text-3xl font-bold text-green-600">
              {dashboardLoading ? '...' : completedTasks}
            </p>

            <p className="mt-2 text-[11px] text-slate-400">
              Out of {totalTasks} learning tasks
            </p>

          </div>

          {/* Pending tasks */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">
                Pending tasks
              </p>

              <ClipboardList size={19} className="text-orange-500" />
            </div>

            <p className="mt-3 text-3xl font-bold text-orange-500">
              {dashboardLoading ? '...' : pendingTasks}
            </p>

            <p className="mt-2 text-[11px] text-slate-400">
              Tasks waiting to be completed
            </p>

          </div>

          {/* Quizzes */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">
                Quizzes attempted
              </p>

              <Brain size={19} className="text-violet-600" />
            </div>

            <p className="mt-3 text-3xl font-bold text-violet-600">
              {dashboardLoading
                ? '...'
                : dashboardData?.quizzes_attempted ?? 0}
            </p>

            <p className="mt-2 text-[11px] text-slate-400">
              Total quiz attempts
            </p>

          </div>

        </div>

        {/* Projects and achievements */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <BookOpen size={20} />
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Projects recorded
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {dashboardLoading
                    ? '...'
                    : dashboardData?.projects_recorded ?? 0}
                </p>
              </div>

            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
                <Award size={20} />
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Badges earned
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {dashboardLoading
                    ? '...'
                    : dashboardData?.badges_earned ?? 0}
                </p>
              </div>

            </div>
          </div>

        </div>

      </section>

      {/* ================================= */}
      {/* WEEKLY ACTIVITY AND CAREER GOAL */}
      {/* ================================= */}

      <section className="grid gap-6 xl:grid-cols-[1.35fr_.85fr]">

        {/* Weekly activity chart */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">

          <SectionTitle
            title="Weekly learning activity"
            action="View progress"
            to="/progress"
          />

          <p className="text-xs text-slate-500">
            Time spent learning · minutes per day
          </p>

          <div className="mt-5 h-[220px] w-full">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart
                data={weeklyActivity}
                margin={{
                  top: 8,
                  right: 8,
                  left: -22,
                  bottom: 0,
                }}
              >

                <defs>
                  <linearGradient
                    id="activityFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#06b6d4"
                      stopOpacity={0.22}
                    />

                    <stop
                      offset="95%"
                      stopColor="#06b6d4"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#edf1f5"
                  vertical={false}
                />

                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#94a3b8',
                    fontSize: 11,
                  }}
                  dy={10}
                />

                <Tooltip
                  contentStyle={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={value => [
                    `${value} min`,
                    'Learning time',
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="minutes"
                  stroke="#0891b2"
                  strokeWidth={2.5}
                  fill="url(#activityFill)"
                  activeDot={{
                    r: 5,
                    strokeWidth: 0,
                  }}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>
        </div>

        {/* Career goal */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">

          <SectionTitle title="Your career goal" />

          <div className="rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 p-4">

            <div className="flex items-center gap-2 text-cyan-800">
              <Target size={17} />

              <span className="text-[11px] font-bold uppercase tracking-wide">
                Selected pathway
              </span>
            </div>

            <h3 className="mt-3 text-lg font-bold text-slate-900">
              {career}
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Your current learning journey is aligned to this career path.
            </p>

            <Link
              to="/careers"
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-cyan-800"
            >
              Explore other paths
              <ArrowUpRight size={14} />
            </Link>

          </div>

          <div className="mt-5 flex items-center justify-between">

            <span className="text-xs font-semibold text-slate-700">
              Career readiness
            </span>

            <span className="text-sm font-bold text-slate-900">
              {readiness}%
            </span>

          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
              style={{
                width: `${readiness}%`,
              }}
            />

          </div>

          <p className="mt-2 text-[10px] text-slate-400">
            Based on your completed skill assessment.
          </p>

        </div>

      </section>

      {/* ================================= */}
      {/* SKILLS SNAPSHOT AND NEXT STEPS */}
      {/* ================================= */}

      <section className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">

        {/* Skills snapshot */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">

          <SectionTitle
            title="Skills snapshot"
            action="See skill gaps"
            to="/skill-gaps"
          />

          <p className="mb-5 text-xs text-slate-500">
            Current level compared with target expectations
          </p>

          <div className="space-y-5">

            {skillProgress.map(skill => (

              <div key={skill.skill}>

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-xs font-semibold text-slate-700">
                    {skill.skill}
                  </span>

                  <span className="text-[10px] text-slate-400">
                    {skill.current}%
                    <span className="px-1">/</span>
                    {skill.required}% target
                  </span>

                </div>

                <div className="relative h-2 rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-cyan-500"
                    style={{
                      width: `${skill.current}%`,
                    }}
                  />

                  <div
                    className="absolute -top-1 h-4 w-px bg-slate-500"
                    style={{
                      left: `${skill.required}%`,
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

          <div className="mt-5 flex items-center gap-2 text-[10px] text-slate-400">

            <span className="h-2 w-2 rounded-full bg-cyan-500" />

            Current skill level

            <span className="ml-3 h-3 w-px bg-slate-500" />

            Target expectation

          </div>

        </div>

        {/* Next steps */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">

          <SectionTitle
            title="Your next steps"
            action="Full roadmap"
            to="/roadmap"
          />

          <div className="space-y-4">

            {roadmap.map((item, index) => (

              <div
                key={item.title}
                className="flex gap-3"
              >

                <div
                  className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                    index === 0
                      ? 'bg-cyan-50 text-cyan-700'
                      : index === 1
                        ? 'bg-violet-50 text-violet-700'
                        : 'bg-slate-100 text-slate-400'
                  }`}
                >

                  {index === 0
                    ? <Play size={14} />
                    : index === 1
                      ? <BookOpen size={15} />
                      : <LockKeyhole size={14} />}

                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center gap-2">

                    <p className="text-xs font-semibold text-slate-800">
                      {item.title}
                    </p>

                    {index === 0 && (
                      <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[9px] font-bold text-cyan-700">
                        NOW
                      </span>
                    )}

                  </div>

                  <p className="mt-1 text-[11px] text-slate-500">
                    {item.detail}
                  </p>

                  <p className="mt-1.5 text-[10px] text-slate-400">
                    {item.time} · {item.status}
                  </p>

                </div>

              </div>

            ))}

          </div>

          <Link
            to="/roadmap"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Open learning roadmap
            <ArrowRight size={14} />
          </Link>

        </div>

      </section>

      {/* ================================= */}
      {/* FINAL CALL TO ACTION */}
      {/* ================================= */}

      <section className="rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 p-5 sm:p-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-cyan-700 shadow-sm">
            <Sparkles size={21} />
          </div>

          <div className="flex-1">

            <h3 className="text-sm font-bold text-slate-900">
              Make your profile more accurate
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              Complete a skill assessment to replace sample estimates with your demonstrated knowledge.
            </p>

          </div>

          <Link
            to="/assessment"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-cyan-800"
          >
            Start assessment
            <ArrowRight size={14} />
          </Link>

        </div>

      </section>

    </div>
  )
}
