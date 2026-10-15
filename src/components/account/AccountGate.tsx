import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/Button'
import { useDemoAccount } from '@/hooks/useDemoAccount'

export function AccountGate({ children }: { children: ReactNode }) {
  const { preview, startPreview } = useDemoAccount()
  if (preview) return children

  return (
    <div className="space-y-4">
      <DemoNotice>These screens preview a signed-in account. Opening them does not create or access an account.</DemoNotice>
      <EmptyState
        title="Signed-in preview is off"
        description="Turn on the preview to walk through overview, profile, addresses, and orders with sample data."
        action={<Button onClick={startPreview}>Preview signed-in screens</Button>}
      />
      <p className="text-sm">
        <Link to="/account/sign-in" className="underline-offset-2 hover:underline">
          View the sign-in form
        </Link>
      </p>
    </div>
  )
}
