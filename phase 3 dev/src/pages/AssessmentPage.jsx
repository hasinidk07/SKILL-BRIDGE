
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  RotateCcw,
  Target,
  Loader2,
  AlertCircle,
  Brain,
} from 'lucide-react'

import { careers } from '../data/sampleData'
import {
  getRequirements,
  questionBank,
  calculateSkillGaps,
} from '../data/skillEngine'
import { useStudent } from '../context/StudentContext'

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100'

export default function AssessmentPage() {
  const { student, saveAssessment } = useStudent()

  const [career, setCareer] = useState(
    student.targetCareer || 'Software Developer'
  )

  const requirements = useMemo(
    () => getRequirements(career),
    [career]
  )

  const [answers, setAnswers] = useState({})
  const [ratings, setRatings] = useState(
    () => student.selfRatings || {}
  )
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [apiStatus, setApiStatus] = useState('')

  const questions = requirements.map((item) => ({
    skill: item.skill,
    ...questionBank[item.skill],
  }))

  const answeredCount = Object.keys(answers).filter(
    (key) => answers[key] !== undefined
  ).length

  const progress = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0

  function handleAnswerChange(skill, value) {
    setAnswers((previous) => ({
      ...previous,
      [skill]: Number(value),
    }))
  }

  function handleRatingChange(skill, value) {
    setRatings((previous) => ({
      ...previous,
      [skill]: Number(value),
    }))
  }

  async function submitAssessment(event) {
    event.preventDefault()

    if (answeredCount !== questions.length || submitting) {
      return
    }

    setSubmitting(true)
    setApiStatus('')

    const assessedSkills = Object.fromEntries(
      questions.map((question) => [
        question.skill,
        answers[question.skill] === question.answer ? 100 : 0,
      ])
    )

    const results = calculateSkillGaps(career, assessedSkills)

    const assessmentPayload = {
      targetCareer: career,
      assessedSkills,
      selfRatings: ratings,
      assessmentResults: results,
      readiness: results.coverage,
      skillsAssessed: results.assessedCount,
      skillsToBuild: results.missingSkills.length,
      assessmentDate: new Date().toISOString(),
    }

    // Save the assessment in the frontend first.
    saveAssessment(assessmentPayload)

    // Send the assessment to the FastAPI backend.
    try {
      const studentKey = (
        student.email || student.name || 'student'
      ).trim().toLowerCase()

      const response = await fetch(
        'http://127.0.0.1:8000/api/roadmap/generate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            student_key: studentKey,
            name: student.name || 'Student',
            career,
            assessed_skills: assessedSkills,
            requirements: requirements.map(
              ({ skill, required, weight }) => ({
                skill,
                required,
                weight,
              })
            ),
          }),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          errorText || `Server error: ${response.status}`
        )
      }

      const backendResult = await response.json()

      // Store the generated roadmap response locally as well.
      saveAssessment({
        ...assessmentPayload,
        roadmapResponse: backendResult,
        backendSynced: true,
      })

      setApiStatus('success')
    } catch (error) {
      console.error('Backend connection error:', error)
      setApiStatus('error')
    }

    setSubmitted(true)
    setSubmitting(false)
  }

  function resetAssessment() {
    setAnswers({})
    setSubmitted(false)
    setApiStatus('')
  }

  return (
    <div className="space-y-6">

      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-600">
            <Brain size={17} />
            Skill Assessment
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Discover your skill level
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Answer a few questions to identify your strengths
            and skills to improve.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <Target className="text-cyan-600" size={20} />
          <div>
            <p className="text-xs text-slate-500">
              Selected career
            </p>
            <p className="text-sm font-semibold text-slate-800">
              {career}
            </p>
          </div>
        </div>
      </div>

      {/* Assessment form */}
      <form onSubmit={submitAssessment} className="space-y-6">

        {/* Career selection */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-cyan-50 p-2.5 text-cyan-600">
              <Target size={21} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Choose your target career
              </h2>
              <p className="text-xs text-slate-500">
                Your questions will be based on this career.
              </p>
            </div>
          </div>

          <select
            className={fieldClass}
            value={career}
            disabled={submitted}
            onChange={(event) => {
              setCareer(event.target.value)
              setAnswers({})
              setSubmitted(false)
              setApiStatus('')
            }}
          >
            {careers.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Progress */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={19} className="text-cyan-600" />
              <h2 className="font-semibold text-slate-900">
                Assessment progress
              </h2>
            </div>

            <span className="text-sm font-semibold text-cyan-700">
              {answeredCount}/{questions.length} answered
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-cyan-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Complete all knowledge questions to submit your assessment.
          </p>
        </div>

        {/* Knowledge questions */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Knowledge check
            </h2>
            <p className="text-sm text-slate-500">
              Select the answer you think is correct.
            </p>
          </div>

          {questions.map((question, index) => (
            <div
              key={question.skill}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-lg bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                  Question {index + 1}
                </span>

                <span className="text-xs font-medium text-slate-500">
                  {question.skill}
                </span>
              </div>

              <h3 className="mb-4 font-semibold leading-relaxed text-slate-900">
                {question.question}
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                {question.options.map((option, optionIndex) => {
                  const selected =
                    answers[question.skill] === optionIndex

                  return (
                    <label
                      key={optionIndex}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${
                        selected
                          ? 'border-cyan-500 bg-cyan-50 text-cyan-800'
                          : 'border-slate-200 text-slate-700 hover:border-cyan-300 hover:bg-slate-50'
                      } ${
                        submitted
                          ? 'cursor-default'
                          : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.skill}
                        value={optionIndex}
                        checked={selected}
                        disabled={submitted}
                        onChange={() =>
                          handleAnswerChange(
                            question.skill,
                            optionIndex
                          )
                        }
                        className="h-4 w-4 accent-cyan-600"
                      />

                      <span>{option}</span>
                    </label>
                  )
                })}
              </div>

              {submitted && (
                <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm">
                  <p className="font-semibold text-slate-700">
                    {answers[question.skill] === question.answer
                      ? 'Correct answer!'
                      : 'Correct answer: ' +
                        question.options[question.answer]}
                  </p>

                  <p className="mt-1 text-slate-500">
                    {question.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Self assessment */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-bold text-slate-900">
              Self-confidence ratings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Rate your confidence in each skill from 0 to 100.
              These ratings are stored separately from your quiz scores.
            </p>
          </div>

          <div className="space-y-5">
            {requirements.map((item) => (
              <div key={item.skill}>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    {item.skill}
                  </label>

                  <span className="text-sm font-semibold text-cyan-700">
                    {ratings[item.skill] ?? 50}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={ratings[item.skill] ?? 50}
                  disabled={submitted}
                  onChange={(event) =>
                    handleRatingChange(
                      item.skill,
                      event.target.value
                    )
                  }
                  className="w-full accent-cyan-600"
                />

                <div className="flex justify-between text-xs text-slate-400">
                  <span>Beginner</span>
                  <span>Confident</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit buttons */}
        {!submitted ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={
                answeredCount !== questions.length || submitting
              }
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting assessment...
                </>
              ) : (
                <>
                  Submit assessment
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={resetAssessment}
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <RotateCcw size={17} />
              Reset
            </button>
          </div>
        ) : (
          /* Submission result */
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="flex items-start gap-3">
              <CheckCircle2
                className="mt-1 shrink-0 text-emerald-600"
                size={25}
              />

              <div className="flex-1">
                <h2 className="font-bold text-emerald-900">
                  Assessment completed!
                </h2>

                <p className="mt-1 text-sm text-emerald-800">
                  Your skill assessment has been saved.
                  You can now view your skill gaps.
                </p>

                {apiStatus === 'success' && (
                  <p className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-800">
                    <CheckCircle2 size={16} />
                    Successfully connected to the backend.
                    Your roadmap has been generated.
                  </p>
                )}

                {apiStatus === 'error' && (
                  <p className="mt-3 flex items-start gap-2 text-sm text-amber-800">
                    <AlertCircle size={17} className="mt-0.5 shrink-0" />
                    Your assessment is saved locally, but the backend
                    could not be reached. Check that your FastAPI
                    server is running.
                  </p>
                )}

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-slate-500">
                      Career readiness
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {calculateSkillGaps(career, Object.fromEntries(
                        questions.map((question) => [
                          question.skill,
                          answers[question.skill] === question.answer
                            ? 100
                            : 0,
                        ])
                      )).coverage}%
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-slate-500">
                      Skills to improve
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {calculateSkillGaps(career, Object.fromEntries(
                        questions.map((question) => [
                          question.skill,
                          answers[question.skill] === question.answer
                            ? 100
                            : 0,
                        ])
                      )).missingSkills.length}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to="/skill-gaps"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    View skill gaps
                    <ArrowRight size={17} />
                  </Link>

                  <button
                    type="button"
                    onClick={resetAssessment}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
                  >
                    <RotateCcw size={16} />
                    Retake assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Assessment information */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <ClipboardCheck
              size={19}
              className="text-cyan-600"
            />
            <h3 className="font-semibold text-slate-900">
              How it works
            </h3>
          </div>

          <p className="text-sm leading-relaxed text-slate-500">
            Your answers are evaluated against illustrative
            career skill benchmarks. The platform identifies
            skills that need improvement and prioritizes them
            for your learning roadmap.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <Target size={19} className="text-cyan-600" />
            <h3 className="font-semibold text-slate-900">
              Assessment details
            </h3>
          </div>

          <ul className="space-y-2 text-sm text-slate-500">
            <li>• {questions.length} knowledge questions</li>
            <li>• {requirements.length} career-related skills</li>
            <li>• Self-confidence ratings</li>
            <li>• Personalized skill-gap analysis</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
