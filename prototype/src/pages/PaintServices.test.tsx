import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'

const open = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
const examples = [
  ['automotive', 'Подбор/колеровка автомобильных эмалей'],
  ['polyurethane', 'Подбор полиуретановых эмалей'],
]

it('lets visitors choose a paint service before opening its request form', async () => {
  const user = userEvent.setup()
  open('/services/paint-matching')
  const main = screen.getByRole('main')
  expect(main.querySelectorAll('.paint-editorial__directions article')).toHaveLength(2)
  expect(main).toHaveClass('paint-service-page')
  expect(main.querySelectorAll('.services-art')).toHaveLength(0)
  expect(within(main).getAllByRole('img')).toHaveLength(2)
  expect(within(main).queryByRole('button', { name: 'Оставить заявку' })).not.toBeInTheDocument()
  await user.click(within(main).getByRole('link', { name: examples[1][1] }))
  expect(within(screen.getByRole('main')).getByRole('heading', { level: 1 })).toHaveTextContent(examples[1][1])
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

it.each(examples)('keeps the selected %s paint service in its persisted request', async (slug, title) => {
  const user = userEvent.setup()
  open(`/services/paint-matching/${slug}`)
  expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
  expect(screen.getByRole('navigation', { name: 'Хлебные крошки' })).toHaveTextContent('Подбор автоэмали')
  expect(screen.getByRole('link', { name: '← Вернуться к направлению' })).toHaveAttribute('href', '/services/paint-matching')
  await user.click(screen.getByRole('button', { name: 'Узнать стоимость' }))
  const dialog = screen.getByRole('region',{name:'Узнать стоимость'})
  expect(dialog).toHaveTextContent(title)
  await user.click(within(dialog).getByLabelText('Имя', {exact:true})); await user.paste('Демо клиент')
  await user.click(within(dialog).getByLabelText('Телефон')); await user.paste('+7 999 111-22-33')
  await user.click(within(dialog).getByLabelText('Марка авто')); await user.paste('Демонстрационный автомобиль')
  await user.click(within(dialog).getByLabelText('Комментарий')); await user.paste('Пример задачи без реальных данных')
  await user.click(within(dialog).getByRole('checkbox',{name:'Даю согласие на обработку персональных данных'}))
  await user.click(within(dialog).getByRole('checkbox',{name:'Принимаю пользовательское соглашение'}))
  await user.click(within(dialog).getByRole('button', { name: 'Отправить заявку' }))
  expect(within(dialog).getByRole('status')).toHaveTextContent('Демонстрационная заявка создана')
  const records = JSON.parse(localStorage.getItem('garage-service-requests-v1')!)
  const created = records.find((item: { seed: boolean }) => !item.seed)
  expect(created).toMatchObject({ kind: 'paint', itemId: `paint-${slug}`, title, ownerPhone: null })
}, 15000)

it('does not replace an unknown paint child with a default service', () => {
  open('/services/paint-matching/unknown')
  expect(screen.getByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument()
})

it.each([
  ['automotive','Сравнение образцов автомобильной эмали с цветом кузовной панели','paint-color-automotive.png'],
  ['polyurethane','Сравнение цветовых образцов с окрашенной металлической пластиной','paint-color-polyurethane.png'],
])('shows the %s detail with a real image, pending terms and four steps',(slug,alt,photo)=>{
  open(`/services/paint-matching/${slug}`)
  const main=screen.getByRole('main')
  expect(main).toHaveClass('automotive-paint-page')
  expect(main.querySelector('.services-art')).toBeNull()
  expect(within(main).getByRole('img',{name:alt})).toHaveAttribute('src',expect.stringContaining(photo))
  expect(within(main).getByText('Стоимость')).toBeInTheDocument()
  expect(within(main).getByText('Сроки')).toBeInTheDocument()
  expect(within(screen.getByRole('region',{name:'Порядок обращения'})).getAllByRole('listitem')).toHaveLength(4)
  expect(main).not.toHaveTextContent(/Здесь можно|Место для фото|Демонстрационное описание/)
})
