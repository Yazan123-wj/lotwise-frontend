import { useState } from 'react'
import { CatalogHero } from '@/components/home/CatalogHero'
import { PageContainer } from '@/components/layout/PageContainer'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { ReferralLinkCard } from '@/components/referral/ReferralLinkCard'
import { Button } from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'
import {
  clearAppliedReferral,
  getAppliedReferral,
  getOwnReferralCode,
  referralVisits,
  setAppliedReferral,
} from '@/services/referral'

export function ReferralPage() {
  usePageTitle('Referral')
  const [code] = useState(getOwnReferralCode)
  const [applied, setApplied] = useState(getAppliedReferral)
  const [visits, setVisits] = useState(referralVisits)
  const [draft, setDraft] = useState('')
  const [note, setNote] = useState('')

  function applyCode() {
    const next = draft.trim().toUpperCase()
    if (!next) {
      setNote('Enter a referral code.')
      return
    }
    if (next === code) {
      setNote('That is your own code. Share it instead of applying it here.')
      return
    }
    setAppliedReferral(next)
    setApplied(next)
    setDraft('')
    setVisits(referralVisits())
    setNote(`${next} will be attached to checkout in this browser.`)
  }

  return (
    <PageContainer className="space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Referral' },
        ]}
      />
      <CatalogHero
        heading="h1"
        eyebrow="Referral link"
        title="Share your catalogue link"
        copy="Anyone who opens your link in this browser gets the code attached to checkout. Visits are stored on this device only. Nothing is sent to a server."
      />
      <ReferralLinkCard />
      <section className="rounded-2xl border border-wire-line bg-white p-5 sm:p-6">
          <h2 className="text-lg font-medium text-navy">Apply a code</h2>
          <p className="mt-1 text-sm text-wire-muted">
            {applied ? `Attached to checkout: ${applied}` : 'No referral code is attached yet.'}
          </p>
          <form
            className="mt-4 flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault()
              applyCode()
            }}
          >
            <label className="sr-only" htmlFor="referral-code">
              Referral code
            </label>
            <input
              id="referral-code"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="LW-XXXXXXXX"
              className="min-h-11 flex-1 rounded-full border border-wire-line bg-white px-4 text-sm text-navy"
            />
            <Button type="submit" className="rounded-full">
              Attach
            </Button>
          </form>
          {applied ? (
            <button
              type="button"
              className="mt-3 text-sm text-royal underline-offset-4 hover:underline"
              onClick={() => {
                clearAppliedReferral()
                setApplied(null)
                setNote('Referral code removed from this browser.')
              }}
            >
              Remove attached code
            </button>
          ) : null}
        </section>
      {note ? (
        <p role="status" className="text-sm text-navy">
          {note}
        </p>
      ) : null}
      <section className="rounded-2xl border border-wire-line bg-white p-5 sm:p-6">
        <h2 className="text-lg font-medium text-navy">Opened in this browser</h2>
        {visits.length === 0 ? (
          <p className="mt-2 text-sm text-wire-muted">
            No incoming codes yet. Open a shared link, or attach a code above, and it will travel with checkout.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-wire-line text-sm">
            {visits.map((visit) => (
              <li key={visit.code} className="flex items-center justify-between py-3">
                <span className="font-medium text-navy">{visit.code}</span>
                <span className="text-wire-muted">
                  {visit.count} {visit.count === 1 ? 'open' : 'opens'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageContainer>
  )
}
