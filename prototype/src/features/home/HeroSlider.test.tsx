import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { prototypeData } from '../../data/prototypeData'
import { HeroSlider } from './HeroSlider'

describe('HeroSlider', () => {
  it('keeps visible copy out of the banner and uses only dot navigation', async () => {
    const user = userEvent.setup()
    const { container } = render(<MemoryRouter><HeroSlider slides={prototypeData.slides} /></MemoryRouter>)

    expect(container.querySelector('.hero__copy')).not.toBeInTheDocument()
    expect(container.querySelector('.hero__stage a')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Предыдущий слайд' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Следующий слайд' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /автопрокрутку/ })).not.toBeInTheDocument()

    const dots = screen.getAllByRole('button', { name: /Перейти к слайду/ })
    expect(dots).toHaveLength(3)
    await user.click(dots[1])
    expect(dots[1]).toHaveAttribute('aria-current', 'true')
  })

  it('advances automatically after five seconds by default', () => {
    vi.useFakeTimers()
    render(<MemoryRouter><HeroSlider slides={prototypeData.slides} /></MemoryRouter>)
    const dots = screen.getAllByRole('button', { name: /Перейти к слайду/ })

    act(() => vi.advanceTimersByTime(4999))
    expect(dots[0]).toHaveAttribute('aria-current', 'true')

    act(() => vi.advanceTimersByTime(1))
    expect(dots[1]).toHaveAttribute('aria-current', 'true')
    vi.useRealTimers()
  })
})
