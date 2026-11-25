import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  GitCompareArrows,
  Target,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react'

import { careers } from '../data/sampleData'
import {
  careerRequirements,
  calculateSkillGaps
} from '../data/skillEngine'
import { useStudent } from '../context/StudentContext'

function CareerCard({ career, report, selected, onSelect }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700">
            {career.category}
          </p>
          <h3 className="mt-2 text-lg font-bold text-slate-900">
            {career.name}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {career.description}
          </p>
        </div>
        <div className="rounded-xl bg-cyan-50 p-3 text-cyan-700">
          <Target size={22} />
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">
            Your readiness
          </span>
          <span className="text-2xl font-bold text-slate-900">
            {report.coverage}%
          </span>
        </div>

        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-cyan-500 transition-all"
            style={{ width: `${report.coverage}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>{report.rows.length} required skills</span>
        <span>{report.missingSkills.length} skills to improve</span>
      </div>

      <button
        onClick={onSelect}
        className={`mt-5 w-full rounded-xl px-4 py-3 text-sm font-bold transition ${
          selected
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-slate-900 text-white hover:bg-cyan-800'
        }`}
      >
        {selected ? 'Selected as target career' : 'Choose this career'}
      </button>
    </div>
  )
}

export default function ComparePage() {
  const { student, saveAssessment } = useStudent()

  const availableCareers = careers.map((career) => career.name)

  const initialFirst = availableCareers.includes(student.targetCareer)
    ? student.targetCareer
    : availableCareers[0]

  const initialSecond =
    availableCareers.find((career) => career !== initialFirst) ||
    availableCareers[1]

  const [firstCareer, setFirstCareer] = useState(initialFirst)
  const [secondCareer, setSecondCareer] = useState(initialSecond)

  const assessedSkills = student.assessedSkills || {}

  const firstReport = useMemo(
    () => calculateSkillGaps(firstCareer, assessedSkills),
    [firstCareer, assessedSkills]
  )

  const secondReport = useMemo(
    () => calculateSkillGaps(secondCareer, assessedSkills),
    [secondCareer, assessedSkills]
  )

  const firstDetails = careers.find((career) => career.name === firstCareer)
  const secondDetails = careers.find((career) => career.name === secondCareer)

  const commonSkills = firstReport.rows
    .filter((item) =>
      secondReport.rows.some((other) => other.skill === item.skill)
    )
    .map((item) => item.skill)

  const firstOnlySkills = firstReport.rows.filter(
    (item) => !commonSkills.includes(item.skill)
  )

  const secondOnlySkills = secondReport.rows.filter(
    (item) => !commonSkills.includes(item.skill)
  )

  const chooseTargetCareer = (careerName) => {
    saveAssessment({
      career: careerName,
      targetCareer: careerName
    })
  }

  const SkillList = ({ rows }) => (
    <div className="space-y-3">
      {rows.length ? (
        rows.map((item) => (
          <div
            key={item.skill}
            className="rounded-xl border border-slate-100 p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-800">
                {item.skill}
              </span>
              <span className="text-xs font-bold text-slate-600">
                {item.required}% required
              </span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-cyan-500"
                style={{ width: `${item.current}%` }}
              />
            </div>

            <p className="mt-1 text-[10px] text-slate-500">
              Current level: {item.current}%
            </p>
          </div>
        ))
      ) : (
        <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          No additional skills in this category.
        </p>
      )}
    </div>
  )

  return (
    <div className="mx-auto max-w-6xl space-y-6">

      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[.15em] text-cyan-700">
          Explore your opportunities
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Career comparison
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Compare career requirements with your assessed skills and discover
          which career matches your current skill profile.
        </p>
      </div>

      {/* Career selectors */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label className="text-xs font-bold text-slate-500">
            FIRST CAREER
          </label>

          <select
            value={firstCareer}
            onChange={(event) => setFirstCareer(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-800 outline-none focus:border-cyan-500"
          >
            {availableCareers.map((career) => (
              <option key={career} value={career}>
                {career}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label className="text-xs font-bold text-slate-500">
            SECOND CAREER
          </label>

          <select
            value={secondCareer}
            onChange={(event) => setSecondCareer(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-800 outline-none focus:border-cyan-500"
          >
            {availableCareers.map((career) => (
              <option key={career} value={career}>
                {career}
              </option>
            ))}
          </select>
        </div>
      </section>

      {firstCareer === secondCareer && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Select two different careers to compare their requirements.
        </div>
      )}

      {/* Comparison cards */}
      {firstCareer !== secondCareer && (
        <>
          <section className="grid gap-4 md:grid-cols-2">
            <CareerCard
              career={firstDetails}
              report={firstReport}
              selected={student.targetCareer === firstCareer}
              onSelect={() => chooseTargetCareer(firstCareer)}
            />

            <CareerCard
              career={secondDetails}
              report={secondReport}
              selected={student.targetCareer === secondCareer}
              onSelect={() => chooseTargetCareer(secondCareer)}
            />
          </section>

          {/* Readiness comparison */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <GitCompareArrows className="text-cyan-700" size={20} />
              <h3 className="font-bold text-slate-900">
                Readiness comparison
              </h3>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Weighted skill coverage based on your assessment.
            </p>

            <div className="mt-6 space-y-6">
              {[firstReport, secondReport].map((report, index) => {
                const careerName = index === 0 ? firstCareer : secondCareer

                return (
                  <div key={careerName}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-800">
                        {careerName}
                      </span>
                      <span className="text-sm font-bold text-cyan-700">
                        {report.coverage}%
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-cyan-500 transition-all"
                        style={{ width: `${report.coverage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Common skills */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-600" />
              <h3 className="font-bold text-slate-900">
                Common skills
              </h3>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Skills required by both career paths.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {commonSkills.length ? (
                commonSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  These careers have no common skills in the current prototype.
                </p>
              )}
            </div>
          </section>

          {/* Unique skills */}
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-slate-900">
                {firstCareer} skills
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Skills unique to this career.
              </p>

              <div className="mt-4">
                <SkillList rows={firstOnlySkills} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-slate-900">
                {secondCareer} skills
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Skills unique to this career.
              </p>

              <div className="mt-4">
                <SkillList rows={secondOnlySkills} />
              </div>
            </div>
          </section>

          {/* Skills to improve */}
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <TrendingUp size={19} className="text-amber-600" />
                <h3 className="font-bold text-slate-900">
                  Skills to improve
                </h3>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                {firstCareer}
              </p>

              <div className="mt-4">
                <SkillList rows={firstReport.missingSkills} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <TrendingUp size={19} className="text-amber-600" />
                <h3 className="font-bold text-slate-900">
                  Skills to improve
                </h3>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                {secondCareer}
              </p>

              <div className="mt-4">
                <SkillList rows={secondReport.missingSkills} />
              </div>
            </div>
          </section>
        </>
      )}

      {/* Assessment reminder */}
      {!student.assessmentResults && (
        <section className="rounded-2xl bg-slate-900 p-6 text-white">
          <div className="flex items-center gap-3">
            <BookOpen size={23} className="text-cyan-300" />
            <h3 className="font-bold">Get a more accurate comparison</h3>
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            Complete your skill assessment to calculate career readiness using
            your demonstrated skill levels instead of baseline values.
          </p>

          <Link
            to="/assessment"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold text-white hover:bg-cyan-400"
          >
            Take assessment <ArrowRight size={15} />
          </Link>
        </section>
      )}

      <p className="text-center text-[10px] leading-5 text-slate-400">
        Career requirements and weights are illustrative prototype benchmarks,
        not official hiring standards.
      </p>
    </div>
  )
}