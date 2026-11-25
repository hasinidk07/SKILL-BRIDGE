import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Compass, ClipboardCheck, GitBranch, Map, Award, ArrowLeftRight, FolderKanban, ChartNoAxesCombined, Settings, LogOut, X, ChevronLeft } from 'lucide-react'
import Logo from './Logo'
import { useStudent } from '../context/StudentContext'

const groups = [
  { label: 'WORKSPACE', items: [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Explore careers', to: '/careers', icon: Compass },
    { label: 'Skill assessment', to: '/assessment', icon: ClipboardCheck },
    { label: 'Skill gap analysis', to: '/skill-gaps', icon: GitBranch },
  ]},
  { label: 'MY DEVELOPMENT', items: [
    { label: 'Learning roadmap', to: '/roadmap', icon: Map },
    { label: 'Skill Passport', to: '/passport', icon: Award },
    { label: 'Career comparison', to: '/compare', icon: ArrowLeftRight },
    { label: 'Mini projects', to: '/projects', icon: FolderKanban },
    { label: 'My progress', to: '/progress', icon: ChartNoAxesCombined },
  ]},
]

export default function Sidebar({ open, onClose, collapsed, setCollapsed }) {
  const { student } = useStudent()
  const navigate = useNavigate()
  return <>
    {open && <button aria-label="Close menu overlay" onClick={onClose} className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden" />}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col border-r border-slate-800 bg-[#101827] text-slate-300 transition-all duration-200 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} ${collapsed ? 'lg:w-[82px]' : ''}`}>
      <div className="flex h-[76px] items-center justify-between border-b border-white/8 px-5">
        <Logo light onClick={onClose} />
        <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"><X size={18}/></button>
        <button onClick={() => setCollapsed(!collapsed)} className="hidden rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:block" title="Collapse sidebar"><ChevronLeft size={17} className={collapsed ? 'rotate-180' : ''}/></button>
      </div>
      <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-6">
        {groups.map(group => <div key={group.label}>
          {!collapsed && <p className="mb-3 px-3 text-[10px] font-bold tracking-[.16em] text-slate-500">{group.label}</p>}
          <div className="space-y-1">{group.items.map(item => {
            const Icon = item.icon
            return <NavLink key={item.to} to={item.to} onClick={onClose} title={collapsed ? item.label : undefined}
              className={({isActive}) => `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${isActive ? 'bg-cyan-400/12 text-cyan-300 ring-1 ring-cyan-300/15' : 'text-slate-400 hover:bg-white/6 hover:text-white'} ${collapsed ? 'justify-center' : ''}`}>
              <Icon size={18} className="shrink-0"/>{!collapsed && <span>{item.label}</span>}
              {!collapsed && item.label === 'Skill assessment' && <span className="ml-auto rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] text-blue-300">New</span>}
            </NavLink>
          })}</div>
        </div>)}
      </nav>
      <div className="border-t border-white/8 p-3">
        <NavLink to="/settings" onClick={onClose} className={({isActive}) => `mb-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/6 hover:text-white'}`}><Settings size={18}/>{!collapsed && 'Settings'}</NavLink>
        <div className={`flex items-center gap-3 rounded-xl bg-white/5 p-2.5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 text-xs font-bold text-slate-950">{student.avatar}</div>
          {!collapsed && <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-white">{student.name}</p><p className="truncate text-[10px] text-slate-500">{student.year}</p></div>}
          {!collapsed && <button title="Back to home" onClick={() => navigate('/')} className="text-slate-500 hover:text-white"><LogOut size={15}/></button>}
        </div>
      </div>
    </aside>
  </>
}