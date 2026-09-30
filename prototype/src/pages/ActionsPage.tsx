import { activeActions, completedActions } from '../data/actionsData'
import { ActionCard } from '../features/actions/ActionCard'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import '../features/actions/Actions.css'
export function ActionsPage(){return <main className="actions-page"><Breadcrumbs items={[{label:'Главная',to:'/'},{label:'Акции'}]}/><header className="actions-heading"><h1>Акции</h1><a className="actions-secondary-link" href="#archive">Архив</a></header><div className="actions-grid">{activeActions().map(action=><ActionCard action={action} key={action.id}/>)}</div><section id="archive" className="actions-archive" aria-label="Архив акций"><header><h2>Архив акций</h2><p>Завершённые предложения и их условия.</p></header><div className="actions-archive__grid">{completedActions().map(action=><ActionCard action={action} completed key={action.id}/>)}</div></section></main>}
