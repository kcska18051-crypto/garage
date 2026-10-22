import { Link } from 'react-router-dom'

export function PaintServiceLink({ className = '' }: { className?: string }) {
  return <Link className={`paint-service-link ${className}`} to="/services/paint-matching"><svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 3S5 11 5 15a7 7 0 0 0 14 0c0-4-7-12-7-12Z"/><path d="M9 15a3 3 0 0 0 3 3"/></svg><span>Подбор автоэмали</span></Link>
}
