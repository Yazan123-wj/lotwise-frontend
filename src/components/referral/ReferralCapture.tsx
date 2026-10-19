import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { captureReferral } from '@/services/referral'

export function ReferralCapture() {
  const [params] = useSearchParams()
  const ref = params.get('ref')
  const [seen, setSeen] = useState<string | null>(null)

  if (ref && ref !== seen) {
    setSeen(ref)
    captureReferral(ref)
  }

  return null
}
