import { NavLink } from 'react-router-dom'
import { infoPageEntries, infoPages, type InfoPageKey } from '../data/infoPagesData'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import '../features/info/InfoPages.css'

export function InfoPage({ page }: { page: InfoPageKey }) {
  const currentPage = infoPages[page]

  return <main className="info-page">
    <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: currentPage.title }]} />
    <div className="info-layout">
      <nav className="info-navigation" aria-label="Информация для покупателей">
        <span>Покупателям</span>
        <div>{infoPageEntries.map(([, item]) => <NavLink key={item.path} to={item.path}>{item.title}</NavLink>)}</div>
      </nav>
      <article className="info-main">
        <header className="info-heading">
          <p>{currentPage.eyebrow}</p>
          <h1>{currentPage.title}</h1>
          <div>{currentPage.lead}</div>
        </header>
        <div className="info-sections">
          {currentPage.sections.map((section) => <section key={section.title} className="info-section" data-testid="info-section">
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </section>)}
        </div>
      </article>
    </div>
  </main>
}
