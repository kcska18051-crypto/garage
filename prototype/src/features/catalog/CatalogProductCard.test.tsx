import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { catalogProducts } from '../../data/catalogData'
import { CommerceProvider } from '../../state/CommerceState'
import { CatalogProductCard } from './CatalogProductCard'

const renderCard = (index = 0) => render(<MemoryRouter><CommerceProvider><CatalogProductCard product={{...catalogProducts[index], storeCount: 8}} index={0} /></CommerceProvider></MemoryRouter>)
describe('detailed catalog card', () => {
  it('changes the actual image with gallery buttons and keyboard arrows', () => {
    renderCard()
    const image = screen.getByRole('img')
    const original = image.getAttribute('src')
    fireEvent.click(screen.getByRole('button', {name: /Фото 2:/}))
    expect(image).not.toHaveAttribute('src', original)
    fireEvent.keyDown(screen.getByRole('link', {name: /Открыть товар:/}), {key:'ArrowLeft'})
    expect(image).toHaveAttribute('src', original)
  })
  it('caps store counts at three and displays the existing rating', () => {
    renderCard()
    expect(screen.getByText('В наличии в 3 магазинах')).toBeInTheDocument()
    expect(screen.getByLabelText('Рейтинг 4,8, 12 отзывов')).toBeInTheDocument()
    expect(screen.getByRole('button', {name:/Добавить в корзину:|Товар в корзине:/})).toHaveTextContent(/В корзину|В корзине/)
  })
  it('omits a rating when the product has no review data', () => {
    renderCard(1)
    expect(screen.queryByLabelText(/Рейтинг/)).not.toBeInTheDocument()
  })
})
