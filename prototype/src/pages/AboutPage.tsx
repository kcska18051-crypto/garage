import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import './AboutPage.css'

const features = [
  { icon: '▦', title: 'Ассортимент', text: 'Структура каталога для профессиональной мастерской.' },
  { icon: '⌕', title: 'Подбор', text: 'Ориентиры для выбора оборудования и инструмента.' },
  { icon: '○', title: 'Поддержка', text: 'Каналы связи по вопросам о товарах и заказах.' },
]

export function AboutPage() {
  return <main className="about-page">
    <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'О компании' }]} />
    <article className="about-content">
      <header className="about-heading">
        <p className="eyebrow">Информация о проекте</p>
        <h1>О компании</h1>
        <p>«Гараж» представлен как интернет-магазин оборудования, инструмента и материалов для профессионального ремонта и обслуживания автомобилей.</p>
      </header>

      <div className="about-copy">
        <p>Это временный текст для демонстрации структуры раздела. Он будет заменён материалами клиента после согласования.</p>
        <p>Здесь можно кратко рассказать о направлении работы, подходе к формированию каталога и помощи покупателям при выборе подходящих решений.</p>
        <p>Фактические сведения о компании, её деятельности и условиях обслуживания будут добавлены после согласования и проверки исходных данных.</p>
      </div>

      <ul className="about-features" aria-label="Основные направления работы">
        {features.map((feature) => <li key={feature.title}><span aria-hidden="true">{feature.icon}</span><div><strong>{feature.title}</strong><p>{feature.text}</p></div></li>)}
      </ul>
    </article>
  </main>
}
