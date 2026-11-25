
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Brain,
  CheckCircle2,
  GraduationCap,
  LayoutDashboard,
  Route,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react'
import Logo from '../components/Logo'

const features = [
  {
    icon: Brain,
    title: 'Discover your skill gaps',
    description:
      'Understand your current skills and identify what you need to improve for your dream career.',
  },
  {
    icon: Route,
    title: 'Personalized learning roadmap',
    description:
      'Get a structured learning path with practical tasks designed around your career goals.',
  },
  {
    icon: Target,
    title: 'Track your progress',
    description:
      'Monitor your learning journey, complete tasks, and see how your skills improve over time.',
  },
  {
    icon: BookOpen,
    title: 'Learn by doing',
    description:
      'Build practical projects and strengthen your knowledge through hands-on experience.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Create your account',
    description: 'Sign up and tell us about your learning and career goals.',
  },
  {
    number: '02',
    title: 'Assess your skills',
    description: 'Complete a skill assessment to understand your current level.',
  },
  {
    number: '03',
    title: 'Follow your roadmap',
    description: 'Work through personalized tasks and track your progress.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#07111f] text-white">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -right-40 top-72 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 border-b border-white/10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <Link to="/" className="flex items-center gap-3">
            <Logo />
            <span className="text-xl font-bold tracking-tight">
              Skill<span className="text-cyan-400">Bridge</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        {/* Hero section */}
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
              <Sparkles size={16} />
              Your career journey starts here
            </div>

            <h1 className="max-w-2xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Turn your skills into your{' '}
              <span className="text-cyan-400">future.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
              Discover your skill gaps, explore career opportunities, and
              follow a personalized learning roadmap to become career-ready.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-cyan-300"
              >
                Get started
                <ArrowRight size={19} />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                Sign in
                <ArrowUpRight size={18} />
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 border-t border-white/10 pt-7">
              <div>
                <p className="text-2xl font-bold text-white">01</p>
                <p className="mt-1 text-sm text-slate-500">Know your skills</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">02</p>
                <p className="mt-1 text-sm text-slate-500">Build your roadmap</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">03</p>
                <p className="mt-1 text-sm text-slate-500">Achieve your goals</p>
              </div>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-cyan-400/10 blur-3xl" />

            <div className="relative rounded-3xl border border-white/10 bg-[#101e30] p-5 shadow-2xl sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-sm text-slate-400">Your learning overview</p>
                  <h3 className="mt-1 text-xl font-bold">Welcome back!</h3>
                </div>
                <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-300">
                  <GraduationCap size={25} />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-[#17283c] p-4">
                  <div className="flex items-center justify-between">
                    <Target className="text-cyan-400" size={21} />
                    <TrendingUp className="text-emerald-400" size={17} />
                  </div>
                  <p className="mt-4 text-3xl font-bold">75%</p>
                  <p className="mt-1 text-xs text-slate-400">Career readiness</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#17283c] p-4">
                  <BookOpen className="text-blue-400" size={21} />
                  <p className="mt-4 text-3xl font-bold">12</p>
                  <p className="mt-1 text-xs text-slate-400">Tasks completed</p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-[#17283c] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Learning progress</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Keep moving towards your goal
                    </p>
                  </div>
                  <span className="text-sm font-bold text-cyan-300">75%</span>
                </div>

                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-700">
                  <div className="h-full w-3/4 rounded-full bg-cyan-400" />
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-[#17283c] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-semibold">Your next steps</p>
                  <span className="text-xs text-cyan-300">View roadmap</span>
                </div>

                {[
                  'Complete skill assessment',
                  'Learn JavaScript fundamentals',
                  'Build your first project',
                ].map((task, index) => (
                  <div
                    key={task}
                    className="flex items-center gap-3 border-t border-white/5 py-3 first:border-0"
                  >
                    {index === 0 ? (
                      <CheckCircle2 className="text-emerald-400" size={19} />
                    ) : (
                      <div className="h-[19px] w-[19px] rounded-full border border-slate-500" />
                    )}
                    <span
                      className={`text-sm ${
                        index === 0
                          ? 'text-slate-400 line-through'
                          : 'text-slate-200'
                      }`}
                    >
                      {task}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4">
                <Zap className="shrink-0 text-cyan-300" size={21} />
                <p className="text-sm text-slate-300">
                  Small steps every day can bring you closer to your career
                  goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="border-y border-white/10 bg-[#0b1727]/80">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
                What SkillBridge offers
              </p>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                Everything you need to move forward
              </h2>
              <p className="mt-5 leading-7 text-slate-400">
                A structured platform to help you understand your abilities,
                develop new skills, and prepare for your chosen career.
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon

                return (
                  <div
                    key={feature.title}
                    className="group rounded-2xl border border-white/10 bg-[#101e30] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40"
                  >
                    <div className="inline-flex rounded-xl bg-cyan-400/10 p-3 text-cyan-300 transition group-hover:bg-cyan-400 group-hover:text-slate-950">
                      <Icon size={24} />
                    </div>

                    <h3 className="mt-6 text-lg font-bold">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              Simple process
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              How SkillBridge works
            </h2>
            <p className="mt-5 text-slate-400">
              Three simple steps to start building your future.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-white/10 bg-[#101e30] p-7"
              >
                <p className="text-4xl font-extrabold text-cyan-400/40">
                  {step.number}
                </p>
                <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 leading-7 text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to action */}
        <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
          <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-[#12324a] to-[#102035] px-7 py-14 text-center sm:px-14">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative">
              <div className="mx-auto inline-flex rounded-2xl bg-cyan-400/10 p-4 text-cyan-300">
                <GraduationCap size={30} />
              </div>

              <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-bold sm:text-4xl">
                Your future is built one skill at a time.
              </h2>

              <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-300">
                Start your SkillBridge journey today and take the next step
                towards your career goals.
              </p>

              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-7 py-4 font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-cyan-300"
              >
                Create your account
                <ArrowRight size={19} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-8 sm:flex-row lg:px-10">
          <Link to="/" className="flex items-center gap-3">
            <Logo />
            <span className="font-bold">
              Skill<span className="text-cyan-400">Bridge</span>
            </span>
          </Link>

          <p className="text-center text-sm text-slate-500">
            Helping students bridge the gap between skills and careers.
          </p>

          <div className="flex gap-5 text-sm text-slate-400">
            <Link to="/login" className="transition hover:text-cyan-300">
              Sign in
            </Link>
            <Link to="/register" className="transition hover:text-cyan-300">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
