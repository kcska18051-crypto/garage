import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { BrandsDirectory } from '../features/brands/BrandsDirectory'
import '../features/brands/Brands.css'

export function BrandsPage() {
  return <main className="brands-page">
    <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Бренды' }]} />
    <header className="brands-page__intro"><h1>Бренды</h1><p>Алфавитный каталог производителей оборудования, инструмента и материалов по направлениям магазина.</p><p className="brands-page__note">Состав брендов и направления представлены как демонстрационные данные интерактивного прототипа.</p></header>
    <BrandsDirectory />
    <section className="brands-page__seo"><h2>Выбор производителя</h2><p>Используйте поиск, направления и алфавит, чтобы быстро найти нужного производителя. Карточки брендов на этом этапе информационные: отдельные страницы будут добавляться только после согласования содержания с клиентом.</p></section>
  </main>
}
