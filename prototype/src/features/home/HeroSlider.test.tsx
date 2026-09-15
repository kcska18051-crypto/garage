import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { prototypeData } from '../../data/prototypeData'
import { HeroSlider } from './HeroSlider'

describe('HeroSlider', () => {
  it('keeps the stable H1 and supports manual navigation and pause', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><HeroSlider slides={prototypeData.slides} /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Оборудование и материалы')
    await user.click(screen.getByRole('button', { name: 'Следующий слайд' }))
    expect(screen.getByText('Подбор автоэмали под вашу задачу')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Остановить автопрокрутку' }))
    expect(screen.getByRole('button', { name: 'Запустить автопрокрутку' })).toBeVisible()
  })

  it('advances automatically after five seconds by default', () => {
    vi.useFakeTimers()
    render(<MemoryRouter><HeroSlider slides={prototypeData.slides} /></MemoryRouter>)

    act(() => vi.advanceTimersByTime(4999))
    expect(screen.getByText('Оборудование и материалы для тех, кто работает с автомобилями')).toBeVisible()

    act(() => vi.advanceTimersByTime(1))
    expect(screen.getByText('Подбор автоэмали под вашу задачу')).toBeVisible()
    vi.useRealTimers()
  })
})
