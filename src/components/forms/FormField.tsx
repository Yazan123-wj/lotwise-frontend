import { cloneElement, type ReactElement, type ReactNode } from 'react'
import { cx } from '@/utils/cx'
import { fieldClass } from '@/utils/fields'

type ControlProps = {
  id?: string
  className?: string
  'aria-invalid'?: boolean | undefined
  'aria-describedby'?: string | undefined
}

export function FormField({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: ReactElement<ControlProps>
}) {
  const describedBy = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined
  const control = cloneElement(children, {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    className: cx(fieldClass, children.props.className),
  })

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {control}
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-wire-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function FormNote({ children }: { children?: ReactNode }) {
  return <p className="text-xs text-wire-muted">Required fields are marked with an asterisk. {children}</p>
}
