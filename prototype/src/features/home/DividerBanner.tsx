import { Link } from 'react-router-dom'
import type { PromoBanner } from '../../data/types'

export function DividerBanner({ item, index }: { item: PromoBanner; index: number }) {
  return <Link className={`divider-banner divider-banner--${item.tone}`} to={item.href} aria-label={`${item.title}. ${item.cta}`}>
    <div className="divider-banner__copy"><h2>{item.title}</h2><p>{item.text}</p><span>{item.cta} →</span></div>
    <div className={`divider-banner__art art-${index}`} aria-hidden="true"><i /><b /></div>
  </Link>
}
