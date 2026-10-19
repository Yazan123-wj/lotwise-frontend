import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CartSummary } from '@/components/cart/CartSummary'
import { DiscountCodeInput } from '@/components/cart/DiscountCodeInput'
import { AddressFields } from '@/components/checkout/AddressFields'
import { PaymentPlaceholder } from '@/components/checkout/PaymentPlaceholder'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { EmptyState } from '@/components/feedback/EmptyState'
import { FormField, FormNote } from '@/components/forms/FormField'
import { PageContainer } from '@/components/layout/PageContainer'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/hooks/useCart'
import { usePageTitle } from '@/hooks/usePageTitle'
import { saveDemoReceipt } from '@/services/commerce'
import { getShippingMethods } from '@/services/content'
import { getAppliedReferral } from '@/services/referral'
import type { Address, DemoReceipt } from '@/types'
import { emptyCheckout, validateCheckout, type CheckoutValues } from '@/utils/validation'

export function CheckoutPage() {
  usePageTitle('Checkout')
  const navigate = useNavigate()
  const { quote, clearCart } = useCart()
  const [values, setValues] = useState<CheckoutValues>(emptyCheckout)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function setField<K extends keyof CheckoutValues>(key: K, value: CheckoutValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function placeOrder() {
    const nextErrors = validateCheckout(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0 || quote.lines.length === 0) return

    const shippingAddress: Address = values.shippingSame
      ? {
          line1: values.billingLine1.trim(),
          line2: values.billingLine2.trim(),
          city: values.billingCity.trim(),
          region: values.billingRegion.trim(),
          postalCode: values.billingPostal.trim(),
          country: values.billingCountry.trim(),
        }
      : {
          line1: values.shippingLine1.trim(),
          line2: values.shippingLine2.trim(),
          city: values.shippingCity.trim(),
          region: values.shippingRegion.trim(),
          postalCode: values.shippingPostal.trim(),
          country: values.shippingCountry.trim(),
        }
    const method = getShippingMethods().find((item) => item.id === values.shippingMethod)
    const receipt: DemoReceipt = {
      id: `demo_${Date.now()}`,
      orderNumber: `LW-DEMO-${String(Date.now()).slice(-6)}`,
      createdAt: new Date().toISOString(),
      customerName: `${values.firstName.trim()} ${values.lastName.trim()}`,
      email: values.email.trim(),
      phone: values.phone.trim(),
      shippingAddress,
      shippingMethodLabel: method?.label ?? 'Placeholder — rate not quoted',
      items: quote.lines.map((line) => ({
        id: line.id,
        productId: line.productId,
        variationId: line.variationId,
        name: line.name,
        sku: line.sku,
        variationLabel: line.variationLabel,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
      })),
      subtotal: quote.subtotal,
      discountAmount: quote.discountAmount,
      discountCode: quote.discountCode,
      referralCode: getAppliedReferral(),
      provisionalTotal: quote.provisionalTotal,
      paymentStatus: 'not-collected',
    }
    saveDemoReceipt(receipt)
    clearCart()
    navigate('/order-confirmation')
  }

  return (
    <PageContainer className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Cart', to: '/cart' },
          { label: 'Checkout' },
        ]}
      />
      <h1 className="text-3xl font-bold">Checkout</h1>
      {getAppliedReferral() ? (
        <p className="rounded-2xl border border-wire-line bg-white px-4 py-3 text-sm text-navy">
          Referral code {getAppliedReferral()} is attached to this checkout. It does not change the total.
        </p>
      ) : null}
      <DemoNotice>
        Guest checkout is part of this flow. Placing an order here creates a demonstration confirmation only. No payment is taken and no order is stored.
      </DemoNotice>
      {quote.lines.length === 0 ? (
        <EmptyState
          title="Nothing to check out"
          description="Add a placeholder product before using the checkout form."
          action={
            <Link to="/shop" className="underline-offset-2 hover:underline">
              Continue shopping
            </Link>
          }
        />
      ) : (
        <form
          className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]"
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            placeOrder()
          }}
        >
          <div className="space-y-8">
            <FormNote>Details stay in this browser until you leave the confirmation page.</FormNote>
            <fieldset className="grid gap-3 sm:grid-cols-2">
              <legend className="mb-3 text-lg font-bold sm:col-span-2">Customer information</legend>
              <FormField id="firstName" label="First name" required error={errors.firstName}>
                <input autoComplete="given-name" value={values.firstName} onChange={(event) => setField('firstName', event.target.value)} />
              </FormField>
              <FormField id="lastName" label="Last name" required error={errors.lastName}>
                <input autoComplete="family-name" value={values.lastName} onChange={(event) => setField('lastName', event.target.value)} />
              </FormField>
            </fieldset>
            <fieldset className="grid gap-3 sm:grid-cols-2">
              <legend className="mb-3 text-lg font-bold sm:col-span-2">Email and phone</legend>
              <FormField id="email" label="Email" required error={errors.email}>
                <input type="email" autoComplete="email" value={values.email} onChange={(event) => setField('email', event.target.value)} />
              </FormField>
              <FormField id="phone" label="Phone" required error={errors.phone}>
                <input type="tel" autoComplete="tel" value={values.phone} onChange={(event) => setField('phone', event.target.value)} />
              </FormField>
            </fieldset>
            <AddressFields legend="Billing address" prefix="billing" values={values} errors={errors} onChange={setField} />
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={values.shippingSame}
                onChange={(event) => setField('shippingSame', event.target.checked)}
              />
              Shipping address is the same as billing
            </label>
            {values.shippingSame ? null : (
              <AddressFields legend="Shipping address" prefix="shipping" values={values} errors={errors} onChange={setField} />
            )}
            <fieldset className="space-y-2">
              <legend className="text-lg font-bold">Shipping method</legend>
              <p className="text-sm text-wire-muted">Placeholder methods only. No carrier rate is quoted.</p>
              {getShippingMethods().map((method) => (
                <label key={method.id} className="flex min-h-11 items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={values.shippingMethod === method.id}
                    onChange={() => setField('shippingMethod', method.id)}
                  />
                  {method.label}
                </label>
              ))}
              {errors.shippingMethod ? (
                <p role="alert" className="text-sm">
                  {errors.shippingMethod}
                </p>
              ) : null}
            </fieldset>
            <DiscountCodeInput />
            <PaymentPlaceholder />
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={values.acknowledgement}
                onChange={(event) => setField('acknowledgement', event.target.checked)}
              />
              <span>I understand this is a demonstration. It does not place a real order or take payment.</span>
            </label>
            {errors.acknowledgement ? (
              <p role="alert" className="text-sm">
                {errors.acknowledgement}
              </p>
            ) : null}
            <Button type="submit">Place demonstration order</Button>
          </div>
          <CartSummary quote={quote} />
        </form>
      )}
    </PageContainer>
  )
}
