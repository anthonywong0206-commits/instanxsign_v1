import { CheckCircle2, LogOut } from 'lucide-react'
import SignatureBox from '../components/SignatureBox'

export default function CheckInPage({
  selectedItem,
  kioskMode,
  form,
  setForm,
  onSubmit,
  onExitRequest
}) {
  const updateField = (id, value) => {
    setForm((f) => ({ ...f, values: { ...f.values, [id]: value } }))
  }

  return (
    <div className={`page ${kioskMode ? 'max-w-2xl' : ''}`}>
      <section className={`card ${kioskMode ? 'border-4 border-slate-950 dark:border-white' : ''}`}>
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-3xl font-black">{selectedItem?.title || '即場登記'}</h2>
            <p className="mt-1 text-slate-500">{selectedItem?.date || ''}</p>
          </div>
          {kioskMode && (
            <button onClick={onExitRequest} className="rounded-2xl bg-rose-50 px-4 py-3 font-bold text-rose-600">
              <LogOut size={20} />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="label text-base">姓名（必填）</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="input text-xl"
              placeholder="請輸入姓名"
            />
          </div>

          {(selectedItem?.fields || []).map((field) => (
            <div key={field.id}>
              <label className="label text-base">{field.label || '未命名欄位'}{field.required ? '（必填）' : ''}</label>
              {field.type === 'select' ? (
                <select
                  value={form.values[field.id] || ''}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  className="input text-xl"
                >
                  <option value="">請選擇</option>
                  {(field.options || '').split(',').map((opt) => opt.trim()).filter(Boolean).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || 'text'}
                  value={form.values[field.id] || ''}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  className="input text-xl"
                  placeholder={`請輸入${field.label || ''}`}
                />
              )}
            </div>
          ))}

          {selectedItem?.requireSignature !== false && (
            <div>
              <label className="label text-base">電子簽名</label>
              <SignatureBox
                value={form.signature}
                onChange={(signature) => setForm((f) => ({ ...f, signature }))}
              />
            </div>
          )}

          <button onClick={onSubmit} className="success-button">
            <CheckCircle2 size={24} />
            確認簽收
          </button>
        </div>
      </section>
    </div>
  )
}
