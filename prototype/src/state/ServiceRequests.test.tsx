import {render,cleanup,act} from '@testing-library/react'
import {CommerceProvider} from './CommerceState'
import {ProfileProvider,useProfile} from './ProfileState'

let profile:ReturnType<typeof useProfile>
function Capture(){profile=useProfile();return null}
const open=()=>render(<CommerceProvider><ProfileProvider><Capture/></ProfileProvider></CommerceProvider>)
const draft=(submissionId='one')=>({submissionId,request:{kind:'repair' as const,title:'Ремонт винтовых компрессоров',itemId:'screw'},fields:{name:'Демо',phone:'+7 (999) 123-45-67',model:'Модель-пример',description:'Не включается',car:'',comment:'',start:'',end:'',quantity:'1'},photoAttached:true})
beforeEach(()=>localStorage.clear())
it('creates one stable persisted request for a double submission and restores it on remount',()=>{
  const view=open()
  expect(profile.createServiceRequest).toBeTypeOf('function')
  let first:ReturnType<typeof profile.createServiceRequest>
  act(()=>{first=profile.createServiceRequest(draft(),'79000000000')})
  expect(first!.ok).toBe(true);if(!first!.ok)return
  const record=first!.record
  expect(record.status).toBe('Новая заявка')
  expect(record.number).toMatch(/^DEMO-SR-/)
  expect(record.fields.model).toBe('Модель-пример')
  expect(record.photoAttached).toBe(true)
  act(()=>{const second=profile.createServiceRequest(draft(),'79000000000');expect(second.ok&&second.record.id).toBe(record.id)})
  expect(profile.serviceRequests.filter(r=>r.submissionId==='one')).toHaveLength(1)
  view.unmount();open()
  expect(profile.serviceRequests.find(r=>r.id===record.id)).toEqual(record)
})
it('claims only a matching unowned guest request after explicit phone confirmation',()=>{
  open();expect(profile.createServiceRequest).toBeTypeOf('function')
  act(()=>{profile.createServiceRequest(draft(),null)})
  act(()=>{profile.claimServiceRequests({phone:'79000000000',phoneConfirmed:true})})
  expect(profile.serviceRequests.find(r=>r.submissionId==='one')?.ownerPhone).toBeNull()
  act(()=>{profile.claimServiceRequests({phone:'79991234567',phoneConfirmed:false})})
  expect(profile.serviceRequests.find(r=>r.submissionId==='one')?.ownerPhone).toBeNull()
  act(()=>{profile.claimServiceRequests({phone:'79991234567',phoneConfirmed:true})})
  expect(profile.serviceRequests.find(r=>r.submissionId==='one')?.ownerPhone).toBe('79991234567')
  act(()=>{profile.claimServiceRequests({phone:'79000000000',phoneConfirmed:true})})
  expect(profile.serviceRequests.find(r=>r.submissionId==='one')?.ownerPhone).toBe('79991234567')
})
it('does not report success or mutate the source when storage quota fails; retry works',()=>{
  open();expect(profile.createServiceRequest).toBeTypeOf('function')
  const set=vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new DOMException('Quota','QuotaExceededError')})
  const before=profile.serviceRequests.length
  act(()=>{const result=profile.createServiceRequest(draft(),'79000000000');expect(result.ok).toBe(false);if(!result.ok)expect(result.error).toMatch(/сохран/i)})
  expect(profile.serviceRequests).toHaveLength(before)
  set.mockRestore()
  act(()=>{expect(profile.createServiceRequest(draft(),'79000000000').ok).toBe(true)})
})
it('does not overwrite malformed local history or accept huge fields',()=>{
  localStorage.setItem('garage-service-requests-v1','broken-json')
  open();expect(profile.createServiceRequest).toBeTypeOf('function')
  act(()=>{expect(profile.createServiceRequest(draft(),null).ok).toBe(false)})
  expect(localStorage.getItem('garage-service-requests-v1')).toBe('broken-json')
  cleanup();localStorage.clear();open()
  const input=draft();input.fields.description='x'.repeat(4001)
  act(()=>{expect(profile.createServiceRequest(input,null).ok).toBe(false)})
})
it('starts rental awaiting confirmation and keeps all legacy request IDs in the same source',()=>{
  open();expect(profile.createServiceRequest).toBeTypeOf('function')
  act(()=>{const input={...draft(),request:{kind:'rental' as const,title:'Домкрат',itemId:'hydraulic-jack'}};const result=profile.createServiceRequest(input,'79000000000');expect(result.ok&&result.record.status).toBe('Ожидает подтверждения')})
  for(const id of ['SR-104','SR-098','SR-082','SR-041'])expect(profile.serviceRequests.some(r=>r.id===id)).toBe(true)
})
it('does not overwrite history corrupted after this tab was opened',()=>{
  open()
  localStorage.setItem('garage-service-requests-v1','external-corruption')
  act(()=>{expect(profile.createServiceRequest(draft(),null).ok).toBe(false)})
  expect(localStorage.getItem('garage-service-requests-v1')).toBe('external-corruption')
})
