import {Link} from 'react-router-dom'
import {Breadcrumbs} from '../features/catalog/Breadcrumbs'
import {CatalogProductCard} from '../features/catalog/CatalogProductCard'
import {RoundedIcon} from '../features/header/RoundedIcon'
import {searchCatalogProducts} from '../data/searchResults'
import {formatProductCount} from '../data/catalogData'
import {useCommerce} from '../state/CommerceState'
import './FavoritesPage.css'

const productsForCards=searchCatalogProducts('')
export function FavoritesContent({embedded=false}:{embedded?:boolean}) {
 const commerce=useCommerce()
 const products=productsForCards.filter(product=>commerce.favoriteIds.has(product.id))
 return <div className={`favorites-content${embedded?' favorites-content--embedded':''}`}>
  <header className="favorites-heading"><div><h1>Избранное</h1><p>{products.length?'Сохранено '+formatProductCount(products.length):'Сохраняйте понравившиеся товары, чтобы вернуться к ним позже.'}</p></div>{products.length>0&&<button className="favorites-clear" type="button" onClick={()=>[...commerce.favoriteIds].forEach(id=>commerce.removeFavorite(id))}>Очистить избранное</button>}</header>
  {products.length?<>
   <div className="favorites-toolbar"><span>Ваши сохранённые товары</span><Link to="/catalog">Продолжить выбор в каталоге</Link></div>
   <div className="catalog-results favorites-grid">{products.map((product,index)=><CatalogProductCard key={product.id} product={product} index={index} quoteHref={product.purchaseMode==='quote'?'/product/'+product.slug:undefined}/>)}</div>
  </>:<section className="favorites-empty"><span className="favorites-empty__icon"><RoundedIcon name="favorite"/></span><h2>В избранном пока пусто</h2><p>Нажмите на сердечко в карточке товара — он появится здесь.</p><Link className="favorites-catalog" to="/catalog">Перейти в каталог</Link></section>}
 </div>
}
export function FavoritesPage() {
 return <main className="favorites-page"><Breadcrumbs items={[{label:'Главная',to:'/'},{label:'Избранное'}]}/><FavoritesContent/></main>
}
