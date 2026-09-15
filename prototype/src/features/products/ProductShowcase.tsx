import { useRef } from 'react'
import { Link } from 'react-router-dom'
import type { ProductCollection } from '../../data/types'
import { ProductCard } from './ProductCard'
import './ProductCard.css'

export function ProductShowcase({ collection }: { collection: ProductCollection }) {
  const railRef = useRef<HTMLDivElement>(null)
  const move = (direction: number) => railRef.current?.scrollBy({ left: direction * railRef.current.clientWidth * .8, behavior: 'smooth' })
  return <section className="home-section product-showcase"><div className="section-heading"><div><h2>{collection.label}</h2></div><div className="rail-actions"><Link to={collection.href}>Смотреть все</Link><button type="button" aria-label={`Предыдущие товары: ${collection.label}`} onClick={() => move(-1)}>←</button><button type="button" aria-label={`Следующие товары: ${collection.label}`} onClick={() => move(1)}>→</button></div></div><div className="product-grid" ref={railRef}>{collection.products.slice(0, 5).map((product, index) => <ProductCard key={`${collection.id}-${product.id}`} product={product} index={index} />)}</div></section>
}
