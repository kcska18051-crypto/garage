import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router-dom'
import {App} from '../app/App'

const open = () => render(<MemoryRouter initialEntries={['/checkout/review']}><App/></MemoryRouter>)
beforeEach(() => {localStorage.clear(); sessionStorage.clear()})

it('keeps the guest login notice outside the recipient card and opens auth without losing another recipient', async () => {
  const user = userEvent.setup(); open()
  const notice = screen.getByRole('region', {name: 'Вход и регистрация'})
  const recipient = screen.getByRole('region', {name: 'Данные получателя'})
  expect(notice.closest('.checkout-layout')).toBeNull()
  expect(within(notice).queryByRole('checkbox')).not.toBeInTheDocument()
  expect(within(notice).queryByRole('textbox')).not.toBeInTheDocument()
  expect(within(recipient).queryByRole('button', {name: 'Войти или зарегистрироваться'})).not.toBeInTheDocument()
  await user.click(within(recipient).getByLabelText('Заберёт другой человек'))
  await user.click(within(recipient).getByLabelText('Имя получателя')); await user.paste('Анна')
  await user.click(within(notice).getByRole('button', {name: 'Войти или зарегистрироваться'}))
  expect(screen.getByRole('dialog', {name: 'Вход и регистрация'})).toBeInTheDocument()
  await user.keyboard('{Escape}')
  expect(within(recipient).getByLabelText('Имя получателя')).toHaveValue('Анна')
})

it('removes only the login notice after entry, preserving the independent recipient fields and current phone', async () => {
  const user = userEvent.setup(); open()
  await user.click(screen.getByLabelText('Заберёт другой человек'))
  await user.click(screen.getByLabelText('Имя получателя')); await user.paste('Анна')
  const notice = screen.getByRole('region', {name: 'Вход и регистрация'})
  await user.click(within(notice).getByRole('button', {name: 'Войти или зарегистрироваться'}))
  const dialog = within(screen.getByRole('dialog', {name: 'Вход и регистрация'}))
  await user.click(dialog.getByLabelText('Номер телефона')); await user.paste('+79991234567')
  await user.click(dialog.getByRole('button', {name: 'Получить код'}))
  await user.type(dialog.getByLabelText('Код подтверждения'), '1234')
  await user.click(dialog.getByRole('button', {name: 'Войти'}))
  expect(screen.queryByRole('region', {name: 'Вход и регистрация'})).not.toBeInTheDocument()
  expect(screen.getByLabelText('Подтверждённый телефон')).toHaveValue('+79991234567')
  expect(screen.getByLabelText('Имя получателя')).toHaveValue('Анна')
  expect(screen.getByLabelText('Заберёт другой человек')).toBeChecked()
}, 15000)
