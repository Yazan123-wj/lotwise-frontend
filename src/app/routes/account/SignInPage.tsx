import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { FormField, FormNote } from '@/components/forms/FormField'
import { Button } from '@/components/ui/Button'
import { useDemoAccount } from '@/hooks/useDemoAccount'
import { usePageTitle } from '@/hooks/usePageTitle'
import { validateAuth, type FieldErrors } from '@/utils/validation'

export function SignInPage() {
  usePageTitle('Sign in')
  const { startPreview } = useDemoAccount()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [notice, setNotice] = useState('')

  return (
    <form
      className="max-w-md space-y-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        const next = validateAuth('sign-in', { email, password })
        setErrors(next)
        setPassword('')
        setNotice(Object.keys(next).length === 0 ? 'No account was accessed. The password was discarded.' : '')
      }}
    >
      <h2 className="text-xl font-bold">Sign in</h2>
      <DemoNotice>Submitting this form does not check a password or start a session.</DemoNotice>
      <FormNote />
      <FormField id="sign-in-email" label="Email" required error={errors.email}>
        <input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} />
      </FormField>
      <FormField id="sign-in-password" label="Password" required error={errors.password}>
        <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </FormField>
      {notice ? <p role="status">{notice}</p> : null}
      <div className="flex flex-wrap gap-2">
        <Button type="submit">Review sign-in form</Button>
        <Button variant="secondary" onClick={startPreview}>
          Preview signed-in screens
        </Button>
      </div>
      <p className="text-sm">
        <Link to="/account/register" className="underline-offset-2 hover:underline">
          Registration form
        </Link>
        {' · '}
        <Link to="/account/reset" className="underline-offset-2 hover:underline">
          Password reset form
        </Link>
      </p>
    </form>
  )
}
