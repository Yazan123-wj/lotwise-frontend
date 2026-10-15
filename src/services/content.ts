import { announcement, homepageSlides, promotionalBanners } from '@/data/banners'
import { brandPillars, faqItems, policies, qualitySection, shippingMethods } from '@/data/content'
import { adminLinks, policyLinks, primaryLinks, supportLinks } from '@/data/navigation'
import { getCategories } from '@/services/catalog'
import type { NavItem, PolicyDocument } from '@/types'

export function getAnnouncement() {
  return announcement.active ? announcement : null
}

export function getHomepageSlides() {
  return homepageSlides
    .filter((slide) => slide.active)
    .sort((a, b) => a.displayOrder - b.displayOrder)
}

export function getAllHomepageSlides() {
  return [...homepageSlides].sort((a, b) => a.displayOrder - b.displayOrder)
}

export function getSecondaryBanner() {
  return promotionalBanners.find((banner) => banner.placement === 'home-secondary' && banner.active) ?? null
}

export function getAllBanners() {
  return [...promotionalBanners].sort((a, b) => a.displayOrder - b.displayOrder)
}

export function getBrandPillars() {
  return brandPillars
}

export function getQualitySection() {
  return qualitySection
}

export function getFaqItems() {
  return faqItems
}

export function getPolicy(slug: string): PolicyDocument | undefined {
  return policies.find((policy) => policy.slug === slug)
}

export function getShippingMethods() {
  return shippingMethods
}

export function getMainNavigation(): NavItem[] {
  const categories: NavItem = {
    label: 'Categories',
    to: '/shop',
    children: getCategories()
      .filter((category) => category.active)
      .map((category) => ({ label: category.name, to: `/categories/${category.slug}` })),
  }
  return [primaryLinks[0], categories, ...primaryLinks.slice(1)]
}

export function getFooterShopLinks(): NavItem[] {
  return [
    { label: 'All products', to: '/shop' },
    ...getCategories()
      .filter((category) => category.active)
      .map((category) => ({ label: category.name, to: `/categories/${category.slug}` })),
  ]
}

export function getSupportLinks() {
  return supportLinks
}

export function getPolicyLinks() {
  return policyLinks
}

export function getAdminLinks() {
  return adminLinks
}
