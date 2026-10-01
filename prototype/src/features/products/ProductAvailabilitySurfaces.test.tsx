import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { Product } from '../../data/types'
import { CommerceProvider } from '../../state/CommerceState'
import { ProductCard } from './ProductCard'

const products = [
  { id: 'one', storeCount: 1, availabilityStatus: 'available', expected: 'В наличии в 1 магазине' },
  { id: 'two', storeCount: 2, availabilityStatus: 'available', expected: 'В наличии в 2 магазинах' },
  { id: 'five', storeCount: 5, availabilityStatus: 'available', expected: 'В наличии в 5 магазинах' },
  { id: 'order', storeCount: 0, availabilityStatus: 'Под заказ', expected: 'Под заказ' },
  { id: 'unavailable', storeCount: 0, availabilityStatus: 'Нет в наличии', expected: 'Нет в наличии' },
  { id: 'discontinued', storeCount: 0, availabilityStatus: 'Снят с производства', expected: 'Снят с производства' },
] as const

describe('shared product availability contract', () => {
  it.each(products)('shows $expected in the shared product card', ({ id, storeCount, availabilityStatus, expected }) => {
    const product = { id, name: `Товар ${id}`, sku: id, price: '1 000 ₽', href: `/product/${id}`, storeCount, availabilityStatus } as unknown as Product
    render(<MemoryRouter><CommerceProvider><ProductCard product={product} index={0}/></CommerceProvider></MemoryRouter>)
    expect(screen.getByText(expected)).toBeInTheDocument()
  })
})
