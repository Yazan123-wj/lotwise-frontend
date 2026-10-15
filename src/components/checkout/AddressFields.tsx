import { FormField } from '@/components/forms/FormField'
import type { CheckoutValues, FieldErrors } from '@/utils/validation'

type AddressKey =
  | 'billingLine1'
  | 'billingLine2'
  | 'billingCity'
  | 'billingRegion'
  | 'billingPostal'
  | 'billingCountry'
  | 'shippingLine1'
  | 'shippingLine2'
  | 'shippingCity'
  | 'shippingRegion'
  | 'shippingPostal'
  | 'shippingCountry'

const fields: { suffix: string; label: string; required: boolean; autoComplete: string }[] = [
  { suffix: 'Line1', label: 'Address line 1', required: true, autoComplete: 'address-line1' },
  { suffix: 'Line2', label: 'Address line 2', required: false, autoComplete: 'address-line2' },
  { suffix: 'City', label: 'City', required: true, autoComplete: 'address-level2' },
  { suffix: 'Region', label: 'Region', required: true, autoComplete: 'address-level1' },
  { suffix: 'Postal', label: 'Postal code', required: true, autoComplete: 'postal-code' },
  { suffix: 'Country', label: 'Country', required: true, autoComplete: 'country-name' },
]

export function AddressFields({
  legend,
  prefix,
  values,
  errors,
  onChange,
}: {
  legend: string
  prefix: 'billing' | 'shipping'
  values: CheckoutValues
  errors: FieldErrors
  onChange: (key: AddressKey, value: string) => void
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-lg font-bold">{legend}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((field) => {
          const key = `${prefix}${field.suffix}` as AddressKey
          return (
            <FormField key={key} id={key} label={field.label} required={field.required} error={errors[key]}>
              <input
                autoComplete={prefix === 'billing' ? `billing ${field.autoComplete}` : `shipping ${field.autoComplete}`}
                value={values[key]}
                onChange={(event) => onChange(key, event.target.value)}
              />
            </FormField>
          )
        })}
      </div>
    </fieldset>
  )
}
