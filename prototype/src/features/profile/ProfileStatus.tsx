import './ProfileStatus.css'

export type ProfileStatusTone = 'success' | 'attention' | 'warning' | 'info' | 'danger' | 'neutral'

const tones: Record<string, ProfileStatusTone> = {
  'Активна': 'success',
  'Требует подтверждения': 'attention',
  'Опубликован': 'success',
  'На модерации': 'warning',
  'Отклонён': 'danger',
  'Новая заявка': 'info',
  'Ожидает подтверждения': 'attention',
  'Уточняем детали': 'attention',
  'Согласовано': 'info',
  'Выполнено': 'success',
  'Отменено': 'neutral',
  'В обработке': 'warning',
  'Получен': 'success',
  'Отменён': 'neutral',
  'Заявка на отмену отправлена': 'attention',
}

export function profileStatusTone(status: string): ProfileStatusTone {
  return tones[status] ?? 'neutral'
}

export function ProfileStatus({ children, as: Tag = 'span' }: { children: string; as?: 'span' | 'p' }) {
  return <Tag className="profile-status" data-status-tone={profileStatusTone(children)}>
    <i aria-hidden="true" />{children}
  </Tag>
}
