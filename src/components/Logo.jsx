import { Link } from 'react-router-dom'
import { Network } from 'lucide-react'

export default function Logo({ light = false, onClick }) {
  return <Link to="/" onClick={onClick} className={`inline-flex items-center gap-2.5 font-bold tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
    <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-blue-500/20"><Network size={19} /></span>
    <span className="text-xl">Skill<span className="text-cyan-500">Bridge</span></span>
  </Link>
}