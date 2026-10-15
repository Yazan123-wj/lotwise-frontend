import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!open || !dialog) return
    dialog.showModal()
    return () => {
      if (dialog.open) dialog.close()
    }
  }, [open])

  if (!open) return null

  return (
    <dialog
      ref={ref}
      className="w-[min(100%,28rem)] bg-white"
      aria-labelledby="confirmation-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
    >
      <div className="space-y-4 p-5">
        <h2 id="confirmation-title" className="text-lg font-bold">
          {title}
        </h2>
        <p className="text-sm text-wire-muted">{description}</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  )
}
