import { Link } from 'react-router-dom'

export function BrandLockup({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  if (tone === 'dark') {
    return (
      <Link to="/" className="inline-flex items-center" aria-label="LotWise Labs, home">
        <img src="/brand/lotwise-logo.png" alt="" className="h-9 w-auto sm:h-11 lg:h-[3.25rem]" />
      </Link>
    )
  }

  return (
    <Link to="/" className="inline-flex items-baseline" aria-label="LotWise Labs, home">
      <span className="text-[1.05rem] font-medium tracking-tight text-white">LotWise</span>
      <span className="ml-1 text-[1.05rem] font-medium tracking-tight text-brand-sky">Labs</span>
    </Link>
  )
}
