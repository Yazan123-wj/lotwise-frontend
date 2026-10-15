import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CatalogueImage } from '@/components/ui/CatalogueImage'
import { buttonClass } from '@/components/ui/Button'
import { getHomepageSlides } from '@/services/content'
import { cx } from '@/utils/cx'

export function HeroSwiper() {
  const slides = getHomepageSlides()
  const [index, setIndex] = useState(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(media.matches)
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (reduced || slides.length < 2) return
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, 6500)
    return () => window.clearInterval(id)
  }, [reduced, slides.length])

  if (slides.length === 0) return null
  const slide = slides[index] ?? slides[0]
  const rotation = reduced
    ? 'Automatic rotation is off because reduced motion is enabled.'
    : 'This swiper advances every 6 seconds.'

  function go(next: number) {
    setIndex((next + slides.length) % slides.length)
  }

  return (
    <section className="relative overflow-hidden bg-navy text-white" aria-roledescription="carousel" aria-label="Promotional slides">
      <div className="absolute inset-0">
        {slides.map((item, itemIndex) => (
          <CatalogueImage
            key={item.id}
            src={item.mediaPath}
            alt=""
            className={cx(
              'absolute inset-0 h-full transition-opacity duration-700',
              item.mediaFocus,
              itemIndex === index ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-transparent sm:bg-gradient-to-r sm:from-navy sm:from-5% sm:via-navy/75 sm:via-38% sm:to-transparent sm:to-72%" />
      <div className="relative z-10 mx-auto flex min-h-[36rem] max-w-7xl flex-col justify-end px-4 py-10 sm:min-h-[40rem] sm:justify-center sm:px-6 lg:min-h-[44rem] xl:min-h-[48rem]">
        <div className="max-w-xl">
          <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] text-brand-sky">
            <span className="h-px w-8 bg-brand-sky" aria-hidden="true" />
            LotWise Labs
          </p>
          <h1 className="mt-6 max-w-lg text-[2.75rem] leading-[0.98] font-medium tracking-[-0.035em] sm:text-6xl lg:text-[4.25rem]">
            {slide.heading}
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-white/80 sm:text-lg sm:leading-8">{slide.supportingCopy}</p>
          <div className="mt-8">
            <Link
              to={slide.ctaDestination}
              className={buttonClass('secondary', 'border-white bg-white px-5 text-navy hover:border-brand-sky hover:bg-brand-sky')}
            >
              {slide.ctaLabel}
              <ArrowRight aria-hidden="true" size={16} strokeWidth={1.75} />
            </Link>
          </div>
          <p className="sr-only">{rotation}</p>
          <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-white/20 pt-6">
            <div className="flex items-center gap-5" role="group" aria-label="Choose a slide">
              {slides.map((item, itemIndex) => {
                const active = itemIndex === index
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Show slide ${itemIndex + 1}`}
                    aria-current={active ? 'true' : undefined}
                    onClick={() => setIndex(itemIndex)}
                    className="group flex min-h-11 flex-col items-start justify-end gap-2"
                  >
                    <span className={cx('text-xs tracking-[0.18em]', active ? 'text-white' : 'text-white/50 group-hover:text-white/80')}>
                      {String(itemIndex + 1).padStart(2, '0')}
                    </span>
                    <span className={cx('h-px transition-all', active ? 'w-10 bg-brand-sky' : 'w-5 bg-white/40 group-hover:bg-white/70')} />
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/30 text-white hover:border-white hover:bg-white/10"
                aria-label="Previous slide"
                onClick={() => go(index - 1)}
              >
                <ChevronLeft aria-hidden="true" size={18} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/30 text-white hover:border-white hover:bg-white/10"
                aria-label="Next slide"
                onClick={() => go(index + 1)}
              >
                <ChevronRight aria-hidden="true" size={18} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
