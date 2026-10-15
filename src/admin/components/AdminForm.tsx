import type { FormEvent, ReactNode } from 'react'
import { DemoNotice } from '@/components/feedback/DemoNotice'

export function AdminForm({
  children,
  onSubmit,
}: {
  children: ReactNode
  onSubmit: () => void
}) {
  return (
    <form
      className="space-y-5 border border-wire-line bg-white p-4"
      noValidate
      onSubmit={(event: FormEvent) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <DemoNotice>Demonstration form. Submitting it does not save data to a server.</DemoNotice>
      {children}
    </form>
  )
}
