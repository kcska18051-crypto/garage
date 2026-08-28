import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { catalogProducts, compressorSubcategories } from '../../data/catalogData'
import { ActiveFilters } from './ActiveFilters'
import { TagGroups } from './TagGroups'
import { useCatalogListing } from './useCatalogListing'

function Harness() {
  const listing = useCatalogListing({ products: catalogProducts, pageSize: 12 })
  const location = useLocation()
  const tags = compressorSubcategories.find((item) => item.id === 'screw-compressors')!.tagGroups
  return <><output aria-label="Результатов">{listing.results.length}</output><output aria-label="Query">{location.search}</output><button onClick={() => listing.toggleFilter('brand', 'remeza')}>Remeza filter</button><TagGroups groups={tags} activeTag={listing.state.tag} onSelect={listing.applyTag} /><ActiveFilters state={listing.state} onRemove={listing.removeCriterion} onClear={listing.clearAll} /></>
}

describe('catalog URL listing state', () => {
  it('commits ordinary filters to the query and clears them', () => {
    render(<MemoryRouter><Harness /></MemoryRouter>)
    const initial = Number(screen.getByLabelText('Результатов').textContent)

    fireEvent.click(screen.getByRole('button', { name: 'Remeza filter' }))
    expect(screen.getByLabelText('Query')).toHaveTextContent('brand=remeza')
    expect(Number(screen.getByLabelText('Результатов').textContent)).toBeLessThan(initial)
    expect(screen.getByRole('button', { name: 'Удалить фильтр Remeza' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Очистить всё' }))
    expect(screen.getByLabelText('Query')).toHaveTextContent('')
  })

  it('stores a selected tag separately without checking the ordinary brand filter', () => {
    render(<MemoryRouter><Harness /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: 'Тег Remeza' }))

    expect(screen.getByLabelText('Query')).toHaveTextContent('tag=brand%3Aremeza')
    expect(screen.getByRole('button', { name: 'Удалить тег Remeza' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Удалить фильтр Remeza' })).not.toBeInTheDocument()
  })

  it('expands long tag groups and renders no wrapper when tags are absent', () => {
    const { rerender } = render(<MemoryRouter><TagGroups groups={compressorSubcategories[0].tagGroups} onSelect={() => undefined} /></MemoryRouter>)
    expect(screen.getByRole('button', { name: 'Тег Remeza' })).toHaveTextContent(/^Remeza$/)
    expect(screen.queryByRole('button', { name: 'Тег Comprag' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Показать все: По бренду' }))
    expect(screen.getByRole('button', { name: 'Тег Comprag' })).toBeInTheDocument()

    rerender(<MemoryRouter><TagGroups onSelect={() => undefined} /></MemoryRouter>)
    expect(document.querySelector('.catalog-tags')).toBeNull()
  })
})
