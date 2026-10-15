import type { ReactNode } from 'react'
import { cx } from '@/utils/cx'

export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-14', className)}>{children}</div>
}
