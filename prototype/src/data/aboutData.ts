import { brandDirectory } from './brandDirectoryData'
import { contactPoints } from './contactsData'
import { materialKinds, materialsByKind } from './materialsData'

export const aboutFigures=[{value:'XX',label:'лет на рынке'},{value:'3',label:'магазина'},{value:'3',label:'города присутствия'},{value:'Комплексное',label:'оснащение мастерской'}]
export const aboutAdvantages=[
  {title:'Ассортимент для разных задач',text:'От ручного инструмента до оборудования рабочего поста.'},
  {title:'Помощь с подбором',text:'Помогаем сопоставить задачи мастерской и характеристики оборудования.'},
  {title:'Удобное получение',text:'Доставка и самовывоз для выбранного города.'},
  {title:'Сопровождение покупки',text:'Консультации по заказу, документам и вопросам после покупки.'},
]
export const aboutBrands=brandDirectory.filter(brand=>brand.popular).slice(0,6).map(brand=>({
  ...brand,href:brand.id==='remeza'?'/brand/remeza/':`/brands?q=${encodeURIComponent(brand.name)}`,
}))
export const aboutCities=[...new Set(contactPoints.map(point=>point.city))]
export const aboutNews=materialsByKind('news').sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3).map(item=>({...item,href:`${materialKinds.news.path}/${item.slug}`}))
export const aboutSocialPlaces=['Социальная сеть','Видеоканал','Сообщество']
export const aboutRequisites=[
  ['Юридическое наименование','Уточняется'],['ИНН','Уточняется'],['КПП','Уточняется'],['ОГРН','Уточняется'],['Юридический адрес','Уточняется'],['Банк','Уточняется'],['Расчётный счёт','Уточняется'],['БИК и корреспондентский счёт','Уточняется'],
]
