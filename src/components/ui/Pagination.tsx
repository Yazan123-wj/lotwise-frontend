import { Button } from '@/components/ui/Button'

export function Pagination({
  page,
  pageCount,
  onPage,
}: {
  page: number
  pageCount: number
  onPage: (page: number) => void
}) {
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3 border border-wire-line bg-white px-3 py-2">
      <p className="text-sm">
        Page {page} of {pageCount}
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => onPage(page - 1)} disabled={page <= 1}>
          Previous
        </Button>
        <Button variant="secondary" onClick={() => onPage(page + 1)} disabled={page >= pageCount}>
          Next
        </Button>
      </div>
    </nav>
  )
}
