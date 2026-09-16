export type Slide = {
  id: string
  title: string
  text: string
  cta: string
  href: string
  deadline?: string
}

export type Category = { id: string; name: string; href: string; code: string }
export type Brand = { id: string; name: string; href: string }
export type Product = {
  id: string
  name: string
  price: string
  availability: string
  href: string
}
export type Service = { id: string; name: string; text: string; cta: string; href: string }
export type ProductCollection = { id: string; label: string; href: string; source: 'automatic-new' | 'automatic-bestseller' | 'brand' | 'category' | 'curated'; products: Product[] }
export type PromoBanner = { id: string; title: string; text: string; cta: string; href: string; tone: 'light' | 'mid' | 'dark' }
export type HomeMerchandisingBlock = { id: string; collectionId: string; bannerIds: string[]; visible: boolean }
export type Promotion = { id: string; title: string; text: string; deadline: string; href: string; showOnHome: boolean }
export type UsefulItem = { id: string; kind: 'article' | 'news' | 'review'; title: string; text: string; meta: string; href: string }
export type Benefit = { id: string; title: string; text: string }
export type HomeConfig = { showReviews: boolean; showNewsletter: boolean }

export type PrototypeData = {
  slides: Slide[]
  benefits: Benefit[]
  categories: Category[]
  brands: Brand[]
  products: Product[]
  productCollections: ProductCollection[]
  promoBanners: PromoBanner[]
  homeMerchandising: HomeMerchandisingBlock[]
  promotions: Promotion[]
  services: Service[]
  useful: UsefulItem[]
  config: HomeConfig
}
