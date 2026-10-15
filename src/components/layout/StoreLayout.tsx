import { Outlet } from 'react-router-dom'
import { LoadingScreen } from '@/components/feedback/LoadingScreen'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'

export function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col">
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
