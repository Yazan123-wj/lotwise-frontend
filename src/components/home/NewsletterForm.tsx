import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { Button } from '@/components/ui/Button'
import { isEmail } from '@/utils/fields'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const describedBy = [error ? 'newsletter-email-error' : '', 'newsletter-email-hint'].filter(Boolean).join(' ')

  return (
    <div className="grid items-center gap-8 bg-white px-6 py-10 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-14">
      <div>
        <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-royal">
          <span className="h-px w-8 bg-royal" aria-hidden="true" />
          LotWise Labs
        </p>
        <h2 id="newsletter" className="mt-4 text-3xl font-medium tracking-tight text-navy sm:text-4xl">
          Newsletter
        </h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-wire-muted">
          A preview of newsletter signup. An address entered here is not stored or subscribed.
        </p>
      </div>
      <form
        className="space-y-3"
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          if (!isEmail(email)) {
            setError('Enter an email address.')
            setDone(false)
            return
          }
          setError('')
          setDone(true)
          setEmail('')
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <label className="sr-only" htmlFor="newsletter-email">
            Email
          </label>
          <input
            id="newsletter-email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email address"
            value={email}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            onChange={(event) => setEmail(event.target.value)}
            className="min-h-11 w-full border border-wire-line bg-wire-bg px-3 py-2 text-sm text-navy placeholder:text-wire-muted sm:min-w-0 sm:flex-1"
          />
          <Button type="submit" className="sm:shrink-0">
            Preview signup
            <ArrowRight aria-hidden="true" size={16} strokeWidth={1.75} />
          </Button>
        </div>
        <p id="newsletter-email-hint" className="text-xs text-wire-muted">
          A newsletter signup will be connected later.
        </p>
        {error ? (
          <p id="newsletter-email-error" role="alert" className="text-sm text-navy">
            {error}
          </p>
        ) : null}
        {done ? <DemoNotice>This address was not stored or subscribed.</DemoNotice> : null}
      </form>
    </div>
  )
}
