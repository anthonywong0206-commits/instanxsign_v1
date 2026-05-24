import { ClipboardCheck, FileText, Home, Settings } from 'lucide-react'

const tabs = [
  { id: 'home', label: '首頁', icon: Home },
  { id: 'checkin', label: '簽到', icon: ClipboardCheck },
  { id: 'records', label: '紀錄', icon: FileText },
  { id: 'settings', label: '設定', icon: Settings }
]

export default function BottomNav({ page, setPage, disabled }) {
  if (disabled) return null

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_rgba(15,23,42,.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto grid max-w-xl grid-cols-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = page === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setPage(tab.id)}
              className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-3 text-xs font-bold transition ${
                active ? 'text-slate-950 dark:text-white' : 'text-slate-400'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 3 : 2} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
