import { ProfileStatus } from './ProfileStatus'
import {CatalogProductCard} from '../catalog/CatalogProductCard'
import {searchCatalogProducts} from '../../data/searchResults'
import {CartProductImage} from '../cart/CartProductImage'
import {ProfileIcon} from './ProfileIcon'
import {FavoritesContent} from '../../pages/FavoritesPage'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { profileData, type ProfileOrganization } from '../../data/profileData'
import type { Product } from '../../data/types'
import { useProfile } from '../../state/ProfileState'
import { ProfileDialog } from './ProfileDialog'
import { SavedAddressSummary } from './SavedAddressSummary'
import { asProductCard, getDemoProduct } from '../../data/productRegistry'
import {useAuth} from '../../state/AuthState'

function Heading({ title, action }: { title: string; note?: string; action?: React.ReactNode }) {
  return <header className="profile-section__heading"><h1>{title}</h1>{action}</header>
}

const historyCatalog=searchCatalogProducts('')
function ProductTile({product,compact=false}:{product:Product;compact?:boolean}) {
 const item=historyCatalog.find(candidate=>candidate.id===product.id)
 if(!item)return <article data-testid={`profile-product-${product.id}`}><Link to={product.href}>{product.name}</Link><p>{product.price}</p></article>
 return <div className={`profile-history-card${compact?' profile-product--compact':''}`} data-testid={`profile-product-${product.id}`}><CatalogProductCard product={item} index={0} quoteHref={item.purchaseMode==='quote'?product.href:undefined} mediaFallback={<CartProductImage product={product}/>}/></div>
}

export function ProfileOrganizations() {
  const { organizations, addOrganization } = useProfile(); const [open, setOpen] = useState(false); const [inn, setInn] = useState(''); const [found, setFound] = useState<ProfileOrganization | null>(null)
  const lookup = () => setFound({ id: `org-${Date.now()}`, name: 'ООО «Гараж Профи»', inn: inn || '7600000028', kpp: '760001003', legalAddress: '150003, г. Ярославль, ул. Советская, 17', bank: 'Демонстрационный банк', account: '40702 •••• 0299', active: true })
  return <div className="profile-section"><Heading title="Мои организации" note="Реквизиты и корпоративные заказы" action={<button className="profile-button profile-button--primary" type="button" onClick={() => setOpen(true)}>Добавить организацию</button>} /><p className="profile-info">К аккаунту можно привязать несколько организаций. Управление сотрудниками и ролями в прототип не входит.</p><div className="profile-organization-grid">{organizations.map((org) => <article className="profile-panel profile-organization" key={org.id}><div><ProfileStatus>{org.active ? 'Активна' : 'Требует подтверждения'}</ProfileStatus><h2>{org.name}</h2><small>ИНН {org.inn} · КПП {org.kpp}</small></div><dl><div><dt>Юридический адрес</dt><dd>{org.legalAddress}</dd></div><div><dt>Расчётный счёт</dt><dd>{org.account}</dd></div></dl><Link to="/profile/orders">Заказы организации →</Link></article>)}</div>{open && <ProfileDialog title="Добавить организацию" onClose={() => setOpen(false)}><div className="profile-form"><p>Демонстрационный поиск имитирует автозаполнение реквизитов по ИНН.</p><label>ИНН организации<input value={inn} inputMode="numeric" onChange={(e) => { setInn(e.target.value); setFound(null) }} /></label><button className="profile-button" type="button" onClick={lookup}>Найти по ИНН</button>{found && <div className="profile-lookup"><strong>{found.name}</strong><span>ИНН {found.inn} · КПП {found.kpp}</span><small>{found.legalAddress}</small></div>}{found && <button className="profile-button profile-button--primary" type="button" onClick={() => { addOrganization(found); setOpen(false) }}>Сохранить организацию</button>}</div></ProfileDialog>}</div>
}

export function ProfileFavorites() { return <FavoritesContent embedded/> }

export function ProfileRecentlyViewed() {
  const { recentProductIds } = useProfile(); const products = recentProductIds.flatMap(id => { const product = getDemoProduct(id); return product ? [asProductCard(product)] : [] })
  return <div className="profile-section"><Heading title="Вы смотрели" note="Недавно просмотренные товары"  />{products.length ? <div className="catalog-results profile-product-grid profile-product-grid--recent">{products.map((product) => <ProductTile compact key={product.id} product={product} />)}</div> : <div className="profile-empty"><span><ProfileIcon name="history"/></span><h2>История просмотров пуста</h2><p>Здесь появятся товары, которые вы недавно открывали.</p><Link className="profile-button profile-button--primary" to="/catalog">Перейти в каталог</Link></div>}</div>
}

export {ProfileServiceRequests as ProfileServices} from './ProfileServiceRequests'

export function ProfileReviews() {
  const [editing, setEditing] = useState<string | null>(null); const [message, setMessage] = useState('')
  return <div className="profile-section"><Heading title="Отзывы" note="Ваши отзывы о товарах" /><div className="profile-review-list">{profileData.reviews.map((review) => <article className="profile-panel profile-review" key={review.id}><span className="profile-product__art" aria-hidden="true"><CartProductImage product={review.product}/></span><div><small>{review.product.sku}</small><h2>{review.product.name}</h2><p>{review.text}</p></div><div><ProfileStatus>{review.status}</ProfileStatus><button className="profile-link-button" type="button" onClick={() => setEditing(review.id)}>Редактировать</button></div></article>)}</div>{editing && <ProfileDialog title="Редактировать отзыв" onClose={() => setEditing(null)}><div className="profile-form"><label>Текст отзыва<textarea defaultValue={profileData.reviews.find((item) => item.id === editing)?.text} /></label><button className="profile-button profile-button--primary" type="button" onClick={() => { setEditing(null); setMessage('Отзыв сохранён и отправлен на модерацию') }}>Сохранить отзыв</button></div></ProfileDialog>}{message && <p className="profile-message profile-message--success" role="status">{message}</p>}</div>
}

export function ProfileData() {
  const {identity}=useAuth()
  const { user, updateUser, profileDeleted, deleteProfile, restoreProfile } = useProfile(); const [draft, setDraft] = useState(user); const [message, setMessage] = useState(''); const [deletionStage, setDeletionStage] = useState<'warning' | 'confirm' | null>(null); const [understood, setUnderstood] = useState(false); const [restoreOpen, setRestoreOpen] = useState(false)
  if (profileDeleted) return <div className="profile-section profile-deleted"><Heading title="Профиль удалён" /><section className="profile-panel"><span aria-hidden="true"><ProfileIcon name="profile"/></span><h2>Профиль находится в удалённом состоянии</h2><p>В прототипе можно восстановить профиль и вернуться к сохранённым данным. Сроки хранения и серверная механика не моделируются.</p><button className="profile-button profile-button--primary" type="button" onClick={() => setRestoreOpen(true)}>Восстановить профиль</button></section>{restoreOpen && <ProfileDialog title="Восстановление профиля" onClose={() => setRestoreOpen(false)}><p>Подтвердите восстановление профиля.</p><div className="profile-actions"><button className="profile-button profile-button--primary" type="button" onClick={() => { restoreProfile(); setRestoreOpen(false); setMessage('Профиль восстановлен') }}>Подтвердить восстановление</button><button className="profile-button" type="button" onClick={() => setRestoreOpen(false)}>Отмена</button></div></ProfileDialog>}</div>
  return <div className="profile-section"><Heading title="Профиль" note="Личные данные и адреса" />{message && <p className="profile-message profile-message--success" role="status">{message}</p>}<div className="profile-detail-grid"><section className="profile-panel"><div className="profile-panel-heading"><h2>Личные данные</h2><span>{identity?.phoneConfirmed?'Телефон подтверждён в деморежиме':'Телефон не подтверждён кодом'}</span></div><div className="profile-form profile-form--grid"><label>Имя<input value={draft.firstName} onChange={(e) => setDraft({ ...draft, firstName: e.target.value })} /></label><label>Фамилия<input value={draft.lastName} onChange={(e) => setDraft({ ...draft, lastName: e.target.value })} /></label><label>Телефон<input value={identity?.phone&&identity.phone!=='79000000000'?`+${identity.phone}`:draft.phone} readOnly /></label><label>Электронная почта<input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></label><button className="profile-button profile-button--primary" type="button" onClick={() => { updateUser(draft); setMessage('Данные профиля сохранены') }}>Сохранить данные</button></div></section><SavedAddressSummary /></div><section className="profile-danger-zone"><div><h2>Удаление профиля</h2><p>Действие переводит прототип в отдельное удалённое состояние. Профиль можно восстановить демонстрационным сценарием.</p></div><button className="profile-button profile-button--danger" type="button" onClick={() => setDeletionStage('warning')}>Удалить профиль</button></section>{deletionStage && <ProfileDialog title="Удаление профиля" onClose={() => { setDeletionStage(null); setUnderstood(false) }}>{deletionStage === 'warning' ? <><p>После подтверждения профиль станет недоступен до восстановления. Заказы и серверные данные в прототипе не удаляются.</p><div className="profile-actions"><button className="profile-button profile-button--danger" type="button" onClick={() => setDeletionStage('confirm')}>Продолжить удаление</button><button className="profile-button" type="button" onClick={() => setDeletionStage(null)}>Отмена</button></div></> : <><label className="profile-check"><input type="checkbox" checked={understood} onChange={(event) => setUnderstood(event.target.checked)} />Я понимаю, что профиль будет удалён</label><div className="profile-actions"><button className="profile-button profile-button--danger" type="button" disabled={!understood} onClick={() => { deleteProfile(); setDeletionStage(null) }}>Подтвердить удаление</button><button className="profile-button" type="button" onClick={() => setDeletionStage(null)}>Отмена</button></div></>}</ProfileDialog>}</div>
}
