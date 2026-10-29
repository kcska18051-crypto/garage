import { useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { ProductCollection } from '../../data/types'
import { ProductCard } from './ProductCard'
import './ProductCard.css'

export function ProductShowcase({ collection, demoCopies = 1 }: { collection: ProductCollection; demoCopies?: number }) {
  const products = Array.from({ length: demoCopies }, () => collection.products.slice(0, 5)).flat()
  const railRef = useRef<HTMLDivElement>(null)
  const isStyleCheck = useLocation().pathname.replace(/\/$/, '') === '/style-check'
  const move = (direction: number) => railRef.current?.scrollBy({ left: direction * railRef.current.clientWidth * .8, behavior: 'smooth' })
  const controls = <><button type="button" aria-label={`Предыдущие товары: ${collection.label}`} onClick={() => move(-1)}>←</button><button type="button" aria-label={`Следующие товары: ${collection.label}`} onClick={() => move(1)}>→</button></>
  const rail = <div className="product-grid" ref={railRef}>{products.map((product, index) => <ProductCard key={`${collection.id}-${product.id}-${index}`} product={product} index={index} />)}</div>
  return <section className="home-section product-showcase" data-collection-source={collection.source}>
    <div className="section-heading"><div><h2>{collection.label}</h2></div><div className="rail-actions"><Link to={collection.href}>Смотреть все</Link>{!isStyleCheck && controls}</div></div>
    {isStyleCheck ? <div className="product-carousel">{rail}<div className="rail-actions product-carousel__controls">{controls}</div></div> : rail}
  </section>
}
