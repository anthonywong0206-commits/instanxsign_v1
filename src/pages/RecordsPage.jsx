import { Download, Eye, Share2, Trash2 } from 'lucide-react'
import { exportElementAsPdf, exportElementAsPng, shareElementAsImage } from '../lib/exporters'

export default function RecordsPage({ state, setState, selectedItem }) {
  const records = state.records.filter((r) => !selectedItem || r.itemId === selectedItem.id)
  const fieldMap = Object.fromEntries((selectedItem?.fields || []).map((f) => [f.id, f]))

  const removeRecord = (id) => {
    setState((s) => ({ ...s, records: s.records.filter((r) => r.id !== id) }))
  }

  const clearCurrent = () => {
    if (!confirm('確定清空此項目的簽收紀錄？')) return
    setState((s) => ({
      ...s,
      records: s.records.filter((r) => r.itemId !== selectedItem?.id)
    }))
  }

  return (
    <div className="page">
      <section className="card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black">簽收表／即場登記表</h2>
            <p className="mt-1 text-sm text-slate-500">{selectedItem?.title || '未選擇項目'}｜共 {records.length} 筆</p>
          </div>
          <button onClick={() => window.print()} className="icon-button">
            <Eye size={22} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={() => exportElementAsPng('sign-table', 'QuickSign簽收表.png')} className="secondary-button">
            <Download size={18} />
            匯出 PNG
          </button>
          <button onClick={() => exportElementAsPdf('sign-table', 'QuickSign簽收表.pdf')} className="secondary-button">
            <Download size={18} />
            匯出 PDF
          </button>
          <button onClick={() => shareElementAsImage('sign-table')} className="secondary-button col-span-2">
            <Share2 size={18} />
            分享圖片 / WhatsApp
          </button>
        </div>
      </section>

      <section id="sign-table" className="rounded-[2rem] bg-white p-5 shadow-soft text-slate-950">
        <div className="border-b border-slate-200 pb-4">
          <div className="text-sm font-bold text-slate-500">{state.settings.organizationName}</div>
          <h1 className="mt-1 text-2xl font-black">簽收表／即場登記表</h1>
          <div className="mt-2 grid gap-1 text-sm text-slate-600">
            <div>項目：{selectedItem?.title}</div>
            <div>項目日期：{selectedItem?.date}</div>
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
                {(selectedItem?.fields || []).map((f) => (
                  <th key={f.id} className="border p-2 text-left">{f.label}</th>
                ))}
                <th className="border p-2 text-left">簽名</th>
                <th className="border p-2 text-left no-print">操作</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={record.id}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{record.date}</td>
                  <td className="border p-2">{record.time}</td>
                  <td className="border p-2 font-bold">{record.name}</td>
                  {(selectedItem?.fields || []).map((f) => (
                    <td key={f.id} className="border p-2">{record.values?.[f.id] || ''}</td>
                  ))}
                  <td className="border p-2">
                    {record.signature ? (
                      <img src={record.signature} className="h-14 max-w-[160px] object-contain" />
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="border p-2 no-print">
                    <button onClick={() => removeRecord(record.id)} className="text-rose-600">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {!records.length && (
                <tr>
                  <td colSpan={6 + (selectedItem?.fields || []).length} className="border p-8 text-center text-slate-400">
                    暫未有簽收紀錄
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <button onClick={clearCurrent} className="danger-button">
        <Trash2 size={20} />
        清空此項目紀錄
      </button>
    </div>
  )
}
