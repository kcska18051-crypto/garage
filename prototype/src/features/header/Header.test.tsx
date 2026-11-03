import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Header } from './Header'
import { RegionProvider, useRegion } from '../../state/RegionState'
import { AuthProvider } from '../../state/AuthState'
import { DesktopHeader } from './DesktopHeader'
import { headerQuickLinksConfig } from '../../data/headerNavigationData'

function renderHeader() {
  return render(<MemoryRouter initialEntries={['/catalog']}><RegionProvider><AuthProvider><Header counts={{ favorites: 2, compare: 1, cart: 3 }} /></AuthProvider></RegionProvider></MemoryRouter>)
}

function RegionEcho() {
  const { region } = useRegion()
  return <output aria-label="Регион страницы">{region}</output>
}

describe('responsive header', () => {
  it('opens the catalog on desktop hover, keeps it open inside, switches sections and closes on leaving', () => {
    vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('hover: hover'), media: query, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => true }))
    try {
      renderHeader()
      const button = document.querySelector<HTMLButtonElement>('.catalog-button')!
      fireEvent.mouseEnter(button)
      const catalog = screen.getByRole('dialog', { name: 'Каталог товаров' })
      expect(button).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByRole('button', { name: 'Закрыть каталог' })).not.toHaveFocus()
      fireEvent.mouseLeave(button)
      fireEvent.mouseEnter(catalog)
      act(() => vi.advanceTimersByTime(350))
      expect(catalog).toBeInTheDocument()
      const roots = within(screen.getByRole('navigation', { name: 'Направления каталога' }))
      fireEvent.mouseEnter(roots.getByRole('button', { name: /Инструмент/ }))
      expect(within(catalog).getByRole('heading', { name: 'Инструмент' })).toBeInTheDocument()
      fireEvent.mouseLeave(catalog)
      act(() => vi.advanceTimersByTime(350))
      expect(screen.queryByRole('dialog', { name: 'Каталог товаров' })).not.toBeInTheDocument()
    } finally { vi.unstubAllGlobals(); vi.useRealTimers() }
  })

  it('does not open the catalog on hover on a touch device', () => {
    vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: false, media: query, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => true }))
    try {
      renderHeader()
      const button = document.querySelector<HTMLButtonElement>('.catalog-button')!
      fireEvent.mouseEnter(button)
      expect(screen.queryByRole('dialog', { name: 'Каталог товаров' })).not.toBeInTheDocument()
      fireEvent.click(button)
      expect(screen.getByRole('dialog', { name: 'Каталог товаров' })).toBeInTheDocument()
    } finally { vi.unstubAllGlobals() }
  })

  it('offers a separate paint service entry even when quick navigation is disabled', () => {
    const enabled = headerQuickLinksConfig.enabled
    headerQuickLinksConfig.enabled = false
    try {
      renderHeader()
      expect(document.querySelector('.main-header-row a[href="/services/paint-matching"]')).toHaveTextContent('Подбор автоэмали')
      expect(document.querySelector('.mobile-header a[href="/services/paint-matching"]')).toHaveTextContent('Подбор автоэмали')
      expect(document.querySelector('.main-header-row a[href="/services"]')).toHaveTextContent('Услуги')
    } finally { headerQuickLinksConfig.enabled = enabled }
  })

  it('keeps the paint entry in the compact header', () => {
    render(<MemoryRouter initialEntries={['/catalog']}><AuthProvider><DesktopHeader region="Ярославль" onRegion={() => {}} counts={{ favorites: 0, compare: 0, cart: 0 }} compact catalogOpen={false} onCatalog={() => {}} /></AuthProvider></MemoryRouter>)
    expect(screen.getByRole('link', { name: 'Подбор автоэмали' })).toHaveAttribute('href', '/services/paint-matching')
  })

  it('changes the selected region from the region dialog', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/catalog']}><RegionProvider><AuthProvider><Header counts={{ favorites: 2, compare: 1, cart: 3 }} /><RegionEcho /></AuthProvider></RegionProvider></MemoryRouter>)
    await user.click(screen.getByRole('button', { name: 'Выбрать город' }))
    await user.click(screen.getByRole('button', { name: 'Вологда' }))
    expect(screen.getByRole('status', { name: 'Регион страницы' })).toHaveTextContent('Вологда')
  })

  it('shows useful search suggestions while typing', async () => {
    const user = userEvent.setup()
    renderHeader()
    await user.type(screen.getAllByRole('searchbox')[0], 'краск')
    expect(screen.getAllByRole('listbox').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Краскопульт/).length).toBeGreaterThan(0)
  })

  it('keeps search input identifiers unique across adaptive header variants', () => {
    renderHeader()
    const ids = screen.getAllByRole('searchbox', { hidden: true }).map((input) => input.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('exposes the five approved mobile destinations and closes its menu with Escape', async () => {
    const user = userEvent.setup()
    renderHeader()
    const mobileNav = document.querySelector<HTMLElement>('[aria-label="Мобильная навигация"]')!
    expect(mobileNav.querySelectorAll('a,button')).toHaveLength(5)
    await user.click(screen.getByLabelText('Открыть меню'))
    expect(document.querySelector('[aria-label="Мобильное меню"]')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('navigation', { name: 'Мобильное меню' })).not.toBeInTheDocument()
  })

  it('renders configured quick links while excluding hidden demonstration items', () => {
    renderHeader()

    const desktopNav = screen.getByRole('navigation', { name: 'Быстрые ссылки' })
    const mobileNav = document.querySelector<HTMLElement>('[aria-label="Быстрые ссылки на мобильных"]')!

    expect(within(desktopNav).getByRole('link', { name: 'Компрессоры' })).toHaveAttribute('href', '/catalog/compressor-equipment')
    expect(within(desktopNav).getByRole('link', { name: 'Remeza' })).toHaveAttribute('href', '/brand/remeza')
    expect(mobileNav.querySelector('a[href="/actions"]')).toHaveTextContent('Акции')
    expect(screen.queryByRole('link', { name: 'Сварочное оборудование' })).not.toBeInTheDocument()
  })

  it('keeps actions only in the third-level quick navigation', () => {
    renderHeader()

    expect(document.querySelector('.main-header-row a[href="/actions"]')).not.toBeInTheDocument()
    const desktopNav = screen.getByRole('navigation', { name: 'Быстрые ссылки' })
    const links = within(desktopNav).getAllByRole('link')
    expect(links[0]).toHaveTextContent('Акции')
    expect(links[0]).toHaveClass('third-level-nav__link--accent')
    const mobileNav = document.querySelector<HTMLElement>('[aria-label="Быстрые ссылки на мобильных"]')!
    expect(mobileNav.querySelector('a')?.textContent).toBe('Акции')
  })
})
