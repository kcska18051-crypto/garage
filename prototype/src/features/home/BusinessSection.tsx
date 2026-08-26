import { Link } from 'react-router-dom'

export function BusinessSection({ onConsult }: { onConsult(): void }) {
  return <section className="business-section"><div><p className="eyebrow">Для профессиональных клиентов</p><h2>Комплексные закупки для бизнеса</h2><p>Оборудование, инструмент и материалы в одном рабочем процессе — от подбора до получения заказа.</p></div><ul><li>Работа с юридическими лицами</li><li>Документы в личном кабинете</li><li>Консультация по составу заказа</li></ul><div className="business-section__actions"><Link className="button button--light" to="/business">Подробнее</Link><button className="button" onClick={onConsult}>Получить консультацию</button></div></section>
}
