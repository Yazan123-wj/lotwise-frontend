import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminPageHeader } from '@/admin/components/AdminPageHeader'
import { DataTable } from '@/admin/components/DataTable'
import { DemoFlash } from '@/admin/components/DemoFlash'
import { StatusBadge } from '@/admin/components/StatusBadge'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { buttonClass } from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getAffiliates } from '@/services/admin'
import type { Affiliate } from '@/types'

export function AffiliatesPage() {
  usePageTitle('Affiliates')
  const [partners, setPartners] = useState<Affiliate[]>(() => getAffiliates())
  const [notice, setNotice] = useState('')
  const visits = partners.reduce((sum, partner) => sum + partner.visits, 0)
  const orders = partners.reduce((sum, partner) => sum + partner.orders, 0)

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Affiliates"
        description="Visits and orders are mock counts. Referral links are not tracked."
        crumbs={[{ label: 'Affiliates' }]}
        actions={
          <Link to="/admin/affiliates/new" className={buttonClass()}>
            Add affiliate
          </Link>
        }
      />
      <DemoFlash />
      <DemoNotice>Performance summaries below are demo data until tracking exists.</DemoNotice>
      {notice ? <p role="status" className="text-sm">{notice}</p> : null}
      <div className="grid gap-3 sm:grid-cols-3">
        <p className="border border-wire-line bg-white p-3 text-sm">Partners: {partners.length}</p>
        <p className="border border-wire-line bg-white p-3 text-sm">Mock visits: {visits}</p>
        <p className="border border-wire-line bg-white p-3 text-sm">Mock orders: {orders}</p>
      </div>
      <DataTable
        rows={partners}
        getRowId={(partner) => partner.id}
        emptyLabel="No sample affiliates."
        columns={[
          { id: 'name', header: 'Partner', cell: (partner) => partner.name },
          { id: 'code', header: 'Code', cell: (partner) => partner.code },
          { id: 'link', header: 'Link', cell: (partner) => partner.linkPath },
          { id: 'visits', header: 'Mock visits', cell: (partner) => partner.visits },
          { id: 'orders', header: 'Mock orders', cell: (partner) => partner.orders },
          { id: 'status', header: 'Status', cell: (partner) => <StatusBadge>{partner.active ? 'Active' : 'Inactive'}</StatusBadge> },
          {
            id: 'actions',
            header: 'Actions',
            cell: (partner) => (
              <div className="flex gap-2">
                <Link to={`/admin/affiliates/${partner.id}`} className="underline">Edit</Link>
                <button
                  type="button"
                  className="underline"
                  onClick={() => {
                    setPartners((current) => current.map((item) => (item.id === partner.id ? { ...item, active: !item.active } : item)))
                    setNotice('Activation changed in this view only. No tracking was updated.')
                  }}
                >
                  {partner.active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}
