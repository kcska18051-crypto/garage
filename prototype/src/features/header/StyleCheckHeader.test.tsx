import { fireEvent, render, screen, within } from '@testing-library/react'
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
  expect(pinned.getByRole('button',{name:'Выбрать телефон магазина'})).toHaveAttribute('aria-haspopup','dialog')
  expect(pinned.queryByRole('link',{name:'Услуги'})).not.toBeInTheDocument()
  expect(pinned.getByRole('button',{name:'Открыть поиск'})).toBeInTheDocument()
  expect(pinned.getByRole('button',{name:'Открыть меню'})).toBeInTheDocument()
})
it('uses the approved compact desktop header on internal pages', () => {
  render(<MemoryRouter initialEntries={['/catalog']}><AuthProvider><DesktopHeader region="Ярославль" onRegion={()=>{}} counts={counts} compact catalogOpen={false} onCatalog={()=>{}} /></AuthProvider></MemoryRouter>)
  expect(screen.getByRole('link',{name:'Услуги'})).toHaveAttribute('href','/services')
  expect(screen.getByRole('link',{name:'Подбор'})).toBeInTheDocument()
})
it('gives the account a distinct double-width destination without paint matching', () => {
 render(<MemoryRouter initialEntries={['/style-check/']}><AuthProvider><MobileBottomNav favorites={2} cart={0} catalogOpen={false} onCatalog={()=>{}} /></AuthProvider></MemoryRouter>)
 const nav=screen.getByRole('navigation',{name:'Мобильная навигация'})
 expect([...nav.children].map(e=>e.textContent?.replace('2',''))).toEqual(['Главная','Каталог','Войти','Избранное','Корзина'])
 expect(within(nav).getByRole('button',{name:'Войти'})).toHaveClass('mobile-bottom-nav__profile')
 expect(within(nav).queryByRole('link',{name:'Подбор'})).not.toBeInTheDocument()
})
it('hides the mobile search shortcut until the search row scrolls away', () => {
 render(<MemoryRouter initialEntries={['/style-check/']}><MobileHeader region="Ярославль" onRegion={()=>{}} menuOpen={false} onMenu={()=>{}} onCatalog={()=>{}} /></MemoryRouter>)
 expect(screen.queryByRole('button',{name:'Открыть поиск'})).not.toBeInTheDocument()
 expect(screen.getByPlaceholderText('Товары, бренды, артикулы')).toBeInTheDocument()
})
it('keeps the full paint matching label in the expanded desktop row', () => {
 render(<MemoryRouter initialEntries={['/style-check/']}><AuthProvider><DesktopHeader region="Ярославль" onRegion={()=>{}} counts={counts} compact={false} catalogOpen={false} onCatalog={()=>{}} /></AuthProvider></MemoryRouter>)
 expect(screen.getByRole('link',{name:'Подбор автоэмалей'})).toHaveAttribute('href','/services/paint-matching')
 expect(document.querySelector('.reference-desktop-services a[href="/services"]')).not.toBeInTheDocument()
})
it('exposes the city outside the burger and removes the old placeholder contact panel', () => {
 const onRegion=vi.fn()
 render(<MemoryRouter initialEntries={['/style-check/']}><MobileHeader region="Вологда" onRegion={onRegion} menuOpen onMenu={()=>{}} onCatalog={()=>{}} /></MemoryRouter>)
 const menu=within(screen.getByRole('dialog',{name:'Мобильное меню'}))
 const city=screen.getByRole('button',{name:'Ваш город: Вологда. Изменить город'});expect(menu.queryByRole('button',{name:'Ваш город: Вологда. Изменить город'})).not.toBeInTheDocument()
 fireEvent.click(city);expect(onRegion).toHaveBeenCalledOnce()
 expect(menu.queryByRole('link',{name:/Позвонить нам/})).not.toBeInTheDocument()
 expect(menu.getByRole('navigation',{name:'Разделы сайта'})).toBeInTheDocument()
})
