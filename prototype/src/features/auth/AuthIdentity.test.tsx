import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from '../../state/AuthState'

const identityKey = 'garage-auth-demo-identity-v1'
const sessionKey = 'garage-auth-demo-session-v1'
function Harness() {
  const auth = useAuth()
  const location = useLocation()
  return <>
    <output aria-label="identity">{JSON.stringify(auth.identity ?? null)}</output>
    <output aria-label="route">{location.pathname + location.search + location.hash}</output>
    <button onClick={() => auth.openAuth()}>Open</button>
    <button onClick={() => auth.openAuth('register', { requirePhoneConfirmation: true, returnTo: '/profile/services/request/?id=local-123#details' })}>Confirm</button>
    <button onClick={() => auth.openAuth('recovery')}>Recovery</button>
    <button onClick={auth.logout}>Logout</button>
  </>
}
const open = () => render(<MemoryRouter><AuthProvider><Harness /></AuthProvider></MemoryRouter>)
const expectIdentity = (phone: string, phoneConfirmed: boolean) => expect(screen.getByLabelText('identity')).toHaveTextContent(JSON.stringify({ phone, phoneConfirmed }))
const enterCode = async (user: ReturnType<typeof userEvent.setup>, action = 'Войти') => {
  await user.type(screen.getByLabelText('Код подтверждения'), '1234')
  await user.click(screen.getByRole('button', { name: action }))
}

beforeEach(() => { sessionStorage.clear(); localStorage.clear() })

describe('demo auth phone identity', () => {
  it('maps legacy active sessions and malformed identity to an unconfirmed default', () => {
    sessionStorage.setItem(sessionKey, 'active')
    sessionStorage.setItem(identityKey, '{bad')
    open()
    expectIdentity('79000000000', false)
  })
  it('ignores a stale identity without an active session and clears it on logout', async () => {
    sessionStorage.setItem(identityKey, JSON.stringify({ phone: '79991112233', phoneConfirmed: true }))
    open()
    expect(screen.getByLabelText('identity')).toHaveTextContent('null')
    await userEvent.setup().click(screen.getByRole('button', { name: 'Logout' }))
    expect(sessionStorage.getItem(identityKey)).toBeNull()
  })
  it('does not use an arbitrary typed phone for password demo login', async () => {
    const user = userEvent.setup(); open()
    await user.click(screen.getByRole('button', { name: 'Open' }))
    await user.type(screen.getByLabelText('Номер телефона'), '+7 999 111-22-33')
    await user.click(screen.getByRole('button', { name: 'По паролю' }))
    await user.click(screen.getByRole('button', { name: 'Войти' }))
    expectIdentity('79000000000', false)
    expect(JSON.parse(sessionStorage.getItem(identityKey)!)).toEqual({ phone: '79000000000', phoneConfirmed: false })
  })
  it('forces SMS even for a register intent, keeps the exact destination and restores identity after remount', async () => {
    const user = userEvent.setup(); let view = open()
    await user.click(screen.getByRole('button', { name: 'Confirm' }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).queryByRole('button', { name: /паролю/ })).not.toBeInTheDocument()
    expect(within(dialog).queryByRole('tab', { name: 'Регистрация' })).not.toBeInTheDocument()
    await user.type(screen.getByLabelText('Номер телефона'), '8 (999) 111-22-33')
    await user.click(screen.getByRole('button', { name: 'Получить код' }))
    expect(dialog).toHaveTextContent(/демонстрац/i)
    expect(dialog).toHaveTextContent(/SMS.*не подключены/i)
    await enterCode(user)
    expectIdentity('79991112233', true)
    expect(screen.getByLabelText('route')).toHaveTextContent('/profile/services/request/?id=local-123#details')
    view.unmount(); view = open()
    expectIdentity('79991112233', true)
    await user.click(screen.getByRole('button', { name: 'Logout' }))
    expect(screen.getByLabelText('identity')).toHaveTextContent('null')
    expect(sessionStorage.getItem(identityKey)).toBeNull()
    expect(sessionStorage.getItem(sessionKey)).toBeNull()
  })
  it('rejects phone text before entering the code screen', async () => {
    const user = userEvent.setup(); open()
    await user.click(screen.getByRole('button', { name: 'Open' }))
    await user.type(screen.getByLabelText('Номер телефона'), 'call 79991112233')
    await user.click(screen.getByRole('button', { name: 'Получить код' }))
    expect(screen.queryByLabelText('Код подтверждения')).not.toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
  it('confirms the new phone on registration completion', async () => {
    const user = userEvent.setup(); open()
    await user.click(screen.getByRole('button', { name: 'Open' }))
    await user.click(screen.getByRole('tab', { name: 'Регистрация' }))
    await user.type(screen.getByLabelText('Имя'), 'Демо')
    await user.type(screen.getByLabelText('Номер телефона'), '9992223344')
    await user.click(screen.getByRole('checkbox', { name: /обработку персональных данных/ }))
    await user.click(screen.getByRole('checkbox', { name: /условия сервиса/ }))
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))
    await enterCode(user, 'Подтвердить')
    await user.click(screen.getByRole('button', { name: 'Продолжить без пароля' }))
    expectIdentity('79992223344', true)
  })
  it('confirms a recovered phone only after the recovery code flow completes', async () => {
    const user = userEvent.setup(); open()
    await user.click(screen.getByRole('button', { name: 'Recovery' }))
    await user.click(screen.getByRole('button', { name: 'Восстановить пароль' }))
    await user.type(screen.getByLabelText('Номер телефона'), '+44 20 1234 5678')
    await user.click(screen.getByRole('button', { name: 'Получить код' }))
    await enterCode(user, 'Подтвердить')
    expect(screen.getByLabelText('identity')).toHaveTextContent('null')
    await user.type(screen.getByLabelText('Новый пароль'), 'demo123')
    await user.type(screen.getByLabelText('Повторите пароль'), 'demo123')
    await user.click(screen.getByRole('button', { name: 'Сохранить пароль и войти' }))
    expectIdentity('442012345678', true)
  })
})
