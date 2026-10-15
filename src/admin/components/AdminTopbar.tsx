import { Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '@/admin/components/StatusBadge'

export function AdminTopbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="flex items-center gap-3 border-b border-wire-line bg-white px-4 py-3 sm:px-6">
      <button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center text-navy md:hidden" onClick={onMenu}>
        <Menu aria-hidden="true" size={18} strokeWidth={1.75} />
        <span className="sr-only">Open admin menu</span>
      </button>
      <p className="text-sm font-medium text-navy">LotWise Labs</p>
      <StatusBadge tone="brand">Preview</StatusBadge>
      <Link to="/" className="ml-auto text-sm text-royal underline-offset-4 hover:underline">
        View storefront
      </Link>
    </header>
  )
}
