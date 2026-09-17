import type { ProductOffer, ProductVariantGroup } from '../../data/productDetailData'

type Props = {
  groups: ProductVariantGroup[]
  selections: Record<string, string>
  offers: ProductOffer[]
  onChange: (groupId: string, value: string) => void
}

export function ProductVariants({ groups, selections, offers, onChange }: Props) {
  if (!groups.length) return null
  return <section className="product-variants" role="group" aria-label="Варианты товара">
    {groups.map((group) => <div className="product-variant-group" key={group.id}>
      <p>{group.label}: <strong>{selections[group.id]}</strong></p>
      <div>{group.values.map((value) => {
        const exists = offers.some((offer) => offer.options[group.id] === value)
        return <button type="button" key={value} disabled={!exists} aria-pressed={selections[group.id] === value} onClick={() => onChange(group.id, value)}>{value}</button>
      })}</div>
    </div>)}
  </section>
}
