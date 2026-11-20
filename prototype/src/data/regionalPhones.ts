// Source: https://www.garageshop.ru/contact/ — verified 20 November 2026.
export const regionalPhones = [
 {city:'Ярославль',phone:'+7 (4852) 59-59-80',href:'tel:+74852595980'},
 {city:'Вологда',phone:'+7 (8172) 55-66-50',href:'tel:+78172556650'},
 {city:'Череповец',phone:'+7 (8202) 73-02-01',href:'tel:+78202730201'},
]
export const regionalPhoneLabel=(city:string)=>regionalPhones.find(item=>item.city===city)?.phone??'8 800 · номер уточняется'

export const orderedRegionalPhones=(city:string)=>[...regionalPhones].sort((a,b)=>Number(b.city===city)-Number(a.city===city))
