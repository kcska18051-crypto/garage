import { addSearchHistory, readSearchHistory } from './searchHistory'

describe('search history', () => {
  beforeEach(() => localStorage.clear())
  it('keeps newest unique requests and limits the list', () => {
    ;['Компрессор', 'Краскопульт', 'Домкрат', 'Инструмент', 'Осушитель', 'Ресивер', 'Сварка', 'компрессор'].forEach(addSearchHistory)
    expect(readSearchHistory()).toEqual(['компрессор', 'Сварка', 'Ресивер', 'Осушитель', 'Инструмент', 'Домкрат'])
  })
})
