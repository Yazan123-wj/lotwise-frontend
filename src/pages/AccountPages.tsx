import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"
import { Link, NavLink, Outlet, useLocation, useNavigate, useParams } from "react-router-dom"
import { previewCustomer, sampleAddress, sampleOrders } from "../data/content.ts"
import SpecularButton from "../components/SpecularButton.tsx"
import { formatDate, formatMoney } from "../lib/catalog.ts"
import { useTitle } from "../lib/useTitle.ts"
import { useCart } from "../state/cart.tsx"
import { sessionError, useSession } from "../state/session.tsx"
import type { Address, SampleOrder } from "../types.ts"

function statusLabel(status: string) {
  if (status === "processing") return "Processing"
  if (status === "placed") return "Placed"
  if (status === "fulfilled") return "Fulfilled"
  if (status === "cancelled") return "Cancelled"
  return status
}

function OrderCard({ order }: { order: SampleOrder }) {
  const names = order.items.map((item) => (item.quantity > 1 ? `${item.name} × ${item.quantity}` : item.name))
  return (
    <Link className="order-card" to={`/account/orders/${order.id}`}>
      <span>
        <strong>{order.orderNumber}</strong>
        <span className="meta">{formatDate(order.placedAt)} · {names.join(" · ")}</span>
        <span className="meta">Payment not collected</span>
      </span>
      <span className="order-card-side">
        <span className="order-status">{statusLabel(order.fulfilmentStatus)}</span>
        <b>{formatMoney(order.provisionalTotal)}</b>
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

function Gate({ children }: { children: ReactNode }) {
  const session = useSession()
  const { preview, setPreview } = useCart()
  if (session.customer || preview) return children
  return (
    <div className="account-empty">
      <h2>Sign in to open your account</h2>
      <p className="lede">Orders, profile details, and your referral link stay with your LotWise account.</p>
      <div className="account-empty__actions">
        <SpecularButton tone="primary" to="/account/sign-in">Sign in</SpecularButton>
        <SpecularButton tone="ghost" to="/account/register">Create account</SpecularButton>
      </div>
      <button className="text-btn" type="button" onClick={() => setPreview(true)}>
        Preview sample account screens
      </button>
    </div>
  )
}

export function AccountLayout() {
  useTitle("Account")
  const session = useSession()
  const { preview } = useCart()
  const { pathname } = useLocation()
  const navRef = useRef<HTMLElement>(null)
  const signedIn = Boolean(session.customer)
  const links = signedIn || preview ? signedInLinks : guestLinks

  useEffect(() => {
    const nav = navRef.current
    const current = nav?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!nav || !current) return
    const navBox = nav.getBoundingClientRect()
    const item = current.getBoundingClientRect()
    if (item.left < navBox.left) nav.scrollLeft -= navBox.left - item.left + 14
    else if (item.right > navBox.right) nav.scrollLeft += item.right - navBox.right + 14
  }, [pathname])

  return (
    <div className="wrap account-page">
      <header className="account-hero">
        <p className="eyebrow">Account</p>
        <h1>{session.customer ? session.customer.name : preview ? "Sample account" : "Your account"}</h1>
        <p className="lede">
          {session.customer
            ? session.customer.email
            : preview
              ? "Preview mode · sample data only"
              : "Sign in to manage your profile, orders, and referrals."}
        </p>
      </header>
      <div className="account">
        <aside className="account-side">
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
          {preview && !session.customer ? <p className="account-side__note">Sample preview is on</p> : null}
        </aside>
        <div className="account-main"><Outlet /></div>
      </div>
    </div>
  )
}

export function OverviewPage() {
  const session = useSession()
  const { preview, receipt } = useCart()
  const sample = sampleOrders.filter((order) => order.customerId === previewCustomer.id)
  const signedIn = Boolean(session.customer)

  if (!signedIn && !preview) {
    return (
      <Gate>
        <span />
      </Gate>
    )
  }

  if (signedIn && session.customer) {
    return (
      <div className="account-panel">
        <div className="account-panel__head">
          <div>
            <p className="eyebrow">Overview</p>
            <h2>Welcome back</h2>
            <p className="meta">Your signed-in LotWise account on this browser.</p>
          </div>
          <SpecularButton tone="ghost" to="/account/referrals">Refer a friend</SpecularButton>
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
            <span>Referrals</span>
            <strong>Open</strong>
            <Link className="account-stat__link" to="/account/referrals">View your link</Link>
          </article>
        </div>
        <div className="order-head">
          <h2>Recent activity</h2>
          <Link to="/account/orders">All orders</Link>
        </div>
        {receipt ? (
          <div className="order-list">
            <Link className="order-card" to={`/account/orders/${receipt.reference}`}>
              <span>
                <strong>{receipt.reference}</strong>
                <span className="meta">Demonstration checkout from this browser</span>
                <span className="meta">{receipt.note}</span>
              </span>
              <span className="order-card-side">
                <span className="order-status">Demo</span>
                <b>{formatMoney(receipt.total)}</b>
              </span>
            </Link>
          </div>
        ) : (
          <div className="account-empty account-empty--inset">
            <p>No orders on this account yet.</p>
            <SpecularButton tone="primary" to="/shop">Browse the catalogue</SpecularButton>
          </div>
        )}
      </div>
    )
  }

  return (
    <Gate>
      <div className="account-panel">
        <div className="account-panel__head">
          <div>
            <p className="eyebrow">Sample preview</p>
            <h2>Overview</h2>
            <p className="meta">This is sample data for layout review. It is not a real customer account.</p>
          </div>
        </div>
        <div className="account-stats">
          <article className="account-stat">
            <span>Name</span>
            <strong>{previewCustomer.name}</strong>
          </article>
          <article className="account-stat">
            <span>Email</span>
            <strong className="account-stat__email">{previewCustomer.email}</strong>
          </article>
          <article className="account-stat">
            <span>Sample orders</span>
            <strong>{sample.length}</strong>
          </article>
        </div>
        <div className="order-head">
          <h2>Recent sample orders</h2>
          <Link to="/account/orders">All orders</Link>
        </div>
        <div className="order-list">
          {sample.map((order) => <OrderCard key={order.id} order={order} />)}
        </div>
      </div>
    </Gate>
  )
}

export function SignInPage() {
  const [message, setMessage] = useState("")
  const { setPreview } = useCart()
  const session = useSession()
  const navigate = useNavigate()
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get("email") ?? "")
    const password = String(data.get("password") ?? "")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
      setMessage("Enter an email and a password of at least 8 characters.")
      return
    }
    try {
      await session.login({ email, password })
      setPreview(false)
      navigate("/account")
    } catch (error) {
      setMessage(sessionError(error, "Sign-in failed."))
    }
  }
  return (
    <form className="account-form" onSubmit={onSubmit}>
      <h2>Sign in</h2>
      <p className="meta">Use the email and password for your LotWise account.</p>
      <label className="field"><span>Email</span><input name="email" type="email" required autoComplete="username" /></label>
      <label className="field"><span>Password</span><input name="password" type="password" required minLength={8} autoComplete="current-password" /></label>
      <SpecularButton tone="primary" type="submit">Sign in</SpecularButton>
      {message ? <p className="notice">{message}</p> : null}
      <p className="meta">Need an account? <Link to="/account/register">Create one</Link></p>
    </form>
  )
}

export function RegisterPage() {
  const [message, setMessage] = useState("")
  const { setPreview } = useCart()
  const session = useSession()
  const navigate = useNavigate()
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const password = String(data.get("password") ?? "")
    const confirm = String(data.get("confirm") ?? "")
    if (password.length < 8 || password !== confirm) {
      setMessage("Passwords must match and be at least 8 characters.")
      return
    }
    try {
      const result = await session.register({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        password,
      })
      setPreview(false)
      navigate("/account")
      if (result.linked) setMessage("This account is linked to the referral visit on this browser.")
    } catch (error) {
      setMessage(sessionError(error, "The account could not be created."))
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
      <SpecularButton tone="primary" type="submit">Create account</SpecularButton>
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
        setMessage("This form does not send email or change a password.")
      }}
    >
      <h2>Reset password</h2>
      <p className="meta">Password reset email is not connected yet.</p>
      <label className="field"><span>Email</span><input name="email" type="email" required /></label>
      <SpecularButton tone="primary" type="submit">Continue</SpecularButton>
      {message ? <p className="notice">{message}</p> : null}
    </form>
  )
}

export function ProfilePage() {
  const session = useSession()
  const [saved, setSaved] = useState(false)
  const name = session.customer?.name ?? previewCustomer.name
  const email = session.customer?.email ?? previewCustomer.email
  return (
    <Gate>
      <form
        className="account-form"
        onSubmit={(event) => {
          event.preventDefault()
          setSaved(true)
        }}
      >
        <h2>Profile</h2>
        <p className="meta">
          {session.customer
            ? "These details come from your signed-in account."
            : "Sample preview details. Edits stay on this page only."}
        </p>
        <label className="field"><span>Name</span><input defaultValue={name} key={`name-${name}`} /></label>
        <label className="field"><span>Email</span><input defaultValue={email} key={`email-${email}`} readOnly={Boolean(session.customer)} /></label>
        <label className="field"><span>Phone</span><input defaultValue={session.customer ? "" : previewCustomer.phone} placeholder={session.customer ? "Add a phone number" : undefined} /></label>
        <SpecularButton tone="primary" type="submit">{session.customer ? "Save on this page" : "Keep on this page"}</SpecularButton>
        {saved ? (
          <p className="notice">
            {session.customer
              ? "The edit was kept on this page only for now."
              : "The edit was kept on this page only. It was not saved to an account."}
          </p>
        ) : null}
      </form>
    </Gate>
  )
}

export function AddressesPage() {
  const session = useSession()
  const { addresses, addAddress } = useCart()
  const [draft, setDraft] = useState<Address>({ ...sampleAddress, line1: "" })
  const [note, setNote] = useState("")
  const shown = session.customer ? addresses : [previewCustomer.address, ...addresses]
  return (
    <Gate>
      <div className="account-panel">
        <div className="account-panel__head">
          <div>
            <h2>Addresses</h2>
            <p className="meta">
              {session.customer
                ? "Addresses added here stay in this browser for checkout."
                : "Sample address plus any addresses added on this page."}
            </p>
          </div>
        </div>
        <div className="address-list">
          {shown.length === 0 ? <p className="meta">No addresses yet.</p> : null}
          {shown.map((address) => (
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
            setNote("The address was added on this browser only.")
            setDraft({ ...sampleAddress, line1: "" })
          }}
        >
          <h3>Add address</h3>
          <label className="field"><span>Address</span><input value={draft.line1} onChange={(event) => setDraft({ ...draft, line1: event.target.value })} required /></label>
          <label className="field"><span>City</span><input value={draft.city} onChange={(event) => setDraft({ ...draft, city: event.target.value })} /></label>
          <SpecularButton tone="primary" type="submit">Add address</SpecularButton>
        </form>
        {note ? <p className="notice">{note}</p> : null}
      </div>
    </Gate>
  )
}

export function OrdersPage() {
  const session = useSession()
  const { receipt } = useCart()
  const orders = sampleOrders.filter((order) => order.customerId === previewCustomer.id)
  return (
    <Gate>
      <div className="account-panel">
        <div className="account-panel__head">
          <div>
            <h2>Orders</h2>
            <p className="meta">
              {session.customer
                ? "Demonstration checkouts from this browser appear here. Card payment is not collected."
                : "Sample orders plus any demonstration confirmation from this browser."}
            </p>
          </div>
        </div>
        {session.customer ? (
          receipt ? (
            <div className="order-list">
              <Link className="order-card" to={`/account/orders/${receipt.reference}`}>
                <span>
                  <strong>{receipt.reference}</strong>
                  <span className="meta">Demonstration checkout</span>
                </span>
                <span className="order-card-side">
                  <span className="order-status">Demo</span>
                  <b>{formatMoney(receipt.total)}</b>
                </span>
              </Link>
            </div>
          ) : (
            <div className="account-empty account-empty--inset">
              <p>No orders yet.</p>
              <SpecularButton tone="primary" to="/shop">Browse the catalogue</SpecularButton>
            </div>
          )
        ) : (
          <div className="order-list">
            {orders.map((order) => <OrderCard key={order.id} order={order} />)}
            {receipt ? (
              <p className="notice"><Link to={`/account/orders/${receipt.reference}`}>{receipt.reference}</Link> · demonstration · {formatMoney(receipt.total)}</p>
            ) : null}
          </div>
        )}
      </div>
    </Gate>
  )
}

export function OrderDetailPage() {
  const { orderId = "" } = useParams()
  const { receipt } = useCart()
  const order = sampleOrders.find((item) => item.id === orderId || item.orderNumber === orderId)
  const isReceipt = receipt && (receipt.reference === orderId)
  useTitle(order?.orderNumber ?? receipt?.reference ?? "Order")
  return (
    <Gate>
      {!order && !isReceipt ? (
        <div className="error-box">That order is not in this account.</div>
      ) : order ? (
        <article className="account-panel">
          <h2>{order.orderNumber}</h2>
          <p className="meta">{formatDate(order.placedAt)} · {order.fulfilmentStatus} · Payment not collected</p>
          <p>{order.note}</p>
          {order.items.map((item) => (
            <p key={item.id}>{item.name} · {item.sku} × {item.quantity} · {formatMoney(item.unitPrice * item.quantity)}</p>
          ))}
          <p><strong>{formatMoney(order.provisionalTotal)}</strong></p>
        </article>
      ) : receipt ? (
        <article className="account-panel">
          <h2>{receipt.reference}</h2>
          <p>{receipt.note}</p>
          {receipt.items.map((item) => (
            <p key={item.id}>{item.name} · {item.sku} × {item.quantity}</p>
          ))}
          <p><strong>{formatMoney(receipt.total)}</strong></p>
        </article>
      ) : null}
    </Gate>
  )
}
