import type { Product } from "../types.ts";

export const products: Product[] = [
  {
    "id": "prd_lw_01",
    "slug": "sample-vial-lw-01",
    "name": "Sample Vial LW-01",
    "baseSku": "LW-01",
    "shortDescription": "Catalogue vial with two sample options. Not a verified listing.",
    "description": "This sample record gives the product page a name, gallery, options, and purchase actions. Replace it with client-approved catalogue copy before any public launch. It states no research results, quality guarantees, or instructions for use.",
    "categorySlug": "sample-vials",
    "featured": true,
    "visible": true,
    "imagePaths": [
      "/images/lotwise-vial.png"
    ],
    "variations": [
      {
        "id": "var_lw_01_a",
        "sku": "LW-01-A",
        "label": "Placeholder size A",
        "price": 42,
        "stockQuantity": 18
      },
      {
        "id": "var_lw_01_b",
        "sku": "LW-01-B",
        "label": "Placeholder size B",
        "price": 76,
        "stockQuantity": 7
      }
    ]
  },
  {
    "id": "prd_lw_02",
    "slug": "sample-vial-lw-02",
    "name": "Sample Vial LW-02",
    "baseSku": "LW-02",
    "shortDescription": "Catalogue vial with a low-stock sample option.",
    "description": "Use this record to review a product with two sample options and mixed availability. Size labels are placeholders only. No dosage, handling, or human-use information is provided.",
    "categorySlug": "sample-vials",
    "featured": true,
    "visible": true,
    "imagePaths": [
      "/images/lotwise-vial.png"
    ],
    "variations": [
      {
        "id": "var_lw_02_a",
        "sku": "LW-02-A",
        "label": "Placeholder size A",
        "price": 54,
        "stockQuantity": 24
      },
      {
        "id": "var_lw_02_b",
        "sku": "LW-02-B",
        "label": "Placeholder size B",
        "price": 81,
        "stockQuantity": 4
      }
    ]
  },
  {
    "id": "prd_lw_03",
    "slug": "sample-vial-lw-03",
    "name": "Sample Vial LW-03",
    "baseSku": "LW-03",
    "shortDescription": "Single-option catalogue vial.",
    "description": "Placeholder description for a single-option sample item. Approved product information will replace this paragraph.",
    "categorySlug": "sample-vials",
    "featured": true,
    "visible": true,
    "imagePaths": [
      "/images/lotwise-vial.png"
    ],
    "variations": [
      {
        "id": "var_lw_03_a",
        "sku": "LW-03-A",
        "label": "Placeholder size A",
        "price": 39,
        "stockQuantity": 11
      }
    ]
  },
  {
    "id": "prd_lw_04",
    "slug": "sample-reference-lw-04",
    "name": "Sample Reference LW-04",
    "baseSku": "LW-04",
    "shortDescription": "Reference-material record for the catalogue.",
    "description": "This item stands in for a future reference-material listing. It does not describe composition, purity, or a test method.",
    "categorySlug": "reference-materials",
    "featured": true,
    "visible": true,
    "imagePaths": [
      "/images/lotwise-vial.png"
    ],
    "variations": [
      {
        "id": "var_lw_04_a",
        "sku": "LW-04-A",
        "label": "Placeholder size A",
        "price": 64,
        "stockQuantity": 9
      },
      {
        "id": "var_lw_04_b",
        "sku": "LW-04-B",
        "label": "Placeholder size B",
        "price": 88,
        "stockQuantity": 2
      }
    ]
  },
  {
    "id": "prd_lw_05",
    "slug": "sample-kit-lw-05",
    "name": "Sample Kit LW-05",
    "baseSku": "LW-05",
    "shortDescription": "Sample kit record for the featured collection.",
    "description": "A sample kit record for layout only. The contents of a real kit have not been supplied, so none are listed here.",
    "categorySlug": "sample-kits",
    "featured": true,
    "visible": true,
    "imagePaths": [
      "/images/lotwise-vial.png"
    ],
    "variations": [
      {
        "id": "var_lw_05_a",
        "sku": "LW-05-A",
        "label": "Placeholder kit",
        "price": 120,
        "stockQuantity": 6
      }
    ]
  },
  {
    "id": "prd_lw_06",
    "slug": "sample-collection-lw-06",
    "name": "Sample Collection LW-06",
    "baseSku": "LW-06",
    "shortDescription": "Collection record shown as out of stock.",
    "description": "This sample is intentionally out of stock in the wireframe. Purchase actions stay disabled. No backorder or fulfilment promise is implied.",
    "categorySlug": "sample-kits",
    "featured": true,
    "visible": true,
    "imagePaths": [
      "/images/lotwise-vial.png"
    ],
    "variations": [
      {
        "id": "var_lw_06_a",
        "sku": "LW-06-A",
        "label": "Placeholder collection",
        "price": 96,
        "stockQuantity": 0
      }
    ]
  },
  {
    "id": "prd_lw_07",
    "slug": "sample-vial-lw-07",
    "name": "Sample Vial LW-07",
    "baseSku": "LW-07",
    "shortDescription": "Catalogue vial with two sample options.",
    "description": "Placeholder description for a sample vial. It does not name a compound or describe how the item should be used.",
    "categorySlug": "sample-vials",
    "featured": true,
    "visible": true,
    "imagePaths": [
      "/images/lotwise-vial.png"
    ],
    "variations": [
      {
        "id": "var_lw_07_a",
        "sku": "LW-07-A",
        "label": "Placeholder size A",
        "price": 48,
        "stockQuantity": 15
      },
      {
        "id": "var_lw_07_b",
        "sku": "LW-07-B",
        "label": "Placeholder size B",
        "price": 72,
        "stockQuantity": 8
      }
    ]
  },
  {
    "id": "prd_lw_08",
    "slug": "sample-vial-lw-08",
    "name": "Sample Vial LW-08",
    "baseSku": "LW-08",
    "shortDescription": "Single-option vial shown with low stock.",
    "description": "Use this record to review a low-stock vial in the catalogue. No dosage or handling information is included.",
    "categorySlug": "sample-vials",
    "featured": true,
    "visible": true,
    "imagePaths": [
      "/images/lotwise-vial.png"
    ],
    "variations": [
      {
        "id": "var_lw_08_a",
        "sku": "LW-08-A",
        "label": "Placeholder size A",
        "price": 45,
        "stockQuantity": 3
      }
    ]
  },
  {
    "id": "prd_lw_09",
    "slug": "sample-vial-lw-09",
    "name": "Sample Vial LW-09",
    "baseSku": "LW-09",
    "shortDescription": "Catalogue vial with two in-stock sample options.",
    "description": "Placeholder description for a two-option sample vial. Approved catalogue copy will replace this paragraph.",
    "categorySlug": "sample-vials",
    "featured": true,
    "visible": true,
    "imagePaths": [
      "/images/lotwise-vial.png"
    ],
    "variations": [
      {
        "id": "var_lw_09_a",
        "sku": "LW-09-A",
        "label": "Placeholder size A",
        "price": 51,
        "stockQuantity": 22
      },
      {
        "id": "var_lw_09_b",
        "sku": "LW-09-B",
        "label": "Placeholder size B",
        "price": 84,
        "stockQuantity": 13
      }
    ]
  },
  {
    "id": "prd_lw_10",
    "slug": "sample-reference-lw-10",
    "name": "Sample Reference LW-10",
    "baseSku": "LW-10",
    "shortDescription": "Reference-material record with two sample options.",
    "description": "This item stands in for another reference-material listing. It does not describe composition, purity, or a test method.",
    "categorySlug": "reference-materials",
    "featured": true,
    "visible": true,
    "imagePaths": [
      "/images/lotwise-vial.png"
    ],
    "variations": [
      {
        "id": "var_lw_10_a",
        "sku": "LW-10-A",
        "label": "Placeholder size A",
        "price": 58,
        "stockQuantity": 14
      },
      {
        "id": "var_lw_10_b",
        "sku": "LW-10-B",
        "label": "Placeholder size B",
        "price": 91,
        "stockQuantity": 6
      }
    ]
  },
  {
    "id": "prd_lw_11",
    "slug": "sample-reference-lw-11",
    "name": "Sample Reference LW-11",
    "baseSku": "LW-11",
    "shortDescription": "Single-option reference record for the catalogue.",
    "description": "Placeholder description for a reference-material sample. No test result or certificate is stated.",
    "categorySlug": "reference-materials",
    "featured": false,
    "visible": true,
    "imagePaths": [
      "/images/lotwise-vial.png"
    ],
    "variations": [
      {
        "id": "var_lw_11_a",
        "sku": "LW-11-A",
        "label": "Placeholder size A",
        "price": 67,
        "stockQuantity": 5
      }
    ]
  },
  {
    "id": "prd_lw_12",
    "slug": "sample-reference-lw-12",
    "name": "Sample Reference LW-12",
    "baseSku": "LW-12",
    "shortDescription": "Reference record with two sample options.",
    "description": "Placeholder description for a two-option reference record. Size labels are not measurements.",
    "categorySlug": "reference-materials",
    "featured": false,
    "visible": true,
    "imagePaths": [
      "/images/lotwise-vial.png"
    ],
    "variations": [
      {
        "id": "var_lw_12_a",
        "sku": "LW-12-A",
        "label": "Placeholder size A",
        "price": 61,
        "stockQuantity": 19
      },
      {
        "id": "var_lw_12_b",
        "sku": "LW-12-B",
        "label": "Placeholder size B",
        "price": 79,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "prd_lw_13",
    "slug": "sample-reference-lw-13",
    "name": "Sample Reference LW-13",
    "baseSku": "LW-13",
    "shortDescription": "Reference record shown with low stock on both options.",
    "description": "Use this record to review low availability on a reference listing. No composition is described.",
    "categorySlug": "reference-materials",
    "featured": false,
    "visible": true,
    "imagePaths": [
      "/images/lotwise-vial.png"
    ],
    "variations": [
      {
        "id": "var_lw_13_a",
        "sku": "LW-13-A",
        "label": "Placeholder size A",
        "price": 70,
        "stockQuantity": 2
      },
      {
        "id": "var_lw_13_b",
        "sku": "LW-13-B",
        "label": "Placeholder size B",
        "price": 94,
        "stockQuantity": 4
      }
    ]
  },
  {
    "id": "prd_lw_14",
    "slug": "sample-reference-lw-14",
    "name": "Sample Reference LW-14",
    "baseSku": "LW-14",
    "shortDescription": "Reference record with a single in-stock option.",
    "description": "Placeholder description for a single-option reference record. Approved copy will replace this paragraph.",
    "categorySlug": "reference-materials",
    "featured": false,
    "visible": true,
    "imagePaths": [
      "/images/lotwise-vial.png"
    ],
    "variations": [
      {
        "id": "var_lw_14_a",
        "sku": "LW-14-A",
        "label": "Placeholder size A",
        "price": 55,
        "stockQuantity": 30
      }
    ]
  },
  {
    "id": "prd_lw_15",
    "slug": "sample-kit-lw-15",
    "name": "Sample Kit LW-15",
    "baseSku": "LW-15",
    "shortDescription": "Sample kit record with one catalogue option.",
    "description": "A sample kit record for layout only. The contents of a real kit have not been supplied, so none are listed here.",
    "categorySlug": "sample-kits",
    "featured": false,
    "visible": true,
    "imagePaths": [
      "/images/lotwise-vial.png"
    ],
    "variations": [
      {
        "id": "var_lw_15_a",
        "sku": "LW-15-A",
        "label": "Placeholder kit",
        "price": 132,
        "stockQuantity": 12
      }
    ]
  }
];
