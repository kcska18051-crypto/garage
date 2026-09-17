import { productDetail } from '../../data/productDetailData'
import { useRegion } from '../../state/RegionState'

const Rail = ({ title, id, items }: { title: string; id?: string; items: string[] }) => <section className="product-rail" id={id}><h2>{title}</h2><div>{items.map((item, index) => <article key={item}><div className={`product-rail__art product-rail__art--${index % 3}`} aria-hidden="true"><span /><i /></div><h3>{item}</h3><p>Информационная карточка прототипа</p><button type="button">Подробнее</button></article>)}</div></section>

export function ProductSections() {
  const { region } = useRegion()
  return <div className="product-sections">
    <section id="description" className="product-content-section product-description"><h2>Описание</h2><div><p>Винтовой компрессор Remeza ВК 10-8 предназначен для подготовки сжатого воздуха в мастерских и производственных линиях с продолжительными рабочими циклами.</p><h3>Назначение и применение</h3><p>Ременной привод упрощает регламентное обслуживание, а напольное исполнение позволяет включать оборудование в существующую пневмосеть. Конкретная комплектация и эксплуатационные параметры зависят от выбранного торгового предложения.</p><h3>Что важно учесть</h3><ul><li>Проверьте доступное напряжение на объекте.</li><li>Сопоставьте производительность с пиковым расходом потребителей.</li><li>Заранее уточните требования к подготовке воздуха и сервисному доступу.</li></ul></div></section>
    <section id="characteristics" className="product-content-section"><h2>Характеристики</h2><p className="product-data-note">Параметры демонстрационные и требуют проверки по документации поставщика.</p><div className="product-spec-groups">{productDetail.specGroups.map((group) => <article key={group.title}><h3>{group.title}</h3><dl>{group.items.map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl></article>)}</div></section>
    <section id="equipment" className="product-content-section"><h2>Комплектация</h2><ul className="product-check-list"><li>Компрессорный модуль</li><li>Панель управления</li><li>Комплект сопроводительных материалов</li><li>Точный состав поставки уточняется для выбранного варианта</li></ul></section>
    <section id="video" className="product-content-section product-video"><h2>Видео</h2><button type="button" aria-label="Воспроизвести демонстрационное видео"><span aria-hidden="true">▶</span><strong>Обзор оборудования</strong><small>Демонстрационный видеоблок</small></button></section>
    <section id="documents" className="product-content-section"><h2>Документы</h2><div className="product-documents"><button type="button">Паспорт изделия <span>PDF · прототип</span></button><button type="button">Техническая карточка <span>PDF · прототип</span></button><button type="button">Сертификаты <span>Состав уточняется</span></button></div></section>
    <section id="reviews" className="product-content-section product-conditional"><h2>Отзывы</h2><p>Демонстрационный блок. Публикуется после подтверждения источника и модерации.</p><button className="button" type="button">Оставить отзыв</button></section>
    <section id="questions" className="product-content-section product-conditional"><h2>Вопросы</h2><p>Здесь будут ответы специалиста по выбору и эксплуатации оборудования.</p><button className="button" type="button">Задать вопрос</button></section>
    <section id="delivery" className="product-content-section product-delivery"><h2>Доставка и оплата</h2><div><strong>{region}</strong><p>Ожидаемый способ и срок получения уточняются с учётом выбранного варианта и адреса. Внутренняя складская логика пользователю не показывается.</p></div></section>
    <section id="service" className="product-content-section"><h2>Сервис и гарантия</h2><p>Условия гарантии, пусконаладки и сервисного обслуживания уточняются для конкретной комплектации. Здесь будут опубликованы подтверждённые регламенты и контакты поддержки.</p></section>
    <Rail title="Расходные материалы" items={['Сервисный комплект', 'Фильтрующий элемент', 'Компрессорное масло']} />
    <Rail title="Совместимые товары" items={['Рефрижераторный осушитель', 'Воздушный ресивер', 'Магистральный фильтр']} />
    <Rail id="analogs" title="Аналоги" items={['Винтовой компрессор — аналог 01', 'Винтовой компрессор — аналог 02', 'Комплектное решение — аналог 03']} />
    <Rail title="Похожие товары" items={['Компрессор серии ВК 11', 'Компрессор серии ВК 15', 'Компрессорная станция']} />
  </div>
}
