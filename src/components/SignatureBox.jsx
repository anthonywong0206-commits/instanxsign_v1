import { useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'

export default function SignatureBox({ value, onChange }) {
  const ref = useRef(null)

  const save = () => {
    if (!ref.current || ref.current.isEmpty()) {
      onChange('')
      return
    }
    onChange(ref.current.getTrimmedCanvas().toDataURL('image/png'))
  }

  const clear = () => {
    ref.current?.clear()
    onChange('')
  }

  return (
    <div className="space-y-3">
      <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-2">
        <SignatureCanvas
          ref={ref}
          penColor="#0f172a"
          onEnd={save}
          canvasProps={{
            className: 'h-56 w-full rounded-2xl bg-white',
            width: 800,
            height: 260
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={clear} className="rounded-2xl bg-slate-100 px-4 py-3 font-bold text-slate-700">
          清除簽名
        </button>
        <button type="button" onClick={save} className="rounded-2xl bg-slate-950 px-4 py-3 font-bold text-white">
          儲存簽名
        </button>
      </div>
      {value && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">已儲存簽名</div>}
    </div>
  )
}
