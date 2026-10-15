import { useState } from 'react'
import { Placeholder } from '@/components/ui/Placeholder'

export function ImageUploadPlaceholder({ label = 'Image' }: { label?: string }) {
  const [name, setName] = useState('')

  return (
    <div className="space-y-2">
      <Placeholder className="aspect-video" label={label} />
      <label className="block text-sm">
        <span className="font-medium">Upload placeholder</span>
        <input
          type="file"
          accept="image/*,video/*"
          className="mt-1 block w-full text-sm"
          onChange={(event) => setName(event.target.files?.[0]?.name ?? '')}
        />
      </label>
      <p className="text-xs text-wire-muted">
        {name ? `Selected “${name}” in this browser only. ` : ''}
        The file is not uploaded or stored.
      </p>
    </div>
  )
}
