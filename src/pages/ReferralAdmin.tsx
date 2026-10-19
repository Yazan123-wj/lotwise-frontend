import { useEffect, useState, type FormEvent } from "react"
import { api } from "../lib/api.ts"
import { useTitle } from "../lib/useTitle.ts"
import { sessionError } from "../state/session.tsx"
import SpecularButton from "../components/SpecularButton.tsx"

type Program = {
  enabled: boolean
  qualifyingAction: "registration" | "purchase" | null
  referrerRewardEnabled: boolean
  friendBenefitEnabled: boolean
  rewardType: "percentage" | "fixed" | null
  rewardValue: number | null
  friendBenefitType: "percentage" | "fixed" | null
  friendBenefitValue: number | null
  minPurchase: number | null
  waitingDays: number
  rewardExpiresDays: number | null
  codeExpiresDays: number | null
  maxQualifiedPerReferrer: number | null
  manualReview: boolean
  termsPath: string
  offerHeadline: string | null
  offerSummary: string | null
}

type ReferralRow = {
  id: string
  code: string
  referrerEmail: string
  friendEmail: string | null
  status: string
  statusLabel: string
  clickedAt: string
  orderId: string | null
  orderNumber: string | null
  orderStatus: string | null
  rejectionReason: string | null
}

type RewardRow = {
  id: string
  recipient: string
  status: string
  code: string | null
  reward_type: string
  reward_value: number
  customer_email: string
}

type AuditRow = { id: string; created_at: string; actor_kind: string; action: string; detail: string }

const emptyProgram: Program = {
  enabled: true,
  qualifyingAction: null,
  referrerRewardEnabled: false,
  friendBenefitEnabled: false,
  rewardType: null,
  rewardValue: null,
  friendBenefitType: null,
  friendBenefitValue: null,
  minPurchase: null,
  waitingDays: 0,
  rewardExpiresDays: null,
  codeExpiresDays: null,
  maxQualifiedPerReferrer: null,
  manualReview: false,
  termsPath: "/policies/referral",
  offerHeadline: null,
  offerSummary: null,
}

function num(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim()
  return text === "" ? null : Number(text)
}

export function ReferralsAdmin() {
  useTitle("Referrals")
  const [adminEmail, setAdminEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [program, setProgram] = useState<Program>(emptyProgram)
  const [rows, setRows] = useState<ReferralRow[]>([])
  const [rewards, setRewards] = useState<RewardRow[]>([])
  const [audit, setAudit] = useState<AuditRow[]>([])
  const [status, setStatus] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [note, setNote] = useState("")
  const [error, setError] = useState("")
  const [reason, setReason] = useState("")
  const [code, setCode] = useState("")
  const [formKey, setFormKey] = useState(0)

  async function load(nextPage = page) {
    const params = new URLSearchParams({ page: String(nextPage) })
    if (status) params.set("status", status)
    if (from) params.set("from", new Date(from).toISOString())
    if (to) params.set("to", new Date(to).toISOString())
    const [programRes, list, rewardRes, auditRes] = await Promise.all([
      api<{ program: Program }>("/api/admin/referrals/program"),
      api<{ items: ReferralRow[]; total: number; page: number }>(`/api/admin/referrals?${params}`),
      api<{ rewards: RewardRow[] }>("/api/admin/referrals/rewards"),
      api<{ audit: AuditRow[] }>("/api/admin/referrals/audit"),
    ])
    setProgram(programRes.program)
    setFormKey((value) => value + 1)
    setRows(list.items)
    setTotal(list.total)
    setPage(list.page)
    setRewards(rewardRes.rewards)
    setAudit(auditRes.audit)
  }

  useEffect(() => {
    api<{ admin: { email: string } | null }>("/api/auth/admin/me")
      .then((result) => setAuthed(Boolean(result.admin)))
      .catch(() => setAuthed(false))
  }, [])

  useEffect(() => {
    if (!authed) return
    load().catch((reason: unknown) => setError(sessionError(reason, "Referrals could not be loaded.")))
  }, [authed])

  async function signIn(event: FormEvent) {
    event.preventDefault()
    setError("")
    try {
      await api("/api/auth/admin/login", { method: "POST", body: JSON.stringify({ email: adminEmail, password }) })
      setAuthed(true)
      setPassword("")
    } catch (reason) {
      setError(sessionError(reason, "Administrator sign-in failed."))
    }
  }

  async function saveProgram(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setError("")
    try {
      const result = await api<{ program: Program }>("/api/admin/referrals/program", {
        method: "PUT",
        body: JSON.stringify({
          enabled: data.get("enabled") === "on",
          qualifyingAction: String(data.get("qualifyingAction") || "") || null,
          referrerRewardEnabled: data.get("referrerRewardEnabled") === "on",
          friendBenefitEnabled: data.get("friendBenefitEnabled") === "on",
          rewardType: String(data.get("rewardType") || "") || null,
          rewardValue: num(data.get("rewardValue")),
          friendBenefitType: String(data.get("friendBenefitType") || "") || null,
          friendBenefitValue: num(data.get("friendBenefitValue")),
          minPurchase: num(data.get("minPurchase")),
          waitingDays: num(data.get("waitingDays")) ?? 0,
          rewardExpiresDays: num(data.get("rewardExpiresDays")),
          codeExpiresDays: num(data.get("codeExpiresDays")),
          maxQualifiedPerReferrer: num(data.get("maxQualifiedPerReferrer")),
          manualReview: data.get("manualReview") === "on",
          termsPath: String(data.get("termsPath") || "/policies/referral"),
          offerHeadline: String(data.get("offerHeadline") || ""),
          offerSummary: String(data.get("offerSummary") || ""),
        }),
      })
      setProgram(result.program)
      setNote("Program settings were saved.")
      await load()
    } catch (reason) {
      setError(sessionError(reason, "The program could not be saved."))
    }
  }

  async function act(path: string, body?: unknown) {
    setError("")
    try {
      await api(path, { method: "POST", body: JSON.stringify(body ?? {}) })
      setNote("The change was saved.")
      await load()
    } catch (reason) {
      setError(sessionError(reason, "That change was rejected."))
    }
  }

  if (authed === null) return <p className="meta">Checking administrator access…</p>
  if (!authed) {
    return (
      <form className="panel" onSubmit={signIn}>
        <h1 className="display">Referral admin</h1>
        <p className="lede">Referral management requires an administrator session. The rest of this wireframe stays open.</p>
        <label className="field"><span>Email</span><input value={adminEmail} onChange={(event) => setAdminEmail(event.target.value)} type="email" required /></label>
        <label className="field"><span>Password</span><input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required /></label>
        <SpecularButton tone="primary" type="submit">Sign in</SpecularButton>
        {error ? <p className="notice">{error}</p> : null}
      </form>
    )
  }

  return (
    <div className="referral-admin">
      <h1 className="display">Referrals</h1>
      <p className="meta">Counts come from the referral database. Leave reward amounts empty until the business sets them. Nothing on this page invents an offer.</p>
      {note ? <p className="notice">{note}</p> : null}
      {error ? <p className="notice">{error}</p> : null}
      <form className="panel" key={formKey} onSubmit={saveProgram}>
        <h2>Program</h2>
        <label className="field"><span><input name="enabled" type="checkbox" defaultChecked={program.enabled} /> Enabled</span></label>
        <label className="field"><span>Qualifying action</span>
          <select name="qualifyingAction" defaultValue={program.qualifyingAction ?? ""}>
            <option value="">Not configured</option>
            <option value="registration">Registration</option>
            <option value="purchase">Paid order</option>
          </select>
        </label>
        <label className="field"><span><input name="manualReview" type="checkbox" defaultChecked={program.manualReview} /> Manual review</span></label>
        <label className="field"><span><input name="referrerRewardEnabled" type="checkbox" defaultChecked={program.referrerRewardEnabled} /> Referrer reward</span></label>
        <label className="field"><span>Reward type</span>
          <select name="rewardType" defaultValue={program.rewardType ?? ""}>
            <option value="">Not set</option>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
        </label>
        <label className="field"><span>Reward value</span><input name="rewardValue" defaultValue={program.rewardValue ?? ""} /></label>
        <label className="field"><span><input name="friendBenefitEnabled" type="checkbox" defaultChecked={program.friendBenefitEnabled} /> Friend benefit</span></label>
        <label className="field"><span>Friend benefit type</span>
          <select name="friendBenefitType" defaultValue={program.friendBenefitType ?? ""}>
            <option value="">Not set</option>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
        </label>
        <label className="field"><span>Friend benefit value</span><input name="friendBenefitValue" defaultValue={program.friendBenefitValue ?? ""} /></label>
        <label className="field"><span>Minimum purchase</span><input name="minPurchase" defaultValue={program.minPurchase ?? ""} /></label>
        <label className="field"><span>Waiting days</span><input name="waitingDays" defaultValue={program.waitingDays} /></label>
        <label className="field"><span>Reward expires after days</span><input name="rewardExpiresDays" defaultValue={program.rewardExpiresDays ?? ""} /></label>
        <label className="field"><span>Link expires after days</span><input name="codeExpiresDays" defaultValue={program.codeExpiresDays ?? ""} /></label>
        <label className="field"><span>Qualified referrals per customer</span><input name="maxQualifiedPerReferrer" defaultValue={program.maxQualifiedPerReferrer ?? ""} /></label>
        <label className="field"><span>Terms path</span><input name="termsPath" defaultValue={program.termsPath} /></label>
        <label className="field"><span>Offer headline</span><input name="offerHeadline" defaultValue={program.offerHeadline ?? ""} /></label>
        <label className="field"><span>Offer summary</span><textarea name="offerSummary" defaultValue={program.offerSummary ?? ""} /></label>
        <SpecularButton tone="primary" type="submit">Save program</SpecularButton>
      </form>
      <form className="lookup" onSubmit={(event) => { event.preventDefault(); load(1).catch((reason: unknown) => setError(sessionError(reason, "The filter failed."))) }}>
        <select aria-label="Status" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All statuses</option>
          {["clicked", "registered", "awaiting_qualification", "qualified", "reward_available", "reward_issued", "rejected"].map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <input aria-label="From" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
        <input aria-label="To" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
        <SpecularButton tone="ghost" type="submit">Filter</SpecularButton>
      </form>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Code</th><th>Referrer</th><th>Friend</th><th>Status</th><th>Order</th><th></th></tr></thead>
          <tbody>
            {rows.length === 0 ? <tr><td colSpan={6}>No referrals match this filter.</td></tr> : rows.map((row) => (
              <tr key={row.id}>
                <td>{row.code}</td>
                <td>{row.referrerEmail}</td>
                <td>{row.friendEmail ?? "—"}</td>
                <td>{row.statusLabel}{row.rejectionReason ? ` · ${row.rejectionReason}` : ""}</td>
                <td>{row.orderNumber ? `${row.orderNumber} · ${row.orderStatus}` : "—"}</td>
                <td>
                  <button className="text-btn" type="button" onClick={() => act(`/api/admin/referrals/${row.id}/approve`)}>Approve</button>
                  <button className="text-btn" type="button" onClick={() => act(`/api/admin/referrals/${row.id}/reject`, { reason })}>Reject</button>
                  {row.orderId ? (
                    <>
                      <button className="text-btn" type="button" onClick={() => act(`/api/admin/orders/${row.orderId}/payment`, { status: "paid" })}>Mark paid</button>
                      <button className="text-btn" type="button" onClick={() => act(`/api/admin/orders/${row.orderId}/payment`, { status: "failed" })}>Mark failed</button>
                      <button className="text-btn" type="button" onClick={() => act(`/api/admin/orders/${row.orderId}/payment`, { status: "cancelled" })}>Cancel</button>
                      <button className="text-btn" type="button" onClick={() => act(`/api/admin/orders/${row.orderId}/payment`, { status: "refunded" })}>Refund</button>
                    </>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="buy-row">
        <button className="text-btn" type="button" disabled={page <= 1} onClick={() => load(page - 1)}>Previous</button>
        <span className="meta">{total} referrals</span>
        <button className="text-btn" type="button" disabled={page * 20 >= total} onClick={() => load(page + 1)}>Next</button>
      </div>
      <form className="panel" onSubmit={(event) => { event.preventDefault(); act(`/api/admin/referrals/codes/${encodeURIComponent(code)}/disable`, { reason }) }}>
        <h2>Disable a code</h2>
        <label className="field"><span>Code</span><input value={code} onChange={(event) => setCode(event.target.value)} required /></label>
        <label className="field"><span>Reason</span><input value={reason} onChange={(event) => setReason(event.target.value)} /></label>
        <div className="buy-row">
          <SpecularButton tone="primary" type="submit">Disable</SpecularButton>
          <SpecularButton tone="ghost" type="button" onClick={() => act(`/api/admin/referrals/codes/${encodeURIComponent(code)}/enable`)}>Enable</SpecularButton>
        </div>
      </form>
      <h2>Rewards</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Customer</th><th>Recipient</th><th>Status</th><th>Code</th><th>Value</th></tr></thead>
          <tbody>
            {rewards.length === 0 ? <tr><td colSpan={5}>No rewards have been issued.</td></tr> : rewards.map((reward) => (
              <tr key={reward.id}>
                <td>{reward.customer_email}</td>
                <td>{reward.recipient}</td>
                <td>{reward.status}</td>
                <td>{reward.code ?? "—"}</td>
                <td>{reward.reward_type} {reward.reward_value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Audit</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>When</th><th>Actor</th><th>Action</th><th>Detail</th></tr></thead>
          <tbody>
            {audit.length === 0 ? <tr><td colSpan={4}>No sensitive referral actions yet.</td></tr> : audit.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.created_at}</td>
                <td>{entry.actor_kind}</td>
                <td>{entry.action}</td>
                <td>{entry.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
