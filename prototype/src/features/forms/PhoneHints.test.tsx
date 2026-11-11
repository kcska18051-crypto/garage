import {render,screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router-dom'
import {ContactDialog} from './ContactDialog'

it('keeps phone assistance out of email-only replies and preserves email entry in consultation',async()=>{
  const user=userEvent.setup()
  const view=render(<MemoryRouter><ContactDialog mode="message" onClose={()=>{}}/></MemoryRouter>)
  expect(screen.getByLabelText('Телефон',{selector:'input[type=tel]'})).toHaveAttribute('placeholder','+7 (___) ___-__-__')
  await user.click(screen.getByRole('radio',{name:'Email'}))
  expect(screen.getByLabelText('Email для ответа')).toHaveAttribute('type','email')
  expect(screen.queryByText('10 цифр после +7')).not.toBeInTheDocument()
  view.unmount()
  render(<MemoryRouter><ContactDialog mode="consultation" onClose={()=>{}}/></MemoryRouter>)
  const input=screen.getByLabelText('Телефон или электронная почта')
  await user.type(input,'client@example.ru')
  expect(input).toHaveValue('client@example.ru')
  expect(input).toHaveAccessibleDescription('Для телефона — 10 цифр после +7. Можно указать email.')
})
