import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AdminSidebar } from '@/admin/components/AdminSidebar'
import { AdminTopbar } from '@/admin/components/AdminTopbar'
import { DemoNotice } from '@/components/feedback/DemoNotice'

export function AdminLayout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const [openPath, setOpenPath] = useState(location.pathname)
  if (openPath !== location.pathname) {
    setOpenPath(location.pathname)
    setOpen(false)
  }

  return (
    <div className="min-h-screen bg-wire-bg md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
      <a className="skip-link" href="#admin-main">
        Skip to content
      </a>
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      <div className="min-w-0">
        <AdminTopbar onMenu={() => setOpen(true)} />
        <div id="admin-main" className="space-y-4 p-4 sm:p-6">
          <DemoNotice>These screens are not authenticated. Changes stay in the browser view and are not saved.</DemoNotice>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
