import { useEffect, useMemo, useState } from 'react'
import type { CatalogProduct, FilterGroup, ListingState } from '../../data/catalogTypes'

const selectedFor = (state: ListingState, group: string) => group === 'brand' ? state.brands : group === 'availability' ? state.availability : group === 'subcategory' ? state.subcategories : state.specs[group] ?? []
const countFor = (products: CatalogProduct[], group: string, value: string) => products.filter((product) => {
  if (group === 'brand') return product.brandId === value
  if (group === 'availability') return value === 'discount' ? product.oldPrice !== undefined : product.availability.includes(value)
  if (group === 'subcategory') return product.subcategoryId === value
  return product.specs[group] === value
}).length

export function FilterPanel({ groups, products, state, onToggle, onPrice, onClearPrice, className = '' }: { groups: FilterGroup[]; products: CatalogProduct[]; state: ListingState; onToggle(group: string, value: string): void; onPrice(side: 'from' | 'to', value?: number): void; onClearPrice(): void; className?: string }) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())
  const [brandQuery, setBrandQuery] = useState('')
  const [priceFrom, setPriceFrom] = useState(state.priceFrom?.toString() ?? '')
  const [priceTo, setPriceTo] = useState(state.priceTo?.toString() ?? '')
  useEffect(() => setPriceFrom(state.priceFrom?.toString() ?? ''), [state.priceFrom])
  useEffect(() => setPriceTo(state.priceTo?.toString() ?? ''), [state.priceTo])
  const commitPrice = (side: 'from' | 'to', raw: string) => onPrice(side, raw.trim() ? Number(raw) : undefined)
  const groupCounts = useMemo(() => new Map(groups.flatMap((group) => group.options?.map((item) => [`${group.id}:${item.value}`, countFor(products, group.id, item.value)] as const) ?? [])), [groups, products])

  return <div className={`catalog-filter ${className}`.trim()}>{groups.map((group) => {
    if (group.type === 'price') return <details key={group.id} open><summary>{group.label}</summary><div className="catalog-filter__price"><label>Цена от<input inputMode="numeric" aria-label="Цена от" value={priceFrom} placeholder="от" onChange={(event) => setPriceFrom(event.target.value.replace(/\D/g, ''))} onBlur={() => commitPrice('from', priceFrom)} onKeyDown={(event) => { if (event.key === 'Enter') commitPrice('from', priceFrom) }} /></label><label>Цена до<input inputMode="numeric" aria-label="Цена до" value={priceTo} placeholder="до" onChange={(event) => setPriceTo(event.target.value.replace(/\D/g, ''))} onBlur={() => commitPrice('to', priceTo)} onKeyDown={(event) => { if (event.key === 'Enter') commitPrice('to', priceTo) }} /></label>{state.priceFrom !== undefined || state.priceTo !== undefined ? <button type="button" onClick={onClearPrice}>Сбросить цену</button> : null}</div></details>
    const options = group.type === 'brand' && brandQuery ? group.options?.filter((item) => item.label.toLowerCase().includes(brandQuery.toLowerCase())) : group.options
    const visible = expanded.has(group.id) || !group.limit ? options : options?.slice(0, group.limit)
    return <details key={group.id} open={group.initiallyOpen || selectedFor(state, group.id).length > 0}><summary>{group.label}</summary><div className="catalog-filter__group">{group.type === 'brand' ? <input className="catalog-filter__search" type="search" aria-label="Поиск бренда" value={brandQuery} placeholder="Найти бренд" onChange={(event) => setBrandQuery(event.target.value)} /> : null}{visible?.map((item) => {
      const count = groupCounts.get(`${group.id}:${item.value}`) ?? 0
      return <label key={item.value} className={count === 0 ? 'is-disabled' : ''}><input type="checkbox" aria-label={item.label} checked={selectedFor(state, group.id).includes(item.value)} disabled={count === 0 || item.disabled} onChange={() => onToggle(group.id, item.value)} /><span>{item.label}</span><small>{count}</small></label>
    })}{group.limit && (options?.length ?? 0) > group.limit && !expanded.has(group.id) ? <button type="button" onClick={() => setExpanded((current) => new Set(current).add(group.id))}>Показать все</button> : null}</div></details>
  })}</div>
}
