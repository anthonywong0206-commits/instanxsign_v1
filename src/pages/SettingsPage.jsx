import { Download, Moon, RotateCcw, Sun } from 'lucide-react'
import { downloadJson, defaultState } from '../lib/storage'

export default function SettingsPage({ state, setState }) {
  const updateSettings = (patch) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }))
  }

  return (
    <div className="page">
      <section className="card">
        <h2 className="text-2xl font-black">設定</h2>
        <p className="mt-1 text-sm text-slate-500">更改管理密碼及機構／用戶名稱。</p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="label">機構／用戶名稱</label>
            <input
              value={state.settings.organizationName}
              onChange={(e) => updateSettings({ organizationName: e.target.value })}
              className="input"
              placeholder="例如：聖匠堂長者地區中心"
            />
          </div>
          <div>
            <label className="label">管理密碼</label>
            <input
              value={state.settings.password}
              onChange={(e) => updateSettings({ password: e.target.value })}
              className="input"
              placeholder="預設：123456"
            />
          </div>

          <button
            onClick={() => updateSettings({ darkMode: !state.settings.darkMode })}
            className="secondary-button w-full"
          >
            {state.settings.darkMode ? <Sun size={20} /> : <Moon size={20} />}
            {state.settings.darkMode ? '切換至淺色模式' : '切換至深色模式'}
          </button>
        </div>
      </section>

      <section className="card">
        <h3 className="text-xl font-black">資料管理</h3>
        <div className="mt-4 grid gap-3">
          <button onClick={() => downloadJson(state)} className="secondary-button w-full">
            <Download size={20} />
            匯出備份 JSON
          </button>
          <button
            onClick={() => {
              if (confirm('確定重設所有資料？')) setState(defaultState)
            }}
            className="danger-button"
          >
            <RotateCcw size={20} />
            重設全部資料
          </button>
        </div>
      </section>
    </div>
  )
}
