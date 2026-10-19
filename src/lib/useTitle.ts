import { useEffect } from "react"

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title === "LotWise Labs" ? title : `${title} · LotWise Labs`
  }, [title])
}
