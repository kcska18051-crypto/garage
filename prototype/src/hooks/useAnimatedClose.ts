import { useCallback, useEffect, useRef } from 'react'

/** Animate only an explicit dismissal. Route changes and reduced motion stay immediate. */
export function useAnimatedClose<Args extends unknown[]>(onClose: (...args: Args) => void, getPanel?: () => HTMLElement | null) {
  const latest = useRef({ onClose, getPanel })
  latest.current = { onClose, getPanel }
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null)
  const animations = useRef<Animation[]>([])
  useEffect(() => () => {
    if (pending.current) clearTimeout(pending.current)
    animations.current.forEach(animation => animation.cancel())
  }, [])
  return useCallback((...args: Args) => {
    if (pending.current) return
    const panel = latest.current.getPanel ? latest.current.getPanel() : [...document.querySelectorAll<HTMLElement>('[role="dialog"],dialog[open]')].at(-1) ?? null
    if (!panel || !panel.matches('[role=dialog],dialog[open]') || typeof panel.animate !== 'function' || !window.matchMedia?.('(prefers-reduced-motion: no-preference)').matches) {
      latest.current.onClose(...args); return
    }
    const surface = panel.querySelector<HTMLElement>('.proposal-modal,.product-gallery-modal__content') ?? panel
    const offset = surface.matches('.unified-site-menu') ? '12px 0' : '0 6px'
    panel.dataset.motionClosing = 'true'
    animations.current.push(surface.animate([{opacity:getComputedStyle(surface).opacity,translate:'0 0'}, {opacity:0,translate:offset}], {duration:140,easing:'cubic-bezier(.2,.7,.2,1)',fill:'forwards'}))
    const backdrop = panel.parentElement?.matches('.overlay,.auth-backdrop,.profile-dialog-backdrop,.region-overlay,.catalog-filter-drawer') ? panel.parentElement : surface !== panel ? panel : null
    if (backdrop) animations.current.push(backdrop.animate([{opacity:getComputedStyle(backdrop).opacity},{opacity:0}],{duration:140,fill:'forwards'}))
    animations.current.forEach(animation => { void animation.finished.catch(() => {}) })
    pending.current = setTimeout(() => {
      pending.current = null
      latest.current.onClose(...args)
      animations.current.forEach(animation => animation.cancel())
      animations.current = []
      delete panel.dataset.motionClosing
    },140)
  }, [])
}
