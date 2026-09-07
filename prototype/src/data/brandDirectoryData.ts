export type BrandDirectoryItem = {
  id: string
  name: string
  popular?: boolean
  categories: string[]
}

export const brandCategories = [
  'Компрессорное оборудование',
  'Кузовной ремонт',
  'Инструмент',
  'Покраска и подготовка',
]

export const brandDirectory: BrandDirectoryItem[] = [
  { id: 'aist', name: 'Аист', categories: ['Инструмент'] },
  { id: 'zubr', name: 'Зубр', categories: ['Инструмент'] },
  { id: 'sorokin', name: 'Сорокин', categories: ['Инструмент', 'Кузовной ремонт'] },
  { id: 'techno-vector', name: 'Техно Вектор', categories: ['Кузовной ремонт'] },
  { id: 'berg', name: 'Berg', popular: true, categories: ['Компрессорное оборудование'] },
  { id: 'car-tool', name: 'Car-Tool', categories: ['Инструмент'] },
  { id: 'comprag', name: 'Comprag', popular: true, categories: ['Компрессорное оборудование'] },
  { id: 'dali', name: 'Dali', popular: true, categories: ['Компрессорное оборудование'] },
  { id: 'fiac', name: 'Fiac', popular: true, categories: ['Компрессорное оборудование'] },
  { id: 'jonnesway', name: 'Jonnesway', categories: ['Инструмент'] },
  { id: 'jtc', name: 'JTC', popular: true, categories: ['Инструмент'] },
  { id: 'nordberg', name: 'Nordberg', categories: ['Кузовной ремонт', 'Инструмент'] },
  { id: 'remeza', name: 'Remeza', popular: true, categories: ['Компрессорное оборудование'] },
  { id: 'rupes', name: 'Rupes', popular: true, categories: ['Кузовной ремонт', 'Покраска и подготовка'] },
  { id: 'sivik', name: 'Sivik', categories: ['Кузовной ремонт'] },
  { id: 'wiederkraft', name: 'WiederKraft', categories: ['Кузовной ремонт', 'Инструмент'] },
]
