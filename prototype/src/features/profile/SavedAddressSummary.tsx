import { Link } from 'react-router-dom'
import { formatProfileAddress, useProfile } from '../../state/ProfileState'
export function SavedAddressSummary() {
  const { addresses } = useProfile()
  return <section className="profile-panel"><div className="profile-panel-heading"><h2>Адреса доставки</h2><Link to="/profile/addresses">Управлять</Link></div>{addresses.length ? addresses.map(address => <article className="saved-address-summary" key={address.id}><strong>{address.label}</strong>{address.isPrimary && <b>Основной</b>}<p>{formatProfileAddress(address)}</p><Link to="/profile/addresses">Изменить адрес →</Link></article>) : <p>Адресов пока нет. <Link to="/profile/addresses">Добавить адрес</Link></p>}</section>
}
