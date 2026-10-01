import { useMemo, useState } from 'react'
import { profileDocuments, type ProfileDocument } from '../../data/profileSupportData'
import { useProfile } from '../../state/ProfileState'
import { ProfileDialog } from './ProfileDialog'

type Scope = 'all' | 'personal' | 'organization'

export function ProfileDocuments() {
  const { organizations } = useProfile()
  const [scope, setScope] = useState<Scope>('all')
  const [organization, setOrganization] = useState('all')
  const [type, setType] = useState('all')
  const [period, setPeriod] = useState('all')
  const [query, setQuery] = useState('')
  const [preview, setPreview] = useState<ProfileDocument | null>(null)
  const [status, setStatus] = useState('')
  const documents = useMemo(() => profileDocuments.filter((document) => {
    const text = `${document.title} ${document.number} ${document.order}`.toLocaleLowerCase('ru')
    return (scope === 'all' || document.scope === scope) && (organization === 'all' || document.organization === organization) && (type === 'all' || document.type === type) && (period === 'all' || document.period === period) && text.includes(query.toLocaleLowerCase('ru'))
  }), [organization, period, query, scope, type])
  const selectScope = (next: Scope) => { setScope(next); if (next !== 'organization') setOrganization('all') }
  return <div className="profile-section profile-documents">
    <header className="profile-section__heading"><div><h1>Документы</h1><p>Документы по личным заказам и организациям.</p></div></header>
    {status && <p className="profile-message profile-message--success" role="status">{status}</p>}
    <div className="profile-tabs" role="tablist" aria-label="Тип документов">{([['all', 'Все'], ['personal', 'Личные заказы'], ['organization', 'Организации']] as const).map(([value, label]) => <button key={value} role="tab" aria-selected={scope === value} onClick={() => selectScope(value)}>{label}</button>)}</div>
    <div className="profile-filter-bar">
      <label className="profile-document-search">Поиск<input type="search" aria-label="Поиск документов" placeholder="Номер заказа или документа" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      {scope === 'organization' && <label>Организация<select value={organization} onChange={(event) => setOrganization(event.target.value)}><option value="all">Все организации</option>{organizations.map((item) => <option key={item.id}>{item.name}</option>)}</select></label>}
      <label>Тип документа<select value={type} onChange={(event) => setType(event.target.value)}><option value="all">Все типы</option>{[...new Set(profileDocuments.map((item) => item.type))].map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>Период<select value={period} onChange={(event) => setPeriod(event.target.value)}><option value="all">За всё время</option><option value="2026">2026</option><option value="2025">2025</option></select></label>
    </div>
    {documents.length ? <div className="profile-document-list">{documents.map((document) => <article className="profile-panel profile-document" key={document.id}>
      <div><small>{document.type}</small><h2>{document.title}</h2><span>№ {document.number} · {document.date}</span></div>
      <div><small>Заказ</small><strong>{document.order}</strong>{document.organization && <span>{document.organization}</span>}</div>
      <div><small>Формат</small><strong>{document.format}</strong></div>
      <span className={`profile-document__status is-${document.status === 'Доступен' ? 'ready' : 'pending'}`}>{document.status}</span>
      {document.status === 'Доступен' && <div className="profile-document__actions"><button className="profile-link-button" type="button" aria-label="Посмотреть документ" onClick={() => setPreview(document)}>Посмотреть</button><button className="profile-link-button" type="button" aria-label="Скачать документ" onClick={() => setStatus('Подготавливаем демонстрационный файл. Реальная загрузка появится после интеграции.')}>Скачать</button></div>}
    </article>)}</div> : <div className="profile-empty profile-empty--compact"><span>▧</span><h2>По вашему запросу документов нет</h2><p>Измените фильтры или сбросьте строку поиска.</p><button className="profile-button" type="button" onClick={() => { setScope('all'); setOrganization('all'); setType('all'); setPeriod('all'); setQuery('') }}>Сбросить фильтры</button></div>}
    {preview && <ProfileDialog title="Предпросмотр документа" onClose={() => setPreview(null)}><div className="profile-document-preview"><span>Демонстрационный предпросмотр</span><h3>{preview.title}</h3><p>№ {preview.number} · заказ {preview.order}</p><div aria-label="Заглушка документа">{preview.format}</div></div></ProfileDialog>}
  </div>
}
