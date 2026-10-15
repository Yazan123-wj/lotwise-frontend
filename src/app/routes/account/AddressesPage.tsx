import { useState } from 'react'
import { AccountGate } from '@/components/account/AccountGate'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { FormField } from '@/components/forms/FormField'
import { Button } from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getPreviewCustomer } from '@/services/commerce'
import type { Address } from '@/types'

const blank: Address = { line1: '', line2: '', city: '', region: '', postalCode: '', country: '' }

export function AddressesPage() {
  usePageTitle('Addresses')
  const customer = getPreviewCustomer()
  const [addresses, setAddresses] = useState<Address[]>(customer.addresses)
  const [draft, setDraft] = useState<Address>(blank)
  const [notice, setNotice] = useState('')

  return (
    <AccountGate>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Saved addresses</h2>
        <ul className="space-y-2">
          {addresses.map((address, index) => (
            <li key={`${address.line1}-${index}`} className="border border-wire-line bg-white p-3 text-sm">
              <p>{address.line1}</p>
              {address.line2 ? <p>{address.line2}</p> : null}
              <p>
                {address.city}, {address.region} {address.postalCode}
              </p>
              <p>{address.country}</p>
              <p className="mt-1 text-wire-muted">Sample address</p>
            </li>
          ))}
        </ul>
        <form
          className="grid max-w-xl gap-3 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            if (!draft.line1.trim() || !draft.city.trim()) {
              setNotice('Add at least a street and city to preview a new address.')
              return
            }
            setAddresses((current) => [...current, draft])
            setDraft(blank)
            setNotice('The address was added to this page only. It was not saved to an account.')
          }}
        >
          <h3 className="font-bold sm:col-span-2">Add an address preview</h3>
          <FormField id="addr-line1" label="Address line 1" required>
            <input value={draft.line1} onChange={(event) => setDraft({ ...draft, line1: event.target.value })} />
          </FormField>
          <FormField id="addr-line2" label="Address line 2">
            <input value={draft.line2} onChange={(event) => setDraft({ ...draft, line2: event.target.value })} />
          </FormField>
          <FormField id="addr-city" label="City" required>
            <input value={draft.city} onChange={(event) => setDraft({ ...draft, city: event.target.value })} />
          </FormField>
          <FormField id="addr-region" label="Region">
            <input value={draft.region} onChange={(event) => setDraft({ ...draft, region: event.target.value })} />
          </FormField>
          <FormField id="addr-postal" label="Postal code">
            <input value={draft.postalCode} onChange={(event) => setDraft({ ...draft, postalCode: event.target.value })} />
          </FormField>
          <FormField id="addr-country" label="Country">
            <input value={draft.country} onChange={(event) => setDraft({ ...draft, country: event.target.value })} />
          </FormField>
          <div className="sm:col-span-2">
            <Button type="submit">Add to this view</Button>
          </div>
        </form>
        {notice ? <DemoNotice>{notice}</DemoNotice> : null}
      </div>
    </AccountGate>
  )
}
