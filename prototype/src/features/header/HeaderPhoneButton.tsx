import {useState,type ReactNode} from 'react'
import {CartDialog} from '../cart/CartDialog'
import './HeaderPhoneButton.css'
import {regionalPhones,orderedRegionalPhones,nationalPhonePlaceholder} from '../../data/regionalPhones'
export function HeaderPhoneDialog({onClose,region='Ярославль'}:{onClose():void;region?:string}) {
 const local=regionalPhones.some(item=>item.city===region)
 const common=<div className="header-phone-dialog__common" data-primary={!local}><strong>Для всех регионов · 8 800</strong><span className="header-phone-dialog__national-number">{nationalPhonePlaceholder}</span><small>Временный номер для макета</small></div>
 return <CartDialog title="Телефоны магазинов" className="header-phone-dialog" onClose={onClose}><p>Ваш регион: {region}. Его телефон показан первым.</p>{!local&&common}<ul>{orderedRegionalPhones(region).map(item=><li key={item.city} data-primary={item.city===region}><strong>{item.city}</strong><a href={item.href} aria-label={`Позвонить в магазин: ${item.city}, ${item.phone}`}>{item.phone}</a></li>)}</ul>{local&&common}<p className="header-phone-dialog__note">Нажмите на региональный номер, чтобы позвонить.</p></CartDialog>
}
export function HeaderPhoneButton({children,className,ariaLabel,onOpen,region='Ярославль'}:{children:ReactNode;className?:string;ariaLabel?:string;onOpen?():void;region?:string}){
 const [open,setOpen]=useState(false)
 return <><button type="button" className={className} aria-label={ariaLabel} aria-haspopup="dialog" onClick={onOpen??(()=>setOpen(true))}>{children}</button>{open&&<HeaderPhoneDialog region={region} onClose={()=>setOpen(false)}/>}</>
}
