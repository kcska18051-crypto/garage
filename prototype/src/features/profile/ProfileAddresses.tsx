import { useState } from 'react'
import { formatProfileAddress, type ProfileAddress, useProfile } from '../../state/ProfileState'
import { ProfileDialog } from './ProfileDialog'

type AddressDraft = Omit<ProfileAddress, 'id' | 'isPrimary'>
const emptyAddress: AddressDraft = { label: '', city: '', street: '', house: '', building: '', unit: '', postalCode: '', comment: '' }

export function ProfileAddresses() {
  const { addresses, addAddress, updateSavedAddress, removeAddress, setPrimaryAddress } = useProfile()
  const [editing, setEditing] = useState<string | 'new' | null>(null)
  const [draft, setDraft] = useState<AddressDraft>(emptyAddress)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [mapAddress, setMapAddress] = useState<ProfileAddress | null>(null)
  const [deleting, setDeleting] = useState<ProfileAddress | null>(null)
  const startEdit = (address?: ProfileAddress) => { setEditing(address?.id ?? 'new'); setDraft(address ? { label: address.label, city: address.city, street: address.street, house: address.house, building: address.building, unit: address.unit, postalCode: address.postalCode, comment: address.comment } : emptyAddress); setError(''); setMessage('') }
  const save = () => {
    if (!draft.city.trim() || !draft.street.trim() || !draft.house.trim()) { setError('Заполните город, улицу и дом'); return }
    if (editing === 'new') addAddress({ ...draft, label: draft.label || 'Адрес' }); else if (editing) updateSavedAddress(editing, { ...draft, label: draft.label || 'Адрес' })
    setEditing(null); setError(''); setMessage('Адрес сохранён')
  }
  return <div className="profile-section profile-addresses">
    <header className="profile-section__heading"><div><h1>Адреса доставки</h1><p>Сохранённые адреса доступны при оформлении заказа.</p></div><button className="profile-button profile-button--primary" type="button" onClick={() => startEdit()}>Добавить адрес</button></header>
    {message && <p className="profile-message profile-message--success" role="status">{message}</p>}
    <div className="profile-address-grid" data-testid="address-card">{addresses.map((address) => <article className="profile-panel profile-address-card" key={address.id}><div><span>{address.label}</span>{address.isPrimary && <b>Основной</b>}</div><h2>{formatProfileAddress(address)}</h2>{address.postalCode && <small>Индекс {address.postalCode}</small>}{address.comment && <p>{address.comment}</p>}<div className="profile-address-card__actions"><button className="profile-link-button" type="button" onClick={() => startEdit(address)}>Изменить</button><button className="profile-link-button" type="button" onClick={() => setMapAddress(address)}>Показать на карте</button>{!address.isPrimary && <button className="profile-link-button" type="button" onClick={() => { setPrimaryAddress(address.id); setMessage('Основной адрес изменён') }}>Сделать основным</button>}<button className="profile-link-button" type="button" disabled={address.isPrimary && addresses.length === 1} onClick={() => setDeleting(address)}>Удалить адрес</button></div></article>)}</div>
    {editing && <section className="profile-panel profile-address-editor" aria-label={editing === 'new' ? 'Новый адрес' : 'Редактирование адреса'}><div className="profile-panel-heading"><h2>{editing === 'new' ? 'Новый адрес' : 'Редактирование адреса'}</h2><button className="profile-link-button" onClick={() => setEditing(null)}>Закрыть</button></div><div className="profile-form profile-form--address"><label>Название адреса<input value={draft.label} onChange={(event) => setDraft({ ...draft, label: event.target.value })} placeholder="Дом, Работа" /></label><label>Город<input value={draft.city} onChange={(event) => setDraft({ ...draft, city: event.target.value })} /></label><label>Улица<input value={draft.street} onChange={(event) => setDraft({ ...draft, street: event.target.value })} /></label>{draft.street.toLocaleLowerCase('ru').includes('свобод') && <button className="profile-suggestion profile-form__wide" type="button" onClick={() => setDraft({ ...draft, city: 'Ярославль', street: 'Свободы' })}>Ярославль, ул. Свободы</button>}<label>Дом<input value={draft.house} onChange={(event) => setDraft({ ...draft, house: event.target.value })} /></label><label>Корпус / строение<input value={draft.building} onChange={(event) => setDraft({ ...draft, building: event.target.value })} /></label><label>Квартира / офис<input value={draft.unit} onChange={(event) => setDraft({ ...draft, unit: event.target.value })} /></label><label>Индекс<input value={draft.postalCode} inputMode="numeric" onChange={(event) => setDraft({ ...draft, postalCode: event.target.value })} /></label><label className="profile-form__wide">Комментарий курьеру<textarea value={draft.comment} onChange={(event) => setDraft({ ...draft, comment: event.target.value })} /></label>{error && <p className="profile-message profile-message--error profile-form__wide" role="alert">{error}</p>}<button className="profile-button profile-button--primary" type="button" onClick={save}>Сохранить адрес</button></div></section>}
    {mapAddress && <ProfileDialog title="Адрес на карте" onClose={() => setMapAddress(null)}><div className="profile-map"><span>●</span><p>{formatProfileAddress(mapAddress)}</p></div></ProfileDialog>}
    {deleting && <ProfileDialog title="Удалить адрес" onClose={() => setDeleting(null)}><p>{deleting.isPrimary ? 'После удаления основным станет следующий сохранённый адрес.' : 'Адрес будет удалён из списка и оформления заказа.'}</p><div className="profile-actions"><button className="profile-button profile-button--danger" type="button" onClick={() => { removeAddress(deleting.id); setDeleting(null); setMessage('Адрес удалён') }}>Удалить</button><button className="profile-button" type="button" onClick={() => setDeleting(null)}>Отмена</button></div></ProfileDialog>}
  </div>
}
