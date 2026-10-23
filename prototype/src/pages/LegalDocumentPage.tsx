import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import './LegalDocumentPage.css'

export function LegalDocumentPage({ title }: { title: string }) {
  return (
    <main className="legal-document-page">
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: title }]} />
      <article className="legal-document">
        <h1>{title}</h1>
        <div className="legal-document__notice">
          <strong>Текст будет предоставлен заказчиком.</strong>
          <p>Сейчас это демонстрационная страница интерфейса. Она не является утверждённым юридическим документом и не служит основанием для реального сбора данных.</p>
        </div>
      </article>
    </main>
  )
}
