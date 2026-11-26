
import { useCallback, useEffect, useState } from 'react'
import {
  Plus,
  Briefcase,
  ExternalLink,
  CalendarDays,
  LoaderCircle,
  Trash2,
  FolderOpen,
  X
} from 'lucide-react'
import { useStudent } from '../context/StudentContext'

const API_URL = 'https://skill-bridge-y9zr.onrender.com'

function formatDate(value) {
  if (!value) return 'Recently added'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Recently added'
    : date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
}

function ProjectsPage() {
  const { student } = useStudent()

  const studentKey = (
    student?.email || student?.name || 'student'
  ).trim().toLowerCase()

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    skills_used: '',
    project_url: '',
    status: 'Completed'
  })

  const loadProjects = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${API_URL}/api/passport/${encodeURIComponent(studentKey)}`
      )

      if (!response.ok) {
        const result = await response.json().catch(() => ({}))
        throw new Error(result.detail || 'Unable to load projects.')
      }

      const data = await response.json()
      setProjects(data.projects || [])
    } catch (err) {
      setError(err.message || 'Could not connect to the backend.')
    } finally {
      setLoading(false)
    }
  }, [studentKey])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  function updateField(event) {
    const { name, value } = event.target
    setForm(previous => ({
      ...previous,
      [name]: value
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        student_key: studentKey,
        title: form.title.trim(),
        description: form.description.trim(),
        skills_used: form.skills_used
          .split(',')
          .map(skill => skill.trim())
          .filter(Boolean),
        project_url: form.project_url.trim(),
        status: form.status
      }

      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result.detail || 'Unable to save project.')
      }

      setForm({
        title: '',
        description: '',
        skills_used: '',
        project_url: '',
        status: 'Completed'
      })

      setShowForm(false)
      setSuccess('Project saved successfully!')
      await loadProjects()
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-indigo-600 mb-2">
            YOUR EXPERIENCE
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            My Projects
          </h1>
          <p className="text-slate-500 mt-2">
            Showcase your work and build your professional portfolio.
          </p>
        </div>

        <button
          onClick={() => {
            setSuccess('')
            setError('')
            setShowForm(true)
          }}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-indigo-700"
        >
          <Plus size={19} />
          Add Project
        </button>
      </div>

      {/* Feedback */}
      {success && (
        <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl p-4">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-100 rounded-xl p-4">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
            <Briefcase size={23} />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-4">
            {projects.length}
          </p>
          <p className="text-sm text-slate-500 mt-1">Total projects</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="p-3 bg-violet-50 text-violet-600 rounded-xl w-fit">
            <FolderOpen size={23} />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-4">
            {projects.filter(project => project.status === 'Completed').length}
          </p>
          <p className="text-sm text-slate-500 mt-1">Completed projects</p>
        </div>
      </div>

      {/* Add Project Form */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Add a New Project
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Enter your project details below.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              aria-label="Close form"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Project Title *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={updateField}
                required
                maxLength={200}
                placeholder="Example: Student Management System"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Project Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={updateField}
                rows={4}
                placeholder="Describe what your project does..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Skills Used
              </label>
              <input
                name="skills_used"
                value={form.skills_used}
                onChange={updateField}
                placeholder="React, Python, HTML, CSS"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-slate-400 mt-2">
                Separate each skill with a comma.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Project URL
              </label>
              <input
                name="project_url"
                type="url"
                value={form.project_url}
                onChange={updateField}
                placeholder="https://github.com/username/project"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Project Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={updateField}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Planned">Planned</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Save Project
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Project List */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900">
            Your Portfolio
          </h2>
          <span className="text-sm text-slate-400">
            {projects.length} projects
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <LoaderCircle className="animate-spin text-indigo-600" size={32} />
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl py-16 text-center">
            <FolderOpen size={42} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-800">
              No projects yet
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Add your first project to start building your portfolio.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-5 inline-flex items-center gap-2 text-indigo-600 font-semibold"
            >
              <Plus size={18} />
              Add your first project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map(project => (
              <article
                key={project.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                    <Briefcase size={23} />
                  </div>

                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                    project.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {project.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-5">
                  {project.title}
                </h3>

                <p className="text-sm text-slate-500 mt-2 leading-6">
                  {project.description || 'No description provided.'}
                </p>

                {project.skills_used && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.skills_used.split(',').map((skill, index) => (
                      <span
                        key={index}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-100">
                  <span className="flex items-center gap-2 text-xs text-slate-400">
                    <CalendarDays size={14} />
                    {formatDate(project.created_at)}
                  </span>

                  {project.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-indigo-600 flex items-center gap-1"
                    >
                      View project <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default ProjectsPage
