import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Construction, Compass } from 'lucide-react'
import { careers } from '../data/sampleData'

const content = {
  '/careers': ['Explore career paths', 'Choose a role to understand the skills commonly expected in that field.'],
  '/assessment': ['Skill assessment', 'Your technical knowledge checks will live here. Assessment results will distinguish demonstrated skills from self-reported skills.'],
  '/skill-gaps': ['Your skill gap analysis', 'Compare your assessed skill levels with the expectations for your selected career.'],
  '/roadmap': ['Your learning roadmap', 'A prioritized sequence of learning activities will be generated from your skill gaps.'],
  '/passport': ['Your Skill Passport', 'A shareable summary of skills you have demonstrated and projects you have completed.'],
  '/compare': ['Career comparison simulator', 'Compare two career paths side by side, including their required skills.'],
  '/projects': ['Mini project recommendations', 'Practise your skills with small projects linked to your roadmap.'],
  '/progress': ['Your learning progress', 'Track completed activities, assessment results and learning consistency.'],
  '/settings': ['Student profile settings', 'Review the profile details you entered during registration.'],
}
export default function PlaceholderPage() {
  const location = useLocation()
  const [title,description] = content[location.pathname] || ['Coming soon','This section is part of the SkillBridge prototype.']
  if (location.pathname === '/careers') return <div className="space-y-6"><div><p className="text-sm text-slate-500">Explore eight career paths across software, data and core engineering.</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{careers.map(c=><article key={c.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><span className="rounded-lg bg-cyan-50 px-2.5 py-1 text-[10px] font-bold text-cyan-800">{c.category}</span><Compass size={18} className="text-slate-400"/></div><h2 className="mt-4 text-base font-bold text-slate-900">{c.name}</h2><p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">{c.description}</p><p className="mt-4 text-[10px] font-bold uppercase tracking-wide text-slate-400">Common skill areas</p><div className="mt-2 flex flex-wrap gap-1.5">{c.skills.map(s=><span key={s} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] text-slate-600">{s}</span>)}</div><Link to="/assessment" className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-cyan-700 hover:text-cyan-900">Assess my skills <ArrowRight size={14}/></Link></article>)}</div></div>
  return <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-cyan-50 text-cyan-700"><Construction size={25}/></span><h2 className="mt-5 text-xl font-bold text-slate-900">{title}</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">{description}</p><div className="mt-7 rounded-xl bg-amber-50 px-4 py-3 text-left text-xs leading-5 text-amber-800">Phase 1–2 prototype: navigation and page structure are ready. The interactive assessment, gap engine, roadmap generation and tracking workflows are planned for the next development phases.</div><Link to="/dashboard" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white hover:bg-cyan-800">Back to dashboard <ArrowRight size={15}/></Link></div>
}