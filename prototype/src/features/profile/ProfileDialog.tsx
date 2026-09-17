import type { ReactNode } from 'react'

export function ProfileDialog({ title, children, onClose }: { title: string; children: ReactNode; onClose(): void }) {
  return <div className="profile-dialog-backdrop"><section className="profile-dialog" role="dialog" aria-modal="true" aria-label={title}><div className="profile-dialog__heading"><h2>{title}</h2><button type="button" aria-label="Закрыть диалог" onClick={onClose}>×</button></div>{children}</section></div>
}
