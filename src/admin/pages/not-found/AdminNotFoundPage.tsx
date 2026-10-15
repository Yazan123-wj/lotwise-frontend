import { Link } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'

export function AdminNotFoundPage() {
  usePageTitle('Admin page not found')
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">This admin page is not in the wireframe</h1>
      <Link to="/admin" className="inline-flex min-h-11 items-center border border-wire-ink px-4 text-sm">
        Back to the dashboard
      </Link>
    </div>
  )
}
