const KEY = 'quicksign.v1'

export const defaultState = {
  settings: {
    organizationName: '我的機構',
    password: '123456',
    darkMode: false
  },
  items: [
    {
      id: 'default',
      title: '長者健康講座',
      date: new Date().toISOString().slice(0, 10),
      fields: [
        { id: 'phone', label: '電話', type: 'tel', required: false }
      ],
      requireSignature: true
    }
  ],
  selectedItemId: 'default',
  records: []
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw)
    return {
      ...defaultState,
      ...parsed,
      settings: { ...defaultState.settings, ...(parsed.settings || {}) },
      items: Array.isArray(parsed.items) && parsed.items.length ? parsed.items : defaultState.items,
      records: Array.isArray(parsed.records) ? parsed.records : []
    }
  } catch {
    return defaultState
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function downloadJson(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `quicksign-backup-${new Date().toISOString().slice(0,10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
