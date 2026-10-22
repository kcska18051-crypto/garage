import {rentalItems,rentalCategories} from './rentalData'
export {rentalItems,rentalCategories} from './rentalData'

export const serviceDirections=[
  {id:'service-center',title:'Сервисный центр по ремонту',href:'/services/service-center',text:'Пример направления диагностики и ремонта оборудования профессиональной мастерской.'},
  {id:'paint-matching',title:'Подбор автоэмали',href:'/services/paint-matching',text:'Знакомство с обращением по подбору цвета и материалов для ремонта покрытия.'},
  {id:'rental',title:'Аренда оборудования и инструмента',href:'/services/rental',text:'Демонстрационные позиции для временных задач. Условия аренды уточняются.'},
]
const repairBase='/services/service-center/compressor-repair'
export const repairDirections=[
  {id:'compressor-repair',title:'Ремонт компрессоров',href:repairBase,text:'Винтовые, поршневые и дизельные установки — три примера детализации категории.'},
  {id:'impact-wrench-repair',title:'Ремонт гайковёрта',text:'Демонстрационное обращение по неисправности гайковёрта.'},
  {id:'angle-grinder-repair',title:'Ремонт болгарки',text:'Демонстрационное обращение по неисправности угловой шлифовальной машины.'},
  {id:'polisher-repair',title:'Ремонт полировальной машинки',text:'Демонстрационное обращение по неисправности полировального оборудования.'},
  {id:'pressure-washer-repair',title:'Ремонт аппарата высокого давления',text:'Демонстрационное обращение по неисправности аппарата высокого давления.'},
]
export const paintServices=[
  {id:'automotive',title:'Подбор/колеровка автомобильных эмалей'},
  {id:'polyurethane',title:'Подбор полиуретановых эмалей'},
].map(item=>({...item,itemId:`paint-${item.id}`,href:`/services/paint-matching/${item.id}`,text:'Демонстрационное описание подбора цвета и материалов под задачу. Способ подбора, состав материалов и условия уточняются.'}))
export const repairServices=[
  {id:'screw',title:'Ремонт винтовых компрессоров',text:'Пример обращения по компрессорному блоку, системе управления и узлам подготовки воздуха.'},
  {id:'piston',title:'Ремонт поршневых компрессоров',text:'Пример обращения по работе поршневой группы, приводу и системе регулирования давления.'},
  {id:'diesel',title:'Ремонт дизельных компрессоров',text:'Пример обращения по компрессорной установке с дизельным приводом и её рабочим системам.'},
].map(item=>({...item,href:`${repairBase}/${item.id}`}))
export const repairSteps=['Опишите оборудование и неисправность','Передайте исходные данные для обсуждения','Согласуйте диагностику и возможные работы','Уточните стоимость, сроки и дальнейшие действия']
export const paintSteps=['Оставьте имя и телефон для связи','При желании добавьте марку авто, код краски и комментарий','Обсудите исходные данные и способ подбора','Уточните стоимость, материалы и условия получения']
export const rentalSteps=['Выберите демонстрационную позицию','Укажите желаемые даты и количество','Уточните наличие, тариф и условия с менеджером','Отдельно согласуйте передачу и возврат']
export const serviceRoutes=['/services',...serviceDirections.map(item=>item.href),...paintServices.map(item=>item.href),repairBase,...repairServices.map(item=>item.href),...rentalCategories.map(item=>item.href),...rentalItems.map(item=>item.href),'/services/workshop']
