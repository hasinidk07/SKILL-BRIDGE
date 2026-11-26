
import { useMemo, useState } from 'react'
import {
  Search,
  BriefcaseBusiness,
  Code2,
  Database,
  Brain,
  Cpu,
  Radio,
  Bot,
  ArrowRight,
  CheckCircle2,
  Target,
  X
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { careers } from '../data/sampleData'
import { careerRequirements, calculateSkillGaps } from '../data/skillEngine'
import { useStudent } from '../context/StudentContext'

const icons = [
  Code2,
  Database,
  Brain,
  Cpu,
  Cpu,
  Radio,
  Bot,
  Radio
]

const colors = [
  'bg-blue-50 text-blue-600',
  'bg-emerald-50 text-emerald-600',
  'bg-violet-50 text-violet-600',
  'bg-orange-50 text-orange-600',
  'bg-pink-50 text-pink-600',
  'bg-cyan-50 text-cyan-600',
  'bg-amber-50 text-amber-600',
  'bg-indigo-50 text-indigo-600'
]

function CareersPage() {
  const { student, saveAssessment } = useStudent()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [selectedCareer, setSelectedCareer] = useState(null)
  const [message, setMessage] = useState('')

  const categories = [
    'All',
    ...new Set(careers.map(career => career.category))
  ]

  const filteredCareers = useMemo(() => {
    return careers.filter(career => {
      const matchesSearch =
        career.name.toLowerCase().includes(search.toLowerCase()) ||
        career.description.toLowerCase().includes(search.toLowerCase()) ||
        career.skills.some(skill =>
          skill.toLowerCase().includes(search.toLowerCase())
        )

      const matchesCategory =
        category === 'All' || career.category === category

      return matchesSearch && matchesCategory
    })
  }, [search, category])

  function getReadiness(careerName) {
    const assessedSkills = student?.assessedSkills || {}
    const result = calculateSkillGaps(careerName, assessedSkills)

    return result?.coverage ?? 0
  }

  function selectCareer(careerName) {
    saveAssessment({
      career: careerName,
      targetCareer: careerName
    })

    setMessage(`${careerName} selected as your target career.`)
    setSelectedCareer(null)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">

      {/* Header */}
      <div>
        <p className="text-sm font-semibold text-indigo-600 mb-2">
          DISCOVER YOUR FUTURE
        </p>
        <h1 className="text-3xl font-bold text-slate-900">
          Career Explorer
        </h1>
        <p className="text-slate-500 mt-2">
          Explore career opportunities and discover the skills you need to build.
        </p>
      </div>

      {message && (
        <div className="flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={18} />
            {message}
          </span>
          <button onClick={() => setMessage('')} aria-label="Dismiss">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Current Career */}
      <div className="bg-gradient-to-r from-indigo-700 to-violet-600 rounded-2xl p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="text-indigo-100 text-sm">
              YOUR CURRENT TARGET CAREER
            </p>
            <h2 className="text-2xl font-bold mt-2">
              {student?.career || student?.targetCareer || 'Not selected'}
            </h2>
            <p className="text-indigo-100 text-sm mt-2">
              You can explore and choose another career at any time.
            </p>
          </div>
          <div className="p-4 bg-white/15 rounded-2xl w-fit">
            <Target size={35} />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={19}
          />
          <input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search careers, skills or opportunities..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map(item => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                category === item
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Career Cards */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900">
            Explore Career Paths
          </h2>
          <span className="text-sm text-slate-400">
            {filteredCareers.length} careers
          </span>
        </div>

        {filteredCareers.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <Search className="mx-auto text-slate-300 mb-3" size={35} />
            <p className="font-semibold text-slate-700">
              No careers found
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Try another search or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredCareers.map(career => {
              const originalIndex = careers.findIndex(
                item => item.name === career.name
              )
              const Icon = icons[originalIndex] || BriefcaseBusiness
              const readiness = getReadiness(career.name)
              const isSelected =
                (student?.career || student?.targetCareer) === career.name

              return (
                <article
                  key={career.name}
                  className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-200 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl ${colors[originalIndex]}`}>
                      <Icon size={25} />
                    </div>

                    {isSelected && (
                      <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700">
                        Selected
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-indigo-600 mt-5">
                    {career.category}
                  </p>

                  <h3 className="text-lg font-bold text-slate-900 mt-2">
                    {career.name}
                  </h3>

                  <p className="text-sm text-slate-500 mt-2 leading-6 min-h-12">
                    {career.description}
                  </p>

                  <div className="mt-5">
                    <p className="text-xs font-semibold text-slate-400 mb-3">
                      REQUIRED SKILLS
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {career.skills.map(skill => (
                        <span
                          key={skill}
                          className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-500">
                        Your skill readiness
                      </span>
                      <span className="font-bold text-indigo-600">
                        {readiness}%
                      </span>
                    </div>

                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all"
                        style={{ width: `${readiness}%` }}
                      />
                    </div>

                    <button
                      onClick={() => setSelectedCareer(career)}
                      className="w-full mt-5 flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl py-3 text-sm font-semibold hover:bg-indigo-600 transition"
                    >
                      Explore Career
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      {/* Career Details Modal */}
      {selectedCareer && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-xs font-semibold text-indigo-600">
                  CAREER DETAILS
                </p>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  {selectedCareer.name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedCareer(null)}
                className="p-2 rounded-lg hover:bg-slate-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-slate-500 mt-4 leading-6">
              {selectedCareer.description}
            </p>

            <div className="mt-6">
              <h3 className="font-bold text-slate-900 mb-3">
                Skills required
              </h3>
              <div className="space-y-3">
                {selectedCareer.skills.map(skill => {
                  const requirement = careerRequirements[
                    selectedCareer.name
                  ]?.find(item => item.skill === skill)

                  return (
                    <div
                      key={skill}
                      className="flex justify-between items-center p-3 bg-slate-50 rounded-xl"
                    >
                      <span className="text-sm font-medium text-slate-700">
                        {skill}
                      </span>
                      <span className="text-sm font-semibold text-indigo-600">
                        Target: {requirement?.required ?? '—'}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3">
              <button
                onClick={() => selectCareer(selectedCareer.name)}
                className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700"
              >
                Select This Career
              </button>

              <Link
                to="/assessment"
                onClick={() => setSelectedCareer(null)}
                className="w-full text-center border border-slate-200 rounded-xl py-3 text-slate-700 font-medium hover:bg-slate-50"
              >
                Take Skill Assessment
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CareersPage
