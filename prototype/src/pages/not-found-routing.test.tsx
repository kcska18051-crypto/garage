import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { App } from '../app/App'

function Address() {
  const location = useLocation()
  return <output data-testid="address">{location.pathname}{location.search}</output>
}

describe('missing public records', () => {
  it.each(['/catalog', '/catalog/lifting-equipment'])('does not link to an unimplemented subsection from %s', (path) => {
    render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
    expect(screen.queryAllByRole('link', { name: 'Автоподъёмники' })).toHaveLength(0)
    expect(screen.getAllByText('Автоподъёмники').length).toBeGreaterThan(0)
  })
  it('explains how to continue and does not index a missing page', () => {
    const previousTitle = document.title
    const { unmount } = render(<MemoryRouter initialEntries={['/missing']}><App /></MemoryRouter>)
    expect(screen.getByText('Возможно, страница была удалена или в адресе есть опечатка.')).toBeInTheDocument()
    expect(document.title).toBe('Страница не найдена — Гараж')
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow')
    unmount()
    expect(document.title).toBe(previousTitle)
    expect(document.querySelector('meta[name="robots"]')).toBeNull()
  })
  it.each([
    '/unknown-test-path/', '/catalog/unknown/',
    '/catalog/compressor-equipment/unknown/',
    '/catalog/compressor-equipment/screw-compressors/unknown/',
    '/catalog/lifting-equipment/unknown/deeper/',
    '/actions/unknown/deeper/', '/brands/unknown/', '/brand/unknown/',
    '/product/unknown/', '/news/unknown/', '/articles/unknown/',
    '/reviews/unknown/', '/services/unknown/', '/contacts/unknown/',
  ])('shows 404 without replacing %s', (path) => {
    render(<MemoryRouter initialEntries={[path]}><Address /><App /></MemoryRouter>)
    expect(within(screen.getByRole('main')).getByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument()
    expect(screen.getByTestId('address')).toHaveTextContent(path)
    expect(document.querySelector('.site-header')).toBeInTheDocument()
    expect(document.querySelector('.site-footer')).toBeInTheDocument()
  })
})
