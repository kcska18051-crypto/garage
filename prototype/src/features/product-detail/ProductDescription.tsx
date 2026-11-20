import {productDetail,defaultOffer,type ProductOffer} from '../../data/productDetailData'
export function ProductDescription({offer=defaultOffer}:{offer?:ProductOffer}){
 return <section id="description" className="product-content-section product-description"><h2>Описание</h2><div>
 <p>Винтовой компрессор Remeza ВК 10-8 предназначен для подготовки сжатого воздуха в мастерских и производственных линиях с продолжительными рабочими циклами.</p>
 <h3>Назначение и применение</h3><p>Ременной привод упрощает регламентное обслуживание, а напольное исполнение позволяет включать оборудование в существующую пневмосеть. Конкретная комплектация и эксплуатационные параметры зависят от выбранного торгового предложения.</p>
 <div className="product-description__photos">{[2,3].map((index)=><figure key={index}><img src={`/garage/style-check/review-assets/catalog-gallery/screw-${index}.webp`} alt={`Компрессор Remeza, ракурс ${index-1}`} width="640" height="420" loading="lazy"/><figcaption>Remeza ВК 10-8 · ракурс {index-1}</figcaption></figure>)}</div>
 <h3>Модификации оборудования</h3><p>Пример таблицы в описании. Параметры взяты из демонстрационных вариантов товара; выбранный вариант выделен.</p>
 <div className="product-description__table" role="region" aria-label="Таблица модификаций" tabIndex={0}><table><caption>Варианты Remeza ВК 10-8</caption><thead><tr><th scope="col">Артикул</th><th scope="col">Напряжение</th><th scope="col">Мощность</th><th scope="col">Исполнение</th></tr></thead><tbody>{productDetail.offers.map(item=><tr key={item.id} data-selected={item.id===offer.id}><th scope="row">{item.sku}{item.id===offer.id&&<span className="product-description__selected">Выбрано</span>}</th><td>{item.options.voltage}</td><td>{item.options.power}</td><td>С ременным приводом</td></tr>)}</tbody></table></div>
 <h3>Что важно учесть</h3><ul><li>Проверьте доступное напряжение на объекте.</li><li>Сопоставьте производительность с пиковым расходом потребителей.</li><li>Заранее уточните требования к подготовке воздуха и сервисному доступу.</li></ul>
 </div></section>
}
