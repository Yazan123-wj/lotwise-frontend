import { Outlet } from 'react-router-dom'
import { LoadingScreen } from '@/components/feedback/LoadingScreen'
import { ResearchGate } from '@/components/feedback/ResearchGate'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { ReferralCapture } from '@/components/referral/ReferralCapture'

export function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col pb-16 lg:pb-0">
      <ResearchGate />
      <ReferralCapture />
      <LoadingScreen />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
