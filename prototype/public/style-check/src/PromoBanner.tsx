import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { PromoBanner as BannerData } from '../../../src/data/types'
import type { PromoDesign } from './promoDesign'

const backgrounds = { white: 'var(--color-surface)', subtle: 'var(--color-surface-subtle)', yellow: 'var(--yellow)', graphite: 'var(--graphite)' }
const textColors = { dark: 'var(--graphite)', light: '#fff' }

export function PromoBanner({ banner, design }: { banner: BannerData; design: PromoDesign }) {
  const style = {
    '--promo-background': backgrounds[design.background],
    '--promo-text': textColors[design.text],
    '--promo-muted': design.text === 'light' ? '#dedede' : 'var(--muted)',
    '--promo-image-position': design.imagePosition,
    '--promo-image-fit': design.imageFit,
  } as CSSProperties
  return <Link className={`sc-promo sc-promo--${design.layout}`} data-promo-id={banner.id} data-cta={design.cta} data-background={design.background} style={style} to={banner.href}>
    <div className="sc-promo-copy"><h2>{banner.title}</h2><p>{banner.text}</p><span className={`sc-promo-cta sc-promo-cta--${design.cta}`}>{banner.cta}</span></div>
    <div className={`sc-promo-media${design.secondaryImage ? ' sc-promo-media--pair' : ''}`}><img src={design.image} alt="" loading="lazy" />{design.secondaryImage && <img className="sc-promo-secondary" src={design.secondaryImage} alt="" loading="lazy" />}</div>
  </Link>
}
