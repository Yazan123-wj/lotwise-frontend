import { cx } from '@/utils/cx'

export function Placeholder({
  label,
  className,
}: {
  label: string
  caption?: string
  className?: string
}) {
  return (
    <div className={cx('wire-placeholder flex items-center justify-center p-6 text-center', className)}>
      <span className="text-[11px] font-medium uppercase tracking-[0.18em]">{label}</span>
    </div>
  )
}
