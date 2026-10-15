import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AdminForm } from '@/admin/components/AdminForm'
import { AdminPageHeader } from '@/admin/components/AdminPageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { FormField } from '@/components/forms/FormField'
import { Button } from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getDiscountCodes } from '@/services/pricing'
import { fieldClass } from '@/utils/fields'

export function DiscountFormPage() {
  const { discountId } = useParams()
  const navigate = useNavigate()
  const existing = getDiscountCodes().find((code) => code.id === discountId)
  const missing = Boolean(discountId && !existing)
  usePageTitle(discountId ? 'Edit discount' : 'Add discount')
  const [code, setCode] = useState(existing?.code ?? '')
  const [type, setType] = useState(existing?.type ?? 'percentage')
  const [value, setValue] = useState(String(existing?.value ?? ''))
  const [minimum, setMinimum] = useState(String(existing?.minOrderValue ?? '0'))
  const [limit, setLimit] = useState(String(existing?.usageLimit ?? '1'))
  const [startsOn, setStartsOn] = useState(existing?.startsOn ?? '2026-01-01')
  const [endsOn, setEndsOn] = useState(existing?.endsOn ?? '2026-12-31')
  const [active, setActive] = useState(existing?.active ?? true)
  const [error, setError] = useState('')

  if (missing) {
    return <ErrorState title="Sample code not found" description="That discount is not in the wireframe data." action={<Link to="/admin/discounts" className="underline">Back to discounts</Link>} />
  }

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title={discountId ? 'Edit discount' : 'Add discount'}
        description="Creating a code here does not make it available in the cart."
        crumbs={[{ label: 'Discounts', to: '/admin/discounts' }, { label: discountId ? 'Edit' : 'Add' }]}
      />
      <AdminForm
        onSubmit={() => {
          if (!code.trim() || Number(value) < 0) {
            setError('Add a code and a value of zero or more.')
            return
          }
          navigate('/admin/discounts', { state: { demoMessage: 'The discount form was submitted in this browser only. The cart codes were not changed.' } })
        }}
      >
        <FormField id="discount-code" label="Code" required error={error}>
          <input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} />
        </FormField>
        <FormField id="discount-type" label="Type" required>
          <select className={fieldClass} value={type} onChange={(event) => setType(event.target.value as 'percentage' | 'fixed')}>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed amount</option>
          </select>
        </FormField>
        <FormField id="discount-value" label={type === 'percentage' ? 'Percent' : 'Amount'} required>
          <input inputMode="decimal" value={value} onChange={(event) => setValue(event.target.value)} />
        </FormField>
        <FormField id="discount-min" label="Minimum order value" required>
          <input inputMode="decimal" value={minimum} onChange={(event) => setMinimum(event.target.value)} />
        </FormField>
        <FormField id="discount-limit" label="Usage limit" required>
          <input inputMode="numeric" value={limit} onChange={(event) => setLimit(event.target.value)} />
        </FormField>
        <FormField id="discount-start" label="Starts" required>
          <input type="date" value={startsOn} onChange={(event) => setStartsOn(event.target.value)} />
        </FormField>
        <FormField id="discount-end" label="Ends" required>
          <input type="date" value={endsOn} onChange={(event) => setEndsOn(event.target.value)} />
        </FormField>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />
          Active
        </label>
        <Button type="submit">Save demonstration</Button>
      </AdminForm>
    </div>
  )
}
