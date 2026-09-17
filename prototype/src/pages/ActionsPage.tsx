import { Link } from 'react-router-dom'
import { activeActions } from '../data/actionsData'
import { ActionCard } from '../features/actions/ActionCard'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import '../features/actions/Actions.css'
export function ActionsPage(){return <main className="actions-page"><Breadcrumbs items={[{label:'Главная',to:'/'},{label:'Акции'}]}/><header className="actions-heading"><h1>Акции</h1><Link className="actions-secondary-link" to="/actions/completed">Завершённые акции</Link></header><div className="actions-grid">{activeActions().map(action=><ActionCard action={action} key={action.id}/>)}</div></main>}
