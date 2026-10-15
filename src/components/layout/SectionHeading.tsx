import type { ReactNode } from 'react'

export function SectionHeading({
  id,
  title,
  description,
  action,
}: {
  id?: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="max-w-2xl">
        <h2 id={id} className="text-2xl font-medium tracking-tight text-navy sm:text-3xl">{title}</h2>
        {description ? <p className="mt-2 text-sm text-wire-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}
