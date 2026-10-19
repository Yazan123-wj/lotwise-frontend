import { useState, type FormEvent, type ReactNode } from "react"
import { Link, NavLink, Outlet, useNavigate, useParams } from "react-router-dom"
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

const links = [
  { to: "/account", label: "Overview", end: true },
  { to: "/account/profile", label: "Profile" },
  { to: "/account/addresses", label: "Addresses" },
  { to: "/account/orders", label: "Orders" },
  { to: "/account/referrals", label: "Refer a friend" },
  { to: "/account/sign-in", label: "Sign in" },
  { to: "/account/register", label: "Register" },
  { to: "/account/reset", label: "Reset password" },
]

function Gate({ children }: { children: ReactNode }) {
  const { preview, setPreview } = useCart()
  if (preview) return children
  return (
    <div className="panel">
      <h2 className="display" style={{ fontSize: 36 }}>Preview signed-in screens</h2>
      <p className="lede">These screens preview a signed-in account. Opening them does not create or access an account.</p>
      <SpecularButton tone="primary" type="button" style={{ marginTop: 16 }} onClick={() => setPreview(true)}>Preview signed-in screens</SpecularButton>
    </div>
  )
}

export function AccountLayout() {
  useTitle("Account")
  const session = useSession()
  return (
    <div className="wrap">
      <header className="page-hero">
        <p className="eyebrow">Account</p>
        <h1 className="display">{session.customer ? session.customer.name : "Account preview"}</h1>
        {session.customer ? <p className="lede">{session.customer.email}</p> : null}
      </header>
      <div className="account">
        <nav className="side-nav" aria-label="Account">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>{link.label}</NavLink>
          ))}
          {session.customer ? <button className="text-btn" type="button" onClick={() => session.logout()}>Sign out</button> : null}
        </nav>
        <div><Outlet /></div>
      </div>
    </div>
  )
}

export function OverviewPage() {
  const { preview } = useCart()
  const orders = sampleOrders.filter((order) => order.customerId === previewCustomer.id)
  return (
    <Gate>
      {preview ? (
        <>
          <p className="lede">Sample customer profile. No account exists for this person.</p>
          <div className="stats" style={{ marginTop: 16 }}>
            <article className="stat"><span className="meta">Name</span><b style={{ fontSize: 22 }}>{previewCustomer.name}</b></article>
            <article className="stat"><span className="meta">Email</span><b style={{ fontSize: 18 }}>{previewCustomer.email}</b></article>
            <article className="stat"><span className="meta">Sample orders</span><b>{orders.length}</b></article>
          </div>
          <div className="order-head">
            <h2>Recent sample orders</h2>
            <Link to="/account/orders">All orders</Link>
          </div>
          <div className="order-list">
            {orders.map((order) => <OrderCard key={order.id} order={order} />)}
          </div>
        </>
      ) : null}
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
      navigate("/account/referrals")
    } catch (error) {
      setMessage(sessionError(error, "Sign-in failed."))
    }
  }
  return (
    <form className="panel" onSubmit={onSubmit}>
      <h2>Sign in</h2>
      <p className="meta">This form checks the referral service and starts a session on this browser. The password is not kept on the page.</p>
      <label className="field"><span>Email</span><input name="email" type="email" required /></label>
      <label className="field"><span>Password</span><input name="password" type="password" required minLength={8} /></label>
      <SpecularButton tone="primary" type="submit">Submit form</SpecularButton>
      {message ? <p className="notice">{message}</p> : null}
      <p className="meta">Guest checkout remains available from the cart. The preview button below still opens the sample account screens.</p>
      <SpecularButton tone="ghost" type="button" onClick={() => setPreview(true)}>Preview signed-in screens</SpecularButton>
    </form>
  )
}

export function RegisterPage() {
  const [message, setMessage] = useState("")
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
      navigate("/account/referrals")
      if (result.linked) setMessage("This account is linked to the referral visit on this browser.")
    } catch (error) {
      setMessage(sessionError(error, "The account could not be created."))
    }
  }
  return (
    <form className="panel" onSubmit={onSubmit}>
      <h2>Register</h2>
      <p className="meta">This creates an account in the referral service. If you opened a referral link in this browser, the new account is linked to it.</p>
      <label className="field"><span>Name</span><input name="name" required /></label>
      <label className="field"><span>Email</span><input name="email" type="email" required /></label>
      <label className="field"><span>Password</span><input name="password" type="password" required /></label>
      <label className="field"><span>Confirm password</span><input name="confirm" type="password" required /></label>
      <SpecularButton tone="primary" type="submit">Submit form</SpecularButton>
      {message ? <p className="notice">{message}</p> : null}
    </form>
  )
}

export function ResetPage() {
  const [message, setMessage] = useState("")
  return (
    <form
      className="panel"
      onSubmit={(event) => {
        event.preventDefault()
        setMessage("This form does not send email or change a password.")
      }}
    >
      <h2>Reset password</h2>
      <label className="field"><span>Email</span><input name="email" type="email" required /></label>
      <SpecularButton tone="primary" type="submit">Submit form</SpecularButton>
      {message ? <p className="notice">{message}</p> : null}
    </form>
  )
}

export function ProfilePage() {
  const [saved, setSaved] = useState(false)
  return (
    <Gate>
      <form
        className="panel"
        onSubmit={(event) => {
          event.preventDefault()
          setSaved(true)
        }}
      >
        <h2>Profile</h2>
        <label className="field"><span>Name</span><input defaultValue={previewCustomer.name} /></label>
        <label className="field"><span>Email</span><input defaultValue={previewCustomer.email} /></label>
        <label className="field"><span>Phone</span><input defaultValue={previewCustomer.phone} /></label>
        <SpecularButton tone="primary" type="submit">Keep on this page</SpecularButton>
        {saved ? <p className="notice">The edit was kept on this page only. It was not saved to an account.</p> : null}
      </form>
    </Gate>
  )
}

export function AddressesPage() {
  const { addresses, addAddress } = useCart()
  const [draft, setDraft] = useState<Address>({ ...sampleAddress, line1: "" })
  const [note, setNote] = useState("")
  const shown = [previewCustomer.address, ...addresses]
  return (
    <Gate>
      <div className="panel">
        <h2>Addresses</h2>
        {shown.map((address) => (
          <p key={address.line1}>{address.line1}, {address.city}, {address.region} {address.postalCode}, {address.country}</p>
        ))}
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (!draft.line1.trim()) return
            addAddress(draft)
            setNote("The address was added to this page only. It was not saved to an account.")
            setDraft({ ...sampleAddress, line1: "" })
          }}
        >
          <label className="field"><span>Address</span><input value={draft.line1} onChange={(event) => setDraft({ ...draft, line1: event.target.value })} required /></label>
          <label className="field"><span>City</span><input value={draft.city} onChange={(event) => setDraft({ ...draft, city: event.target.value })} /></label>
          <SpecularButton tone="primary" type="submit">Add on this page</SpecularButton>
        </form>
        {note ? <p className="notice">{note}</p> : null}
      </div>
    </Gate>
  )
}

export function OrdersPage() {
  const { receipt } = useCart()
  const orders = sampleOrders.filter((order) => order.customerId === previewCustomer.id)
  return (
    <Gate>
      <h2>Orders</h2>
      <p className="meta">Sample orders plus any demonstration confirmation from this browser. These are not purchases.</p>
      <div className="order-list">
        {orders.map((order) => <OrderCard key={order.id} order={order} />)}
      </div>
      {receipt ? (
        <p className="notice"><Link to={`/account/orders/${receipt.reference}`}>{receipt.reference}</Link> · demonstration · {formatMoney(receipt.total)}</p>
      ) : null}
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
        <div className="error-box">That record is not part of the sample account or this browser’s demonstration checkout.</div>
      ) : order ? (
        <article className="panel">
          <h2>{order.orderNumber}</h2>
          <p className="meta">{formatDate(order.placedAt)} · {order.fulfilmentStatus} · Payment not collected</p>
          <p>{order.note}</p>
          {order.items.map((item) => (
            <p key={item.id}>{item.name} · {item.sku} × {item.quantity} · {formatMoney(item.unitPrice * item.quantity)}</p>
          ))}
          <p><strong>{formatMoney(order.provisionalTotal)}</strong></p>
        </article>
      ) : receipt ? (
        <article className="panel">
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
