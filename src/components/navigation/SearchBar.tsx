import { Search } from 'lucide-react'
import { useId, useState } from 'react'

export function SearchBar({
  label = 'Search',
  initialValue = '',
  onSearch,
  variant = 'field',
  placeholder = 'Search the catalogue',
}: {
  label?: string
  initialValue?: string
  onSearch: (query: string) => void
  variant?: 'field' | 'bar'
  placeholder?: string
}) {
  const id = useId()
  const [value, setValue] = useState(initialValue)
  const [syncedValue, setSyncedValue] = useState(initialValue)
  if (syncedValue !== initialValue) {
    setSyncedValue(initialValue)
    setValue(initialValue)
  }

  return (
    <form
      role="search"
      className={variant === 'bar' ? 'relative h-10' : 'flex h-11 gap-2'}
      onSubmit={(event) => {
        event.preventDefault()
        onSearch(value.trim())
      }}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className={
          variant === 'bar'
            ? 'h-10 w-full border border-wire-line bg-wire-bg pr-3 pl-10 text-sm text-navy placeholder:text-wire-muted'
            : 'h-11 min-w-0 flex-1 border border-wire-line bg-white px-3 text-sm text-navy'
        }
      />
      <button
        type="submit"
        className={
          variant === 'bar'
            ? 'absolute inset-y-0 left-0 flex w-10 items-center justify-center text-navy hover:text-royal'
            : 'inline-flex h-11 w-11 shrink-0 items-center justify-center border border-royal bg-royal text-white hover:border-navy hover:bg-navy'
        }
      >
        <Search aria-hidden="true" size={variant === 'bar' ? 16 : 18} strokeWidth={1.75} />
        <span className="sr-only">Search</span>
      </button>
    </form>
  )
}
