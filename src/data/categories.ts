import type { ProductCategory } from '@/types'

/** Sample categories. "Awaiting Items" is an empty wireframe fixture, not a commercial category. */
export const categories: ProductCategory[] = [
  {
    id: 'cat_vials',
    slug: 'sample-vials',
    name: 'Vials',
    description: 'Individual vial records from the catalogue.',
    imagePath: '/images/categories/sample-vials.jpg',
    imageLabel: 'Category Image',
    displayOrder: 1,
    active: true,
    featured: true,
  },
  {
    id: 'cat_reference',
    slug: 'reference-materials',
    name: 'Reference',
    description: 'Reference records kept beside the vial lots.',
    imagePath: '/images/categories/reference-materials.jpg',
    imageLabel: 'Category Image',
    displayOrder: 2,
    active: true,
    featured: true,
  },
  {
    id: 'cat_kits',
    slug: 'sample-kits',
    name: 'Kits',
    description: 'Kit and collection records from the catalogue.',
    imagePath: '/images/categories/sample-kits.jpg',
    imageLabel: 'Category Image',
    displayOrder: 3,
    active: true,
    featured: true,
  },
  {
    id: 'cat_empty',
    slug: 'awaiting-items',
    name: 'Awaiting Items',
    description: 'Empty sample category so the catalogue empty state can be reviewed. It is not a commercial category.',
    imagePath: '/images/categories/awaiting-items.jpg',
    imageLabel: 'Category Image',
    displayOrder: 4,
    active: true,
    featured: false,
  },
]
