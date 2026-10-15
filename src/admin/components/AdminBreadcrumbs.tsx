import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import type { Crumb } from '@/types'

export function AdminBreadcrumbs({ items }: { items: Crumb[] }) {
  return <Breadcrumbs items={[{ label: 'Admin', to: '/admin' }, ...items]} />
}
