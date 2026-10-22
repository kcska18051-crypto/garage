import {render,screen,within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router-dom'
import {App} from '../app/App'

const open=(path:string)=>render(<MemoryRouter initialEntries={[path]}><App/></MemoryRouter>)
const base='/services/service-center/compressor-repair'
it.each([
  ['/services','Услуги'],['/services/service-center','Сервисный центр по ремонту'],[base,'Ремонт компрессоров'],
  [base+'/screw','Ремонт винтовых компрессоров'],[base+'/piston','Ремонт поршневых компрессоров'],[base+'/diesel','Ремонт дизельных компрессоров'],
  ['/services/paint-matching','Подбор автоэмали'],['/services/rental','Аренда оборудования и инструмента'],
  ['/services/rental/hydraulic-jack','Домкрат подкатной профессиональный'],['/services/rental/tool-set','Набор инструмента для мастерской'],['/services/rental/piston-compressor','Компрессор поршневой'],
])('opens the implemented service route %s', (path,title)=>{
  open(path)
  const main=screen.getByRole('main')
  expect(within(main).getByRole('heading',{level:1,name:title})).toBeInTheDocument()
  expect(main).toHaveTextContent(/демонстрационн/i)
  expect(main.querySelectorAll('.placeholder-page,a[href="#"]')).toHaveLength(0)
  expect(screen.getByRole('navigation',{name:'Хлебные крошки'})).toHaveTextContent('Услуги')
})
it('connects all repair levels through real links',()=>{
  open(base)
  for(const [slug,name] of [['screw','винтовых'],['piston','поршневых'],['diesel','дизельных']]) expect(screen.getByRole('main').querySelector(`a[href="${base}/${slug}"]`)).toHaveTextContent(`Ремонт ${name} компрессоров`)
})
it('keeps rental request separate from cart and identifies the selected item',async()=>{
  const user=userEvent.setup();open('/services/rental/hydraulic-jack')
  const before=localStorage.getItem('garage-cart-v2')
  await user.click(within(screen.getByRole('main')).getByRole('button',{name:'Арендовать'}))
  expect(screen.getByRole('dialog')).toHaveTextContent('Домкрат подкатной профессиональный')
  expect(localStorage.getItem('garage-cart-v2')).toBe(before)
})
it.each(['/services/rental/not-a-real-item',base+'/unknown','/services/unknown'])('uses actual 404 UI for %s',path=>{
  open(path)
  expect(screen.getByRole('heading',{name:'Страница не найдена'})).toBeInTheDocument()
})
it('preserves the old workshop link as a redirect, not a fourth direction',()=>{
  open('/services/workshop')
  expect(screen.getByRole('heading',{level:1,name:'Услуги'})).toBeInTheDocument()
  expect(screen.getByRole('main').querySelectorAll('.services-grid article')).toHaveLength(3)
})
