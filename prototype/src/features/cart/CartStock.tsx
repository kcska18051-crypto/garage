import { useState } from 'react'
import { Link } from 'react-router-dom'
import { contactPoints } from '../../data/contactsData'
import type { DemoProduct } from '../../data/productRegistry'
import { useRegion } from '../../state/RegionState'
import { CartDialog as ProfileDialog } from './CartDialog'
import { formatAvailability } from '../../utils/availability'

export function CartStock({ product }: { product: Pick<DemoProduct, 'name' | 'availabilityStatus' | 'storeCount'> }) {
  const [open, setOpen] = useState(false)
  const { region } = useRegion()
  const points = contactPoints.filter(point => point.city === region)
  const availability = formatAvailability(product.availabilityStatus, product.storeCount)
  return <><button type="button" className="cart-stock-trigger" onClick={() => setOpen(true)} aria-label={`Наличие в магазинах: ${product.name}`}>Наличие в магазинах · {region}</button>
    {open && <ProfileDialog title={`Наличие в магазинах · ${region}`} onClose={() => setOpen(false)}><p>{product.name}</p><p>Статус товара: {availability}</p><p>Демонстрационные данные. Остатки по конкретной точке пока не подключены.</p>{points.length ? points.map(point => <article className="cart-stock-point" key={point.id}><h3>{point.name}</h3><p>{point.city}, {point.address}</p><p>{point.hours}</p><p>{availability.startsWith('В наличии') ? 'Наличие в этой точке уточняется' : availability}</p><Link to={`/contacts/${point.id}?city=${encodeURIComponent(region)}`}>Адрес, фото и проезд</Link></article>) : <p>Контактные точки для этого города пока не указаны. Получение уточняется при оформлении.</p>}</ProfileDialog>}
  </>
}
