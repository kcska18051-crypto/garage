import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getActionBySlug, getActionDeadline } from '../data/actionsData'
import { catalogProducts, fullFilterGroups } from '../data/catalogData'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { ProductListing } from '../features/catalog/ProductListing'
import { NotFoundPage } from './NotFoundPage'
import '../features/actions/Actions.css'

export function ActionDetailPage(){
 const{slug}=useParams();const action=getActionBySlug(slug);const[tab,setTab]=useState('all')
 if(!action)return <NotFoundPage/>
 const selected=action.productConfig.tabs.find(item=>item.id===tab)
 const products=selected?.subcategoryIds?catalogProducts.filter(product=>selected.subcategoryIds?.includes(product.subcategoryId)):catalogProducts
 return <main className="action-detail-page"><Breadcrumbs items={[{label:'Главная',to:'/'},{label:'Акции',to:'/actions'},{label:action.title}]}/><header className="action-detail-heading"><h1>{action.title}</h1></header><div className="action-hero" aria-label="Основное изображение акции" role="img"><i/><b/></div>{action.features.length?<dl className="action-feature-grid">{action.features.map(feature=><div key={feature.label}><dt>{feature.label}</dt><dd>{feature.value}</dd></div>)}</dl>:null}<section className="action-content" aria-label="Описание и условия акции"><aside className="action-detail-status"><strong>{getActionDeadline(action.endDate)}</strong><span>{action.audience}</span></aside><p>{action.fullDescription}</p><ol>{action.conditions.map(item=><li key={item}>{item}</li>)}</ol><p className="action-legal">Демонстрационные условия прототипа. Фактические сроки, выгода и ограничения требуют юридического согласования клиентом.</p><div className="action-detail-actions">{action.cta?<a className="button button--dark" href={action.cta.href}>{action.cta.label}</a>:null}<a href={action.rulesHref}>Полные правила акции</a></div>{action.promoCode?<p className="action-promo">Промокод: <strong>{action.promoCode}</strong></p>:null}</section>{action.categories?.length?<div className="action-categories" aria-label="Категории акции">{action.categories.map(item=><span key={item}>{item}</span>)}</div>:null}{action.productConfig.enabled?<section id="action-products" aria-label="Товары акции">{action.productConfig.showTabs?<div className="action-product-tabs" role="group" aria-label="Группы товаров акции">{action.productConfig.tabs.map(item=><button type="button" aria-pressed={tab===item.id} onClick={()=>setTab(item.id)} key={item.id}>{item.label}</button>)}</div>:null}<ProductListing products={products} filterGroups={fullFilterGroups} mode="full" title="Товары по акции" tagGroups={action.productConfig.showTags?action.productConfig.tagGroups:undefined} showFilters={action.productConfig.showFilters}/></section>:null}</main>
}
