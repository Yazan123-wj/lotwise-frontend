import { useState } from 'react'
import { getOwnReferralCode, referralUrl } from '@/services/referral'

export function ReferralLinkCard() {
  const [code] = useState(getOwnReferralCode)
  const [copied, setCopied] = useState(false)
  const link = typeof window === 'undefined' ? `/?ref=${code}` : referralUrl(window.location.origin, code)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="rounded-[1.75rem] bg-navy px-6 py-8 text-white sm:px-8" aria-labelledby="your-referral-link">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/50">Your referral link</p>
      <h2 id="your-referral-link" className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl">
        {code}
      </h2>
      <p className="mt-4 break-all rounded-2xl bg-white/10 px-4 py-3 text-sm text-white">{link}</p>
      <button
        type="button"
        className="mt-5 inline-flex min-h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-navy hover:bg-brand-sky"
        onClick={copyLink}
      >
        {copied ? 'Copied' : 'Copy link'}
      </button>
    </section>
  )
}
