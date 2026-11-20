import {render,screen,within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {ProductVideos} from './ProductVideos'
it('shows four previews, expands to eight, and opens an honest cover preview with focus return',async()=>{
 const user=userEvent.setup();render(<ProductVideos/>)
 const section=screen.getByRole('region',{name:'Видео'}),scope=within(section)
 expect(scope.getAllByRole('button',{name:/Предпросмотр видео:/})).toHaveLength(4)
 await user.click(scope.getByRole('button',{name:'Показать ещё 4'}))
 expect(scope.getAllByRole('button',{name:/Предпросмотр видео:/})).toHaveLength(8)
 const trigger=scope.getByRole('button',{name:'Предпросмотр видео: Диагностика оборудования'})
 await user.click(trigger)
 const dialog=screen.getByRole('dialog',{name:'Диагностика оборудования'})
 expect(dialog).toHaveTextContent('Видеоролик пока не подключён')
 expect(within(dialog).getByRole('img')).toHaveAttribute('alt','Обложка: Диагностика оборудования')
 await user.keyboard('{Escape}')
 expect(screen.queryByRole('dialog')).not.toBeInTheDocument();expect(trigger).toHaveFocus()
 await user.click(scope.getByRole('button',{name:'Свернуть'}))
 expect(scope.getAllByRole('button',{name:/Предпросмотр видео:/})).toHaveLength(4)
})
