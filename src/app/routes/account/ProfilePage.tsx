import { useState } from 'react'
import { AccountGate } from '@/components/account/AccountGate'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { FormField } from '@/components/forms/FormField'
import { Button } from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getPreviewCustomer } from '@/services/commerce'

export function ProfilePage() {
  usePageTitle('Profile')
  const customer = getPreviewCustomer()
  const [values, setValues] = useState({
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone,
  })
  const [saved, setSaved] = useState(false)

  return (
    <AccountGate>
      <form
        className="max-w-md space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          setSaved(true)
        }}
      >
        <h2 className="text-xl font-bold">Personal information</h2>
        <FormField id="profile-first" label="First name" required>
          <input value={values.firstName} onChange={(event) => setValues({ ...values, firstName: event.target.value })} />
        </FormField>
        <FormField id="profile-last" label="Last name" required>
          <input value={values.lastName} onChange={(event) => setValues({ ...values, lastName: event.target.value })} />
        </FormField>
        <FormField id="profile-email" label="Email" required>
          <input type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} />
        </FormField>
        <FormField id="profile-phone" label="Phone" required>
          <input type="tel" value={values.phone} onChange={(event) => setValues({ ...values, phone: event.target.value })} />
        </FormField>
        <Button type="submit">Save demonstration</Button>
        {saved ? <DemoNotice>The preview profile changed on this page only. It was not saved.</DemoNotice> : null}
      </form>
    </AccountGate>
  )
}
