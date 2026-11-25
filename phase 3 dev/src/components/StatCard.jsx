export default function StatCard({ label, value, note, icon: Icon, tone = 'cyan' }) {
  const tones = { cyan: 'bg-cyan-50 text-cyan-700', violet: 'bg-violet-50 text-violet-700', amber: 'bg-amber-50 text-amber-700', emerald: 'bg-emerald-50 text-emerald-700' }
  return <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40">
    <div className="flex items-start justify-between"><p className="text-xs font-medium text-slate-500">{label}</p><span className={`grid h-9 w-9 place-items-center rounded-xl ${tones[tone]}`}><Icon size={18}/></span></div>
    <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
    <p className="mt-1 text-[11px] text-slate-500">{note}</p>
  </div>
}