
import { useEffect, useMemo } from 'react'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock3,
  RefreshCw,
  Target,
  Trophy,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { calculateSkillGaps } from '../data/skillEngine'
import { useStudent } from '../context/StudentContext'

function createRoadmap(career, assessedSkills) {
  const report = calculateSkillGaps(career, assessedSkills)

  return report.missingSkills.flatMap((item) => [
    {
      id: `${item.skill}-1`,
      skill: item.skill,
      title: `Learn the fundamentals of ${item.skill}`,
      detail: `Understand the basic concepts and terminology of ${item.skill}.`,
      estimatedDays: 2,
      priority: item.priority,
      completed: false,
    },
    {
      id: `${item.skill}-2`,
      skill: item.skill,
      title: `Practise ${item.skill}`,
      detail: `Work through exercises and examples to strengthen your understanding.`,
      estimatedDays: 3,
      priority: item.priority,
      completed: false,
    },
    {
      id: `${item.skill}-3`,
      skill: item.skill,
      title: `Build a mini project using ${item.skill}`,
      detail: `Apply what you learned in a small practical project.`,
      estimatedDays: 3,
      priority: item.priority,
      completed: false,
    },
  ])
}

export default function RoadmapPage() {
  const { student, saveRoadmap } = useStudent()

  const career = student.targetCareer || 'Software Developer'
  const assessedSkills = student.assessedSkills || {}

  const generatedTasks = useMemo(
    () => createRoadmap(career, assessedSkills),
    [career, assessedSkills]
  )

  const tasks = Array.isArray(student.roadmap)
    ? student.roadmap
    : generatedTasks

  useEffect(() => {
    if (!Array.isArray(student.roadmap)) {
      saveRoadmap(generatedTasks)
    }
  }, [student.roadmap, generatedTasks])

  const completedCount = tasks.filter(task => task.completed).length
  const totalCount = tasks.length
  const progress = totalCount
    ? Math.round((completedCount / totalCount) * 100)
    : 100

  function toggleTask(taskId) {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    )

    saveRoadmap(updatedTasks)
  }

  function regenerateRoadmap() {
    saveRoadmap(createRoadmap(career, assessedSkills))
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-[#10243b] to-[#12516a] p-6 text-white sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-200">
          Your personalized learning journey
        </p>

        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
          Your Learning Roadmap
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          Follow your learning tasks, strengthen your skills and work towards
          becoming a {career}.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <div className="rounded-xl bg-white/10 px-4 py-3">
            <p className="text-xs text-slate-300">Tasks completed</p>
            <p className="mt-1 text-xl font-bold">
              {completedCount}/{totalCount}
            </p>
          </div>

          <div className="rounded-xl bg-white/10 px-4 py-3">
            <p className="text-xs text-slate-300">Overall progress</p>
            <p className="mt-1 text-xl font-bold">{progress}%</p>
          </div>

          <div className="rounded-xl bg-white/10 px-4 py-3">
            <p className="text-xs text-slate-300">Target career</p>
            <p className="mt-1 text-sm font-bold">{career}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Learning progress
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Complete tasks to move forward.
            </p>
          </div>

          <Trophy className="text-cyan-600" size={23} />
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2 text-right text-xs font-bold text-cyan-700">
          {progress}% completed
        </p>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Your learning tasks
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Tasks are prioritized using your career skill gaps.
          </p>
        </div>

        <button
          onClick={regenerateRoadmap}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw size={14} />
          Regenerate roadmap
        </button>
      </div>

      {tasks.length === 0 ? (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <CheckCircle2 className="mx-auto text-emerald-600" size={32} />
          <h3 className="mt-3 font-bold text-emerald-900">
            All career skills are on track!
          </h3>
          <p className="mt-2 text-sm text-emerald-800">
            Complete another assessment later to identify new learning goals.
          </p>
        </section>
      ) : (
        <section className="space-y-3">
          {tasks.map((task, index) => (
            <article
              key={task.id}
              className={`rounded-2xl border bg-white p-4 shadow-sm transition ${
                task.completed
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleTask(task.id)}
                  aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
                  className="mt-1 shrink-0 text-cyan-700"
                >
                  {task.completed
                    ? <CheckCircle2 size={23} className="text-emerald-600" />
                    : <Circle size={23} />}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-cyan-700">
                      Step {index + 1}
                    </span>

                    <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                      task.priority === 'High'
                        ? 'bg-rose-50 text-rose-700'
                        : task.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                    }`}>
                      {task.priority} priority
                    </span>
                  </div>

                  <h3 className={`mt-2 text-sm font-bold ${
                    task.completed
                      ? 'text-emerald-800 line-through'
                      : 'text-slate-900'
                  }`}>
                    {task.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {task.detail}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Target size={12} />
                      {task.skill}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock3 size={12} />
                      {task.estimatedDays} days
                    </span>

                    <span className="flex items-center gap-1">
                      <BookOpen size={12} />
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      <section className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5">
        <h3 className="text-sm font-bold text-slate-900">
          Want a more accurate roadmap?
        </h3>
        <p className="mt-2 text-xs leading-5 text-slate-600">
          Complete your skill assessment to generate learning tasks based on
          your demonstrated knowledge.
        </p>

        <Link
          to="/assessment"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-cyan-800"
        >
          Take skill assessment
          <ArrowRight size={14} />
        </Link>
      </section>
    </div>
  )
}
