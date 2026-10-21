import {prototypeData} from './prototypeData'

export const serviceDirections=[
  {id:'service-center',title:'Сервисный центр по ремонту',href:'/services/service-center',text:'Пример направления диагностики и ремонта оборудования профессиональной мастерской.'},
  {id:'paint-matching',title:'Подбор автоэмали',href:'/services/paint-matching',text:'Знакомство с обращением по подбору цвета и материалов для ремонта покрытия.'},
  {id:'rental',title:'Аренда оборудования и инструментов',href:'/services/rental',text:'Демонстрационные позиции для временных задач. Условия аренды уточняются.'},
]
const repairBase='/services/service-center/compressor-repair'
export const repairServices=[
  {id:'screw',title:'Ремонт винтовых компрессоров',text:'Пример обращения по компрессорному блоку, системе управления и узлам подготовки воздуха.'},
  {id:'piston',title:'Ремонт поршневых компрессоров',text:'Пример обращения по работе поршневой группы, приводу и системе регулирования давления.'},
  {id:'diesel',title:'Ремонт дизельных компрессоров',text:'Пример обращения по компрессорной установке с дизельным приводом и её рабочим системам.'},
].map(item=>({...item,href:`${repairBase}/${item.id}`}))
export const rentalItems=[
  {id:'hydraulic-jack',sourceId:'product-1',text:'Демонстрационный домкрат для знакомства с заявкой на временное использование.'},
  {id:'tool-set',sourceId:'product-2',text:'Демонстрационный набор для знакомства с арендой инструмента для рабочего поста.'},
  {id:'piston-compressor',sourceId:'product-4',text:'Демонстрационный пример компрессорного оборудования для временных задач.'},
].map((item,index)=>{
  const source=prototypeData.products.find(product=>product.id===item.sourceId)!
  return {...item,title:source.name,sku:source.sku,href:`/services/rental/${item.id}`,art:index}
})
export const repairSteps=['Опишите оборудование и неисправность','Передайте исходные данные для обсуждения','Согласуйте диагностику и возможные работы','Уточните стоимость, сроки и дальнейшие действия']
export const paintSteps=['Укажите автомобиль и задачу ремонта','Подготовьте доступные сведения о цвете и покрытии','Обсудите исходные данные и способ подбора','Уточните состав материалов и условия получения']
export const rentalSteps=['Выберите демонстрационную позицию','Укажите желаемые даты и количество','Уточните наличие, тариф и условия с менеджером','Отдельно согласуйте передачу и возврат']
export const serviceRoutes=['/services',...serviceDirections.map(item=>item.href),repairBase,...repairServices.map(item=>item.href),...rentalItems.map(item=>item.href),'/services/workshop']
