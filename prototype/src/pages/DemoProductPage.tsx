import { useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { designedProductIds } from '../app/demoNavigation'
import { ProductDetailPage } from './ProductDetailPage'
import { NotFoundPage } from './NotFoundPage'

export function DemoProductPage() {
 const {slug} = useParams()
 const {hash} = useLocation()
 useEffect(() => {
  const target = hash ? document.getElementById(hash.slice(1)) : null
  if (target) target.scrollIntoView?.()
  else { document.documentElement.scrollTop = 0; document.body.scrollTop = 0 }
 }, [slug, hash])
 const supported = !!slug && designedProductIds.includes(slug)
 return supported ? <ProductDetailPage key={slug} initialOfferId={slug}/> : <NotFoundPage/>
}
