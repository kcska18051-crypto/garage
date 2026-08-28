import { useEffect } from 'react'
import { filterCatalogProducts } from './catalogFilters'
import type { CatalogProduct, FilterGroup, ListingState } from '../../data/catalogTypes'
import { FilterPanel } from './FilterPanel'

const valuesFor = (state: ListingState, group: string) => group === 'brand' ? state.brands : group === 'availability' ? state.availability : group === 'subcategory' ? state.subcategories : state.specs[group] ?? []
const updateGroup = (state: ListingState, group: string, values: string[]): ListingState => group === 'brand' ? { ...state, brands: values, page: 1 } : group === 'availability' ? { ...state, availability: values, page: 1 } : group === 'subcategory' ? { ...state, subcategories: values, page: 1 } : { ...state, specs: { ...state.specs, [group]: values }, page: 1 }

export function MobileFilterDrawer({ groups, products, draft, onDraft, onApply, onClose }: { groups: FilterGroup[]; products: CatalogProduct[]; draft: ListingState; onDraft(state: ListingState): void; onApply(): void; onClose(): void }) {
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [])
  const toggle = (group: string, value: string) => {
    const current = valuesFor(draft, group)
    onDraft(updateGroup(draft, group, current.includes(value) ? current.filter((item) => item !== value) : [...current, value]))
  }
  const setPrice = (side: 'from' | 'to', value?: number) => onDraft({ ...draft, [side === 'from' ? 'priceFrom' : 'priceTo']: value, page: 1 })
  const count = filterCatalogProducts(products, draft).length
  return <div className="catalog-filter-drawer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section role="dialog" aria-modal="true" aria-labelledby="mobile-filter-title" onKeyDown={(event) => { if (event.key === 'Escape') onClose() }}><header><div><p className="eyebrow">Параметры выдачи</p><h2 id="mobile-filter-title">Фильтры каталога</h2></div><button type="button" aria-label="Закрыть фильтры" onClick={onClose} autoFocus>×</button></header><div className="catalog-filter-drawer__body"><FilterPanel groups={groups} products={products} state={draft} onToggle={toggle} onPrice={setPrice} onClearPrice={() => onDraft({ ...draft, priceFrom: undefined, priceTo: undefined, page: 1 })} /></div><footer><button type="button" className="button button--dark" onClick={onApply}>Показать {count} товаров</button></footer></section></div>
}
