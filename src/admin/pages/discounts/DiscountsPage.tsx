import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminPageHeader } from '@/admin/components/AdminPageHeader'
import { DataTable } from '@/admin/components/DataTable'
import { DemoFlash } from '@/admin/components/DemoFlash'
import { StatusBadge } from '@/admin/components/StatusBadge'
import { ConfirmationDialog } from '@/components/feedback/ConfirmationDialog'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { buttonClass } from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getDiscountCodes } from '@/services/pricing'
import type { DiscountCode } from '@/types'
import { formatMoney } from '@/utils/format'

export function DiscountsPage() {
  usePageTitle('Discounts')
  const [codes, setCodes] = useState<DiscountCode[]>(() => getDiscountCodes())
  const [pending, setPending] = useState<DiscountCode | null>(null)
  const [notice, setNotice] = useState('')

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Discounts"
        description="DEMO10 and FIXED5 can be previewed in the cart. Usage counts are sample numbers."
        crumbs={[{ label: 'Discounts' }]}
        actions={
          <Link to="/admin/discounts/new" className={buttonClass()}>
            Add code
          </Link>
        }
      />
      <DemoFlash />
      {notice ? <DemoNotice>{notice}</DemoNotice> : null}
      <DataTable
        rows={codes}
        getRowId={(code) => code.id}
        emptyLabel="No sample codes."
        columns={[
          { id: 'code', header: 'Code', cell: (code) => code.code },
          {
            id: 'value',
            header: 'Value',
            cell: (code) => (code.type === 'percentage' ? `${code.value}%` : formatMoney(code.value)),
          },
          { id: 'min', header: 'Minimum', cell: (code) => formatMoney(code.minOrderValue) },
          { id: 'dates', header: 'Sample dates', cell: (code) => `${code.startsOn} – ${code.endsOn}` },
          { id: 'usage', header: 'Usage', cell: (code) => `${code.usageCount} / ${code.usageLimit}` },
          { id: 'status', header: 'Status', cell: (code) => <StatusBadge>{code.active ? 'Active' : 'Inactive'}</StatusBadge> },
          {
            id: 'actions',
            header: 'Actions',
            cell: (code) => (
              <div className="flex gap-2">
                <Link to={`/admin/discounts/${code.id}`} className="underline">Edit</Link>
                <button
                  type="button"
                  className="underline"
                  onClick={() => {
                    setCodes((current) => current.map((item) => (item.id === code.id ? { ...item, active: !item.active } : item)))
                    setNotice('Activation changed in this view only. The cart still reads the original sample list.')
                  }}
                >
                  {code.active ? 'Deactivate' : 'Activate'}
                </button>
                <button type="button" className="underline" onClick={() => setPending(code)}>Delete</button>
              </div>
            ),
          },
        ]}
      />
      <ConfirmationDialog
        open={Boolean(pending)}
        title="Remove this code from the view?"
        description="The sample code returns on refresh and can still be used in the cart preview."
        confirmLabel="Remove from view"
        onClose={() => setPending(null)}
        onConfirm={() => {
          if (!pending) return
          setCodes((current) => current.filter((code) => code.id !== pending.id))
          setNotice(`${pending.code} was removed from this view only.`)
        }}
      />
    </div>
  )
}
