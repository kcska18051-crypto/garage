import {MemoryRouter} from 'react-router-dom'
import {regionalPhoneLabel} from '../../data/regionalPhones'
import {render,screen,within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {HeaderPhoneButton} from './HeaderPhoneButton'
it('offers verified regional phone links and keeps the unconfirmed 8800 non-clickable',async()=>{
 const user=userEvent.setup();render(<HeaderPhoneButton ariaLabel="Выбрать телефон магазина">Телефон</HeaderPhoneButton>)
 const trigger=screen.getByRole('button',{name:'Выбрать телефон магазина'});await user.click(trigger)
 const dialog=within(screen.getByRole('dialog',{name:'Телефоны магазинов'}))
 expect(dialog.getByRole('link',{name:/Ярославль/})).toHaveAttribute('href','tel:+74852595980')
 expect(dialog.getByRole('link',{name:/Вологда/})).toHaveAttribute('href','tel:+78172556650')
 expect(dialog.getByRole('link',{name:/Череповец/})).toHaveAttribute('href','tel:+78202730201')
 expect(dialog.getAllByRole('link')).toHaveLength(3)
 expect(dialog.getByText('Временный номер для макета')).toBeInTheDocument()
 await user.click(dialog.getByRole('button',{name:'Закрыть диалог'}))
 expect(screen.queryByRole('dialog')).not.toBeInTheDocument();expect(trigger).toHaveFocus()
})

it.each(['Ярославль','Вологда','Череповец'])('shows %s first and uses its number in the header',async region=>{
 const user=userEvent.setup();render(<HeaderPhoneButton region={region}>Телефон</HeaderPhoneButton>)
 await user.click(screen.getByRole('button',{name:'Телефон'}))
 const dialog=within(screen.getByRole('dialog',{name:'Телефоны магазинов'}))
 expect(dialog.getAllByRole('link')[0]).toHaveAccessibleName(new RegExp(region))
 expect(dialog.getAllByRole('link')[0]).toHaveTextContent(regionalPhoneLabel(region))
})
it('puts the national contact first for another Russian city without inventing a number',async()=>{
 const user=userEvent.setup();render(<HeaderPhoneButton region="Москва">Телефон</HeaderPhoneButton>)
 await user.click(screen.getByRole('button',{name:'Телефон'}))
 const dialog=screen.getByRole('dialog',{name:'Телефоны магазинов'})
 const common=dialog.querySelector('.header-phone-dialog__common')!
 expect(common).toHaveAttribute('data-primary','true')
 expect(common.compareDocumentPosition(dialog.querySelector('ul')!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
 expect(regionalPhoneLabel('Москва')).toBe('8 (800) 000 00 00')
 expect(common.querySelector('a')).toBeNull()
})

it('switches from store phones to callback without stacking dialogs and returns focus',async()=>{
 const user=userEvent.setup();render(<MemoryRouter><HeaderPhoneButton ariaLabel="Выбрать телефон магазина">Телефон</HeaderPhoneButton></MemoryRouter>)
 const trigger=screen.getByRole('button',{name:'Выбрать телефон магазина'});await user.click(trigger)
 await user.click(screen.getByRole('button',{name:'Заказать обратный звонок'}))
 expect(screen.queryByRole('dialog',{name:'Телефоны магазинов'})).not.toBeInTheDocument()
 const dialog=screen.getByRole('dialog',{name:'Заказать звонок'})
 expect(screen.getAllByRole('dialog')).toHaveLength(1)
 expect(within(dialog).getByLabelText('Телефон')).toBeInTheDocument()
 await user.keyboard('{Escape}')
 expect(screen.queryByRole('dialog')).not.toBeInTheDocument();expect(trigger).toHaveFocus()
})
