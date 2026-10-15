import { useEffect } from 'react'

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · LotWise Labs` : 'LotWise Labs'
  }, [title])
}
