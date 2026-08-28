import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { catalogProducts, fullFilterGroups, reducedFilterGroups } from '../../data/catalogData'
import { CommerceProvider } from '../../state/CommerceState'
import { ProductListing } from './ProductListing'

const renderListing = (mode: 'reduced' | 'full' = 'full') => render(<MemoryRouter><CommerceProvider><ProductListing products={catalogProducts} filterGroups={mode === 'full' ? fullFilterGroups : reducedFilterGroups} mode={mode} /></CommerceProvider></MemoryRouter>)

describe('catalog product listing', () => {
  it('filters immediately, exposes removable chips and changes sorting and view', () => {
    renderListing()
    expect(screen.getByText('Найдено 32 товара')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Remeza'))
    expect(screen.getByRole('button', { name: 'Удалить фильтр Remeza' })).toBeInTheDocument()
    expect(screen.getByText('Найдено 6 товаров')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Сортировка'), { target: { value: 'price-asc' } })
    fireEvent.click(screen.getByRole('button', { name: 'Список' }))
    expect(screen.getByTestId('catalog-results')).toHaveClass('catalog-results--list')

    fireEvent.click(screen.getByRole('button', { name: 'Удалить фильтр Remeza' }))
    expect(screen.getByText('Найдено 32 товара')).toBeInTheDocument()
  })

  it('commits numeric price fields on blur and provides an empty-state reset', () => {
    renderListing()
    const priceFrom = screen.getByLabelText('Цена от')
    fireEvent.change(priceFrom, { target: { value: '9999999' } })
    expect(screen.getByText('Найдено 32 товара')).toBeInTheDocument()
    fireEvent.blur(priceFrom)

    expect(screen.getByRole('heading', { name: 'Ничего не найдено' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить параметры' }))
    expect(screen.getByText('Найдено 32 товара')).toBeInTheDocument()
  })

  it('resets both price boundaries with one action', () => {
    renderListing()
    fireEvent.change(screen.getByLabelText('Цена от'), { target: { value: '200000' } })
    fireEvent.blur(screen.getByLabelText('Цена от'))
    fireEvent.change(screen.getByLabelText('Цена до'), { target: { value: '500000' } })
    fireEvent.blur(screen.getByLabelText('Цена до'))

    fireEvent.click(screen.getByRole('button', { name: 'Сбросить цену' }))
    expect(screen.queryByRole('button', { name: 'Удалить фильтр минимальной цены' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Удалить фильтр максимальной цены' })).not.toBeInTheDocument()
  })

  it('keeps existing commerce interactions in rich catalog cards', () => {
    renderListing('reduced')
    const addButton = screen.getAllByRole('button', { name: /Добавить в корзину:/ })[0]
    fireEvent.click(addButton)
    expect(screen.getByRole('button', { name: /Товар в корзине:/ })).toBeInTheDocument()
  })

  it('shows a price range and disables zero-count technical values', () => {
    renderListing()
    expect(screen.getByLabelText('Диапазон цены')).toHaveAttribute('type', 'range')
    expect(screen.getByLabelText('22 кВт')).toBeDisabled()
  })
})
