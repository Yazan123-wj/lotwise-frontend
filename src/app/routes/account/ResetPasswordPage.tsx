import { useState } from 'react'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { FormField, FormNote } from '@/components/forms/FormField'
import { Button } from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'
import { validateAuth, type FieldErrors } from '@/utils/validation'

export function ResetPasswordPage() {
  usePageTitle('Reset password')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [notice, setNotice] = useState('')

  return (
    <form
      className="max-w-md space-y-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        const next = validateAuth('reset', { email })
        setErrors(next)
        setNotice(Object.keys(next).length === 0 ? 'No reset email was sent.' : '')
      }}
    >
      <h2 className="text-xl font-bold">Reset password</h2>
      <DemoNotice>This form does not send email or change a password.</DemoNotice>
      <FormNote />
      <FormField id="reset-email" label="Email" required error={errors.email}>
        <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </FormField>
      {notice ? <p role="status">{notice}</p> : null}
      <Button type="submit">Review reset form</Button>
    </form>
  )
}
