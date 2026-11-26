
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Compass,
  Target,
  Route,
  Sparkles,
  GraduationCap,
  Code2,
  Cpu,
  Database,
  BrainCircuit,
  Wifi,
  CircuitBoard,
  Bot,
  Radio
} from 'lucide-react'
import Logo from '../components/Logo'

const roles = [
  { name: 'Software Developer', icon: Code2 },
  { name: 'Data Analyst', icon: Database },
  { name: 'AI/ML Engineer', icon: BrainCircuit },
  { name: 'Embedded Systems', icon: Cpu },
  { name: 'IoT Developer', icon: Wifi },
  { name: 'VLSI Design', icon: CircuitBoard },
  { name: 'Robotics Engineer', icon: Bot },
  { name: 'Telecommunications', icon: Radio },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#0c1524] text-white">

      {/* HEADER */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo light />

        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#how-it-works" className="hover:text-white">
            How it works
          </a>
          <a href="#careers" className="hover:text-white">
            Career paths
          </a>
          <a href="#why-skillbridge" className="hover:text-white">
            Why SkillBridge
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/8"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            Sign Up
          </Link>
        </div>
      </header>

      <main>

        {/* HERO SECTION */}
        <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:pb-32 lg:pt-24">

          <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-blue-600/20 blur-[110px]" />
          <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-cyan-400/10 blur-[110px]" />

          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-cyan-200">
              <Sparkles size={13} />
              YOUR SKILLS. YOUR NEXT STEP.
            </div>

            <h1 className="max-w-2xl text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-[62px]">
              Bridge the gap between{' '}
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                learning
              </span>{' '}
              and your career.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
              Know where you stand. Discover the skills your dream career expects.
              Follow a learning roadmap built around you.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/15 transition hover:-translate-y-0.5 hover:bg-cyan-300"
              >
                Start your journey
                <ArrowRight size={17} />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-white/5"
              >
                See how it works
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-cyan-400" />
                Skill-based guidance
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-cyan-400" />
                Personalized roadmaps
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-cyan-400" />
                No paid AI required
              </span>
            </div>
          </div>

          {/* SAMPLE DASHBOARD PREVIEW */}
          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="absolute -inset-5 rounded-[32px] bg-gradient-to-br from-cyan-500/15 to-blue-600/10 blur-2xl" />

            <div className="relative rounded-[26px] border border-white/10 bg-[#152236] p-5 shadow-2xl shadow-black/30 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">CAREER READINESS</p>
                  <p className="mt-1 text-lg font-semibold">Your progress snapshot</p>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                  Sample profile
                </span>
              </div>

              <div className="mt-7 flex items-center gap-6">
                <div
                  className="relative grid h-32 w-32 shrink-0 place-items-center rounded-full"
                  style={{
                    background: 'conic-gradient(#22d3ee 0deg 244deg, #29384d 244deg 360deg)'
                  }}
                >
                  <div className="grid h-[104px] w-[104px] place-items-center rounded-full bg-[#152236]">
                    <div className="text-center">
                      <p className="text-3xl font-bold">68%</p>
                      <p className="text-[10px] text-slate-400">Readiness</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Skills assessed</span>
                      <b>8 / 12</b>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-slate-700">
                      <div className="h-1.5 w-2/3 rounded-full bg-cyan-400" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Roadmap progress</span>
                      <b>42%</b>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-slate-700">
                      <div className="h-1.5 w-[42%] rounded-full bg-violet-400" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Weekly learning</span>
                      <b>4.5 hrs</b>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-slate-700">
                      <div className="h-1.5 w-3/4 rounded-full bg-emerald-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-white/8 bg-[#101c2d] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold">Top skill gaps</p>
                  <span className="text-[10px] text-cyan-300">
                    View analysis →
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    ['React', 48],
                    ['SQL', 42],
                    ['API development', 28]
                  ].map(([skill, value]) => (
                    <div key={skill}>
                      <div className="mb-1 flex justify-between text-[11px]">
                        <span className="text-slate-300">{skill}</span>
                        <span className="text-slate-500">{value}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-700">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl bg-cyan-400/8 p-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-300/10 text-cyan-300">
                  <Route size={18} />
                </span>
                <div>
                  <p className="text-xs font-semibold">Next recommended step</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Complete React fundamentals
                  </p>
                </div>
                <ArrowUpRight size={16} className="ml-auto text-cyan-300" />
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="border-y border-white/8 bg-[#111e30] px-5 py-20 sm:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold tracking-[.2em] text-cyan-300">
                A CLEAR PATH FORWARD
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                From unsure to industry-ready
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                A simple, guided journey that turns career goals into practical next steps.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  n: '01',
                  t: 'Discover',
                  d: 'Explore career paths and understand what each role involves.',
                  I: Compass
                },
                {
                  n: '02',
                  t: 'Assess',
                  d: 'Check your current knowledge with focused skill quizzes.',
                  I: Target
                },
                {
                  n: '03',
                  t: 'Bridge',
                  d: 'Find your skill gaps and get a prioritized learning roadmap.',
                  I: Route
                },
                {
                  n: '04',
                  t: 'Showcase',
                  d: 'Build projects, track progress and grow your Skill Passport.',
                  I: GraduationCap
                }
              ].map(({ n, t, d, I }) => (
                <div
                  key={n}
                  className="rounded-2xl border border-white/8 bg-[#152236] p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300">{n}</span>
                    <I size={20} className="text-slate-400" />
                  </div>
                  <h3 className="mt-7 text-lg font-semibold">{t}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CAREER PATHS */}
        <section
          id="careers"
          className="mx-auto max-w-7xl px-5 py-20 sm:px-8"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold tracking-[.2em] text-cyan-300">
                EXPLORE YOUR OPTIONS
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Eight paths. One starting point.
              </h2>
              <p className="mt-3 text-sm text-slate-400">
                Explore technical career directions across software and core engineering.
              </p>
            </div>

            <Link
              to="/careers"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
            >
              Explore all careers
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {roles.map(({ name, icon: Icon }) => (
              <Link
                to="/careers"
                key={name}
                className="group flex items-center gap-3 rounded-2xl border border-slate-800 bg-[#111e30] p-4 transition hover:-translate-y-1 hover:border-cyan-400/40"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  <Icon size={19} />
                </span>
                <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-200">
                  {name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section id="why-skillbridge" className="px-5 pb-20 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-3xl border border-cyan-300/15 bg-gradient-to-r from-[#142c42] to-[#17243b] p-8 sm:flex-row sm:p-12">
            <div>
              <p className="text-xs font-bold tracking-[.2em] text-cyan-300">
                YOUR NEXT CHAPTER STARTS HERE
              </p>
              <h2 className="mt-3 max-w-xl text-3xl font-bold">
                Don't just collect skills. Build the right ones.
              </h2>
              <p className="mt-3 text-sm text-slate-400">
                Make your learning purposeful with SkillBridge.
              </p>
            </div>

            <Link
              to="/register"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-cyan-300"
            >
              Create your profile
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/8 px-5 py-7 text-center text-xs text-slate-500">
        © 2026 SkillBridge · Connecting student potential with industry expectations.
      </footer>
    </div>
  )
}