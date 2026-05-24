import React from 'react'

import { CalendarDays, ClipboardCheck, Plus, QrCode, X } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import FieldEditor from '../components/FieldEditor'

const createBlankItem = () => ({
  title: '',
  date: new Date().toISOString().slice(0, 10),
  fields: [
    { id: crypto.randomUUID(), label: '電話', type: 'tel', required: false }
  ],
  requireSignature: true
})

export default function HomePage({
  state,
  setState,
  selectedItem,
  setPage,
  onStartKiosk
}) {
  const [draftItem, setDraftItem] = React.useState(null)

  const openCreateForm = () => {
    setDraftItem(createBlankItem())
  }

  const closeCreateForm = () => {
    setDraftItem(null)
  }

  const updateDraft = (patch) => {
    setDraftItem((item) => ({
      ...item,
      ...patch
    }))
  }

  const confirmCreateItem = () => {
    if (!draftItem?.title?.trim()) {
      alert('請輸入簽收項目名稱。')
      return
    }

    const item = {
      ...draftItem,
      id: crypto.randomUUID(),
      title: draftItem.title.trim(),
      fields: (draftItem.fields || []).filter((field) =>
        field.label?.trim()
      )
    }

    setState((s) => ({
      ...s,
      items: [item, ...s.items],
      selectedItemId: item.id
    }))

    setDraftItem(null)
  }

  const openItem = (id) => {
    setState((s) => ({
      ...s,
      selectedItemId: id
    }))

    setPage('checkin')
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
              主畫面顯示已建立的簽收項目，點選即可進入簽收。
            </p>
          </div>

          <button
            onClick={openCreateForm}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-soft active:scale-95 dark:bg-white dark:text-slate-950"
            title="新增簽收項目"
          >
            <Plus size={26} strokeWidth={3} />
          </button>
        </div>

        {state.items.length === 0 ? (
          <div className="rounded-[1.5rem] border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
            <div className="text-lg font-black">尚未建立簽收項目</div>
            <p className="mt-2 text-sm text-slate-500">
              請按右上角「＋」新增第一個簽收項目。
            </p>
          </div>
        ) : (
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

                      <div
                        className={`mt-2 flex flex-wrap items-center gap-3 text-sm ${
                          state.selectedItemId === item.id
                            ? 'opacity-80'
                            : 'text-slate-500'
                        }`}
                      >
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

                    <div
                      className={`rounded-2xl px-3 py-2 text-xs font-black ${
                        state.selectedItemId === item.id
                          ? 'bg-white/20'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      簽收
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
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

      {state.items.length > 0 && (
        <button onClick={onStartKiosk} className="primary-button">
          <ClipboardCheck size={22} />
          啟動簽到模式
        </button>
      )}

      {draftItem && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/70 p-4 backdrop-blur">
          <div className="mx-auto my-6 max-w-2xl rounded-[2rem] bg-white p-5 shadow-2xl dark:bg-slate-900">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black">新增簽收項目</h2>
                <p className="mt-1 text-sm text-slate-500">
                  請先輸入目前選取項目設定及自訂收集項目，確認後才會建立。
                </p>
              </div>

              <button
                onClick={closeCreateForm}
                className="icon-button"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="rounded-[1.5rem] bg-slate-50 p-4 dark:bg-slate-950">
                <h3 className="mb-4 text-lg font-black">目前選取項目設定</h3>

                <div className="grid gap-4">
                  <div>
                    <label className="label">項目名稱</label>
                    <input
                      value={draftItem.title}
                      onChange={(e) => updateDraft({ title: e.target.value })}
                      className="input"
                      placeholder="例如：長者健康講座"
                    />
                  </div>

                  <div>
                    <label className="label">日期</label>
                    <input
                      type="date"
                      value={draftItem.date}
                      onChange={(e) => updateDraft({ date: e.target.value })}
                      className="input"
                    />
                  </div>

                  <label className="flex items-center gap-3 rounded-2xl bg-white p-4 font-bold dark:bg-slate-900">
                    <input
                      type="checkbox"
                      checked={draftItem.requireSignature !== false}
                      onChange={(e) =>
                        updateDraft({ requireSignature: e.target.checked })
                      }
                    />
                    啟用電子簽名
                  </label>
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-slate-50 p-4 dark:bg-slate-950">
                <h3 className="mb-4 text-lg font-black">自訂收集項目</h3>

                <FieldEditor
                  fields={draftItem.fields || []}
                  onChange={(fields) => updateDraft({ fields })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={closeCreateForm}
                  className="rounded-2xl bg-slate-100 px-4 py-4 font-black text-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  取消
                </button>

                <button
                  onClick={confirmCreateItem}
                  className="rounded-2xl bg-slate-950 px-4 py-4 font-black text-white dark:bg-white dark:text-slate-950"
                >
                  確認建立
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
