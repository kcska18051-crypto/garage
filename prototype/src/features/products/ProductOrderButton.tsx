import {useCallback,useState} from 'react'
import {ContactDialog} from '../forms/ContactDialog'
export function ProductOrderButton({product,className}:{product:{id:string;name:string;sku:string};className?:string}) {
 const [open,setOpen]=useState(false)
 const close=useCallback(()=>setOpen(false),[])
 return <><button className={className} type="button" onClick={()=>setOpen(true)}>Под заказ</button>{open&&<ContactDialog mode="preorder" product={product} onClose={close}/>}</>
}
