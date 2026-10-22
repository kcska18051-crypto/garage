import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'
import { contactPoints } from '../data/contactsData'

describe('standalone contact points', () => {
  it.each(contactPoints)('contains all visit information for $id on direct entry', point => {
    render(<MemoryRouter initialEntries={[`/contacts/${point.id}/`]}><App /></MemoryRouter>)
    const main = screen.getByRole('main')
    expect(within(main).getByRole('heading', { level: 1, name: `${point.name} — ${point.city}` })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Выбрать город' })[0]).toHaveTextContent(point.city)
    expect(within(main).getByText(`${point.city}, ${point.address}`)).toBeInTheDocument()
    expect(within(main).getByText(point.hours)).toBeInTheDocument()
    expect(within(main).getByText(/Условия посещения и доступные услуги уточняются/)).toBeInTheDocument()
    expect(within(main).getByRole('link', { name: point.email })).toHaveAttribute('href', `mailto:${point.email}`)
    expect(within(main).getAllByRole('img', { name: /Место для фотографии:/ })).toHaveLength(3)
    expect(within(main).getByText(`${point.coordinates.lat}, ${point.coordinates.lng}`)).toBeInTheDocument()
    expect(within(main).getByRole('heading', { name: 'Как добраться' })).toBeInTheDocument()
    expect(within(main).getByRole('link', { name: /Построить маршрут/ })).toHaveAttribute('href', `https://www.openstreetmap.org/directions?to=${point.coordinates.lat},${point.coordinates.lng}`)
    expect(within(main).getByRole('link', { name: 'Вернуться к контактам' })).toHaveAttribute('href', `/contacts?city=${encodeURIComponent(point.city)}`)
    expect(within(main).queryByRole('link', { name: /Перейти к самовывозу/ })).not.toBeInTheDocument()
  })
  it('shows 404 for an unknown point', () => {
    render(<MemoryRouter initialEntries={['/contacts/missing-store']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument()
  })
})
