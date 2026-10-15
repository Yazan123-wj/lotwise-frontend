export function PaymentPlaceholder() {
  return (
    <fieldset className="space-y-3 border border-wire-line bg-white p-4" disabled>
      <legend className="px-1 text-lg font-bold">Payment method</legend>
      <p className="text-sm text-wire-muted">
        Integration placeholder. Card numbers and payment credentials are not collected in this phase. No payment provider is connected.
      </p>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input type="radio" name="payment-placeholder" />
        Card payment — not connected
      </label>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input type="radio" name="payment-placeholder" />
        Other methods — not connected
      </label>
    </fieldset>
  )
}
