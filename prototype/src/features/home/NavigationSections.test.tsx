import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { prototypeData } from '../../data/prototypeData'
import { BenefitsStrip } from './BenefitsStrip'
import { BrandGrid } from './BrandGrid'
import { CategoryGrid } from './CategoryGrid'

describe('homepage navigation sections', () => {
  it('renders every configured category and the all brands route as links', () => {
    render(<MemoryRouter><BenefitsStrip items={prototypeData.benefits} /><CategoryGrid items={prototypeData.categories} /><BrandGrid items={prototypeData.brands} /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Популярные категории' })).toBeVisible()
    expect(screen.getAllByLabelText(/Перейти в категорию/)).toHaveLength(prototypeData.categories.length)
    expect(screen.getByRole('link', { name: 'Все бренды' })).toHaveAttribute('href', '/brands')
  })
})
