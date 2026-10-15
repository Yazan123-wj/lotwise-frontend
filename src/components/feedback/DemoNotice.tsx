import type { ReactNode } from 'react'

export function DemoNotice({ children }: { children: ReactNode }) {
  return (
    <div className="border border-wire-line border-l-2 border-l-royal bg-white px-4 py-3 text-sm text-navy" role="note">
      <span className="mr-2 text-[11px] font-medium uppercase tracking-[0.14em] text-royal">Note</span>
      {children}
    </div>
  )
}
