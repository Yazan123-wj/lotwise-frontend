import { Link } from 'react-router-dom'

export function AnnouncementBar() {
  return (
    <div className="bg-navy text-white">
      <p className="px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[0.28em] text-white/75">
        <Link to="/shop" className="hover:text-white">
          Research use only · LotWise Labs
        </Link>
      </p>
    </div>
  )
}
