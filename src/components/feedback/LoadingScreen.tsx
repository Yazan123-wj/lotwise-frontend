import { useEffect, useState } from 'react'
import { cx } from '@/utils/cx'

export function LoadingScreen() {
  const [phase, setPhase] = useState<'show' | 'leave' | 'done'>('show')

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hold = reduced ? 250 : 1700
    const fade = reduced ? 150 : 550
    const leave = window.setTimeout(() => setPhase('leave'), hold)
    const done = window.setTimeout(() => setPhase('done'), hold + fade)
    return () => {
      window.clearTimeout(leave)
      window.clearTimeout(done)
    }
  }, [])

  if (phase === 'done') return null

  return (
    <div
      className={cx(
        'fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500',
        phase === 'leave' && 'pointer-events-none opacity-0',
      )}
      role="status"
      aria-live="polite"
      aria-label="Loading LotWise Labs"
    >
      <div className="loading-rise flex flex-col items-center">
        <img src="/brand/lotwise-logo.png" alt="" className="h-20 w-auto sm:h-24" />
        <span className="mt-8 block h-px w-28 overflow-hidden bg-wire-line">
          <span className="loading-sweep block h-full w-8 bg-royal" />
        </span>
      </div>
    </div>
  )
}
