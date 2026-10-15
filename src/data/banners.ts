import type { Announcement, HomepageSwiper, PromotionalBanner } from '@/types'

export const announcement: Announcement = {
  id: 'ann_01',
  message: 'Catalogue preview. Approved product copy will replace this message.',
  href: '/shop',
  active: true,
}

export const homepageSlides: HomepageSwiper[] = [
  {
    id: 'slide_01',
    heading: 'Precision in every lot.',
    supportingCopy:
      'A research-focused collection, presented with clarity, consistency, and care.',
    ctaLabel: 'Shop the collection',
    ctaDestination: '/shop',
    mediaKind: 'image',
    mediaLabel: 'Hero',
    mediaPath: '/images/banners/hero-vials.jpg',
    mediaFocus: 'object-[92%_68%]',
    displayOrder: 1,
    active: true,
  },
  {
    id: 'slide_02',
    heading: 'The collection, in full view.',
    supportingCopy: 'Categories and sample records, arranged so every lot is easy to find and review.',
    ctaLabel: 'View categories',
    ctaDestination: '/categories/sample-vials',
    mediaKind: 'image',
    mediaLabel: 'Hero',
    mediaPath: '/images/banners/hero-lab.jpg',
    mediaFocus: 'object-[center_22%]',
    displayOrder: 2,
    active: true,
  },
  {
    id: 'slide_03',
    heading: 'Clarity, held steady.',
    supportingCopy: 'Names, options, and sample prices — set out plainly, without promotional claims.',
    ctaLabel: 'Browse the shop',
    ctaDestination: '/shop',
    mediaKind: 'image',
    mediaLabel: 'Hero',
    mediaPath: '/images/banners/hero-bench.jpg',
    mediaFocus: 'object-[38%_42%]',
    displayOrder: 3,
    active: true,
  },
]

export const promotionalBanners: PromotionalBanner[] = [
  {
    id: 'banner_secondary',
    placement: 'home-secondary',
    heading: 'Featured collection',
    supportingCopy: 'Kits and collections from the sample catalogue, gathered for a closer look. No promotional claims are made here.',
    ctaLabel: 'Explore sample kits',
    ctaDestination: '/categories/sample-kits',
    mediaLabel: 'Collection',
    mediaPath: '/images/banners/collection.jpg',
    displayOrder: 1,
    active: true,
  },
]
