import { useState } from 'react'
import { Placeholder } from '@/components/ui/Placeholder'
import { cx } from '@/utils/cx'

export function CatalogueImage({
  src,
  alt,
  className,
  fit = 'cover',
}: {
  src?: string
  alt: string
  className?: string
  fit?: 'cover' | 'contain'
}) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return <Placeholder className={cx('h-full w-full', className)} label={alt || 'Image'} />
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cx('block w-full max-w-full', fit === 'contain' ? 'object-contain' : 'object-cover', className)}
      onError={() => setFailed(true)}
    />
  )
}
