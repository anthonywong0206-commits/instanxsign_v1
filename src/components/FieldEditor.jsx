import { Plus, Trash2 } from 'lucide-react'

export default function FieldEditor({ fields, onChange }) {
  const addField = () => {
    onChange([
      ...fields,
      { id: crypto.randomUUID(), label: '', type: 'text', required: false }
    ])
  }

  const update = (id, patch) => {
    onChange(fields.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }

  const remove = (id) => {
    onChange(fields.filter((f) => f.id !== id))
  }

  return (
    <div className="space-y-3">
      {fields.map((field) => (
        <div key={field.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="grid gap-3">
            <input
              value={field.label}
              onChange={(e) => update(field.id, { label: e.target.value })}
              placeholder="欄位名稱，例如：電話"
              className="input"
            />
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <select
                value={field.type}
                onChange={(e) => update(field.id, { type: e.target.value })}
                className="input"
              >
                <option value="text">文字欄位</option>
                <option value="tel">電話欄位</option>
                <option value="email">電郵欄位</option>
                <option value="number">數字欄位</option>
                <option value="select">下拉選單</option>
              </select>
              <button onClick={() => remove(field.id)} className="rounded-2xl bg-rose-50 px-4 text-rose-600">
                <Trash2 size={20} />
              </button>
            </div>
            {field.type === 'select' && (
              <input
                value={field.options || ''}
                onChange={(e) => update(field.id, { options: e.target.value })}
                placeholder="下拉選項，用逗號分隔，例如：男,女,其他"
                className="input"
              />
            )}
            <label className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={!!field.required}
                onChange={(e) => update(field.id, { required: e.target.checked })}
              />
              必填欄位
            </label>
          </div>
        </div>
      ))}

      <button onClick={addField} className="flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-slate-300 bg-white px-4 py-4 font-black text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
        <Plus size={20} />
        新增自訂欄位
      </button>
    </div>
  )
}
