import { catalogCategories, catalogBrands, compressorSubcategories } from './catalogData'
import { prototypeData } from './prototypeData'
import { demoProducts, matchesSearch, money } from './productRegistry'
import { styleCheckProductPhotos } from './styleCheckAssets'
import { promotionPrice } from './promotionPricing'

export type SearchSuggestion = {
  id: string
  kind: 'Товар' | 'Категория' | 'Бренд'
  name: string
  meta: string
  href: string
  image?: string
}

export type SearchPromoItem = {
  id: string
  kind: 'product' | 'section'
  title: string
  caption: string
  href: string
  price?: string
  oldPrice?: string
  badge?: string
  image?: string
}

export const searchPromoItems: SearchPromoItem[] = [
  'remeza-vk-10-gr-0001', 'product-2', 'product-1', 'product-3', 'product-6', 'product-8',
].flatMap(id => {
  const product = demoProducts.find(item => item.id === id)
  if (!product) return []
  const price = promotionPrice(product.id, product.price, product.purchaseMode === 'quote')
  return [{ id: product.id, kind: 'product' as const, title: product.name, caption: '', href: product.href,
    image: styleCheckProductPhotos[product.name], price: money(product.price),
    oldPrice: price.oldPrice ? money(price.oldPrice) : undefined, badge: price.promotionHref ? 'Акция' : undefined }]
})

const productSuggestions: SearchSuggestion[] = [
  ...demoProducts.map(item=>({id:item.id,kind:'Товар' as const,name:item.name,meta:`${item.sku} · ${item.brand??''} · ${item.searchTerms??''} · ${item.purchaseMode==='quote'?'Цена по запросу':money(item.price)}`,href:item.href,image:styleCheckProductPhotos[item.name]})),
]

const categorySuggestions: SearchSuggestion[] = [
  ...catalogCategories.map((item) => ({ id: `category-${item.id}`, kind: 'Категория' as const, name: item.name, meta: 'Раздел каталога', href: item.href })),
  ...compressorSubcategories.map((item) => ({ id: `subcategory-${item.id}`, kind: 'Категория' as const, name: item.name, meta: 'Категория оборудования', href: item.href })),
]

const brandNames = new Set([...catalogBrands.map(item=>item.name), ...prototypeData.brands.map((item) => item.name)])
const brandSuggestions: SearchSuggestion[] = [...brandNames].map((name) => ({
  id: `brand-${name.toLocaleLowerCase()}`,
  kind: 'Бренд',
  name,
  meta: 'Бренд',
  href: name === 'Remeza' ? '/brand/remeza' : `/search?q=${encodeURIComponent(name)}`,
}))

const searchIndex = [...brandSuggestions, ...categorySuggestions, ...productSuggestions]

export function findSearchSuggestions(query: string, limit = 8): SearchSuggestion[] {
  const needle = query.trim().toLocaleLowerCase()
  if (needle.length < 2) return []
  const seen = new Set<string>()
  return searchIndex.filter((item) => {
    const matches = matchesSearch(`${item.name} ${item.meta}`,needle)
    const key = `${item.name}-${item.href}`
    if (!matches || seen.has(key)) return false
    seen.add(key)
    return true
  }).slice(0, limit)
}
