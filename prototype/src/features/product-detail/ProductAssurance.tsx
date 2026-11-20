import {DemoLink as Link} from '../../app/DemoLink'
import {defaultOffer,type ProductOffer} from '../../data/productDetailData'
import {ProductDocumentRequest} from './ProductDocumentRequest'
function AssuranceIcon({document=false}:{document?:boolean}){return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{document?<><path d="M14 3H5v18h14V8zM14 3v5h5M8 12h8M8 16h6"/></>:<><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-6"/></>}</svg>}
export function ProductAssurance({offer=defaultOffer}:{offer?:ProductOffer}){
 return <aside className="product-assurance" aria-label="Документы и гарантия"><header><span className="product-assurance__icon"><AssuranceIcon/></span><div><h3>Документы и гарантия</h3><small>Remeza · Артикул {offer.sku}</small></div></header>
 <div className="product-assurance__item"><AssuranceIcon document/><div><h4>Документы на оборудование</h4><p>Паспорт, сертификаты и документы поставки. Уточните комплект для проверки происхождения и комплектации.</p></div></div>
 <div className="product-assurance__item"><AssuranceIcon/><div><h4>Гарантия на оборудование</h4><p>Срок и условия подтвердим для выбранной комплектации до оформления заказа.</p><Link to="/warranty">Условия гарантии</Link></div></div>
 <ProductDocumentRequest offer={offer} className="button product-assurance__request"/>
 </aside>
}
