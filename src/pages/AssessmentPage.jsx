
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  RotateCcw,
  Target
} from 'lucide-react'

import { careers } from '../data/sampleData'
import {
  getRequirements,
  questionBank,
  calculateSkillGaps
} from '../data/skillEngine'
import { useStudent } from '../context/StudentContext'

const API_URL = 'https://skill-bridge-y9zr.onrender.com'

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100'

export default function AssessmentPage() {
  const { student, token, saveAssessment } = useStudent()

  const [career, setCareer] = useState(
    student?.targetCareer || 'Software Developer'
  )

  const requirements = useMemo(
    () => getRequirements(career),
    [career]
  )

  const [answers, setAnswers] = useState({})
  const [ratings, setRatings] = useState(
    () => student?.selfRatings || {}
  )
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const questions = requirements.map((item) => ({
    skill: item.skill,
    ...questionBank[item.skill]
  }))

  const answeredCount = Object.keys(answers).filter(
    (key) => answers[key] !== undefined
  ).length

  async function submitAssessment(event) {
    event.preventDefault()

    if (
      answeredCount !== questions.length ||
      saving
    ) {
      return
    }

    if (!token) {
      setError('Your login session is missing. Please log in again.')
      return
    }

    const studentKey =
      student?.email || student?.student_key

    if (!studentKey) {
      setError('Student account information is missing. Please log in again.')
      return
    }

    setSaving(true)
    setError('')
    setSubmitted(false)

    try {
      const assessedSkills = Object.fromEntries(
        questions.map((question) => [
          question.skill,
          answers[question.skill] === question.answer
            ? 100
            : 0
        ])
      )

      const results = calculateSkillGaps(
        career,
        assessedSkills
      )

      // Save every skill result in the backend.
      for (const question of questions) {
        const isCorrect =
          answers[question.skill] === question.answer

        const correctAnswers = isCorrect ? 1 : 0

        const response = await fetch(
          `${API_URL}/api/quizzes`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              student_key: studentKey,
              skill: question.skill,
              score: correctAnswers * 100,
              total_questions: 1,
              correct_answers: correctAnswers
            })
          }
        )

        if (!response.ok) {
          let message = 'Unable to save assessment results.'

          try {
            const data = await response.json()
            message = data.detail || message
          } catch {
            // Keep the default error message.
          }

          throw new Error(message)
        }
      }

      // Update the existing student profile and local storage.
      saveAssessment({
        targetCareer: career,
        assessedSkills,
        selfRatings: ratings,
        assessmentResults: results,
        readiness: results.coverage,
        skillsAssessed: results.assessedCount,
        skillsToBuild: results.missingSkills.length,
        assessmentDate: new Date().toISOString()
      })

      setSubmitted(true)
    } catch (err) {
      console.error('Assessment submission error:', err)

      setError(
        err.message ||
        'Something went wrong while saving your assessment.'
      )
    } finally {
      setSaving(false)
    }
  }

  function resetAssessment() {
    setAnswers({})
    setSubmitted(false)
    setError('')
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.15em] text-cyan-700">
            Demonstrate what you know
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Technical skill assessment
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Answer one knowledge check for each skill required by your selected career.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
          <span className="text-slate-500">Progress </span>
          <strong className="text-slate-900">
            {answeredCount}/{questions.length}
          </strong>

          <div className="mt-2 h-1.5 w-36 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-cyan-500 transition-all"
              style={{
                width: `${
                  questions.length
                    ? (answeredCount / questions.length) * 100
                    : 0
                }%`
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">

        <form
          onSubmit={submitAssessment}
          className="space-y-5"
        >

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="mb-2 block text-xs font-bold text-slate-700">
              Target career
            </label>

            <select
              className={fieldClass}
              value={career}
              disabled={saving}
              onChange={(event) => {
                setCareer(event.target.value)
                setAnswers({})
                setSubmitted(false)
                setError('')
              }}
            >
              {careers.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Changing the career updates the required skills and questions automatically.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <ClipboardCheck
                size={18}
                className="text-cyan-700"
              />
              <h3 className="font-bold text-slate-900">
                Knowledge checks
              </h3>
            </div>

            <div className="space-y-6">
              {questions.map((question, index) => (
                <fieldset
                  key={`${career}-${question.skill}`}
                  className="border-b border-slate-100 pb-5 last:border-0 last:pb-0"
                  disabled={saving}
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <legend className="text-sm font-semibold text-slate-900">
                      {index + 1}. {question.question}
                    </legend>

                    <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-bold text-cyan-800">
                      {question.skill}
                    </span>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-xs transition ${
                          answers[question.skill] === optionIndex
                            ? 'border-cyan-500 bg-cyan-50 text-cyan-900'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={question.skill}
                          value={optionIndex}
                          checked={
                            answers[question.skill] === optionIndex
                          }
                          onChange={() => {
                            setAnswers((old) => ({
                              ...old,
                              [question.skill]: optionIndex
                            }))
                            setSubmitted(false)
                            setError('')
                          }}
                          className="accent-cyan-600"
                        />

                        {option}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-900">
              Self-reported confidence
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Optional: rate your own confidence. This is stored separately and does not increase your demonstrated assessment score.
            </p>

            <div className="mt-4 space-y-4">
              {requirements.map((item) => (
                <label
                  key={item.skill}
                  className="block"
                >
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      {item.skill}
                    </span>

                    <span className="font-bold tabular-nums text-slate-900">
                      {ratings[item.skill] ?? 50}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    disabled={saving}
                    value={ratings[item.skill] ?? 50}
                    onChange={(event) =>
                      setRatings((old) => ({
                        ...old,
                        [item.skill]: Number(event.target.value)
                      }))
                    }
                    className="w-full accent-cyan-600"
                  />
                </label>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={
                answeredCount !== questions.length || saving
              }
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving
                ? 'Saving assessment...'
                : 'Calculate my skill gaps'}

              <ArrowRight size={15} />
            </button>

            <button
              type="button"
              onClick={resetAssessment}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <RotateCcw size={14} />
              Reset answers
            </button>
          </div>

          {answeredCount !== questions.length && (
            <p className="text-xs text-slate-500">
              Answer all {questions.length} questions to calculate your result.
            </p>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

        </form>

        <aside className="space-y-4">

          <div className="rounded-2xl bg-[#101827] p-5 text-white shadow-sm">
            <div className="flex items-center gap-2 text-cyan-300">
              <Target size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">
                Assessment method
              </span>
            </div>

            <p className="mt-3 text-sm font-semibold">
              Transparent rule-based scoring
            </p>

            <ul className="mt-3 space-y-3 text-xs leading-5 text-slate-300">
              <li>• Correct answer = 100 demonstrated skill points.</li>
              <li>• Incorrect answer = 0 demonstrated points.</li>
              <li>• Each skill is matched by its name to the career requirement.</li>
              <li>• Self-rating stays separate from quiz evidence.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 text-slate-500">
              <Activity size={17} />
              <span className="text-xs font-bold">
                CAREER REQUIREMENTS
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {requirements.map((item) => (
                <div
                  key={item.skill}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <span className="text-slate-600">
                    {item.skill}
                  </span>

                  <strong className="text-slate-900">
                    {item.required}%
                  </strong>
                </div>
              ))}
            </div>

            <p className="mt-4 border-t border-slate-100 pt-3 text-[10px] leading-4 text-slate-400">
              Prototype benchmark values for demonstration; replace with validated industry data before production use.
            </p>
          </div>

        </aside>
      </div>

      {submitted && (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 size={20} />

              <h3 className="font-bold">
                Assessment saved successfully
              </h3>
            </div>

            <Link
              to="/skill-gaps"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800"
            >
              View skill gap report
              <ArrowRight size={14} />
            </Link>
          </div>

          <p className="mt-2 text-sm text-emerald-800">
            Your assessment results have been saved to your student account and browser.
          </p>
        </section>
      )}

    </div>
  )
}
