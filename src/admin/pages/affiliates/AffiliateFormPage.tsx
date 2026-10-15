import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AdminForm } from '@/admin/components/AdminForm'
import { AdminPageHeader } from '@/admin/components/AdminPageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { FormField } from '@/components/forms/FormField'
import { Button } from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getAffiliates } from '@/services/admin'

export function AffiliateFormPage() {
  const { affiliateId } = useParams()
  const navigate = useNavigate()
  const existing = getAffiliates().find((partner) => partner.id === affiliateId)
  const missing = Boolean(affiliateId && !existing)
  usePageTitle(affiliateId ? 'Edit affiliate' : 'Add affiliate')
  const [name, setName] = useState(existing?.name ?? '')
  const [email, setEmail] = useState(existing?.email ?? '')
  const [code, setCode] = useState(existing?.code ?? '')
  const [linkPath, setLinkPath] = useState(existing?.linkPath ?? '/shop?ref=')
  const [active, setActive] = useState(existing?.active ?? true)
  const [error, setError] = useState('')

  if (missing) {
    return <ErrorState title="Sample affiliate not found" description="That partner is not in the wireframe data." action={<Link to="/admin/affiliates" className="underline">Back to affiliates</Link>} />
  }

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title={affiliateId ? 'Edit affiliate' : 'Add affiliate'}
        description="Links are placeholders. Visits and orders are not recorded."
        crumbs={[{ label: 'Affiliates', to: '/admin/affiliates' }, { label: affiliateId ? 'Edit' : 'Add' }]}
      />
      <AdminForm
        onSubmit={() => {
          if (!name.trim() || !code.trim()) {
            setError('Name and code are required.')
            return
          }
          navigate('/admin/affiliates', { state: { demoMessage: 'The affiliate form was submitted in this browser only. No link was issued.' } })
        }}
      >
        <FormField id="affiliate-name" label="Partner" required error={error}>
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </FormField>
        <FormField id="affiliate-email" label="Email">
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </FormField>
        <FormField id="affiliate-code" label="Code" required>
          <input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} />
        </FormField>
        <FormField id="affiliate-link" label="Link path" hint="A path only. Opening it does not attribute a visit.">
          <input value={linkPath} onChange={(event) => setLinkPath(event.target.value)} />
        </FormField>
        {existing ? (
          <p className="text-sm text-wire-muted">
            Mock visits {existing.visits}. Mock orders {existing.orders}. These numbers are not live.
          </p>
        ) : null}
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />
          Active
        </label>
        <Button type="submit">Save demonstration</Button>
      </AdminForm>
    </div>
  )
}
