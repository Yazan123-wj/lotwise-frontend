import { useState } from 'react'
import { CatalogueImage } from '@/components/ui/CatalogueImage'
import { cx } from '@/utils/cx'

export function ProductGallery({ paths, alt }: { paths: string[]; alt: string }) {
  const [index, setIndex] = useState(0)
  const current = paths[index] ?? paths[0]

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl bg-[#f3f5f8]">
        <CatalogueImage fit="contain" className="aspect-square p-6 sm:p-10" src={current} alt={alt} />
      </div>
      {paths.length > 1 ? (
        <ul className="flex gap-2">
          {paths.map((path, itemIndex) => (
            <li key={path}>
              <button
                type="button"
                aria-label={`Show product image ${itemIndex + 1}`}
                aria-current={itemIndex === index ? 'true' : undefined}
                onClick={() => setIndex(itemIndex)}
                className={cx(
                  'w-[4.5rem] overflow-hidden rounded-xl bg-[#f3f5f8]',
                  itemIndex === index ? 'ring-2 ring-navy' : 'opacity-60 hover:opacity-100',
                )}
              >
                <CatalogueImage fit="contain" className="aspect-square p-1.5" src={path} alt="" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
