import { brandDirectory } from './brandDirectoryData'
import { contactPoints } from './contactsData'
import { materialKinds, materialsByKind } from './materialsData'

export const aboutFigures=['XX лет на рынке','X городов','XX XXX товаров']
export const aboutAdvantages=[
  {title:'Ассортимент для разных задач',text:'Оборудование, инструмент и материалы можно объединить в подборку под задачи мастерской.'},
  {title:'Помощь с подбором',text:'В этом блоке можно рассказать, как специалисты помогают сопоставить задачи и параметры товара.'},
  {title:'Удобное получение',text:'Здесь можно описать доступные способы доставки и самовывоза для выбранного города.'},
  {title:'Сопровождение покупки',text:'Место для рассказа о консультациях по заказу, документах и обращениях после покупки.'},
]
export const aboutBrands=brandDirectory.filter(brand=>brand.popular).slice(0,6).map(brand=>({
  ...brand,href:brand.id==='remeza'?'/brand/remeza/':`/brands?q=${encodeURIComponent(brand.name)}`,
}))
export const aboutCities=[...new Set(contactPoints.map(point=>point.city))]
export const aboutNews=materialsByKind('news').sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3).map(item=>({...item,href:`${materialKinds.news.path}/${item.slug}`}))
export const aboutSocialPlaces=['Социальная сеть','Видеоканал','Сообщество']
export const aboutRequisites=[
  ['Юридическое наименование','Название организации'],['ИНН','Будет заполнено'],['КПП','Будет заполнено'],['ОГРН','Будет заполнено'],['Юридический адрес','Будет заполнено'],['Банк','Будет заполнено'],['Расчётный счёт','Будет заполнено'],['БИК и корреспондентский счёт','Будет заполнено'],
]
