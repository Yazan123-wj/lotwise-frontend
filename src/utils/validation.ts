import { digitCount, isEmail } from '@/utils/fields'

export type FieldErrors = Record<string, string>

export type CheckoutValues = {
  firstName: string
  lastName: string
  email: string
  phone: string
  billingLine1: string
  billingLine2: string
  billingCity: string
  billingRegion: string
  billingPostal: string
  billingCountry: string
  shippingSame: boolean
  shippingLine1: string
  shippingLine2: string
  shippingCity: string
  shippingRegion: string
  shippingPostal: string
  shippingCountry: string
  shippingMethod: string
  acknowledgement: boolean
}

export function emptyCheckout(): CheckoutValues {
  return {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    billingLine1: '',
    billingLine2: '',
    billingCity: '',
    billingRegion: '',
    billingPostal: '',
    billingCountry: '',
    shippingSame: true,
    shippingLine1: '',
    shippingLine2: '',
    shippingCity: '',
    shippingRegion: '',
    shippingPostal: '',
    shippingCountry: '',
    shippingMethod: 'ship_standard',
    acknowledgement: false,
  }
}

function requireText(errors: FieldErrors, key: string, value: string, label: string) {
  if (!value.trim()) errors[key] = `${label} is required.`
}

export function validateCheckout(values: CheckoutValues): FieldErrors {
  const errors: FieldErrors = {}
  requireText(errors, 'firstName', values.firstName, 'First name')
  requireText(errors, 'lastName', values.lastName, 'Last name')
  if (!values.email.trim()) errors.email = 'Email is required.'
  else if (!isEmail(values.email)) errors.email = 'Enter an email address.'
  if (!values.phone.trim()) errors.phone = 'Phone is required.'
  else if (digitCount(values.phone) < 7) errors.phone = 'Enter a phone number.'
  requireText(errors, 'billingLine1', values.billingLine1, 'Billing address')
  requireText(errors, 'billingCity', values.billingCity, 'Billing city')
  requireText(errors, 'billingRegion', values.billingRegion, 'Billing region')
  requireText(errors, 'billingPostal', values.billingPostal, 'Billing postal code')
  requireText(errors, 'billingCountry', values.billingCountry, 'Billing country')
  if (!values.shippingSame) {
    requireText(errors, 'shippingLine1', values.shippingLine1, 'Shipping address')
    requireText(errors, 'shippingCity', values.shippingCity, 'Shipping city')
    requireText(errors, 'shippingRegion', values.shippingRegion, 'Shipping region')
    requireText(errors, 'shippingPostal', values.shippingPostal, 'Shipping postal code')
    requireText(errors, 'shippingCountry', values.shippingCountry, 'Shipping country')
  }
  if (!values.shippingMethod) errors.shippingMethod = 'Choose a shipping placeholder.'
  if (!values.acknowledgement) {
    errors.acknowledgement = 'Confirm that this is a demonstration and does not take payment.'
  }
  return errors
}

export function validateContact(values: { name: string; email: string; message: string }): FieldErrors {
  const errors: FieldErrors = {}
  requireText(errors, 'name', values.name, 'Name')
  if (!values.email.trim()) errors.email = 'Email is required.'
  else if (!isEmail(values.email)) errors.email = 'Enter an email address.'
  requireText(errors, 'message', values.message, 'Message')
  return errors
}

export function validateAuth(
  mode: 'sign-in' | 'register' | 'reset',
  values: { firstName?: string; lastName?: string; email: string; password?: string; confirm?: string },
): FieldErrors {
  const errors: FieldErrors = {}
  if (mode === 'register') {
    requireText(errors, 'firstName', values.firstName ?? '', 'First name')
    requireText(errors, 'lastName', values.lastName ?? '', 'Last name')
  }
  if (!values.email.trim()) errors.email = 'Email is required.'
  else if (!isEmail(values.email)) errors.email = 'Enter an email address.'
  if (mode !== 'reset') {
    if (!values.password) errors.password = 'Password is required.'
    else if (mode === 'register' && values.password.length < 8) {
      errors.password = 'Use at least 8 characters for this form preview.'
    }
  }
  if (mode === 'register' && values.password !== values.confirm) {
    errors.confirm = 'Password confirmation does not match.'
  }
  return errors
}
