import { useLocation } from 'react-router-dom'
import { DemoNotice } from '@/components/feedback/DemoNotice'

export function DemoFlash() {
  const location = useLocation()
  const message = (location.state as { demoMessage?: string } | null)?.demoMessage
  if (!message) return null
  return <DemoNotice>{message}</DemoNotice>
}
