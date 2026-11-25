
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, LockKeyhole, ArrowRight, GraduationCap, Eye, EyeOff } from 'lucide-react'
import Logo from '../components/Logo'
import { useStudent } from '../context/StudentContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuthenticatedUser } = useStudent()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: form.email.trim(),
            password: form.password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Unable to sign in')
      }

      setAuthenticatedUser(data.student, data.access_token)
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

  return (
    <div className="min-h-screen bg-[#f5f8fc]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">
          Back to home
        </Link>
      </header>

      <main className="mx-auto grid max-w-5xl gap-8 px-5 py-10 lg:grid-cols-2 lg:items-center">
        <section className="rounded-3xl bg-[#101827] p-8 text-white sm:p-10">
          <span className="inline-flex rounded-xl bg-cyan-300/10 p-3 text-cyan-300">
            <GraduationCap size={28} />
          </span>

          <p className="mt-8 text-xs font-bold tracking-widest text-cyan-300">
            WELCOME BACK
          </p>

          <h1 className="mt-3 text-4xl font-bold leading-tight">
            Your career journey continues here.
          </h1>

          <p className="mt-5 text-sm leading-7 text-slate-400">
            Sign in to continue learning, follow your roadmap,
            track your progress and build your Skill Passport.
          </p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Sign in to SkillBridge
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Enter your registered email and password.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-slate-700">
                Email address
              </span>

              <span className="relative block">
                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@college.edu"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-slate-700">
                Password
              </span>

              <span className="relative block">
                <LockKeyhole size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-12 text-sm text-slate-900 outline-none focus:border-cyan-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            {error && (
              <p role="alert" className="rounded-lg bg-rose-50 p-3 text-xs text-rose-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-cyan-700 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-cyan-700 hover:text-cyan-900">
              Sign up
            </Link>
          </p>
        </section>
      </main>
    </div>
  )
}
