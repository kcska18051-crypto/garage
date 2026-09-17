export type CatalogProduct = {
  id: string
  name: string
  slug: string
  sku: string
  brandId: string
  subcategoryId: string
  price: number
  oldPrice?: number
  availability: string[]
  delivery: string
  purchaseMode: 'cart' | 'quote'
  popularity: number
  isNew: boolean
  specs: Record<string, string>
}

export type CatalogRootSubcategory = {
  id: string
  name: string
  href: string
  artVariant: number
}

export type CatalogRootCategory = {
  id: string
  slug: string
  name: string
  href: string
  count: number
  artVariant: number
  description: string
  subcategories: CatalogRootSubcategory[]
  childNames: string[]
}

export type CatalogCategory = CatalogRootCategory

export type CatalogSubcategory = CatalogRootSubcategory & {
  count: number
  description: string
  tagGroups?: TagGroup[]
  childSections?: CatalogChildSection[]
}

export type CatalogChildSection = { id: string; name: string; href: string; description: string; count?: number }

export type CatalogBrand = { id: string; name: string; count: number }

export type FilterOption = { value: string; label: string; count?: number; disabled?: boolean }
export type FilterGroup = {
  id: string
  label: string
  type: 'checkbox' | 'brand' | 'price'
  options?: FilterOption[]
  initiallyOpen?: boolean
  limit?: number
}

export type TagValue = { value: string; label: string; count: number }
export type TagGroup = {
  id: string
  label: string
  values: TagValue[]
  limit?: number
  seoIndexable: false
}

export type CatalogSort = 'popular' | 'price-asc' | 'price-desc' | 'new' | 'available'
export type CatalogView = 'grid' | 'list'

export type ListingState = {
  availability: string[]
  brands: string[]
  subcategories: string[]
  specs: Record<string, string[]>
  priceFrom?: number
  priceTo?: number
  tag?: { group: string; value: string }
  sort: CatalogSort
  view: CatalogView
  page: number
}

export type PaginationResult<T> = { items: T[]; page: number; pages: number; total: number }
export type ListingCriterion = { kind: 'filter' | 'tag' | 'price'; group: string; value?: string }
