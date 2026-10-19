import { certificates, type Certificate } from '@/data/certifications'

const STORAGE_KEY = 'lotwise-added-certificates'

function readAdded(): Certificate[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is Certificate =>
        Boolean(item) &&
        typeof item === 'object' &&
        typeof (item as Certificate).id === 'string' &&
        typeof (item as Certificate).title === 'string' &&
        typeof (item as Certificate).image === 'string',
    )
  } catch {
    return []
  }
}

export function listCertificates(): Certificate[] {
  return [...certificates, ...readAdded()]
}

export function addCertificate(title: string, image: string) {
  const next = [...readAdded(), { id: `added_${Date.now()}`, title: title.trim(), image }]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}
