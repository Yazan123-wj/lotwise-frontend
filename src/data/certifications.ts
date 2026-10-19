export type Certificate = {
  id: string
  title: string
  image: string
}

export const certificates: Certificate[] = [
  {
    id: 'coa',
    title: 'Certificate of Analysis',
    image: '/images/certificates/analysis.svg',
  },
  {
    id: 'quality',
    title: 'Quality certificate',
    image: '/images/certificates/quality.svg',
  },
  {
    id: 'batch',
    title: 'Batch certificate',
    image: '/images/certificates/batch.svg',
  },
]
