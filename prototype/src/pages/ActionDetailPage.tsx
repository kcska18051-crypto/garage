import {useState} from 'react'
import {Link,useParams} from 'react-router-dom'
import {formatActionPeriod,getActionBySlug,getActionDeadline,getActionState} from '../data/actionsData'
import {catalogProducts,fullFilterGroups} from '../data/catalogData'
import {Breadcrumbs} from '../features/catalog/Breadcrumbs'
import {ProductListing} from '../features/catalog/ProductListing'
import {actionPicture} from '../features/actions/actionPictures'
import {NotFoundPage} from './NotFoundPage'
import '../features/actions/Actions.css'

export function ActionDetailPage(){
 const {slug}=useParams();const action=getActionBySlug(slug);const [tab,setTab]=useState('all')
 if(!action)return <NotFoundPage/>
 const completed=getActionState(action)==='completed'
 const selected=action.productConfig.tabs.find(item=>item.id===tab)
 const products=selected?.subcategoryIds?catalogProducts.filter(product=>selected.subcategoryIds?.includes(product.subcategoryId)):catalogProducts
 return <main className={`action-detail-page${completed?' action-detail-page--completed':''}`}>
  <Breadcrumbs items={[{label:'Главная',to:'/'},{label:'Акции',to:'/actions'},{label:action.title}]}/>
  <div className="action-intro"><div>
   <aside className="action-detail-status"><strong>{getActionDeadline(action.endDate)}</strong>{completed&&<span>{formatActionPeriod(action)}</span>}</aside>
   <header className="action-detail-heading"><h1>{action.title}</h1><p>{action.shortDescription}</p></header>
   {!completed&&action.cta&&<div className="action-detail-actions"><a className="button" href={action.cta.href}>{action.cta.label}</a><a href="#action-rules">Условия предложения</a></div>}
  </div><div className="action-hero" aria-label="Основное изображение акции" role="img"><img src={actionPicture(action)} alt="" width="1200" height="800"/></div></div>
  {action.features.length>0&&<dl className="action-feature-grid">{action.features.map(feature=><div key={feature.label}><dt>{feature.label}</dt><dd>{feature.value}</dd></div>)}</dl>}
  <section id="action-rules" className="action-content" aria-label="Описание и условия акции">
   <p>{action.fullDescription||action.shortDescription}</p>
   {action.conditions.length>0&&<ol>{action.conditions.map(item=><li key={item}>{item}</li>)}</ol>}
   <p className="action-legal">Итоговые условия и применимость предложения уточняются перед оформлением заказа.</p>
   {!completed&&action.promoCode&&<p className="action-promo">Промокод: <strong>{action.promoCode}</strong></p>}
  </section>
  {action.categories?.length&&<div className="action-categories" aria-label="Категории акции">{action.categories.map(item=><span key={item}>{item}</span>)}</div>}
  {!completed&&action.productConfig.enabled&&<section id="action-products" aria-label="Товары акции">
   {action.productConfig.showTabs&&<div className="action-product-tabs" role="group" aria-label="Группы товаров акции">{action.productConfig.tabs.map(item=><button type="button" aria-pressed={tab===item.id} onClick={()=>setTab(item.id)} key={item.id}>{item.label}</button>)}</div>}
   <ProductListing products={products} filterGroups={fullFilterGroups} mode="full" title="Товары по акции" showFilters={false}/>
  </section>}
  <Link className="action-back" to="/actions">← Все акции</Link>
 </main>
}
