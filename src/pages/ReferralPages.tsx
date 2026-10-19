import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import SpecularButton from "../components/SpecularButton.tsx"
import { api } from "../lib/api.ts"
import { formatDate, formatMoney } from "../lib/catalog.ts"
import { useTitle } from "../lib/useTitle.ts"
import { sessionError, useSession, type VisitResult } from "../state/session.tsx"

type Dashboard = {
  code: string
  active: boolean
  disabledReason: string | null
  url: string
  message: string
  program: VisitResult["program"] & { explanation: string; manualReview: boolean; waitingDays: number }
  stats: { visits: number; registrations: number; qualified: number; pendingRewards: number; availableRewards: number }
  rewards: Array<{ code: string | null; status: string; reward_type: string; reward_value: number; recipient: string; expires_at: string | null }>
  activity: {
    page: number
    pageSize: number
    total: number
    items: Array<{ id: string; friend: string; referredAt: string; status: string; rewardStatus: string; rewardCode: string | null }>
  }
}

function benefitLabel(benefit: { type: "percentage" | "fixed"; value: number }) {
  return benefit.type === "percentage" ? `${benefit.value}%` : formatMoney(benefit.value)
}

export function ReferralDashboardPage() {
  useTitle("Refer a friend")
  const session = useSession()
  const [page, setPage] = useState(1)
  const [reload, setReload] = useState(0)
  const [data, setData] = useState<Dashboard | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState("")
  const [copyNote, setCopyNote] = useState("")
  const [shareNote, setShareNote] = useState("")

  useEffect(() => {
    if (!session.ready || !session.customer) {
      setLoading(false)
      return
    }
    let cancel = false
    setLoading(true)
    setError("")
    api<Dashboard>(`/api/account/referral?page=${page}`)
      .then((next) => {
        if (cancel) return
        setData(next)
        setDraft((current) => current || `${next.message} ${next.url}`)
      })
      .catch((reason: unknown) => {
        if (!cancel) setError(sessionError(reason, "Your referrals could not be loaded."))
      })
      .finally(() => {
        if (!cancel) setLoading(false)
      })
    return () => {
      cancel = true
    }
  }, [page, reload, session.customer, session.ready])

  async function copy(value: string, success: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopyNote(success)
      setShareNote("")
    } catch {
      setCopyNote("The link could not be copied. Select it and copy it manually.")
    }
  }

  async function nativeShare() {
    if (!data) return
    if (!navigator.share) {
      setShareNote("Sharing is not available in this browser. Copy the link instead.")
      return
    }
    try {
      await navigator.share({ title: "LotWise Labs", text: draft, url: data.url })
      setShareNote("Share sheet opened.")
    } catch (reason) {
      const name = reason instanceof DOMException ? reason.name : ""
      setShareNote(name === "AbortError" ? "Share was cancelled." : "Share could not be opened.")
    }
  }

  function openShare(href: string) {
    const popup = window.open(href, "_blank", "noopener,noreferrer")
    if (!popup) setShareNote("The share window was blocked.")
    else setShareNote("")
  }

  if (!session.ready || (session.customer && loading && !data)) {
    return <p className="meta">Loading your referrals…</p>
  }

  if (!session.customer) {
    return (
      <div className="panel">
        <h2 className="display" style={{ fontSize: 40 }}>Sign in to refer a friend</h2>
        <p className="lede">Your referral link is created for your account and stored with the referral service. The sample preview does not issue a link.</p>
        <div className="buy-row" style={{ marginTop: 16 }}>
          <SpecularButton tone="primary" to="/account/sign-in">Sign in</SpecularButton>
          <SpecularButton tone="ghost" to="/account/register">Create account</SpecularButton>
        </div>
      </div>
    )
  }

  return (
    <div className="referral">
      <header className="page-hero">
        <p className="eyebrow">Refer a friend</p>
        <h1 className="display">Good Things Are Better Shared</h1>
        <p className="lede">Invite your friends to discover LotWise Labs and track your referrals in one place.</p>
      </header>
      {error ? (
        <div className="error-box">
          <p>{error}</p>
          <SpecularButton tone="ghost" type="button" onClick={() => setReload((value) => value + 1)}>Try again</SpecularButton>
        </div>
      ) : null}
      {data ? (
        <>
          <section className="panel">
            <h2>Your referral link</h2>
            {!data.active ? <p className="notice">This link is disabled{data.disabledReason ? `: ${data.disabledReason}` : "."}</p> : null}
            <div className="referral-link">
              <input aria-label="Referral link" readOnly value={data.url} />
              <SpecularButton tone="primary" type="button" onClick={() => copy(data.url, "Referral link copied.")}>Copy referral link</SpecularButton>
            </div>
            <div className="share-row">
              <SpecularButton tone="ghost" type="button" onClick={() => openShare(`https://wa.me/?text=${encodeURIComponent(draft)}`)}>Share on WhatsApp</SpecularButton>
              <SpecularButton tone="ghost" type="button" onClick={() => openShare(`mailto:?subject=${encodeURIComponent("LotWise Labs")}&body=${encodeURIComponent(draft)}`)}>Share via email</SpecularButton>
              <SpecularButton tone="ghost" type="button" onClick={nativeShare}>Share…</SpecularButton>
            </div>
            <label className="field">
              <span>Invitation</span>
              <textarea value={draft} onChange={(event) => setDraft(event.target.value)} />
            </label>
            <SpecularButton tone="ghost" type="button" onClick={() => copy(draft, "Invitation copied.")}>Copy invitation</SpecularButton>
            <p className="notice" aria-live="polite">{copyNote || shareNote}</p>
            <p className="meta">{data.program.explanation}</p>
          </section>
          <div className="stats">
            <article className="stat"><span className="meta">Total referral visits</span><b>{data.stats.visits}</b></article>
            <article className="stat"><span className="meta">Referred registrations</span><b>{data.stats.registrations}</b></article>
            <article className="stat"><span className="meta">Qualified referrals</span><b>{data.stats.qualified}</b></article>
            <article className="stat"><span className="meta">Pending rewards</span><b>{data.stats.pendingRewards}</b></article>
            <article className="stat"><span className="meta">Available rewards</span><b>{data.stats.availableRewards}</b></article>
          </div>
          {data.rewards.length > 0 ? (
            <section className="panel">
              <h2>Your rewards</h2>
              {data.rewards.map((reward) => (
                <p key={`${reward.recipient}-${reward.code ?? reward.status}`}>
                  <strong>{reward.recipient === "friend" ? "Friend benefit" : "Referrer reward"}</strong>
                  {" · "}{reward.status}
                  {reward.reward_type === "percentage" ? ` · ${reward.reward_value}%` : ` · ${formatMoney(reward.reward_value)}`}
                  {reward.code ? ` · ${reward.code}` : ""}
                  {reward.expires_at ? ` · expires ${formatDate(reward.expires_at)}` : ""}
                </p>
              ))}
              <p className="meta">A reward code applies only to the account it was issued to, and only after an administrator has configured the amount.</p>
            </section>
          ) : null}
          <section>
            <h2>Referral activity</h2>
            {data.activity.items.length === 0 ? (
              <div className="empty">
                <p>No referrals yet. Share your link to record the first visit.</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Friend</th><th>Date referred</th><th>Status</th><th>Reward</th></tr>
                  </thead>
                  <tbody>
                    {data.activity.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.friend}</td>
                        <td>{formatDate(item.referredAt)}</td>
                        <td>{item.status}</td>
                        <td>{item.rewardStatus}{item.rewardCode ? ` · ${item.rewardCode}` : ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {data.activity.total > data.activity.pageSize ? (
              <div className="buy-row" style={{ marginTop: 12 }}>
                <button className="text-btn" type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</button>
                <span className="meta">Page {data.activity.page} of {Math.ceil(data.activity.total / data.activity.pageSize)}</span>
                <button className="text-btn" type="button" disabled={page * data.activity.pageSize >= data.activity.total} onClick={() => setPage((value) => value + 1)}>Next</button>
              </div>
            ) : null}
          </section>
        </>
      ) : null}
    </div>
  )
}

export function ReferralLandingPage() {
  useTitle("Referral")
  const { code = "" } = useParams()
  const session = useSession()
  const [result, setResult] = useState<VisitResult | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancel = false
    setResult(null)
    setError("")
    session.captureReferral(code)
      .then((next) => {
        if (!cancel) setResult(next)
      })
      .catch((reason: unknown) => {
        if (!cancel) setError(sessionError(reason, "This referral link could not be checked."))
      })
    return () => {
      cancel = true
    }
  }, [code])

  const offer = result?.program.offer
  const headline = result?.state === "ok"
    ? offer?.headline || "A friend shared LotWise Labs with you."
    : result?.state === "self"
      ? "This is your own referral link."
      : result?.state === "existing_customer"
        ? "Referral links are for new accounts."
        : result?.state === "expired"
          ? "This referral link has expired."
          : result?.state === "disabled"
            ? "This referral link is no longer active."
            : result?.state === "program_off"
              ? "The referral program is paused."
              : result?.state === "invalid"
                ? "This referral link is not valid."
                : "Checking this referral link."

  return (
    <div className="wrap referral-landing">
      <header className="page-hero">
        <p className="eyebrow">Referral</p>
        <h1 className="display">{headline}</h1>
        {error ? <p className="lede">{error}</p> : null}
        {result?.state === "ok" ? (
          <p className="lede">{offer?.summary || "Create an account to keep this invitation with your visit. No reward is promised unless the program has one configured."}</p>
        ) : null}
        {result?.state === "self" ? <p className="lede">Share it with someone else. Opening it yourself does not create a referral.</p> : null}
        {result?.state === "existing_customer" ? <p className="lede">You already have an account, so this visit is not linked to a new registration.</p> : null}
      </header>
      {result?.state === "ok" ? (
        <section className="panel">
          <h2>How it works</h2>
          <ol className="referral-steps">
            <li>You opened a personal referral link. The visit is recorded without the referrer’s private details.</li>
            <li>Create an account and the invitation stays attached to that new account.</li>
            <li>Qualification follows the program rules. If no reward is configured, nothing is offered.</li>
          </ol>
          {offer?.friendBenefit ? <p className="notice">Configured friend benefit: {benefitLabel(offer.friendBenefit)}. It is issued only after the qualification rules are met.</p> : <p className="notice">No friend benefit is configured, so this invitation does not promise a discount or reward.</p>}
          <div className="buy-row">
            <SpecularButton tone="primary" to="/shop">Explore products</SpecularButton>
            <SpecularButton tone="ghost" to="/account/register">Create account</SpecularButton>
          </div>
          <p className="meta"><Link to={result.program.termsPath}>Referral terms</Link></p>
        </section>
      ) : result ? (
        <div className="buy-row">
          <SpecularButton tone="primary" to="/shop">Explore products</SpecularButton>
          <SpecularButton tone="ghost" to={result.program.termsPath}>Referral terms</SpecularButton>
        </div>
      ) : !error ? <p className="meta">Loading…</p> : (
        <SpecularButton tone="primary" to="/shop">Explore products</SpecularButton>
      )}
    </div>
  )
}

export function ReferralInfoPage() {
  useTitle("Referral")
  const session = useSession()
  return (
    <div className="wrap" style={{ paddingBottom: 64 }}>
      <header className="page-hero">
        <p className="eyebrow">Referral</p>
        <h1 className="display">Refer a friend</h1>
        <p className="lede">Signed-in customers receive one personal link. Visits, new accounts, and rewards are stored by the referral service. Reward amounts stay empty until an administrator configures them.</p>
      </header>
      <div className="buy-row">
        {session.customer ? <SpecularButton tone="primary" to="/account/referrals">Open your referrals</SpecularButton> : <SpecularButton tone="primary" to="/account/sign-in">Sign in</SpecularButton>}
        <SpecularButton tone="ghost" to="/policies/referral">Referral terms</SpecularButton>
      </div>
    </div>
  )
}
