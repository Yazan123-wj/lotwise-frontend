import { useState } from 'react'
import { AdminPageHeader } from '@/admin/components/AdminPageHeader'
import { ImageUploadPlaceholder } from '@/admin/components/ImageUploadPlaceholder'
import { StatusBadge } from '@/admin/components/StatusBadge'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { FormField } from '@/components/forms/FormField'
import { Button } from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getAllBanners, getAllHomepageSlides } from '@/services/content'
import type { HomepageSwiper, PromotionalBanner } from '@/types'
import { fieldClass } from '@/utils/fields'

export function HomepageContentPage() {
  usePageTitle('Homepage content')
  const [slides, setSlides] = useState<HomepageSwiper[]>(() => getAllHomepageSlides())
  const [banners, setBanners] = useState<PromotionalBanner[]>(() => getAllBanners())
  const [slideId, setSlideId] = useState<string | null>(null)
  const [bannerId, setBannerId] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const slide = slides.find((item) => item.id === slideId) ?? null
  const banner = banners.find((item) => item.id === bannerId) ?? null

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Homepage content"
        description="Edit promotional slides and banners in this view. The public homepage still reads the original sample file."
        crumbs={[{ label: 'Homepage content' }]}
      />
      {notice ? <DemoNotice>{notice}</DemoNotice> : null}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Promotional swiper</h2>
        <ul className="space-y-2">
          {slides.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 border border-wire-line bg-white p-3 text-sm">
              <div>
                <p className="font-medium">{item.heading}</p>
                <p className="text-wire-muted">Order {item.displayOrder} · {item.mediaKind}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge>{item.active ? 'Active' : 'Inactive'}</StatusBadge>
                <Button variant="secondary" onClick={() => setSlideId(item.id)}>Edit</Button>
              </div>
            </li>
          ))}
        </ul>
        {slide ? (
          <form
            className="space-y-3 border border-wire-line bg-white p-4"
            onSubmit={(event) => {
              event.preventDefault()
              setSlides((current) => current.map((item) => (item.id === slide.id ? slide : item)))
              setNotice('Slide updated in this editor only. The storefront was not published.')
            }}
          >
            <FormField id="slide-heading" label="Heading" required>
              <input value={slide.heading} onChange={(event) => setSlides((current) => current.map((item) => item.id === slide.id ? { ...item, heading: event.target.value } : item))} />
            </FormField>
            <FormField id="slide-copy" label="Supporting copy">
              <textarea className="min-h-24" value={slide.supportingCopy} onChange={(event) => setSlides((current) => current.map((item) => item.id === slide.id ? { ...item, supportingCopy: event.target.value } : item))} />
            </FormField>
            <FormField id="slide-cta" label="CTA label">
              <input value={slide.ctaLabel} onChange={(event) => setSlides((current) => current.map((item) => item.id === slide.id ? { ...item, ctaLabel: event.target.value } : item))} />
            </FormField>
            <FormField id="slide-dest" label="CTA destination">
              <input value={slide.ctaDestination} onChange={(event) => setSlides((current) => current.map((item) => item.id === slide.id ? { ...item, ctaDestination: event.target.value } : item))} />
            </FormField>
            <FormField id="slide-order" label="Display order">
              <input inputMode="numeric" value={String(slide.displayOrder)} onChange={(event) => setSlides((current) => current.map((item) => item.id === slide.id ? { ...item, displayOrder: Number(event.target.value) || item.displayOrder } : item))} />
            </FormField>
            <FormField id="slide-kind" label="Media">
              <select className={fieldClass} value={slide.mediaKind} onChange={(event) => setSlides((current) => current.map((item) => item.id === slide.id ? { ...item, mediaKind: event.target.value as 'image' | 'video' } : item))}>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </FormField>
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input type="checkbox" checked={slide.active} onChange={(event) => setSlides((current) => current.map((item) => item.id === slide.id ? { ...item, active: event.target.checked } : item))} />
              Active
            </label>
            <ImageUploadPlaceholder label={slide.mediaKind === 'video' ? 'Video' : 'Image'} />
            <Button type="submit">Update this view</Button>
          </form>
        ) : null}
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Banners</h2>
        <ul className="space-y-2">
          {banners.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 border border-wire-line bg-white p-3 text-sm">
              <div>
                <p className="font-medium">{item.heading}</p>
                <p className="text-wire-muted">{item.placement}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge>{item.active ? 'Active' : 'Inactive'}</StatusBadge>
                <Button variant="secondary" onClick={() => setBannerId(item.id)}>Edit</Button>
              </div>
            </li>
          ))}
        </ul>
        {banner ? (
          <form
            className="space-y-3 border border-wire-line bg-white p-4"
            onSubmit={(event) => {
              event.preventDefault()
              setNotice('Banner updated in this editor only. The storefront was not published.')
            }}
          >
            <FormField id="banner-heading" label="Heading" required>
              <input value={banner.heading} onChange={(event) => setBanners((current) => current.map((item) => item.id === banner.id ? { ...item, heading: event.target.value } : item))} />
            </FormField>
            <FormField id="banner-copy" label="Supporting copy">
              <textarea className="min-h-24" value={banner.supportingCopy} onChange={(event) => setBanners((current) => current.map((item) => item.id === banner.id ? { ...item, supportingCopy: event.target.value } : item))} />
            </FormField>
            <FormField id="banner-cta" label="CTA label">
              <input value={banner.ctaLabel} onChange={(event) => setBanners((current) => current.map((item) => item.id === banner.id ? { ...item, ctaLabel: event.target.value } : item))} />
            </FormField>
            <FormField id="banner-dest" label="CTA destination">
              <input value={banner.ctaDestination} onChange={(event) => setBanners((current) => current.map((item) => item.id === banner.id ? { ...item, ctaDestination: event.target.value } : item))} />
            </FormField>
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input type="checkbox" checked={banner.active} onChange={(event) => setBanners((current) => current.map((item) => item.id === banner.id ? { ...item, active: event.target.checked } : item))} />
              Active
            </label>
            <ImageUploadPlaceholder label="Banner media" />
            <Button type="submit">Update this view</Button>
          </form>
        ) : null}
      </section>
    </div>
  )
}
