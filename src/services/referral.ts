const CODE_KEY = 'lotwise-referral-code'
const APPLIED_KEY = 'lotwise-referral-applied'
const VISITS_KEY = 'lotwise-referral-visits'

function readVisits(): Record<string, number> {
  try {
    const parsed = JSON.parse(localStorage.getItem(VISITS_KEY) || '{}') as unknown
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed as Record<string, number>
  } catch {
    return {}
  }
}

export function getOwnReferralCode(): string {
  try {
    const existing = localStorage.getItem(CODE_KEY)
    if (existing) return existing
    const code = `LW-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
    localStorage.setItem(CODE_KEY, code)
    return code
  } catch {
    return 'LW-DEMO'
  }
}

export function referralUrl(origin: string, code = getOwnReferralCode()) {
  const url = new URL(origin)
  url.searchParams.set('ref', code)
  url.pathname = '/'
  url.hash = ''
  return url.toString()
}

export function getAppliedReferral(): string | null {
  try {
    return localStorage.getItem(APPLIED_KEY)
  } catch {
    return null
  }
}

export function setAppliedReferral(code: string) {
  const clean = code.trim().toUpperCase()
  if (!clean) return null
  try {
    localStorage.setItem(APPLIED_KEY, clean)
  } catch {
    return null
  }
  return clean
}

export function clearAppliedReferral() {
  try {
    localStorage.removeItem(APPLIED_KEY)
  } catch {
    /* the in-memory page can still clear its own display */
  }
}

export function captureReferral(code: string) {
  const clean = code.trim().toUpperCase()
  if (!clean) return
  const own = getOwnReferralCode()
  if (clean === own) return
  try {
    localStorage.setItem(APPLIED_KEY, clean)
    const seenKey = `lotwise-ref-seen-${clean}`
    if (sessionStorage.getItem(seenKey)) return
    sessionStorage.setItem(seenKey, '1')
    const visits = readVisits()
    visits[clean] = (visits[clean] ?? 0) + 1
    localStorage.setItem(VISITS_KEY, JSON.stringify(visits))
  } catch {
    /* the link still applies for this view when storage is blocked */
  }
}

export function referralVisits(): { code: string; count: number }[] {
  return Object.entries(readVisits())
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count)
}
