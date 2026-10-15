export function QuantitySelector({
  id,
  value,
  max,
  onChange,
}: {
  id: string
  value: number
  max: number
  onChange: (value: number) => void
}) {
  const disabled = max < 1
  return (
    <div className="inline-flex items-center border border-wire-line bg-white">
      <button
        type="button"
        className="min-h-11 min-w-11"
        aria-label="Decrease quantity"
        disabled={disabled || value <= 1}
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        −
      </button>
      <label htmlFor={id} className="sr-only">
        Quantity
      </label>
      <input
        id={id}
        inputMode="numeric"
        value={disabled ? 0 : value}
        disabled={disabled}
        onChange={(event) => {
          const next = Number(event.target.value)
          if (!Number.isInteger(next)) return
          onChange(Math.min(max, Math.max(1, next)))
        }}
        className="h-11 w-14 border-x border-wire-line text-center text-sm"
      />
      <button
        type="button"
        className="min-h-11 min-w-11"
        aria-label="Increase quantity"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        +
      </button>
    </div>
  )
}
