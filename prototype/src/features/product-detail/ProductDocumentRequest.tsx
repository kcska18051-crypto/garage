import {useCallback,useState,type ReactNode} from 'react'
import {ContactDialog} from '../forms/ContactDialog'
import {defaultOffer,productDetail,type ProductOffer} from '../../data/productDetailData'
export function ProductDocumentRequest({offer=defaultOffer,label='Запросить документы',documentName='',className}:{offer?:ProductOffer;label?:ReactNode;documentName?:string;className?:string}){
 const [open,setOpen]=useState(false),close=useCallback(()=>setOpen(false),[])
 const product={id:offer.id,name:`${productDetail.name} · ${offer.options.voltage} · ${offer.options.power}`,sku:offer.sku}
 return <><button type="button" className={className} onClick={()=>setOpen(true)}>{label}</button>{open&&<ContactDialog mode="documents" product={product} initialComment={documentName} onClose={close}/>}</>
}
