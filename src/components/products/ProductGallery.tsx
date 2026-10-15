import { useState } from 'react'
import { CatalogueImage } from '@/components/ui/CatalogueImage'
import { cx } from '@/utils/cx'

export function ProductGallery({ paths, alt }: { paths: string[]; alt: string }) {
  const [index, setIndex] = useState(0)
  const current = paths[index] ?? paths[0]

  return (
    <div className="space-y-3">
      <div className="overflow-hidden bg-[#eef3f8]">
        <CatalogueImage fit="contain" className="aspect-square p-6" src={current} alt={alt} />
      </div>
      {paths.length > 1 ? (
        <ul className="flex gap-2 overflow-x-auto">
          {paths.map((path, itemIndex) => (
            <li key={path}>
              <button
                type="button"
                aria-label={`Show product image ${itemIndex + 1}`}
                aria-current={itemIndex === index ? 'true' : undefined}
                onClick={() => setIndex(itemIndex)}
                className={cx(
                  'w-16 overflow-hidden bg-[#eef3f8]',
                  itemIndex === index ? 'outline outline-2 outline-offset-2 outline-royal' : 'opacity-70 hover:opacity-100',
                )}
              >
                <CatalogueImage fit="contain" className="aspect-square p-1" src={path} alt="" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
