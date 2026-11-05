import { useEffect, useState } from 'react'
import type { GalleryItem, ProductOffer } from '../../data/productDetailData'
import { GalleryPurchasePanel, type CommercialState } from './ProductPurchase'
import { Link } from 'react-router-dom'
import { promotionHref } from '../../data/promotionPricing'

type Props = { images: GalleryItem[]; name: string; offer: ProductOffer; state: CommercialState; quantity:number }

export function ProductGallery({ name, offer, state, quantity }: Props) {
  const photos = [1,2,3].map(index => '/garage/style-check/review-assets/catalog-gallery/screw-' + index + '.webp')
  const [active, setActive] = useState(offer.galleryIndex)
  const [open, setOpen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  useEffect(() => setActive(offer.galleryIndex), [offer.galleryIndex])
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKey) }
  }, [open])
  const move = (direction: number) => setActive((index) => (index + direction + photos.length) % photos.length)
  const art = <img className="product-gallery__photo" src={photos[active]} alt={name + ', фото ' + (active + 1)} />
  const thumbs = (modal = false) => <div className="product-gallery__thumbs" aria-label={modal ? 'Миниатюры увеличенного просмотра' : 'Миниатюры товара'}>{photos.map((photo, index) => <button type="button" key={photo} aria-label={`Миниатюра ${index + 1}`} aria-pressed={active === index} onClick={() => setActive(index)}><img src={photo} alt="" /></button>)}</div>
  const stage = () => <div className="product-gallery__stage" onTouchStart={(event) => setTouchStart(event.touches[0].clientX)} onTouchEnd={(event) => { if (touchStart === null) return; const delta = event.changedTouches[0].clientX - touchStart; if (Math.abs(delta) > 40) move(delta < 0 ? 1 : -1); setTouchStart(null) }}>
    <Link className="promotion-badge" to={promotionHref}>Акция</Link>
    <button type="button" className="product-gallery__main" data-image={active + 1} aria-label="Увеличить изображение" onClick={() => setOpen(true)}>{art}</button>
    <button className="product-gallery__arrow product-gallery__arrow--prev" type="button" aria-label="Предыдущее изображение" onClick={() => move(-1)}>←</button><button className="product-gallery__arrow product-gallery__arrow--next" type="button" aria-label="Следующее изображение" onClick={() => move(1)}>→</button>
    <span className="product-gallery__counter">{active + 1} из {photos.length}</span>
  </div>
  return <section className="product-gallery" aria-label="Галерея товара"><div className="product-gallery__layout">{thumbs()}{stage()}</div>{open && <div className="product-gallery-modal" role="dialog" aria-modal="true" aria-label="Увеличенный просмотр товара" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}><div className="product-gallery-modal__content"><button className="product-modal__close" type="button" aria-label="Закрыть изображение" onClick={() => setOpen(false)}>×</button><div className="product-gallery-modal__viewer">{thumbs(true)}{stage()}</div><GalleryPurchasePanel offer={offer} state={state} quantity={quantity} /></div></div>}</section>
}
