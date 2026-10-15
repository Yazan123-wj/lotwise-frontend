import type { ReactNode } from 'react'
import { AdminBreadcrumbs } from '@/admin/components/AdminBreadcrumbs'
import type { Crumb } from '@/types'

export function AdminPageHeader({
  title,
  description,
  crumbs,
  actions,
}: {
  title: string
  description?: string
  crumbs: Crumb[]
  actions?: ReactNode
}) {
  return (
    <header className="space-y-3">
      <AdminBreadcrumbs items={crumbs} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-navy">{title}</h1>
          {description ? <p className="mt-1 max-w-2xl text-sm text-wire-muted">{description}</p> : null}
        </div>
        {actions}
      </div>
    </header>
  )
}
