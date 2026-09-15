import { useRef } from 'react'
import { Link } from 'react-router-dom'
import type { Brand } from '../../data/types'

export function BrandGrid({ items }: { items: Brand[] }) {
  const railRef = useRef<HTMLDivElement>(null)
  const move = (direction: number) => railRef.current?.scrollBy({ left: direction * railRef.current.clientWidth * .7, behavior: 'smooth' })
  return <section className="home-section home-section--brands"><div className="section-heading"><div><h2>Популярные бренды</h2></div><div className="rail-actions"><Link to="/brands">Все бренды</Link><button type="button" aria-label="Предыдущие бренды" onClick={() => move(-1)}>←</button><button type="button" aria-label="Следующие бренды" onClick={() => move(1)}>→</button></div></div><div className="brand-grid" ref={railRef}>{items.map((item, index) => <Link to={item.href} key={item.id}><span className={`brand-symbol brand-symbol--${index % 4}`} aria-hidden="true" />{item.name}</Link>)}</div></section>
}
