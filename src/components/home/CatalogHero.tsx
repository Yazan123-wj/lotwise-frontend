import type { ReactNode } from 'react'
import { CatalogueImage } from '@/components/ui/CatalogueImage'

export function CatalogHero({
  eyebrow,
  title,
  subtitle,
  copy,
  action,
  heading = 'h2',
  images = [],
  figures = [],
}: {
  eyebrow: string
  title: string
  subtitle?: string
  copy: string
  action?: ReactNode
  heading?: 'h1' | 'h2'
  images?: string[]
  figures?: { label: string; value: string }[]
}) {
  const Title = heading
  const shots = images.slice(0, 3)

  return (
    <section className="catalog-panel rounded-[1.75rem] px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-12 lg:py-14">
      <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-brand-sky">{eyebrow}</p>
          <Title className="mt-4 text-5xl font-medium tracking-tight sm:text-6xl lg:text-7xl">
            {title}
            {subtitle ? <span className="mt-2 block text-3xl font-medium text-white/70 sm:text-4xl">{subtitle}</span> : null}
          </Title>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/70">{copy}</p>
          {action ? <div className="mt-8">{action}</div> : null}
        </div>
        {shots.length > 0 ? (
          <div className="grid grid-cols-3 gap-3" aria-hidden="true">
            {shots.map((src, index) => (
              <div key={src} className={index === 1 ? 'pt-8' : index === 2 ? 'pt-3' : ''}>
                <div className="overflow-hidden rounded-[1.15rem] bg-white/10 ring-1 ring-white/15">
                  <CatalogueImage src={src} alt="" className="aspect-[3/4]" />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      {figures.length > 0 ? (
        <dl
          className={`relative z-10 mt-10 grid overflow-hidden rounded-2xl border border-white/10 ${figures.length > 2 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}
        >
          {figures.map((figure) => (
            <div key={figure.label} className="border-b border-white/10 px-4 py-4 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0">
              <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/45">{figure.label}</dt>
              <dd className="mt-1 text-2xl font-medium tracking-tight">{figure.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  )
}
