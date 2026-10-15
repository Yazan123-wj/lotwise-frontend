import type { ReactNode } from 'react'
import { cx } from '@/utils/cx'

export function StatusBadge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'brand' }) {
  return (
    <span
      className={cx(
        'inline-flex items-center px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.12em]',
        tone === 'brand' ? 'bg-royal/10 text-royal' : 'bg-wire-bg text-navy',
      )}
    >
      {children}
    </span>
  )
}
