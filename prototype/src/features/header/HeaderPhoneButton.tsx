import {useState,type ReactNode} from 'react'
import {CartDialog} from '../cart/CartDialog'
import './HeaderPhoneButton.css'
import {regionalPhones} from '../../data/regionalPhones'
export function HeaderPhoneDialog({onClose}:{onClose():void}) {
 return <CartDialog title="Телефоны магазинов" className="header-phone-dialog" onClose={onClose}><p>Выберите телефон для обращения.</p><ul>{regionalPhones.map(item=><li key={item.city}><strong>{item.city}</strong><a href={item.href} aria-label={`Позвонить в магазин: ${item.city}, ${item.phone}`}>{item.phone}</a></li>)}</ul><div className="header-phone-dialog__common"><strong>Для всех регионов · 8 800</strong><span>Единый номер уточняется</span></div><p className="header-phone-dialog__note">Нажмите на региональный номер, чтобы позвонить.</p></CartDialog>
}
export function HeaderPhoneButton({children,className,ariaLabel,onOpen}:{children:ReactNode;className?:string;ariaLabel?:string;onOpen?():void}){
 const [open,setOpen]=useState(false)
 return <><button type="button" className={className} aria-label={ariaLabel} aria-haspopup="dialog" onClick={onOpen??(()=>setOpen(true))}>{children}</button>{open&&<HeaderPhoneDialog onClose={()=>setOpen(false)}/>}</>
}
