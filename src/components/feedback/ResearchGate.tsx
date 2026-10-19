import { useState } from 'react'

const STORAGE_KEY = 'lotwise-research-gate'

export function ResearchGate() {
  const [open, setOpen] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) !== '1'
    } catch {
      return true
    }
  })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-navy px-4 text-white">
      <div className="w-full max-w-md text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-brand-sky">LotWise Labs</p>
        <h1 className="mt-4 text-3xl font-medium tracking-tight">You must be at least 18 to view this catalogue.</h1>
        <p className="mt-4 text-sm leading-6 text-white/70">
          Records on this site are for catalogue review. They are not offered for human or veterinary use.
        </p>
        <button
          type="button"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-navy hover:bg-brand-sky"
          onClick={() => {
            try {
              sessionStorage.setItem(STORAGE_KEY, '1')
            } catch {
              /* the gate still closes for this view */
            }
            setOpen(false)
          }}
        >
          I'm 18 or older — Enter
        </button>
        <p className="mt-4 text-xs text-white/50">Entering confirms the catalogue is for research review only.</p>
      </div>
    </div>
  )
}
