import { catalogBrands, compressorSubcategories, fullFilterGroups } from '../../data/catalogData'
import type { ListingCriterion, ListingState } from '../../data/catalogTypes'

const labelFor = (group: string, value: string) => {
  if (group === 'brand') return catalogBrands.find((item) => item.id === value)?.name ?? value
  if (group === 'subcategory') return compressorSubcategories.find((item) => item.id === value)?.name ?? value
  return fullFilterGroups.find((item) => item.id === group)?.options?.find((item) => item.value === value)?.label ?? value
}

export function ActiveFilters({ state, onRemove, onClear }: { state: ListingState; onRemove(criterion: ListingCriterion): void; onClear(): void }) {
  const chips: { criterion: ListingCriterion; label: string; aria: string }[] = []
  state.availability.forEach((value) => chips.push({ criterion: { kind: 'filter', group: 'availability', value }, label: labelFor('availability', value), aria: `Удалить фильтр ${labelFor('availability', value)}` }))
  state.brands.forEach((value) => chips.push({ criterion: { kind: 'filter', group: 'brand', value }, label: labelFor('brand', value), aria: `Удалить фильтр ${labelFor('brand', value)}` }))
  state.subcategories.forEach((value) => chips.push({ criterion: { kind: 'filter', group: 'subcategory', value }, label: labelFor('subcategory', value), aria: `Удалить фильтр ${labelFor('subcategory', value)}` }))
  Object.entries(state.specs).forEach(([group, values]) => values.forEach((value) => chips.push({ criterion: { kind: 'filter', group, value }, label: labelFor(group, value), aria: `Удалить фильтр ${labelFor(group, value)}` })))
  if (state.priceFrom !== undefined) chips.push({ criterion: { kind: 'price', group: 'priceFrom' }, label: `от ${state.priceFrom.toLocaleString('ru-RU')} ₽`, aria: 'Удалить фильтр минимальной цены' })
  if (state.priceTo !== undefined) chips.push({ criterion: { kind: 'price', group: 'priceTo' }, label: `до ${state.priceTo.toLocaleString('ru-RU')} ₽`, aria: 'Удалить фильтр максимальной цены' })
  if (state.tag) chips.push({ criterion: { kind: 'tag', group: state.tag.group, value: state.tag.value }, label: `Тег: ${labelFor(state.tag.group, state.tag.value)}`, aria: `Удалить тег ${labelFor(state.tag.group, state.tag.value)}` })
  if (!chips.length) return null
  return <div className="catalog-active-filters" aria-label="Активные параметры">{chips.map(({ criterion, label, aria }) => <button type="button" key={`${criterion.kind}-${criterion.group}-${criterion.value ?? ''}`} aria-label={aria} onClick={() => onRemove(criterion)}>{label}<span aria-hidden="true">×</span></button>)}<button className="catalog-active-filters__clear" type="button" onClick={onClear}>Очистить всё</button></div>
}
