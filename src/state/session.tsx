import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { useLocation } from "react-router-dom"
import { ApiError, api } from "../lib/api.ts"

export type SessionCustomer = { id: string; name: string; email: string }

export type VisitResult = {
  state: "ok" | "invalid" | "expired" | "disabled" | "self" | "program_off" | "existing_customer"
  program: {
    enabled: boolean
    termsPath: string
    rewardsConfigured: boolean
    friendBenefitConfigured: boolean
    qualifyingAction: "registration" | "purchase" | null
    offer: null | {
      headline: string | null
      summary: string | null
      friendBenefit: null | { type: "percentage" | "fixed"; value: number }
    }
  }
}

type SessionValue = {
  ready: boolean
  customer: SessionCustomer | null
  attribution: { attached: boolean; code: string | null }
  refresh: () => Promise<void>
  register: (input: { name: string; email: string; password: string }) => Promise<{ linked: boolean }>
  login: (input: { email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  captureReferral: (code: string) => Promise<VisitResult>
}

const SessionContext = createContext<SessionValue | null>(null)
const visitRequests = new Map<string, Promise<VisitResult>>()

export function SessionProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [ready, setReady] = useState(false)
  const [customer, setCustomer] = useState<SessionCustomer | null>(null)
  const [attribution, setAttribution] = useState<{ attached: boolean; code: string | null }>({ attached: false, code: null })

  async function refresh() {
    const [me, attached] = await Promise.all([
      api<{ customer: SessionCustomer | null }>("/api/auth/me"),
      api<{ attached: boolean; code: string | null }>("/api/referrals/attribution"),
    ])
    setCustomer(me.customer)
    setAttribution(attached)
  }

  function captureReferral(code: string) {
    const key = code.trim().toUpperCase()
    const existing = visitRequests.get(key)
    if (existing) return existing
    const request = api<VisitResult>(`/api/referrals/visit/${encodeURIComponent(code.trim())}`, { method: "POST" })
      .then(async (result) => {
        const attached = await api<{ attached: boolean; code: string | null }>("/api/referrals/attribution")
        setAttribution(attached)
        return result
      })
      .catch((error: unknown) => {
        visitRequests.delete(key)
        throw error
      })
    visitRequests.set(key, request)
    return request
  }

  useEffect(() => {
    let cancel = false
    async function load() {
      try {
        if (!location.pathname.startsWith("/ref/")) {
          const ref = new URLSearchParams(window.location.search).get("ref")?.trim()
          if (ref) await captureReferral(ref)
        }
        if (!cancel) await refresh()
      } catch {
        if (!cancel) {
          setCustomer(null)
          setAttribution({ attached: false, code: null })
        }
      } finally {
        if (!cancel) setReady(true)
      }
    }
    void load()
    return () => {
      cancel = true
    }
  }, [location.pathname, location.search])

  const value = useMemo<SessionValue>(() => ({
    ready,
    customer,
    attribution,
    refresh,
    captureReferral,
    register: async (input) => {
      const result = await api<{ customer: SessionCustomer; linked: boolean }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(input),
      })
      setCustomer(result.customer)
      setAttribution({ attached: false, code: null })
      return { linked: result.linked }
    },
    login: async (input) => {
      const result = await api<{ customer: SessionCustomer }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(input),
      })
      setCustomer(result.customer)
    },
    logout: async () => {
      await api("/api/auth/logout", { method: "POST" })
      setCustomer(null)
    },
  }), [attribution, customer, ready])

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const value = useContext(SessionContext)
  if (!value) throw new Error("useSession must be used inside SessionProvider")
  return value
}

export function sessionError(error: unknown, fallback: string) {
  if (error instanceof ApiError) return error.message
  return fallback
}
