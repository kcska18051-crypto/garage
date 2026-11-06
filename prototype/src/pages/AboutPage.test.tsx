import { render, screen, within } from '@testing-library/react'
import { StrictMode } from 'react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'
import { prototypeData } from '../data/prototypeData'
import { materialsByKind } from '../data/materialsData'
import { contactPoints } from '../data/contactsData'

const open=(path='/about')=>render(<MemoryRouter initialEntries={[path]}><App/></MemoryRouter>)

it('renders company content without editorial notes and preserves the figures',()=>{
  open()
  const main=screen.getByRole('main')
  expect(within(main).getByRole('heading',{level:1,name:'О компании'})).toBeInTheDocument()
  expect(within(main).getAllByRole('heading',{level:2}).map(h=>h.textContent)).toEqual(['Компания в цифрах','Наши преимущества','Бренды и производители','География присутствия','Наши новости','Наши соцсети','Реквизиты'])
  expect(within(main).queryByText(/Всё наполнение страницы демонстрационное/)).not.toBeInTheDocument()
  expect(main.querySelector('.about-photo')).toBeNull()
  expect(main.textContent).not.toMatch(/Данные клиента|не подтверждённые факты|Пример содержания|Примеры из справочника|Образец полей/)
  for(const mask of ['XX лет на рынке','X городов','XX XXX товаров']) expect(within(main).getByText(mask)).toBeInTheDocument()
  expect(within(screen.getByRole('region',{name:'Наши преимущества'})).getAllByRole('listitem')).toHaveLength(4)
  expect(within(main).getByText('Название организации')).toBeInTheDocument()
  expect(main.querySelectorAll('a[href="#"],a:not([href]),button')).toHaveLength(0)
  expect(within(screen.getByRole('region',{name:'Наши соцсети'})).queryAllByRole('link')).toHaveLength(0)
  expect(within(screen.getByRole('region',{name:'Наши соцсети'})).getAllByText('Ссылка будет добавлена')).toHaveLength(3)
})

it('reuses three existing news records and only working brand destinations',()=>{
  open()
  const news=screen.getByRole('region',{name:'Наши новости'})
  for(const item of materialsByKind('news').slice(0,3)) {
    expect(within(news).getByRole('link',{name:item.title})).toHaveAttribute('href',`/news/${item.slug}`)
    expect(within(news).getByText(item.summary)).toBeInTheDocument()
    expect(within(news).getByText(item.dateLabel)).toHaveAttribute('datetime',item.date)
  }
  const brands=screen.getByRole('region',{name:'Бренды и производители'})
  for(const brand of prototypeData.brands) {
    expect(within(brands).getByRole('link',{name:brand.name})).toHaveAttribute('href',brand.href)
    expect(within(brands).getByAltText(brand.name)).toHaveAttribute('src',expect.stringContaining('logo-'))
  }
  expect(news.querySelectorAll('img')).toHaveLength(3)
})

it.each([...new Set(contactPoints.map(point=>point.city))])('opens existing contacts for %s with matching city and point',async city=>{
  const user=userEvent.setup();open()
  await user.click(within(screen.getByRole('region',{name:'География присутствия'})).getByRole('link',{name:city}))
  expect(screen.getByRole('tab',{name:city})).toHaveAttribute('aria-selected','true')
  expect(screen.getByTestId('contact-point')).toHaveTextContent(contactPoints.find(point=>point.city===city)!.name)
})

it.each(['Вологда','Череповец'])('restores a direct city query for %s',city=>{
  render(<StrictMode><MemoryRouter initialEntries={[`/contacts?city=${encodeURIComponent(city)}`]}><App/></MemoryRouter></StrictMode>)
  expect(screen.getByRole('tab',{name:city})).toHaveAttribute('aria-selected','true')
})
