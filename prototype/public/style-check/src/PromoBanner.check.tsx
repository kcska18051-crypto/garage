import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { prototypeData } from '../../../src/data/prototypeData'
import { PromoBanner } from './PromoBanner'
import { promoDesigns, type PromoDesign } from './promoDesign'

afterEach(cleanup)
it('preserves each original promotion destination and copy with configured photography', () => {
  for (const banner of prototypeData.promoBanners) {
    const { unmount } = render(<MemoryRouter><PromoBanner banner={banner} design={promoDesigns[banner.id]} /></MemoryRouter>)
    expect(screen.getByRole('heading', {name:banner.title})).toBeInTheDocument()
    expect(screen.getByText(banner.text)).toBeInTheDocument()
    expect(screen.getByText(banner.cta).closest('a')).toHaveAttribute('href',banner.href)
    const images = document.querySelectorAll('img')
    expect(images[0]).toHaveAttribute('src',promoDesigns[banner.id].image)
    expect(images.length).toBe(promoDesigns[banner.id].secondaryImage ? 2 : 1)
    unmount()
  }
})

it.each(['white','subtle','yellow','graphite'] as const)('accepts the %s palette and image/CTA settings through data', background => {
  const design: PromoDesign = {...promoDesigns.season,background,text:background==='graphite'?'light':'dark',imagePosition:'70% center',imageFit:'contain',cta:'dark'}
  render(<MemoryRouter><PromoBanner banner={prototypeData.promoBanners[0]} design={design} /></MemoryRouter>)
  const link=screen.getByRole('link')
  expect(link).toHaveAttribute('data-background',background)
  expect(link).toHaveAttribute('data-cta','dark')
  expect(link.style.getPropertyValue('--promo-image-position')).toBe('70% center')
  expect(link.style.getPropertyValue('--promo-image-fit')).toBe('contain')
  expect(link.style.getPropertyValue('--promo-text')).toBe(background==='graphite'?'#fff':'var(--graphite)')
})
