import {useState} from 'react'
import {Link} from 'react-router-dom'
import {rentalCategories,rentalForSaleProduct} from '../../data/rentalData'
import {CartDialog} from '../cart/CartDialog'
import './RentalAvailability.css'

export function RentalAvailability({productId,prominent=false}:{productId:string;prominent?:boolean}) {
  const [open,setOpen]=useState(false)
  const item=rentalForSaleProduct(productId)
  const category=rentalCategories.find(category=>category.id===item?.categoryId)
  if(!item||!category) return null
  return <div className="rental-availability">
    <button type="button" onClick={()=>setOpen(true)}>{prominent ? <><svg className="rental-availability__icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 10h18M12 13v3l2 1"/></svg><span>Взять в аренду</span><span className="rental-availability__arrow" aria-hidden="true">→</span></> : 'Можно взять в аренду'}</button>
    {open&&<CartDialog className="rental-availability-dialog" title="Можно взять в аренду" onClose={()=>setOpen(false)}>
      <p>Для этого товара предусмотрен отдельный сценарий аренды. Перейдите в категорию, выберите оборудование и укажите желаемые даты.</p>
      <p className="rental-availability__note">Это демонстрация. Наличие, тариф и условия уточняются; заявка не подтверждает бронь. Аренда не добавляется в корзину покупки.</p>
      <Link className="button button--dark" to={category.href} onClick={()=>setOpen(false)}>{category.heading}</Link>
    </CartDialog>}
  </div>
}
