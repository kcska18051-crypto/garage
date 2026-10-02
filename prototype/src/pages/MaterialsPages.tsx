import { Link, NavLink, useParams, useSearchParams } from 'react-router-dom'
import { getMaterial, materialKinds, materialsByKind, type Material, type MaterialKind } from '../data/materialsData'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { DemoVideo } from '../features/materials/DemoVideo'
import { NotFoundPage } from './NotFoundPage'
import '../features/materials/Materials.css'

const pageSize = 4
const kindEntries = Object.entries(materialKinds) as [MaterialKind, typeof materialKinds[MaterialKind]][]

function MaterialsNav({ active }: { active: MaterialKind }) {
  return <nav className="materials-nav" aria-label="Разделы материалов"><span>Материалы</span>{kindEntries.map(([kind, item]) => <NavLink key={kind} to={item.path} aria-current={active === kind ? 'page' : undefined}>{item.title}<small aria-hidden="true">{materialsByKind(kind).length}</small></NavLink>)}</nav>
}

function Cover({ item, video = true }: { item: Material; video?: boolean }) {
  return <div className={`material-cover material-cover--${item.coverTone}`} aria-hidden="true"><i /><b />{video && item.videos?.length && <span>▶</span>}</div>
}

function MaterialCard({ item }: { item: Material }) {
  const kind = materialKinds[item.kind]
  return <article className="material-card" data-testid="material-card"><Link to={`${kind.path}/${item.slug}`} aria-label={item.title}><Cover item={item} /></Link><div className="material-card__copy"><div className="material-meta"><span>{kind.singular}</span><time dateTime={item.date}>{item.dateLabel}</time>{item.videos?.length && <b>Видео</b>}</div><h2><Link to={`${kind.path}/${item.slug}`}>{item.title}</Link></h2><p>{item.summary}</p><small>{item.categoryLabel}</small></div></article>
}

function setParam(search: URLSearchParams, name: string, value: string) {
  const next = new URLSearchParams(search)
  if (!value || value === 'all' || value === 'newest' || value === '1') next.delete(name); else next.set(name, value)
  if (name !== 'page') next.delete('page')
  return next
}

export function MaterialsListPage({ kind }: { kind: MaterialKind }) {
  const config = materialKinds[kind]
  const [search, setSearch] = useSearchParams()
  const category = search.get('category') ?? 'all'
  const sort = search.get('sort') ?? 'newest'
  const page = Math.max(1, Number(search.get('page') ?? '1'))
  const source = materialsByKind(kind)
  const categories = [...new Map(source.map((item) => [item.category, item.categoryLabel])).entries()]
  const filtered = source.filter((item) => category === 'all' || item.category === category).sort((a, b) => sort === 'oldest' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date))
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  return <main className="materials-page"><Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: config.title }]} /><div className="materials-layout"><MaterialsNav active={kind} /><section className="materials-main"><header className="materials-heading"><span className="eyebrow">Материалы «Гаража»</span><h1>{config.title}</h1><p>Практические материалы об оборудовании, инструментах и организации профессиональной мастерской.</p></header><div className="materials-controls"><label>Рубрика<select value={category} onChange={(event) => setSearch(setParam(search, 'category', event.target.value))}><option value="all">Все рубрики</option>{categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>Сортировка<select value={sort} onChange={(event) => setSearch(setParam(search, 'sort', event.target.value))}><option value="newest">Сначала новые</option><option value="oldest">Сначала старые</option></select></label><span>{filtered.length} материалов</span></div><div className="materials-grid">{visible.map((item) => <MaterialCard key={item.slug} item={item} />)}</div>{pageCount > 1 && <nav className="materials-pagination" aria-label="Пагинация материалов">{Array.from({ length: pageCount }, (_, index) => { const number = index + 1; const next = setParam(search, 'page', String(number)); return <Link key={number} to={`?${next.toString()}`} aria-label={`Страница ${number}`} aria-current={currentPage === number ? 'page' : undefined}>{number}</Link> })}</nav>}</section></div></main>
}

export function MaterialDetailPage({ kind }: { kind: MaterialKind }) {
  const { slug } = useParams()
  const item = getMaterial(kind, slug)
  if (!item) return <NotFoundPage />
  const config = materialKinds[kind]
  const related = materialsByKind(kind).filter((candidate) => candidate.slug !== item.slug).slice(0, 3)
  return <main className="materials-page material-detail"><Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: config.title, to: config.path }, { label: item.title }]} /><div className="materials-layout"><MaterialsNav active={kind} /><article className="materials-main"><Link className="material-back" to={config.path}>← {config.all}</Link><header className="material-detail__heading"><div className="material-meta"><span>{config.singular}</span><time dateTime={item.date}>{item.dateLabel}</time><small>{item.categoryLabel}</small></div><h1>{item.title}</h1><p>{item.summary}</p></header><div className="material-detail__cover"><Cover item={item} video={false} /></div><p className="material-intro">{item.intro}</p>{kind === 'article' && <p className="material-detail__note" data-testid="material-detail-note">Материал последовательно раскрывает тему и помогает сопоставить основные параметры без отдельного оглавления.</p>}{item.videos?.length && <div className={`material-videos material-videos--${item.videos.length}`} role="region" aria-label="Видео материала">{item.videos.map((video) => <DemoVideo title={video.title} key={video.title} />)}</div>}{item.sections.map((content) => <section className="material-section" id={content.id} key={content.id}>{content.title && <h2>{content.title}</h2>}{content.paragraphs.map((paragraph) => <p data-testid="material-body-paragraph" key={paragraph}>{paragraph}</p>)}{content.image && <div className="material-inline-image" role="img" aria-label={content.title ? `Иллюстрация: ${content.title}` : 'Иллюстрация материала'}><i /><b /></div>}</section>)}<section className="material-related" aria-label="Связанные материалы"><header><h2>Читайте дальше</h2><Link to={config.path}>{config.all}</Link></header><div>{related.map((candidate) => <MaterialCard item={candidate} key={candidate.slug} />)}</div></section></article></div></main>
}
