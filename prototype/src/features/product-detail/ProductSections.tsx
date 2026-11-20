import {ProductVideos} from './ProductVideos'
import {ProductDocumentRequest} from './ProductDocumentRequest'
import {ProductDescription} from './ProductDescription'
import {productSpecLink} from './productSpecLinks'
import { DemoLink as Link } from '../../app/DemoLink'
import { catalogProducts } from '../../data/catalogData'
import type { CatalogProduct } from '../../data/catalogTypes'
import { CatalogProductCard } from '../catalog/CatalogProductCard'
import { productDetail } from '../../data/productDetailData'
import { useRegion } from '../../state/RegionState'
import { ProductExtras } from './ProductExtras'
import type { ProductOffer } from '../../data/productDetailData'

const relatedProducts = catalogProducts.filter(product => product.subcategoryId === 'screw-compressors' && product.id !== productDetail.id)
const analogProducts = relatedProducts.slice(0, 4)
const similarProducts = relatedProducts.filter(product => product.brandId === 'remeza').slice(0, 4)
const Rail = ({ title, id, items }: { title: string; id?: string; items: CatalogProduct[] }) => <section className="product-content-section product-recommendations" id={id} aria-label={title}><h2>{title}</h2><div className="catalog-results">{items.map((product, index) => <CatalogProductCard key={product.id} product={product} index={index}/>)}</div></section>

export function ProductSections({ offer }: { offer?: ProductOffer }) {
  const { region } = useRegion()
  return <div className="product-sections">
    <ProductDescription offer={offer}/>
    <section id="characteristics" className="product-content-section"><h2>Характеристики</h2><p className="product-data-note">Параметры демонстрационные и требуют проверки по документации поставщика.</p><div className="product-spec-groups">{productDetail.specGroups.map((group) => <article key={group.title}><h3>{group.title}</h3><dl>{group.items.map(([name, value]) => { const spec=productSpecLink(name,value,offer); return <div key={name}><dt>{name}</dt><dd>{spec.href?<Link className="product-spec-link" to={spec.href} aria-label={`Показать компрессоры: ${name} — ${spec.value}`}>{spec.value}</Link>:spec.value}</dd></div> })}</dl></article>)}</div></section>
    <section id="equipment" className="product-content-section"><h2>Комплектация</h2><ul className="product-check-list"><li>Компрессорный модуль</li><li>Панель управления</li><li>Комплект сопроводительных материалов</li><li>Точный состав поставки уточняется для выбранного варианта</li></ul></section>
    <ProductExtras offer={offer}/>
    <ProductVideos/>
    <section id="documents" className="product-content-section"><h2>Документы</h2><div className="product-documents"><ProductDocumentRequest offer={offer} documentName="Паспорт изделия" label={<>Паспорт изделия <span>Запросить копию</span></>}/><ProductDocumentRequest offer={offer} documentName="Техническая карточка" label={<>Техническая карточка <span>Запросить копию</span></>}/><ProductDocumentRequest offer={offer} documentName="Сертификаты" label={<>Сертификаты <span>Уточнить комплект</span></>}/></div></section>
    <section id="reviews" className="product-content-section product-conditional"><h2>Отзывы</h2><p>Демонстрационный блок. Публикуется после подтверждения источника и модерации.</p><button className="button" type="button">Оставить отзыв</button></section>
    <section id="questions" className="product-content-section product-conditional"><h2>Вопросы</h2><p>Здесь будут ответы специалиста по выбору и эксплуатации оборудования.</p><button className="button" type="button">Задать вопрос</button></section>
    <section id="delivery" className="product-content-section product-delivery"><h2>Доставка и оплата</h2><div><strong>{region}</strong><p>Ожидаемый способ и срок получения уточняются с учётом выбранного варианта и адреса. Внутренняя складская логика пользователю не показывается.</p><div className="product-info-links"><Link to="/delivery">Подробнее о доставке</Link><Link to="/payment">Подробнее об оплате</Link></div></div></section>
    <section id="service" className="product-content-section"><h2>Сервис и гарантия</h2><p>Условия гарантии, пусконаладки и сервисного обслуживания уточняются для конкретной комплектации. Здесь будут опубликованы подтверждённые регламенты и контакты поддержки.</p><div className="product-info-links"><Link to="/warranty">Подробнее о гарантии</Link></div></section>

    <Rail id="analogs" title="Аналоги" items={analogProducts} />
    <Rail title="Похожие товары" items={similarProducts} />
  </div>
}

