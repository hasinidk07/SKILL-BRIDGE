
import { useEffect, useState } from 'react'
import {
  User,
  GraduationCap,
  Target,
  Save,
  RotateCcw,
  CheckCircle2
} from 'lucide-react'
import { useStudent } from '../context/StudentContext'
import { careers } from '../data/sampleData'

export default function SettingsPage() {
  const { student, setStudent } = useStudent()

  const [form, setForm] = useState({
    name: student.name || '',
    email: student.email || '',
    department: student.department || '',
    year: student.year || '',
    college: student.college || '',
    career: student.targetCareer || student.career || 'Software Developer'
  })

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm({
      name: student.name || '',
      email: student.email || '',
      department: student.department || '',
      year: student.year || '',
      college: student.college || '',
      career: student.targetCareer || student.career || 'Software Developer'
    })
  }, [student])

  function handleChange(event) {
    const { name, value } = event.target
    setForm(current => ({ ...current, [name]: value }))
    setSaved(false)
  }

  function handleSave(event) {
    event.preventDefault()

    setStudent(current => ({
      ...current,
      ...form,
      avatar: form.name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(part => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      career: form.career,
      targetCareer: form.career
    }))

    setSaved(true)
  }

  function handleReset() {
    setForm({
      name: student.name || '',
      email: student.email || '',
      department: student.department || '',
      year: student.year || '',
      college: student.college || '',
      career: student.targetCareer || student.career || 'Software Developer'
    })
    setSaved(false)
  }

  const inputClass =
    'mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100'

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      <div>
        <p className="text-xs font-bold uppercase tracking-[.15em] text-cyan-700">
          Account preferences
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Settings
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Manage your student profile and career preferences.
        </p>
      </div>

      {/* Profile overview */}
      <section className="flex items-center gap-4 rounded-2xl bg-[#101827] p-6 text-white">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 text-xl font-bold text-slate-950">
          {student.avatar || 'ST'}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold">
            {student.name || 'Student'}
          </h3>
          <p className="truncate text-sm text-slate-400">
            {student.email || 'No email added'}
          </p>
          <p className="mt-1 text-xs text-cyan-300">
            SkillBridge Student
          </p>
        </div>
      </section>

      {/* Edit profile */}
      <form onSubmit={handleSave} className="space-y-5">

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <User size={20} className="text-cyan-700" />
            <h3 className="font-bold text-slate-900">
              Personal information
            </h3>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-600">
                Full name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">
                Email address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">
                Department
              </label>
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                className={inputClass}
                placeholder="Your department"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">
                Academic year
              </label>
              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select academic year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-600">
                College name
              </label>
              <input
                name="college"
                value={form.college}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter your college name"
              />
            </div>
          </div>
        </section>

        {/* Career preference */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Target size={20} className="text-cyan-700" />
            <h3 className="font-bold text-slate-900">
              Career preferences
            </h3>
          </div>

          <label className="text-xs font-semibold text-slate-600">
            Target career
          </label>

          <select
            name="career"
            value={form.career}
            onChange={handleChange}
            className={inputClass}
          >
            {careers.map(career => (
              <option key={career.name} value={career.name}>
                {career.name}
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Changing your target career updates your profile preference.
            Complete a new assessment to calculate readiness for that career.
          </p>
        </section>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <RotateCcw size={16} />
            Reset changes
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-cyan-800"
          >
            <Save size={16} />
            Save changes
          </button>
        </div>

        {saved && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
            <CheckCircle2 size={18} />
            Profile settings saved successfully!
          </div>
        )}
      </form>

      {/* Account information */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <GraduationCap size={20} className="text-cyan-700" />
          <h3 className="font-bold text-slate-900">Account information</h3>
        </div>

        <p className="mt-3 text-sm text-slate-500">
          Your profile preferences are saved in this browser using local
          storage. They will remain available when you reopen SkillBridge
          in the same browser.
        </p>
      </section>
    </div>
  )
}
