import { useEffect, useState } from 'react'

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])
  const isVideo = active === images.length - 1
  const art = <div className={`product-art product-art--${active + 1}`} aria-hidden="true"><span /><i /><b>{String(active + 1).padStart(2, '0')}</b></div>
  return <div className="product-gallery"><button type="button" className="product-gallery__main" data-image={active + 1} aria-label={isVideo ? 'Видео о товаре' : 'Увеличить изображение'} onClick={() => setOpen(true)}>{art}{isVideo && <span className="product-gallery__play" aria-hidden="true">▶</span>}<small>{images[active]} · {isVideo ? 'смотреть' : 'увеличить'}</small></button><div className="product-gallery__thumbs" aria-label="Миниатюры товара">{images.map((image, index) => <button type="button" key={image} aria-label={index === images.length - 1 ? 'Видео о товаре' : `Миниатюра ${index + 1}`} aria-pressed={active === index} onClick={() => setActive(index)}><span aria-hidden="true">{index === images.length - 1 ? '▶' : String(index + 1).padStart(2, '0')}</span><small>{image}</small></button>)}</div>{open && <div className="product-gallery-modal" role="dialog" aria-modal="true" aria-label="Увеличенное изображение товара" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}><div><button type="button" aria-label="Закрыть изображение" onClick={() => setOpen(false)}>×</button>{art}<p>{name} — {images[active]}</p></div></div>}</div>
}
