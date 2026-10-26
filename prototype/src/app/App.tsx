import { BrowserRouter, useInRouterContext, useLocation } from 'react-router-dom'
import { Header } from '../features/header/Header'
import { CommerceProvider, useCommerce } from '../state/CommerceState'
import { Footer } from '../features/footer/Footer'
import { AppRoutes } from './routes'
import { RegionProvider } from '../state/RegionState'
import { ProfileProvider } from '../state/ProfileState'
import { AuthProvider,useAuth } from '../state/AuthState'
import {useEffect} from 'react'
import {useProfile} from '../state/ProfileState'
import { CookiePreferenceProvider } from '../state/CookiePreferenceState'
import { CookieBanner } from '../features/cookie/CookieBanner'

function blockStyleCheckInteraction(event: { target: EventTarget | null; preventDefault: () => void; stopPropagation: () => void }) {
  if (event.target instanceof Element && event.target.closest('.cookie-banner__actions button')) return
  event.preventDefault()
  event.stopPropagation()
}

function AppContent() {
  const isStyleCheck = useLocation().pathname.replace(/\/$/, '') === '/style-check'
  const commerce = useCommerce()
  const {identity}=useAuth()
  const {claimServiceRequests}=useProfile()
  useEffect(()=>{if(identity)claimServiceRequests(identity)},[identity,claimServiceRequests])
  return (
    <div
      className="app-shell"
      data-style-check={isStyleCheck || undefined}
      onClickCapture={isStyleCheck ? blockStyleCheckInteraction : undefined}
      onAuxClickCapture={isStyleCheck ? blockStyleCheckInteraction : undefined}
      onSubmitCapture={isStyleCheck ? blockStyleCheckInteraction : undefined}
      onContextMenuCapture={isStyleCheck ? blockStyleCheckInteraction : undefined}
      onKeyDownCapture={isStyleCheck ? (event) => {
        if (event.key === 'Enter' || event.key === ' ') blockStyleCheckInteraction(event)
      } : undefined}
    >
      <Header counts={{ favorites: commerce.favoriteIds.size, compare: commerce.compareIds.size, cart: commerce.cartCount }} />
      <AppRoutes />
      <Footer />
      <CookieBanner />
    </div>
  )
}

export function routerBasename(baseUrl: string) {
  return baseUrl === '/' ? '/' : `/${baseUrl.replace(/^\/+|\/+$/g, '')}`
}

export function App() {
  const content = <CookiePreferenceProvider><RegionProvider><CommerceProvider><ProfileProvider><AuthProvider><AppContent /></AuthProvider></ProfileProvider></CommerceProvider></RegionProvider></CookiePreferenceProvider>
  return useInRouterContext() ? content : <BrowserRouter basename={routerBasename(import.meta.env.BASE_URL)}>{content}</BrowserRouter>
}
