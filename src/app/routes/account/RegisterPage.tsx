import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { FormField, FormNote } from '@/components/forms/FormField'
import { Button } from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'
import { validateAuth, type FieldErrors } from '@/utils/validation'

export function RegisterPage() {
  usePageTitle('Register')
  const [values, setValues] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [notice, setNotice] = useState('')

  return (
    <form
      className="max-w-md space-y-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        const next = validateAuth('register', values)
        setErrors(next)
        setValues((current) => ({ ...current, password: '', confirm: '' }))
        setNotice(Object.keys(next).length === 0 ? 'No account was created. The password was discarded.' : '')
      }}
    >
      <h2 className="text-xl font-bold">Register</h2>
      <DemoNotice>This registration form does not create an account.</DemoNotice>
      <FormNote />
      <FormField id="register-first" label="First name" required error={errors.firstName}>
        <input value={values.firstName} onChange={(event) => setValues({ ...values, firstName: event.target.value })} />
      </FormField>
      <FormField id="register-last" label="Last name" required error={errors.lastName}>
        <input value={values.lastName} onChange={(event) => setValues({ ...values, lastName: event.target.value })} />
      </FormField>
      <FormField id="register-email" label="Email" required error={errors.email}>
        <input type="email" autoComplete="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} />
      </FormField>
      <FormField id="register-password" label="Password" required error={errors.password}>
        <input type="password" autoComplete="new-password" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} />
      </FormField>
      <FormField id="register-confirm" label="Confirm password" required error={errors.confirm}>
        <input type="password" autoComplete="new-password" value={values.confirm} onChange={(event) => setValues({ ...values, confirm: event.target.value })} />
      </FormField>
      {notice ? <p role="status">{notice}</p> : null}
      <Button type="submit">Review registration form</Button>
      <p className="text-sm">
        <Link to="/account/sign-in" className="underline-offset-2 hover:underline">
          Sign-in form
        </Link>
      </p>
    </form>
  )
}
