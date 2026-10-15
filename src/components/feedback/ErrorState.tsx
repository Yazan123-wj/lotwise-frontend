import type { ReactNode } from 'react'

export function ErrorState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="border border-wire-line bg-white px-4 py-10 text-center" role="alert">
      <h2 className="text-lg font-medium text-navy">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-wire-muted">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
