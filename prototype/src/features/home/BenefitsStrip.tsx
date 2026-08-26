import type { Benefit } from '../../data/types'

export function BenefitsStrip({ items }: { items: Benefit[] }) {
  return <section className="benefits-strip" aria-label="Преимущества">{items.map((item, index) => <article key={item.id}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h2>{item.title}</h2><p>{item.text}</p></div></article>)}</section>
}
