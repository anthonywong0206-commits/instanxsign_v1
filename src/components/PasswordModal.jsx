import { useState } from 'react'

export default function PasswordModal({ password, onCancel, onSuccess }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    if (input === password) {
      onSuccess()
    } else {
      setError('密碼錯誤，請再試一次。')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur">
      <div className="w-full max-w-sm rounded-[2rem] bg-white p-6 shadow-2xl dark:bg-slate-900">
        <h2 className="text-xl font-black">退出簽到模式</h2>
        <p className="mt-2 text-sm text-slate-500">請輸入管理密碼才可返回設定。</p>
        <input
          autoFocus
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          className="input mt-5"
          placeholder="管理密碼"
        />
        {error && <p className="mt-3 text-sm font-bold text-rose-600">{error}</p>}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={onCancel} className="rounded-2xl bg-slate-100 px-4 py-3 font-bold dark:bg-slate-800">取消</button>
          <button onClick={submit} className="rounded-2xl bg-slate-950 px-4 py-3 font-bold text-white">確認</button>
        </div>
      </div>
    </div>
  )
}
