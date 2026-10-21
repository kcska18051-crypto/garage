import { catalogCategories, catalogBrands, compressorSubcategories } from './catalogData'
import { prototypeData } from './prototypeData'
import { demoProducts, matchesSearch, money } from './productRegistry'

export type SearchSuggestion = {
  id: string
  kind: 'Товар' | 'Категория' | 'Бренд'
  name: string
  meta: string
  href: string
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
}

export const searchPromoItems: SearchPromoItem[] = [
  { id: 'promo-compressor', kind: 'product', title: 'Компрессор Remeza ВК 10', caption: 'Товар специальной подборки', href: '/product/remeza-vk-10-gr-0001', price: '185 000 ₽', oldPrice: '207 200 ₽', badge: 'Акция' },
  { id: 'promo-tools', kind: 'product', title: 'Набор инструмента для мастерской', caption: 'Комплектация для рабочего поста', href: '/product/product-2', price: '27 900 ₽', oldPrice: '31 248 ₽', badge: 'Акция' },
  { id: 'promo-workshop', kind: 'section', title: 'Оснащение мастерской', caption: 'Специальное предложение на комплект', href: '/actions/professional-workshop', badge: 'Акция' },
  { id: 'promo-new', kind: 'section', title: 'Новинки оборудования', caption: 'Свежие позиции каталога', href: '/new', badge: 'Раздел' },
]

const productSuggestions: SearchSuggestion[] = [
  ...demoProducts.map(item=>({id:item.id,kind:'Товар' as const,name:item.name,meta:`${item.sku} · ${item.brand??''} · ${item.searchTerms??''} · ${item.purchaseMode==='quote'?'Цена по запросу':money(item.price)}`,href:item.href})),
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
