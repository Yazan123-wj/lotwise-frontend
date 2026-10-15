export const fieldClass =
  'min-h-11 w-full border border-wire-line bg-white px-3 py-2 text-sm text-navy placeholder:text-wire-muted'

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function digitCount(value: string) {
  return value.replace(/\D/g, '').length
}
