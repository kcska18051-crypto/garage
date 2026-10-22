import { useState } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render as rtlRender, screen } from '@testing-library/react'
import type {ReactNode} from 'react'
import {MemoryRouter} from 'react-router-dom'
import {CommerceProvider} from '../../state/CommerceState'
import {ProfileProvider} from '../../state/ProfileState'
import {AuthProvider} from '../../state/AuthState'
import userEvent from '@testing-library/user-event'
import type { ServiceRequest } from '../../data/serviceTypes'
import { ServiceRequestDialog } from './ServiceRequestDialog'
const render=(ui:ReactNode)=>rtlRender(ui,{wrapper:({children})=><MemoryRouter><CommerceProvider><ProfileProvider><AuthProvider>{children}</AuthProvider></ProfileProvider></CommerceProvider></MemoryRouter>})

const request = (kind: ServiceRequest['kind']): ServiceRequest => ({ kind, title: 'Демонстрационный компрессор', itemId: 'demo' })
async function common(user: ReturnType<typeof userEvent.setup>, kind: ServiceRequest['kind']) {
  await user.type(screen.getByLabelText(kind==='paint'?'Имя':'Ваше имя', {exact:true}), 'Иван')
  await user.type(screen.getByLabelText('Телефон'), '+7 (999) 123-45-67')
}
beforeEach(() => {
  localStorage.removeItem('garage-service-requests-v1')
  vi.stubGlobal('URL', class extends URL {
    static createObjectURL = vi.fn(() => 'blob:local-preview')
    static revokeObjectURL = vi.fn()
  })
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

describe('service request dialog', () => {
  it.each(['repair', 'paint', 'rental'] as const)('shows linked errors and focuses the first invalid %s field', async (kind) => {
    const user = userEvent.setup()
    render(<ServiceRequestDialog request={request(kind)} onClose={() => {}} />)
    const submitLabel=kind==='paint'?'Узнать стоимость':'Отправить заявку'
    const nameLabel=kind==='paint'?'Имя':'Ваше имя'
    await user.click(screen.getByRole('button', { name: submitLabel }))
    expect(screen.getByLabelText(nameLabel,{exact:true})).toHaveFocus()
    expect(screen.getByLabelText(nameLabel,{exact:true})).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText(nameLabel,{exact:true})).toHaveAccessibleDescription('Укажите имя')
    await common(user,kind)
    await user.click(screen.getByRole('button', { name: submitLabel }))
    if(kind==='paint'){expect(screen.getByRole('status')).toHaveTextContent('Демонстрационная заявка создана');return}
    const field = screen.getByLabelText(kind === 'repair' ? 'Модель оборудования' : 'Дата начала')
    expect(field).toHaveFocus()
    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    if (kind !== 'rental') {
      await user.type(field, 'Демо')
      await user.click(screen.getByRole('button', { name: 'Отправить заявку' }))
      expect(screen.getByLabelText('Описание неисправности')).toHaveFocus()
      expect(screen.getByLabelText('Описание неисправности')).toHaveAttribute('aria-invalid', 'true')
    }
  })
  it.each(['repair', 'paint', 'rental'] as const)('accepts a valid %s request and explains the demo result', async (kind) => {
    const user = userEvent.setup()
    render(<ServiceRequestDialog request={request(kind)} onClose={() => {}} />)
    const before = localStorage.getItem('garage-cart-v2')
    await common(user,kind)
    if (kind === 'repair') {
      await user.type(screen.getByLabelText('Модель оборудования'), 'Демо модель')
      await user.type(screen.getByLabelText('Описание неисправности'), 'Не включается')
      fireEvent.change(screen.getByLabelText('Фото неисправности (необязательно)'), { target: { files: [new File(['x'], 'photo.png', { type: 'image/png' })] } })
    } else if (kind === 'paint') {
      await user.type(screen.getByLabelText('Марка авто'), 'Демо автомобиль')
      await user.type(screen.getByLabelText('Комментарий'), 'Нужен подбор')
    } else {
      expect(screen.getByText('Демонстрационный компрессор')).toBeInTheDocument()
      fireEvent.change(screen.getByLabelText('Дата начала'), { target: { value: '2099-01-01' } })
      fireEvent.change(screen.getByLabelText('Дата окончания'), { target: { value: '2099-01-01' } })
    }
    await user.click(screen.getByRole('button', { name: kind==='paint'?'Узнать стоимость':'Отправить заявку' }))
    expect(screen.getByRole('status')).toHaveTextContent(kind === 'rental' ? 'Заявка на аренду отправлена' : 'Демонстрационная заявка создана')
    expect(screen.getByText(/DEMO-/)).toBeInTheDocument()
    expect(screen.getByText(/Реальная отправка/)).toBeInTheDocument()
    if (kind === 'rental') expect(screen.getByText(/не бронь/)).toBeInTheDocument()
    expect(localStorage.getItem('garage-cart-v2')).toBe(before)
    expect(JSON.parse(localStorage.getItem('garage-service-requests-v1')!).filter((record:{seed:boolean})=>!record.seed)).toHaveLength(1)
    expect(screen.queryByLabelText('Ваше имя')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Демонстрационная заявка' })).toHaveFocus()
    if (kind === 'repair') expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:local-preview')
  })
  it('rejects phone text and invalid rental dates and quantity', async () => {
    const user = userEvent.setup()
    render(<ServiceRequestDialog request={request('rental')} onClose={() => {}} />)
    await user.type(screen.getByLabelText('Ваше имя'), 'Иван')
    await user.type(screen.getByLabelText('Телефон'), 'call 79991234567')
    fireEvent.change(screen.getByLabelText('Дата начала'), { target: { value: '2000-01-01' } })
    fireEvent.change(screen.getByLabelText('Дата окончания'), { target: { value: '1999-12-31' } })
    fireEvent.change(screen.getByLabelText('Количество'), { target: { value: '1.5' } })
    await user.click(screen.getByRole('button', { name: 'Отправить заявку' }))
    for (const label of ['Телефон', 'Дата начала', 'Дата окончания', 'Количество']) expect(screen.getByLabelText(label)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Телефон')).toHaveFocus()
  })
  it('previews and removes a local photo, rejects invalid files and clears input', () => {
    render(<ServiceRequestDialog request={request('repair')} onClose={() => {}} />)
    const input = screen.getByLabelText('Фото неисправности (необязательно)') as HTMLInputElement
    fireEvent.change(input, { target: { files: [new File(['x'], 'photo.png', { type: 'image/png' })] } })
    expect(screen.getByRole('img', { name: 'Предпросмотр фото неисправности' })).toHaveAttribute('src', 'blob:local-preview')
    fireEvent.click(screen.getByRole('button', { name: 'Удалить фото' }))
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:local-preview')
    expect(input.value).toBe('')
    fireEvent.change(input, { target: { files: [new File(['x'], 'bad.gif', { type: 'image/gif' })] } })
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription(expect.stringContaining('JPEG'))
    fireEvent.change(input, { target: { files: [new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.jpg', { type: 'image/jpeg' })] } })
    expect(input).toHaveAccessibleDescription(expect.stringContaining('5 МиБ'))
  })
  it('releases a photo when the form closes', () => {
    const { unmount } = render(<ServiceRequestDialog request={request('repair')} onClose={() => {}} />)
    fireEvent.change(screen.getByLabelText('Фото неисправности (необязательно)'), { target: { files: [new File(['x'], 'photo.webp', { type: 'image/webp' })] } })
    unmount()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:local-preview')
  })
  it('traps focus from heading and edges, closes with Escape and restores the trigger', async () => {
    function Harness() {
      const [open, setOpen] = useState(false)
      return <><button onClick={() => setOpen(true)}>Открыть</button>{open && <ServiceRequestDialog request={request('paint')} onClose={() => setOpen(false)} />}</>
    }
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Открыть' }))
    expect(document.body).toHaveClass('service-dialog-open')
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Узнать стоимость' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Закрыть форму' })).toHaveFocus()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Узнать стоимость' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Открыть' })).toHaveFocus()
    expect(document.body).not.toHaveClass('service-dialog-open')
  })
  it('keeps focus stable on rerender and uses the latest close handler for backdrop and Escape', () => {
    const oldClose = vi.fn(), newClose = vi.fn()
    const { rerender } = render(<ServiceRequestDialog request={request('paint')} onClose={oldClose} />)
    screen.getByLabelText('Телефон').focus()
    rerender(<ServiceRequestDialog request={request('paint')} onClose={newClose} />)
    expect(screen.getByLabelText('Телефон')).toHaveFocus()
    fireEvent.keyDown(window, { key: 'Escape' })
    fireEvent.mouseDown(screen.getByRole('dialog').parentElement!)
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть форму' }))
    expect(newClose).toHaveBeenCalledTimes(3)
    expect(oldClose).not.toHaveBeenCalled()
  })
})
