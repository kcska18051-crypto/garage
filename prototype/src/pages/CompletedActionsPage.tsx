import { Link } from 'react-router-dom'
import { completedActions } from '../data/actionsData'
import { ActionCard } from '../features/actions/ActionCard'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import '../features/actions/Actions.css'
export function CompletedActionsPage(){return <main className="actions-page"><Breadcrumbs items={[{label:'Главная',to:'/'},{label:'Акции',to:'/actions'},{label:'Завершённые акции'}]}/><header className="actions-heading"><h1>Завершённые акции</h1><Link className="actions-secondary-link" to="/actions">Вернуться к актуальным акциям</Link></header><div className="actions-grid">{completedActions().map(action=><ActionCard action={action} completed key={action.id}/>)}</div></main>}
