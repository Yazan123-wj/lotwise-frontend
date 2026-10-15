import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'lotwise-demo-account-preview'

type DemoAccountValue = {
  preview: boolean
  startPreview: () => void
  stopPreview: () => void
}

const DemoAccountContext = createContext<DemoAccountValue | null>(null)

function readPreview() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

/** Local layout preview only. This does not authenticate anyone. */
export function DemoAccountProvider({ children }: { children: ReactNode }) {
  const [preview, setPreview] = useState(readPreview)

  const value = useMemo<DemoAccountValue>(
    () => ({
      preview,
      startPreview: () => {
        try {
          sessionStorage.setItem(STORAGE_KEY, '1')
        } catch {
          /* session storage can be unavailable; the in-memory flag still previews the layout */
        }
        setPreview(true)
      },
      stopPreview: () => {
        try {
          sessionStorage.removeItem(STORAGE_KEY)
        } catch {
          /* ignore */
        }
        setPreview(false)
      },
    }),
    [preview],
  )

  return <DemoAccountContext.Provider value={value}>{children}</DemoAccountContext.Provider>
}

export function useDemoAccount() {
  const value = useContext(DemoAccountContext)
  if (!value) throw new Error('useDemoAccount must be used within DemoAccountProvider')
  return value
}
