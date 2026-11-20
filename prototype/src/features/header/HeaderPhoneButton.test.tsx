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
 expect(dialog.getByText('Единый номер уточняется')).toBeInTheDocument()
 await user.click(dialog.getByRole('button',{name:'Закрыть диалог'}))
 expect(screen.queryByRole('dialog')).not.toBeInTheDocument();expect(trigger).toHaveFocus()
})
