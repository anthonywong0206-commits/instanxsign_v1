import { ShieldCheck } from 'lucide-react'

export default function Header({ organizationName, subtitle, darkMode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950 text-white shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
          <ShieldCheck size={26} />
        </div>
        <div className="min-w-0">
          <div className="truncate text-lg font-black">{organizationName || '我的機構'}</div>
          <div className="truncate text-sm text-slate-300">{subtitle}</div>
        </div>
      </div>
    </header>
  )
}
