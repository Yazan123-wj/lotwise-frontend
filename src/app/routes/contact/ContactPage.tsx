import { useState } from 'react'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { FormField, FormNote } from '@/components/forms/FormField'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'
import { validateContact, type FieldErrors } from '@/utils/validation'

export function ContactPage() {
  usePageTitle('Contact')
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [sent, setSent] = useState(false)

  return (
    <PageContainer className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Contact</h1>
        <p className="text-sm text-wire-muted">Official contact details have not been confirmed. The form does not send a message.</p>
        <ul className="space-y-1 text-sm">
          <li>Email: To be confirmed</li>
          <li>Phone: To be confirmed</li>
          <li>Address: To be confirmed</li>
        </ul>
      </div>
      <form
        className="space-y-4 border border-wire-line bg-white p-4"
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          const next = validateContact(values)
          setErrors(next)
          setSent(Object.keys(next).length === 0)
          if (Object.keys(next).length === 0) setValues({ name: '', email: '', message: '' })
        }}
      >
        <FormNote />
        <FormField id="contact-name" label="Name" required error={errors.name}>
          <input autoComplete="name" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} />
        </FormField>
        <FormField id="contact-email" label="Email" required error={errors.email}>
          <input type="email" autoComplete="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} />
        </FormField>
        <FormField id="contact-message" label="Message" required error={errors.message}>
          <textarea className="min-h-32" value={values.message} onChange={(event) => setValues({ ...values, message: event.target.value })} />
        </FormField>
        <Button type="submit">Preview message</Button>
        {sent ? <DemoNotice>The message was not sent or stored.</DemoNotice> : null}
      </form>
    </PageContainer>
  )
}
