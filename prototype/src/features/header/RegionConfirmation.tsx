import { useRegion } from '../../state/RegionState'
import './RegionDialog.css'

export function RegionConfirmation({ onChoose }: { onChoose(): void }) {
  const { region, confirmRegion, dismissConfirmation } = useRegion()
  return <aside className="region-confirmation" aria-label="Подтверждение города">
    <button className="region-close" type="button" aria-label="Закрыть подтверждение города" onClick={dismissConfirmation}>×</button>
    <p>Ваш город — <strong>{region}</strong>?</p>
    <div className="region-confirmation__actions">
      <button className="region-confirmation__yes" type="button" onClick={confirmRegion}>Всё верно</button>
      <button type="button" onClick={onChoose}>Выбрать другой</button>
    </div>
  </aside>
}
