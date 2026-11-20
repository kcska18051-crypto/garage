import {useCallback,useState} from 'react'
import {CartDialog} from '../cart/CartDialog'
export function BrandCertificate(){
 const [open,setOpen]=useState(false),close=useCallback(()=>setOpen(false),[])
 return <><button className="brand-certificate" type="button" onClick={()=>setOpen(true)}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 3h14v13H5zM8 7h8M8 10h6M9 16l-1 5 4-2 4 2-1-5"/></svg><span>Сертификат дилера</span></button>{open&&<CartDialog title="Сертификат дилера Remeza" onClose={close}><p>Сертификат будет опубликован после получения документа.</p><button className="button" type="button" onClick={close}>Закрыть</button></CartDialog>}</>
}
