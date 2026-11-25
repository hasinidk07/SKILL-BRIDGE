import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu, Bell, Search, ChevronDown } from 'lucide-react'
import Sidebar from './Sidebar'
import { useStudent } from '../context/StudentContext'

const titles = {
  '/dashboard': ['Dashboard', 'Here’s your career readiness at a glance.'],
  '/careers': ['Explore careers', 'Discover roles that match your interests.'],
  '/assessment': ['Skill assessment', 'Check what you know with practical quizzes.'],
  '/skill-gaps': ['Skill gap analysis', 'Understand what stands between you and your goal.'],
  '/roadmap': ['Learning roadmap', 'A focused plan to move your skills forward.'],
  '/passport': ['Skill Passport', 'Your growing record of demonstrated skills.'],
  '/compare': ['Career comparison', 'Compare the skills required across career paths.'],
  '/projects': ['Mini projects', 'Turn your learning into practical experience.'],
  '/progress': ['My progress', 'See how your learning journey is developing.'],
  '/settings': ['Settings', 'Manage your student profile.'],
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const { student } = useStudent()
  const location = useLocation()
  const [title, subtitle] = titles[location.pathname] || titles['/dashboard']
  return <div className="min-h-screen bg-[#f5f8fc]">
    <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={collapsed} setCollapsed={setCollapsed}/>
    <div className={`min-h-screen transition-all duration-200 ${collapsed ? 'lg:pl-[82px]' : 'lg:pl-[264px]'}`}>
      <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-7">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"><Menu size={21}/></button>
          <div><h1 className="text-base font-bold text-slate-900 sm:text-lg">{title}</h1><p className="hidden text-xs text-slate-500 sm:block">{subtitle}</p></div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-400 md:flex"><Search size={15}/> Search anything <kbd className="ml-5 rounded border bg-white px-1.5 py-0.5 text-[10px]">⌘ K</kbd></button>
          <button aria-label="Notifications" className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"><Bell size={18}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-500 ring-2 ring-white"/></button>
          <div className="flex items-center gap-2 border-l border-slate-200 pl-3"><div className="grid h-8 w-8 place-items-center rounded-full bg-cyan-100 text-[11px] font-bold text-cyan-800">{student.avatar}</div><ChevronDown size={14} className="hidden text-slate-400 sm:block"/></div>
        </div>
      </header>
      <main className="mx-auto max-w-[1500px] p-4 sm:p-7"><Outlet/></main>
    </div>
  </div>
}