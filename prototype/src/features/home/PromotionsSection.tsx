import { Link } from 'react-router-dom'
import type { Promotion } from '../../data/types'

export function PromotionsSection({ items }: { items: Promotion[] }) {
  const visible = items.filter((item) => item.showOnHome)
  if (!visible.length) return null
  return <section className="home-section promotions"><div className="section-heading"><div><h2>Акции</h2></div><Link to="/actions">Все акции →</Link></div><div className="promotions__grid">{visible.map((item, index) => <Link className="promotion-card" to={item.href} key={item.id}><div className={`promotion-card__art art-${index}`} aria-hidden="true"><span /></div><p className="promotion-card__deadline">{item.deadline}</p><h3>{item.title}</h3><p>{item.text}</p><strong>Подробнее →</strong></Link>)}</div></section>
}
