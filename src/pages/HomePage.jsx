import { Lock, Plus, QrCode } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import FieldEditor from '../components/FieldEditor'

export default function HomePage({ state, setState, selectedItem, onStartKiosk }) {
  const addItem = () => {
    const item = {
      id: crypto.randomUUID(),
      title: '新的簽收項目',
      date: new Date().toISOString().slice(0, 10),
      fields: [],
      requireSignature: true
    }
    setState((s) => ({ ...s, items: [item, ...s.items], selectedItemId: item.id }))
  }

  const updateSelected = (patch) => {
    setState((s) => ({
      ...s,
      items: s.items.map((item) => item.id === s.selectedItemId ? { ...item, ...patch } : item)
    }))
  }

  return (
    <div className="page">
      <section className="card">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black">建立簽收／即場登記項目</h2>
            <p className="mt-1 text-sm text-slate-500">選擇或建立項目後，可啟動簽到模式。</p>
          </div>
          <button onClick={addItem} className="icon-button">
            <Plus size={22} />
          </button>
        </div>

        <label className="label">選擇簽收項目</label>
        <select
          value={state.selectedItemId}
          onChange={(e) => setState((s) => ({ ...s, selectedItemId: e.target.value }))}
          className="input"
        >
          {state.items.map((item) => (
            <option key={item.id} value={item.id}>{item.title}</option>
          ))}
        </select>

        <div className="mt-4 grid gap-3">
          <div>
            <label className="label">項目名稱</label>
            <input
              value={selectedItem?.title || ''}
              onChange={(e) => updateSelected({ title: e.target.value })}
              className="input"
              placeholder="例如：長者健康講座"
            />
          </div>
          <div>
            <label className="label">日期</label>
            <input
              type="date"
              value={selectedItem?.date || ''}
              onChange={(e) => updateSelected({ date: e.target.value })}
              className="input"
            />
          </div>
          <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 font-bold dark:bg-slate-900">
            <input
              type="checkbox"
              checked={selectedItem?.requireSignature !== false}
              onChange={(e) => updateSelected({ requireSignature: e.target.checked })}
            />
            啟用電子簽名
          </label>
        </div>
      </section>

      <section className="card">
        <h3 className="mb-4 text-xl font-black">自訂收集項目</h3>
        <FieldEditor
          fields={selectedItem?.fields || []}
          onChange={(fields) => updateSelected({ fields })}
        />
      </section>

      <section className="card">
        <h3 className="mb-3 text-xl font-black">QR Code 快速進入</h3>
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-slate-50 p-5 dark:bg-slate-900">
          <QRCodeCanvas value={window.location.href} size={180} />
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
            <QrCode size={18} />
            現場可展示此 QR Code
          </div>
        </div>
      </section>

      <button onClick={onStartKiosk} className="primary-button">
        <Lock size={22} />
        啟動簽到模式
      </button>
    </div>
  )
}
