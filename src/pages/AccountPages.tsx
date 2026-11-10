import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"
import { Link, NavLink, Outlet, useLocation, useNavigate, useParams } from "react-router-dom"
import SpecularButton from "../components/SpecularButton.tsx"
import { api } from "../lib/api.ts"
import { formatDate, formatMoney } from "../lib/catalog.ts"
import { useTitle } from "../lib/useTitle.ts"
import { useCart } from "../state/cart.tsx"
import { sessionError, useSession, type SessionCustomer } from "../state/session.tsx"
import type { Address } from "../types.ts"

type AccountOrder = {
  id: string
  orderNumber: string
  status: string
  subtotal: number
  discountAmount: number
  discountCode: string | null
  total: number
  createdAt: string
  paidAt: string | null
}

function statusLabel(status: string) {
  if (status === "pending_payment") return "Awaiting payment"
  if (status === "paid") return "Paid"
  if (status === "failed") return "Failed"
  if (status === "cancelled") return "Cancelled"
  if (status === "refunded") return "Refunded"
  return status
}

function OrderCard({ order }: { order: AccountOrder }) {
  return (
    <Link className="order-card" to={`/account/orders/${order.id}`}>
      <span>
        <strong>{order.orderNumber}</strong>
        <span className="meta">{formatDate(order.createdAt)}</span>
        <span className="meta">{order.discountCode ? `Code ${order.discountCode}` : "No discount code"}</span>
      </span>
      <span className="order-card-side">
        <span className="order-status">{statusLabel(order.status)}</span>
        <b>{formatMoney(order.total)}</b>
      </span>
    </Link>
  )
}

const signedInLinks: Array<{ to: string; label: string; end?: boolean }> = [
  { to: "/account", label: "Overview", end: true },
  { to: "/account/profile", label: "Profile" },
  { to: "/account/addresses", label: "Addresses" },
  { to: "/account/orders", label: "Orders" },
  { to: "/account/referrals", label: "Refer a friend" },
]

const guestLinks: Array<{ to: string; label: string; end?: boolean }> = [
  { to: "/account/sign-in", label: "Sign in" },
  { to: "/account/register", label: "Create account" },
  { to: "/account/reset", label: "Reset password" },
]

function RequireAuth({ children }: { children: ReactNode }) {
  const session = useSession()
  if (!session.ready) return <p className="meta">Loading your account…</p>
  if (!session.customer) {
    return (
      <div className="account-empty">
        <h2>Sign in to continue</h2>
        <p className="lede">This page is only available when you are signed in.</p>
        <div className="account-empty__actions">
          <SpecularButton tone="primary" to="/account/sign-in">Sign in</SpecularButton>
          <SpecularButton tone="ghost" to="/account/register">Create account</SpecularButton>
        </div>
      </div>
    )
  }
  return children
}

export function AccountLayout() {
  useTitle("Account")
  const session = useSession()
  const { pathname } = useLocation()
  const navRef = useRef<HTMLElement>(null)
  const signedIn = Boolean(session.customer)
  const links = signedIn ? signedInLinks : guestLinks

  useEffect(() => {
    const nav = navRef.current
    const current = nav?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!nav || !current) return
    const navBox = nav.getBoundingClientRect()
    const item = current.getBoundingClientRect()
    if (item.left < navBox.left) nav.scrollLeft -= navBox.left - item.left + 14
    else if (item.right > navBox.right) nav.scrollLeft += item.right - navBox.right + 14
  }, [pathname])

  const initial = session.customer?.name?.trim()?.charAt(0)?.toUpperCase() || "L"

  return (
    <div className="wrap account-page">
      <header className="account-hero">
        <p className="eyebrow">Account</p>
        {session.customer ? (
          <div className="account-hero__user">
            <span className="account-avatar" aria-hidden="true">{initial}</span>
            <div>
              <h1>{session.customer.name}</h1>
              <p className="lede">{session.customer.email}</p>
            </div>
          </div>
        ) : (
          <>
            <h1>Sign in</h1>
            <p className="lede">Access your profile, orders, and referral link.</p>
          </>
        )}
      </header>
      <div className="account">
        <aside className="account-side">
          {session.customer ? (
            <div className="account-side__user">
              <span className="account-avatar account-avatar--sm" aria-hidden="true">{initial}</span>
              <div>
                <strong>{session.customer.name}</strong>
                <span>{session.customer.email}</span>
              </div>
            </div>
          ) : null}
          <nav className="side-nav" aria-label="Account" ref={navRef}>
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end}>{link.label}</NavLink>
            ))}
          </nav>
          {session.customer ? (
            <button className="side-nav__signout" type="button" onClick={() => session.logout()}>
              Sign out
            </button>
          ) : null}
        </aside>
        <div className="account-main"><Outlet /></div>
      </div>
    </div>
  )
}

function useAccountOrders() {
  const session = useSession()
  const [orders, setOrders] = useState<AccountOrder[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session.customer) {
      setOrders([])
      setLoading(false)
      return
    }
    let cancel = false
    setLoading(true)
    api<{ orders: AccountOrder[] }>("/api/account/orders")
      .then((data) => {
        if (!cancel) {
          setOrders(data.orders)
          setError("")
        }
      })
      .catch((reason: unknown) => {
        if (!cancel) setError(sessionError(reason, "Your orders could not be loaded."))
      })
      .finally(() => {
        if (!cancel) setLoading(false)
      })
    return () => {
      cancel = true
    }
  }, [session.customer?.id])

  return { orders, error, loading }
}

export function OverviewPage() {
  const session = useSession()
  const navigate = useNavigate()
  const { orders, error, loading } = useAccountOrders()

  useEffect(() => {
    if (session.ready && !session.customer) navigate("/account/sign-in", { replace: true })
  }, [navigate, session.customer, session.ready])

  if (!session.ready) return <p className="meta">Loading your account…</p>
  if (!session.customer) return null

  return (
    <div className="account-panel">
      <div className="account-panel__head">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Welcome back</h2>
          <p className="meta">You are signed in to LotWise Labs.</p>
        </div>
        <div className="account-panel__actions">
          <SpecularButton tone="ghost" to="/shop">Shop</SpecularButton>
          <SpecularButton tone="primary" to="/account/referrals">Refer a friend</SpecularButton>
        </div>
      </div>
      <div className="account-stats">
        <article className="account-stat">
          <span>Name</span>
          <strong>{session.customer.name}</strong>
        </article>
        <article className="account-stat">
          <span>Email</span>
          <strong className="account-stat__email">{session.customer.email}</strong>
        </article>
        <article className="account-stat">
          <span>Orders</span>
          <strong>{loading ? "…" : String(orders.length)}</strong>
        </article>
      </div>
      <div className="order-head">
        <h2>Recent orders</h2>
        <Link to="/account/orders">All orders</Link>
      </div>
      {error ? <p className="notice">{error}</p> : null}
      {loading ? <p className="meta">Loading orders…</p> : null}
      {!loading && orders.length === 0 ? (
        <div className="account-empty account-empty--inset">
          <p>No orders yet.</p>
          <SpecularButton tone="primary" to="/shop">Browse the catalogue</SpecularButton>
        </div>
      ) : null}
      {!loading && orders.length > 0 ? (
        <div className="order-list">
          {orders.slice(0, 3).map((order) => <OrderCard key={order.id} order={order} />)}
        </div>
      ) : null}
    </div>
  )
}

export function SignInPage() {
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  const session = useSession()
  const navigate = useNavigate()

  useEffect(() => {
    if (session.customer) navigate("/account", { replace: true })
  }, [navigate, session.customer])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get("email") ?? "")
    const password = String(data.get("password") ?? "")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
      setMessage("Enter an email and a password of at least 8 characters.")
      return
    }
    setBusy(true)
    setMessage("")
    try {
      await session.login({ email, password })
      navigate("/account")
    } catch (error) {
      setMessage(sessionError(error, "Sign-in failed."))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="account-form" onSubmit={onSubmit}>
      <h2>Sign in</h2>
      <p className="meta">Use the email and password for your LotWise account.</p>
      <label className="field"><span>Email</span><input name="email" type="email" required autoComplete="username" /></label>
      <label className="field"><span>Password</span><input name="password" type="password" required minLength={8} autoComplete="current-password" /></label>
      <SpecularButton tone="primary" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</SpecularButton>
      {message ? <p className="notice">{message}</p> : null}
      <p className="meta">Need an account? <Link to="/account/register">Create one</Link></p>
    </form>
  )
}

export function RegisterPage() {
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  const session = useSession()
  const navigate = useNavigate()

  useEffect(() => {
    if (session.customer) navigate("/account", { replace: true })
  }, [navigate, session.customer])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const password = String(data.get("password") ?? "")
    const confirm = String(data.get("confirm") ?? "")
    if (password.length < 8 || password !== confirm) {
      setMessage("Passwords must match and be at least 8 characters.")
      return
    }
    setBusy(true)
    setMessage("")
    try {
      const result = await session.register({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        password,
      })
      navigate("/account")
      if (result.linked) setMessage("This account is linked to the referral visit on this browser.")
    } catch (error) {
      setMessage(sessionError(error, "The account could not be created."))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="account-form" onSubmit={onSubmit}>
      <h2>Create account</h2>
      <p className="meta">If you opened a referral link in this browser, the new account is linked to it.</p>
      <label className="field"><span>Name</span><input name="name" required autoComplete="name" /></label>
      <label className="field"><span>Email</span><input name="email" type="email" required autoComplete="email" /></label>
      <label className="field"><span>Password</span><input name="password" type="password" required minLength={8} autoComplete="new-password" /></label>
      <label className="field"><span>Confirm password</span><input name="confirm" type="password" required minLength={8} autoComplete="new-password" /></label>
      <SpecularButton tone="primary" type="submit" disabled={busy}>{busy ? "Creating…" : "Create account"}</SpecularButton>
      {message ? <p className="notice">{message}</p> : null}
      <p className="meta">Already have an account? <Link to="/account/sign-in">Sign in</Link></p>
    </form>
  )
}

export function ResetPage() {
  const [message, setMessage] = useState("")
  return (
    <form
      className="account-form"
      onSubmit={(event) => {
        event.preventDefault()
        setMessage("Password reset email is not connected yet. Sign in with your current password, or create a new account.")
      }}
    >
      <h2>Reset password</h2>
      <p className="meta">Enter the email on your account.</p>
      <label className="field"><span>Email</span><input name="email" type="email" required /></label>
      <SpecularButton tone="primary" type="submit">Continue</SpecularButton>
      {message ? <p className="notice">{message}</p> : null}
    </form>
  )
}

export function ProfilePage() {
  const session = useSession()
  const customer = session.customer as SessionCustomer | null
  return (
    <RequireAuth>
      {customer ? (
        <div className="account-form">
          <h2>Profile</h2>
          <p className="meta">These details come from your signed-in LotWise account.</p>
          <label className="field"><span>Name</span><input value={customer.name} readOnly /></label>
          <label className="field"><span>Email</span><input value={customer.email} readOnly /></label>
          <p className="meta">Profile editing will be added next. Your sign-in already uses this account.</p>
        </div>
      ) : null}
    </RequireAuth>
  )
}

export function AddressesPage() {
  const { addresses, addAddress } = useCart()
  const [draft, setDraft] = useState<Address>({
    line1: "",
    line2: "",
    city: "",
    region: "",
    postalCode: "",
    country: "",
  })
  const [note, setNote] = useState("")
  return (
    <RequireAuth>
      <div className="account-panel">
        <div className="account-panel__head">
          <div>
            <h2>Addresses</h2>
            <p className="meta">Saved on this device for checkout.</p>
          </div>
        </div>
        <div className="address-list">
          {addresses.length === 0 ? <p className="meta">No addresses saved yet.</p> : null}
          {addresses.map((address) => (
            <article className="address-card" key={`${address.line1}-${address.postalCode}`}>
              <strong>{address.line1}</strong>
              <span className="meta">{address.city}, {address.region} {address.postalCode}</span>
              <span className="meta">{address.country}</span>
            </article>
          ))}
        </div>
        <form
          className="account-form account-form--nested"
          onSubmit={(event) => {
            event.preventDefault()
            if (!draft.line1.trim()) return
            addAddress(draft)
            setNote("Address saved on this device.")
            setDraft({ line1: "", line2: "", city: "", region: "", postalCode: "", country: "" })
          }}
        >
          <h3>Add address</h3>
          <label className="field"><span>Address</span><input value={draft.line1} onChange={(event) => setDraft({ ...draft, line1: event.target.value })} required /></label>
          <label className="field"><span>City</span><input value={draft.city} onChange={(event) => setDraft({ ...draft, city: event.target.value })} required /></label>
          <label className="field"><span>Region</span><input value={draft.region} onChange={(event) => setDraft({ ...draft, region: event.target.value })} /></label>
          <label className="field"><span>Postal code</span><input value={draft.postalCode} onChange={(event) => setDraft({ ...draft, postalCode: event.target.value })} /></label>
          <label className="field"><span>Country</span><input value={draft.country} onChange={(event) => setDraft({ ...draft, country: event.target.value })} /></label>
          <SpecularButton tone="primary" type="submit">Add address</SpecularButton>
        </form>
        {note ? <p className="notice">{note}</p> : null}
      </div>
    </RequireAuth>
  )
}

export function OrdersPage() {
  const { orders, error, loading } = useAccountOrders()
  return (
    <RequireAuth>
      <div className="account-panel">
        <div className="account-panel__head">
          <div>
            <h2>Orders</h2>
            <p className="meta">Orders placed while signed in on this account.</p>
          </div>
        </div>
        {error ? <p className="notice">{error}</p> : null}
        {loading ? <p className="meta">Loading orders…</p> : null}
        {!loading && orders.length === 0 ? (
          <div className="account-empty account-empty--inset">
            <p>No orders yet.</p>
            <SpecularButton tone="primary" to="/shop">Browse the catalogue</SpecularButton>
          </div>
        ) : null}
        {!loading && orders.length > 0 ? (
          <div className="order-list">
            {orders.map((order) => <OrderCard key={order.id} order={order} />)}
          </div>
        ) : null}
      </div>
    </RequireAuth>
  )
}

export function OrderDetailPage() {
  const { orderId = "" } = useParams()
  const session = useSession()
  const [order, setOrder] = useState<AccountOrder | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session.customer || !orderId) {
      setLoading(false)
      return
    }
    let cancel = false
    setLoading(true)
    api<{ order: AccountOrder }>(`/api/account/orders/${encodeURIComponent(orderId)}`)
      .then((data) => {
        if (!cancel) {
          setOrder(data.order)
          setError("")
        }
      })
      .catch((reason: unknown) => {
        if (!cancel) {
          setOrder(null)
          setError(sessionError(reason, "That order was not found."))
        }
      })
      .finally(() => {
        if (!cancel) setLoading(false)
      })
    return () => {
      cancel = true
    }
  }, [orderId, session.customer?.id])

  useTitle(order?.orderNumber ?? "Order")

  return (
    <RequireAuth>
      {loading ? <p className="meta">Loading order…</p> : null}
      {error ? <div className="error-box">{error}</div> : null}
      {order ? (
        <article className="account-panel">
          <h2>{order.orderNumber}</h2>
          <p className="meta">{formatDate(order.createdAt)} · {statusLabel(order.status)}</p>
          <p className="meta">Subtotal {formatMoney(order.subtotal)}</p>
          {order.discountAmount > 0 ? <p className="meta">Discount {formatMoney(order.discountAmount)}{order.discountCode ? ` · ${order.discountCode}` : ""}</p> : null}
          <p><strong>{formatMoney(order.total)}</strong></p>
        </article>
      ) : null}
    </RequireAuth>
  )
}
