import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { FormField, FormNote } from '@/components/forms/FormField'
import { Button, buttonClass } from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'
import { validateAuth, type FieldErrors } from '@/utils/validation'

export function AdminLoginPage() {
  usePageTitle('Admin sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [ready, setReady] = useState(false)

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-4 py-10">
      <p className="text-xs font-medium uppercase tracking-wider text-royal">LotWise Labs</p>
      <h1 className="text-3xl font-medium tracking-tight text-navy">Admin sign-in</h1>
      <DemoNotice>This screen is a layout preview. It does not authenticate an administrator.</DemoNotice>
      <form
        className="space-y-4 border border-wire-line bg-white p-4"
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          const next = validateAuth('sign-in', { email, password })
          setErrors(next)
          setPassword('')
          setReady(Object.keys(next).length === 0)
        }}
      >
        <FormNote />
        <FormField id="admin-email" label="Email" required error={errors.email}>
          <input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} />
        </FormField>
        <FormField id="admin-password" label="Password" required error={errors.password}>
          <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </FormField>
        <Button type="submit">Review admin form</Button>
      </form>
      {ready ? (
        <div className="space-y-3">
          <DemoNotice>No administrator was signed in. You can still open the admin preview.</DemoNotice>
          <Link to="/admin" className={buttonClass()}>
            Open admin
          </Link>
        </div>
      ) : null}
      <Link to="/" className="text-sm underline-offset-2 hover:underline">
        Back to the storefront
      </Link>
    </main>
  )
}
