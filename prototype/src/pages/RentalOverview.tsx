import {Link} from 'react-router-dom'
import {rentalCategories} from '../data/rentalData'
import {Breadcrumbs} from '../features/catalog/Breadcrumbs'
import './RentalOverview.css'
const content:Record<string,{text:string;action:string;images:Array<[string,string]>}>={
 compressors:{text:'Поршневые и винтовые компрессоры для временного использования.',action:'Выбрать компрессор',images:[['product-compressor.jpg','Поршневой компрессор'],['product-remeza1.jpg','Винтовой компрессор']]},
 tools:{text:'Домкрат и набор инструмента для задач рабочего поста.',action:'Выбрать инструмент',images:[['product-jack.jpg','Подкатной домкрат'],['product-toolset.jpg','Набор инструмента']]},
}
const steps=[{title:'Выберите оборудование',text:'Откройте нужную позицию и посмотрите её параметры.'},{title:'Укажите даты',text:'Оставьте заявку с желаемым периодом аренды и количеством.'},{title:'Уточните условия',text:'Согласуйте наличие, тариф, залог, получение и возврат оборудования.'}]
function Arrow(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>}
export function RentalOverview(){return <main className="rental-overview">
 <Breadcrumbs items={[{label:'Главная',to:'/'},{label:'Услуги',to:'/services'},{label:'Аренда оборудования и инструмента'}]}/>
 <header className="rental-overview__heading"><h1>Аренда оборудования и инструмента</h1><p>Для временных задач мастерской.</p><span>Выберите направление, затем оборудование и желаемый период аренды.</span></header>
 <section className="rental-overview__grid" aria-label="Направления аренды">{rentalCategories.map(category=>{const item=content[category.id];return <article key={category.id}><Link className="rental-overview__card" to={category.href} aria-label={category.title}><div className={`rental-overview__art rental-overview__art--${category.id}`}>{item.images.map(([file,alt])=><img key={file} src={`/garage/style-check/review-assets/${file}`} alt={alt} decoding="async"/>)}</div><div className="rental-overview__copy"><h2>{category.title}</h2><p>{item.text}</p><span className="rental-overview__action">{item.action}<Arrow/></span></div></Link></article>})}</section>
 <section className="rental-overview__process" aria-labelledby="rental-overview-process"><h2 id="rental-overview-process">Как оформить аренду</h2><ol>{steps.map((step,i)=><li key={step.title}><span>{String(i+1).padStart(2,'0')}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol></section>
 <aside className="rental-overview__notice"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h14v17H5zM8 2v4m8-4v4M5 9h14m-9 5 2 2 4-4"/></svg><div><strong>Заявка не подтверждает бронь</strong><p>Наличие оборудования и условия аренды уточняются отдельно. Онлайн-оплата и автоматическое бронирование не предусмотрены.</p></div></aside>
 <Link className="rental-overview__back" to="/services">← Все услуги</Link>
 </main>}
