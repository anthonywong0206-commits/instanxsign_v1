import { CalendarDays, ClipboardCheck, Plus, QrCode, Settings2 } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import FieldEditor from '../components/FieldEditor'

export default function HomePage({
  state,
  setState,
  selectedItem,
  setPage,
  onStartKiosk
}) {
  const addItem = () => {
    const item = {
      id: crypto.randomUUID(),
      title: '新的簽收項目',
      date: new Date().toISOString().slice(0, 10),
      fields: [
        { id: crypto.randomUUID(), label: '電話', type: 'tel', required: false }
      ],
      requireSignature: true
    }

    setState((s) => ({
      ...s,
      items: [item, ...s.items],
      selectedItemId: item.id
    }))
  }

  const openItem = (id) => {
    setState((s) => ({
      ...s,
      selectedItemId: id
    }))

    setPage('checkin')
  }

  const updateSelected = (patch) => {
    setState((s) => ({
      ...s,
      items: s.items.map((item) =>
        item.id === s.selectedItemId
          ? { ...item, ...patch }
          : item
      )
    }))
  }

  const selectedRecords = state.records.filter(
    (record) => record.itemId === selectedItem?.id
  )

  return (
    <div className="page">
      <section className="card">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black">簽收項目</h2>
            <p className="mt-1 text-sm text-slate-500">
              點選項目即可進入簽收畫面。
            </p>
          </div>

          <button
            onClick={addItem}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-soft active:scale-95 dark:bg-white dark:text-slate-950"
            title="新增簽收項目"
          >
            <Plus size={26} strokeWidth={3} />
          </button>
        </div>

        <div className="space-y-3">
          {state.items.map((item) => {
            const count = state.records.filter(
              (record) => record.itemId === item.id
            ).length

            return (
              <button
                key={item.id}
                onClick={() => openItem(item.id)}
                className={`w-full rounded-[1.5rem] border p-4 text-left transition active:scale-[.99] ${
                  state.selectedItemId === item.id
                    ? 'border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950'
                    : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-lg font-black">
                      {item.title || '未命名簽收項目'}
                    </div>

                    <div className={`mt-2 flex flex-wrap items-center gap-3 text-sm ${
                      state.selectedItemId === item.id
                        ? 'opacity-80'
                        : 'text-slate-500'
                    }`}>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={16} />
                        {item.date || '未設定日期'}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <ClipboardCheck size={16} />
                        {count} 筆紀錄
                      </span>
                    </div>
                  </div>

                  <div className={`rounded-2xl px-3 py-2 text-xs font-black ${
                    state.selectedItemId === item.id
                      ? 'bg-white/20'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    進入
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="card">
        <div className="mb-4 flex items-center gap-2">
          <Settings2 size={22} />
          <h3 className="text-xl font-black">目前選取項目設定</h3>
        </div>

        <div className="grid gap-4">
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
        <ClipboardCheck size={22} />
        啟動簽到模式
      </button>
    </div>
  )
}
