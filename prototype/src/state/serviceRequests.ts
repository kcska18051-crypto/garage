import {profileData} from '../data/profileData'
import type {ServiceRequest,ServiceRequestDraft,ServiceRequestFields} from '../data/serviceTypes'
import {normalizePhoneIdentity} from '../utils/phoneIdentity'

export const serviceRequestStorageKey='garage-service-requests-v1'
export const serviceStatuses=['Новая заявка','Ожидает подтверждения','Уточняем детали','Согласовано','Выполнено','Отменено'] as const
export type ServiceStatus=typeof serviceStatuses[number]
export type ServiceIdentity={phone:string;phoneConfirmed:boolean}
export type ProfileServiceRequest={id:string;number:string;createdAt:string;kind:ServiceRequest['kind'];title:string;itemId:string;status:ServiceStatus;ownerPhone:string|null;submissionId:string;fields:ServiceRequestFields;photoAttached:boolean;seed:boolean}
export type ServiceCreationResult={ok:true;record:ProfileServiceRequest}|{ok:false;error:string}
const fieldLimits={name:100,phone:64,model:200,description:4000,car:200,comment:4000,start:10,end:10,quantity:8} as const
const emptyFields:ServiceRequestFields={name:'',phone:'',model:'',description:'',car:'',comment:'',start:'',end:'',quantity:'1'}
const seedDates=['2026-09-16T09:00:00.000Z','2026-09-12T09:00:00.000Z','2026-08-27T09:00:00.000Z','2026-07-04T09:00:00.000Z']
const seedStatuses:ServiceStatus[]=['Согласовано','Уточняем детали','Уточняем детали','Выполнено']
export const seededServiceRequests:ProfileServiceRequest[]=profileData.serviceRequests.map((item,index)=>({id:item.id,number:item.id,createdAt:seedDates[index],kind:index===0?'paint':index===3?'rental':'repair',title:item.service,itemId:`legacy-${item.id}`,status:seedStatuses[index],ownerPhone:'79000000000',submissionId:`legacy-${item.id}`,fields:{...emptyFields,name:'Демонстрационный клиент',phone:item.contact,comment:`Исторический демопример. Город: ${item.city}. Исходный статус: ${item.status}.`},photoAttached:false,seed:true}))
const isFields=(value:unknown):value is ServiceRequestFields=>Boolean(value&&typeof value==='object'&&Object.entries(fieldLimits).every(([key,limit])=>typeof (value as Record<string,unknown>)[key]==='string'&&((value as Record<string,string>)[key]).length<=limit))
const isRecord=(value:unknown):value is ProfileServiceRequest=>{
  if(!value||typeof value!=='object')return false
  const r=value as ProfileServiceRequest
  return ['id','number','title','itemId','submissionId','createdAt'].every(key=>typeof (r as unknown as Record<string,unknown>)[key]==='string'&&((r as unknown as Record<string,string>)[key]).length<=300)
    &&Boolean(r.id&&r.number&&r.submissionId)&&Number.isFinite(Date.parse(r.createdAt))&&['repair','paint','rental'].includes(r.kind)&&serviceStatuses.includes(r.status)
    &&(r.ownerPhone===null||(typeof r.ownerPhone==='string'&&Boolean(normalizePhoneIdentity(r.ownerPhone))))&&isFields(r.fields)&&typeof r.photoAttached==='boolean'&&typeof r.seed==='boolean'
}
export function readServiceRequests():{records:ProfileServiceRequest[];error:string}{
  try{
    const raw=localStorage.getItem(serviceRequestStorageKey)
    if(raw===null)return{records:seededServiceRequests,error:''}
    if(raw.length>1500000)throw new Error('size')
    const records:unknown=JSON.parse(raw)
    if(!Array.isArray(records)||records.length>104||!records.every(isRecord)||new Set(records.map(r=>r.id)).size!==records.length||new Set(records.map(r=>r.submissionId)).size!==records.length)throw new Error('schema')
    const merged=[...records,...seededServiceRequests.filter(seed=>!records.some(r=>r.id===seed.id))]
    return{records:merged,error:''}
  }catch{return{records:seededServiceRequests,error:'Локальная история недоступна или повреждена. Сохранение приостановлено, существующие данные не перезаписаны.'}}
}
export function saveServiceRequests(records:ProfileServiceRequest[]):string{
  try{
    const raw=JSON.stringify(records)
    if(records.filter(r=>!r.seed).length>100||raw.length>1500000)return'Лимит локальной истории достигнут. Новая заявка не сохранена.'
    localStorage.setItem(serviceRequestStorageKey,raw)
    return''
  }catch{return'Не удалось сохранить заявку в этом браузере. Проверьте доступность локального хранилища и повторите отправку; поля сохранены в открытой форме.'}
}
export function buildServiceRequest(input:ServiceRequestDraft,ownerPhone:string|null):ProfileServiceRequest|null{
  if(!isFields(input.fields)||!input.submissionId||input.submissionId.length>300||!input.request.title||input.request.title.length>300||!input.request.itemId||input.request.itemId.length>300||!['repair','paint','rental'].includes(input.request.kind)||!normalizePhoneIdentity(input.fields.phone))return null
  if(ownerPhone!==null&&!normalizePhoneIdentity(ownerPhone))return null
  const uuid=crypto.randomUUID()
  const now=new Date()
  return{id:`sr-${uuid}`,number:`DEMO-SR-${now.getTime().toString(36).toUpperCase()}-${uuid.slice(0,8).toUpperCase()}`,createdAt:now.toISOString(),kind:input.request.kind,title:input.request.title,itemId:input.request.itemId,status:input.request.kind==='rental'?'Ожидает подтверждения':'Новая заявка',ownerPhone:ownerPhone?normalizePhoneIdentity(ownerPhone):null,submissionId:input.submissionId,fields:Object.fromEntries(Object.keys(fieldLimits).map(key=>[key,input.fields[key as keyof ServiceRequestFields].trim()])) as ServiceRequestFields,photoAttached:input.photoAttached,seed:false}
}
export const serviceRequestHref=(id:string)=>`/profile/services/request/?id=${encodeURIComponent(id)}`
export const canViewServiceRequest=(record:ProfileServiceRequest,identity:ServiceIdentity|null)=>Boolean(identity&&record.ownerPhone&&record.ownerPhone===normalizePhoneIdentity(identity.phone))
