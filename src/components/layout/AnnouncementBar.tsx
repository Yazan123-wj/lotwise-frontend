import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAnnouncement } from '@/services/content'

const STORAGE_KEY = 'lotwise-announcement-dismissed'

export function AnnouncementBar() {
  const announcement = getAnnouncement()
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })

  if (!announcement || dismissed) return null

  return (
    <div className="bg-navy text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6">
        <p>
          <Link to={announcement.href} className="underline-offset-4 hover:text-brand-sky hover:underline">
            {announcement.message}
          </Link>
        </p>
        <button
          type="button"
          className="min-h-11 shrink-0 px-2 text-[11px] font-medium uppercase tracking-[0.14em] text-brand-sky"
          onClick={() => {
            try {
              sessionStorage.setItem(STORAGE_KEY, '1')
            } catch {
              /* the bar still closes for this view */
            }
            setDismissed(true)
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
