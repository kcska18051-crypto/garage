import userEvent from '@testing-library/user-event'
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
    expect(within(screen.getByRole('region', {name:'Посещение и контакты'})).getByRole('link', { name: point.email })).toHaveAttribute('href', `mailto:${point.email}`)
    expect(within(main).getAllByRole('button', {name:/Открыть фото/})).toHaveLength(3)
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

it('opens all three photos on the city URL, switches photos and restores focus', async () => {
  const user = userEvent.setup()
  render(<MemoryRouter initialEntries={['/contacts/yaroslavl/']}><App /></MemoryRouter>)
  const main = screen.getByRole('main')
  expect(main).not.toHaveTextContent(/демо|демонстрац/i)
  for (const index of [1,2,3]) {
    const opener = within(main).getByRole('button', {name:`Открыть фото ${index}`})
    await user.click(opener)
    const dialog = screen.getByRole('dialog', {name:`Фото ${index} из 3`})
    expect(within(dialog).getByRole('img')).toHaveAttribute('src', expect.stringContaining('contact-showroom.png'))
    await user.click(within(dialog).getByRole('button', {name:'Следующее фото'}))
    expect(screen.getByRole('dialog', {name:`Фото ${index % 3 + 1} из 3`})).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
  }
})
