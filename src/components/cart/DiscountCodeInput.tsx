import { useId, useState } from 'react'
import { FormField } from '@/components/forms/FormField'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/hooks/useCart'

export function DiscountCodeInput() {
  const { quote, applyDiscount, clearDiscount } = useCart()
  const id = useId()
  const [value, setValue] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  return (
    <form
      className="space-y-3 border border-wire-line bg-white p-4"
      onSubmit={(event) => {
        event.preventDefault()
        const result = applyDiscount(value)
        setMessage(result.message)
      }}
    >
      <FormField
        id={id}
        label="Discount code"
        hint="Try DEMO10 or FIXED5. The result stays in this browser and is not validated by a server."
      >
        <input value={value} onChange={(event) => setValue(event.target.value)} autoComplete="off" />
      </FormField>
      <div className="flex flex-wrap gap-2">
        <Button type="submit">Apply code</Button>
        {quote.discountCode ? (
          <Button variant="secondary" onClick={() => { clearDiscount(); setMessage('The demonstration discount was cleared.') }}>
            Remove code
          </Button>
        ) : null}
      </div>
      {message ? (
        <p role="status" className="text-sm">
          {message}
        </p>
      ) : null}
    </form>
  )
}
