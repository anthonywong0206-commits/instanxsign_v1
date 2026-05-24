import { Download, Eye, Share2, Trash2, ClipboardList, CalendarDays } from 'lucide-react'
import { exportElementAsPdf, exportElementAsPng, shareElementAsImage } from '../lib/exporters'

export default function RecordsPage({ state, setState, selectedItem }) {
  const recordGroups = buildRecordGroups(state)

  const removeRecord = (id) => {
    setState((s) => ({
      ...s,
      records: s.records.filter((record) => record.id !== id)
    }))
  }

  const clearItemRecords = (itemId, itemTitle) => {
    if (!confirm(`確定清空「${itemTitle}」的所有紀錄？`)) return

    setState((s) => ({
      ...s,
      records: s.records.filter((record) => record.itemId !== itemId)
    }))
  }

  return (
    <div className="page">
      <section className="card">
        <h2 className="text-2xl font-black">紀錄頁面</h2>
        <p className="mt-1 text-sm text-slate-500">
          只要項目曾經建立簽收紀錄，會一律保留在此頁面。PNG / PDF 匯出會按項目獨立匯出。
        </p>
      </section>

      {recordGroups.length === 0 ? (
        <section className="card">
          <div className="rounded-[1.5rem] border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
            <ClipboardList className="mx-auto text-slate-400" size={42} />
            <div className="mt-3 text-lg font-black">暫未有簽收紀錄</div>
            <p className="mt-2 text-sm text-slate-500">
              完成第一筆簽收後，相關項目會自動顯示在此頁。
            </p>
          </div>
        </section>
      ) : (
        <div className="space-y-6">
          {recordGroups.map((group) => (
            <section key={group.itemId} className="space-y-3">
              <div className="card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm font-black text-slate-500">
                      <ClipboardList size={18} />
                      簽收項目
                    </div>

                    <h3 className="mt-1 truncate text-2xl font-black">
                      {group.itemTitle}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={16} />
                        {group.itemDate || '沒有日期'}
                      </span>

                      <span>
                        共 {group.records.length} 筆紀錄
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="icon-button no-print"
                    title="預覽 / 列印"
                  >
                    <Eye size={22} />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 no-print">
                  <button
                    onClick={() =>
                      exportElementAsPng(
                        `sign-table-${group.safeId}`,
                        `${safeFileName(group.itemTitle)}-簽收表.png`
                      )
                    }
                    className="secondary-button"
                  >
                    <Download size={18} />
                    匯出 PNG
                  </button>

                  <button
                    onClick={() =>
                      exportElementAsPdf(
                        `sign-table-${group.safeId}`,
                        `${safeFileName(group.itemTitle)}-簽收表.pdf`
                      )
                    }
                    className="secondary-button"
                  >
                    <Download size={18} />
                    匯出 PDF
                  </button>

                  <button
                    onClick={() =>
                      shareElementAsImage(
                        `sign-table-${group.safeId}`,
                        `${group.itemTitle}｜QuickSign 簽收表`
                      )
                    }
                    className="secondary-button col-span-2"
                  >
                    <Share2 size={18} />
                    分享此項目圖片 / WhatsApp
                  </button>
                </div>
              </div>

              <div
                id={`sign-table-${group.safeId}`}
                className="rounded-[2rem] bg-white p-5 text-slate-950 shadow-soft"
              >
                <div className="border-b border-slate-200 pb-4">
                  <div className="text-sm font-bold text-slate-500">
                    {state.settings.organizationName}
                  </div>

                  <h1 className="mt-1 text-2xl font-black">
                    簽收表／即場登記表
                  </h1>

                  <div className="mt-2 grid gap-1 text-sm text-slate-600">
                    <div>項目：{group.itemTitle}</div>
                    <div>項目日期：{group.itemDate || '沒有日期'}</div>
                    <div>紀錄數量：{group.records.length}</div>
                    <div>產生時間：{new Date().toLocaleString()}</div>
                  </div>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border p-2 text-left">#</th>
                        <th className="border p-2 text-left">日期</th>
                        <th className="border p-2 text-left">時間</th>
                        <th className="border p-2 text-left">姓名</th>

                        {group.fields.map((field) => (
                          <th key={field.id} className="border p-2 text-left">
                            {field.label}
                          </th>
                        ))}

                        <th className="border p-2 text-left">簽名</th>
                        <th className="border p-2 text-left no-print">操作</th>
                      </tr>
                    </thead>

                    <tbody>
                      {group.records.map((record, index) => (
                        <tr key={record.id}>
                          <td className="border p-2">{index + 1}</td>
                          <td className="border p-2">{record.date}</td>
                          <td className="border p-2">{record.time}</td>
                          <td className="border p-2 font-bold">{record.name}</td>

                          {group.fields.map((field) => (
                            <td key={field.id} className="border p-2">
                              {record.values?.[field.id] || ''}
                            </td>
                          ))}

                          <td className="border p-2">
                            {record.signature ? (
                              <img
                                src={record.signature}
                                className="h-14 max-w-[160px] object-contain"
                              />
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          <td className="border p-2 no-print">
                            <button
                              onClick={() => removeRecord(record.id)}
                              className="text-rose-600"
                              title="刪除此筆紀錄"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                onClick={() => clearItemRecords(group.itemId, group.itemTitle)}
                className="danger-button no-print"
              >
                <Trash2 size={20} />
                清空「{group.itemTitle}」紀錄
              </button>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

function buildRecordGroups(state) {
  const itemsById = Object.fromEntries(
    (state.items || []).map((item) => [item.id, item])
  )

  const map = new Map()

  for (const record of state.records || []) {
    const item = itemsById[record.itemId]

    const itemId = record.itemId || 'unknown'
    const itemTitle =
      item?.title ||
      record.itemTitle ||
      '已刪除／未命名項目'

    if (!map.has(itemId)) {
      map.set(itemId, {
        itemId,
        safeId: makeSafeId(itemId),
        itemTitle,
        itemDate: item?.date || record.itemDate || '',
        fields: item?.fields || inferFieldsFromRecords(state.records, itemId),
        records: []
      })
    }

    map.get(itemId).records.push(record)
  }

  return Array.from(map.values()).sort((a, b) => {
    const aTime = a.records[0]?.timestamp || ''
    const bTime = b.records[0]?.timestamp || ''
    return bTime.localeCompare(aTime)
  })
}

function inferFieldsFromRecords(records, itemId) {
  const fieldIds = new Set()

  for (const record of records || []) {
    if (record.itemId !== itemId) continue

    Object.keys(record.values || {}).forEach((key) => fieldIds.add(key))
  }

  return Array.from(fieldIds).map((id) => ({
    id,
    label: id
  }))
}

function makeSafeId(value) {
  return String(value || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '_')
}

function safeFileName(name) {
  return String(name || 'QuickSign')
    .replace(/[\\/:*?"<>|]/g, '')
    .slice(0, 50)
}
