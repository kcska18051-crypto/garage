import { act, renderHook } from '@testing-library/react'
import { useAnimatedClose } from './useAnimatedClose'

let panel: HTMLElement
let animate: ReturnType<typeof vi.fn>
let cancel: ReturnType<typeof vi.fn>
beforeEach(() => {
 vi.useFakeTimers()
 vi.stubGlobal('matchMedia', vi.fn(() => ({matches:true})))
 panel=document.createElement('section');panel.setAttribute('role','dialog');document.body.append(panel)
 cancel=vi.fn();animate=vi.fn(() => ({cancel,finished:Promise.resolve()}))
 Object.defineProperty(panel,'animate',{value:animate})
})
afterEach(() => {panel.remove();vi.useRealTimers();vi.unstubAllGlobals()})
it('finishes a single short exit before dismissing and forwards callback arguments', () => {
 const close=vi.fn<(restoreFocus?:boolean)=>void>()
 const {result}=renderHook(()=>useAnimatedClose(close,()=>panel))
 act(()=>{result.current(false);result.current(false)})
 expect(animate).toHaveBeenCalledTimes(1)
 expect(close).not.toHaveBeenCalled()
 act(()=>vi.advanceTimersByTime(140))
 expect(close).toHaveBeenCalledExactlyOnceWith(false)
 expect(cancel).toHaveBeenCalledOnce()
})
it('dismisses immediately when reduced motion is preferred', () => {
 vi.stubGlobal('matchMedia',vi.fn(()=>({matches:false})))
 const close=vi.fn();const {result}=renderHook(()=>useAnimatedClose(close,()=>panel))
 act(()=>result.current())
 expect(close).toHaveBeenCalledOnce();expect(animate).not.toHaveBeenCalled()
})
it('cancels the exit if navigation unmounts the dialog', () => {
 const close=vi.fn();const {result,unmount}=renderHook(()=>useAnimatedClose(close,()=>panel))
 act(()=>result.current());unmount();act(()=>vi.runAllTimers())
 expect(close).not.toHaveBeenCalled();expect(cancel).toHaveBeenCalledOnce()
})
it('does not animate inline form regions', () => {
 panel.setAttribute('role','region')
 const close=vi.fn();const {result}=renderHook(()=>useAnimatedClose(close,()=>panel))
 act(()=>result.current());expect(close).toHaveBeenCalledOnce();expect(animate).not.toHaveBeenCalled()
})
