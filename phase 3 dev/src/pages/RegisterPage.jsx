
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  UserRound,
  Mail,
  Building2,
  BookOpen,
  Target,
  CheckCircle2,
  LockKeyhole,
  Eye,
  EyeOff,
} from 'lucide-react'

import Logo from '../components/Logo'
import { useStudent } from '../context/StudentContext'
import { careers } from '../data/sampleData'

const fields = [
  {
    name: 'name',
    label: 'Full name',
    placeholder: 'e.g. Aarav Sharma',
    icon: UserRound,
    required: true,
  },
  {
    name: 'email',
    label: 'College email',
    placeholder: 'you@college.edu',
    icon: Mail,
    type: 'email',
    required: true,
  },
  {
    name: 'college',
    label: 'College / Institution',
    placeholder: 'Your college name',
    icon: Building2,
    required: true,
  },
]

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    college: '',
    department: '',
    year: '1st Year',
    targetCareer: 'Software Developer',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { setAuthenticatedUser } = useStudent()
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError('')

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.college.trim() ||
      !form.department ||
      !form.year ||
      !form.targetCareer
    ) {
      setError('Please complete all fields to create your profile.')
      return
    }

    if (form.password.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            career: form.targetCareer,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Unable to create your account.'
        )
      }

      // Save the authenticated student and token.
      setAuthenticatedUser(
        data.student,
        data.access_token,
        {
          college: form.college.trim(),
          department: form.department,
          year: form.year,
        }
      )

      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to SkillBridge server. Please start the backend.'
          : err.message
      )
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10'

  return (
    <div className="min-h-screen bg-[#f5f8fc]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-5 lg:grid-cols-[.85fr_1.15fr] lg:items-start lg:pt-12">

        {/* Left information panel */}
        <section className="rounded-3xl bg-[#101827] p-7 text-white sm:p-9">
          <span className="inline-flex rounded-xl bg-cyan-300/10 p-3 text-cyan-300">
            <GraduationCap size={25} />
          </span>

          <p className="mt-7 text-xs font-bold tracking-[.18em] text-cyan-300">
            YOUR CAREER JOURNEY
          </p>

          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
            Let's build your bridge to what's next.
          </h1>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            Create your student profile to start understanding your skills,
            exploring career paths and planning your next steps.
          </p>

          <div className="mt-9 space-y-5">
            {[
              ['01', 'Tell us about yourself'],
              ['02', 'Choose a career direction'],
              ['03', 'Discover your skill gaps'],
            ].map(([n, t]) => (
              <div key={n} className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-cyan-300/25 text-xs font-bold text-cyan-300">
                  {n}
                </span>

                <span className="text-sm text-slate-300">{t}</span>

                <CheckCircle2
                  size={16}
                  className="ml-auto text-slate-600"
                />
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-white/8 bg-white/5 p-4">
            <p className="text-xs font-semibold">
              A note about your profile
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Your career choice is a starting point, not a permanent
              decision. You can explore and compare other paths later.
            </p>
          </div>
        </section>

        {/* Registration form */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <div>
            <p className="text-xs font-bold tracking-[.16em] text-cyan-600">
              GET STARTED — IT'S FREE
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Create your student profile
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              A few details help us make your experience relevant.
            </p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-5">

            {/* Name, email and college */}
            {fields.map(
              ({ name, label, placeholder, icon: Icon, type = 'text' }) => (
                <label key={name} className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-700">
                    {label} <span className="text-rose-500">*</span>
                  </span>

                  <span className="relative block">
                    <Icon
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={type}
                      required
                      value={form[name]}
                      onChange={(e) =>
                        setForm({ ...form, [name]: e.target.value })
                      }
                      placeholder={placeholder}
                      className={inputClass}
                    />
                  </span>
                </label>
              )
            )}

            {/* Department and year */}
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-slate-700">
                  Department <span className="text-rose-500">*</span>
                </span>

                <span className="relative block">
                  <BookOpen
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    required
                    value={form.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-cyan-500"
                  >
                    <option value="">Select department</option>

                    {[
                      'Computer Science Engineering',
                      'Information Technology',
                      'Electronics and Communication',
                      'Electrical and Electronics',
                      'Mechanical Engineering',
                      'Other',
                    ].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-slate-700">
                  Current year <span className="text-rose-500">*</span>
                </span>

                <select
                  required
                  value={form.year}
                  onChange={(e) =>
                    setForm({ ...form, year: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:border-cyan-500"
                >
                  {[
                    '1st Year',
                    '2nd Year',
                    '3rd Year',
                    '4th Year',
                    'Recent Graduate',
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
            </div>

            {/* Career */}
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-slate-700">
                Career you're interested in{' '}
                <span className="text-rose-500">*</span>
              </span>

              <span className="relative block">
                <Target
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  required
                  value={form.targetCareer}
                  onChange={(e) =>
                    setForm({ ...form, targetCareer: e.target.value })
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-cyan-500"
                >
                  {careers.map((c) => (
                    <option key={c.name}>{c.name}</option>
                  ))}
                </select>
              </span>
            </label>

            {/* Password */}
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-slate-700">
                Password <span className="text-rose-500">*</span>
              </span>

              <span className="relative block">
                <LockKeyhole
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="At least 8 characters"
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>

            {/* Confirm password */}
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-slate-700">
                Confirm password <span className="text-rose-500">*</span>
              </span>

              <span className="relative block">
                <LockKeyhole
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  placeholder="Enter your password again"
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </span>
            </label>

            {/* Error */}
            {error && (
              <p role="alert" className="text-xs font-medium text-rose-600">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create account & open dashboard'}
              {!loading && <ArrowRight size={17} />}
            </button>

            <p className="text-center text-xs text-slate-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-cyan-700 hover:text-cyan-900"
              >
                Sign in
              </Link>
            </p>

            <p className="text-center text-[11px] text-slate-400">
              Your password is securely hashed by the backend.
            </p>
          </form>
        </section>
      </main>
    </div>
  )
}
