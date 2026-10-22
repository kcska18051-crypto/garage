import {useState} from 'react'
import {Link} from 'react-router-dom'
import {rentalCategories,rentalForSaleProduct} from '../../data/rentalData'
import {CartDialog} from '../cart/CartDialog'
import './RentalAvailability.css'

export function RentalAvailability({productId}:{productId:string}) {
  const [open,setOpen]=useState(false)
  const item=rentalForSaleProduct(productId)
  const category=rentalCategories.find(category=>category.id===item?.categoryId)
  if(!item||!category) return null
  return <div className="rental-availability">
    <button type="button" onClick={()=>setOpen(true)}>Можно взять в аренду</button>
    {open&&<CartDialog title="Можно взять в аренду" onClose={()=>setOpen(false)}>
      <p>Для этого товара предусмотрен отдельный сценарий аренды. Перейдите в категорию, выберите оборудование и укажите желаемые даты.</p>
      <p className="rental-availability__note">Это демонстрация. Наличие, тариф и условия уточняются; заявка не подтверждает бронь. Аренда не добавляется в корзину покупки.</p>
      <Link className="button button--dark" to={category.href} onClick={()=>setOpen(false)}>{category.heading}</Link>
    </CartDialog>}
  </div>
}
