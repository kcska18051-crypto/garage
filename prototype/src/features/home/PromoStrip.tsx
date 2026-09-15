import { Link } from 'react-router-dom'
import type { PromoBanner } from '../../data/types'

export function PromoStrip({ items }: { items: PromoBanner[] }) {
  return <section className="home-section promo-strip" aria-label="Тематические предложения">{items.map((item, index) => <Link className={`promo-strip__item promo-strip__item--${item.tone}`} to={item.href} key={item.id}><span>{String(index + 1).padStart(2, '0')}</span><div><h2>{item.title}</h2><p>{item.text}</p></div><strong aria-hidden="true">→</strong></Link>)}</section>
}
