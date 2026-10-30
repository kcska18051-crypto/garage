import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../state/AuthState'
import { DesktopHeader } from './DesktopHeader'
import { MobileHeader } from './MobileHeader'
import { MobileBottomNav } from './MobileBottomNav'

const counts = {favorites:0,compare:0,cart:0}
it('keeps both service destinations before the desktop account actions', () => {
  render(<MemoryRouter initialEntries={['/style-check/']}><AuthProvider><DesktopHeader region="Ярославль" onRegion={()=>{}} counts={counts} compact catalogOpen={false} onCatalog={()=>{}} /></AuthProvider></MemoryRouter>)
  expect(screen.getByRole('link',{name:'Услуги'})).toHaveAttribute('href','/services')
  expect(screen.getByRole('link',{name:'Подбор'})).toHaveAttribute('href','/services/paint-matching')
})
it('keeps calling and search in the pinned mobile header without service buttons', () => {
  render(<MemoryRouter initialEntries={['/style-check/']}><MobileHeader compact region="Ярославль" onRegion={()=>{}} menuOpen={false} onMenu={()=>{}} onCatalog={()=>{}} /></MemoryRouter>)
  const pinned=within(document.querySelector<HTMLElement>('.review-mobile-pinned')!)
  expect(pinned.getByRole('link',{name:'Позвонить: +7 (000) 000-00-00'})).toHaveAttribute('href','tel:+70000000000')
  expect(pinned.queryByRole('link',{name:'Услуги'})).not.toBeInTheDocument()
  expect(pinned.getByRole('button',{name:'Открыть поиск'})).toBeInTheDocument()
  expect(pinned.getByRole('button',{name:'Открыть меню'})).toBeInTheDocument()
})
it('leaves the original compact desktop header unchanged outside Style Check', () => {
  render(<MemoryRouter><AuthProvider><DesktopHeader region="Ярославль" onRegion={()=>{}} counts={counts} compact catalogOpen={false} onCatalog={()=>{}} /></AuthProvider></MemoryRouter>)
  expect(screen.queryByRole('link',{name:'Услуги'})).not.toBeInTheDocument()
  expect(screen.getByRole('link',{name:'Подбор автоэмали'})).toBeInTheDocument()
})
it('orders the six bottom destinations and highlights both services', () => {
 render(<MemoryRouter initialEntries={['/style-check/']}><AuthProvider><MobileBottomNav favorites={2} cart={0} catalogOpen={false} onCatalog={()=>{}} /></AuthProvider></MemoryRouter>)
 const nav=screen.getByRole('navigation',{name:'Мобильная навигация'})
 expect([...nav.children].map(e=>e.textContent?.replace('2',''))).toEqual(['Главная','Каталог','Услуги','Подбор','Избранное','Корзина'])
 expect(within(nav).getByRole('link',{name:'Услуги'})).toHaveClass('reference-bottom-service')
 expect(within(nav).getByRole('link',{name:'Подбор'})).toHaveAttribute('href','/services/paint-matching')
})
