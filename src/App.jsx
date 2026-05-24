import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import PasswordModal from './components/PasswordModal'
import HomePage from './pages/HomePage'
import CheckInPage from './pages/CheckInPage'
import RecordsPage from './pages/RecordsPage'
import SettingsPage from './pages/SettingsPage'
import { loadState, saveState } from './lib/storage'

const emptyForm = { name: '', values: {}, signature: '' }

export default function App() {
  const [state, setState] = useState(loadState)
  const [page, setPage] = useState('home')
  const [kioskMode, setKioskMode] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    saveState(state)
    document.documentElement.classList.toggle('dark', !!state.settings.darkMode)
  }, [state])

  const selectedItem = useMemo(() => {
    return state.items.find((item) => item.id === state.selectedItemId) || state.items[0]
  }, [state.items, state.selectedItemId])

  const startKiosk = () => {
    if (!selectedItem) {
      alert('請先選取簽收項目。')
      return
    }

    setKioskMode(true)
    setPage('checkin')
  }

  const exitKiosk = () => {
    setKioskMode(false)
    setShowPassword(false)
    setPage('home')
  }

  const submitCheckIn = () => {
    if (!form.name.trim()) {
      alert('請輸入姓名。')
      return
    }

    const missing = (selectedItem.fields || []).find(
      (field) => field.required && !String(form.values[field.id] || '').trim()
    )

    if (missing) {
      alert(`請填寫：${missing.label}`)
      return
    }

    if (selectedItem.requireSignature !== false && !form.signature) {
      alert('請完成電子簽名。')
      return
    }

    const now = new Date()

    const record = {
      id: crypto.randomUUID(),
      itemId: selectedItem.id,
      itemTitle: selectedItem.title,
      itemDate: selectedItem.date,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: now.toISOString(),
      name: form.name.trim(),
      values: form.values,
      signature: form.signature
    }

    setState((s) => ({
      ...s,
      records: [record, ...s.records]
    }))

    setForm(emptyForm)
    setNotice('已完成簽收')
    setTimeout(() => setNotice(''), 1800)
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-24 text-slate-950 dark:bg-slate-950 dark:text-white">
      <Header
        organizationName={state.settings.organizationName}
        subtitle="QuickSign｜快速完成簽收、即場登記及電子簽名。"
        darkMode={state.settings.darkMode}
      />

      {notice && (
        <div className="fixed left-1/2 top-24 z-[80] -translate-x-1/2 rounded-full bg-emerald-600 px-5 py-3 font-black text-white shadow-xl">
          ✅ {notice}
        </div>
      )}

      {page === 'home' && !kioskMode && (
        <HomePage
          state={state}
          setState={setState}
          selectedItem={selectedItem}
          setPage={setPage}
          onStartKiosk={startKiosk}
        />
      )}

      {page === 'checkin' && (
        <CheckInPage
          selectedItem={selectedItem}
          kioskMode={kioskMode}
          form={form}
          setForm={setForm}
          onSubmit={submitCheckIn}
          onExitRequest={() => setShowPassword(true)}
        />
      )}

      {page === 'records' && !kioskMode && (
        <RecordsPage
          state={state}
          setState={setState}
          selectedItem={selectedItem}
        />
      )}

      {page === 'settings' && !kioskMode && (
        <SettingsPage
          state={state}
          setState={setState}
        />
      )}

      <BottomNav page={page} setPage={setPage} disabled={kioskMode} />

      {showPassword && (
        <PasswordModal
          password={state.settings.password || '123456'}
          onCancel={() => setShowPassword(false)}
          onSuccess={exitKiosk}
        />
      )}
    </div>
  )
}
