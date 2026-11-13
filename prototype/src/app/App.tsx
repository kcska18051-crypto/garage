import { ApprovedHomepageStyles, isApprovedHomepage } from './approvedHomepage'
import { BrowserRouter, useInRouterContext, useLocation } from 'react-router-dom'
import { Header } from '../features/header/Header'
import { CommerceProvider, useCommerce } from '../state/CommerceState'
import { Footer } from '../features/footer/Footer'
import { AppRoutes } from './routes'
import { RegionProvider } from '../state/RegionState'
import { ProfileProvider } from '../state/ProfileState'
import { AuthProvider,useAuth } from '../state/AuthState'
import {useEffect, type ReactNode} from 'react'
import {useProfile} from '../state/ProfileState'
import { CookiePreferenceProvider } from '../state/CookiePreferenceState'
import { CookieBanner } from '../features/cookie/CookieBanner'
import '../features/dialogs/ApprovedDialogs.css'

function AppContent() {
  const pathname = useLocation().pathname
  const isStyleCheck = isApprovedHomepage(pathname)
  const usesApprovedStyles = isStyleCheck || pathname.replace(/\/$/, '') === '/about'
  const commerce = useCommerce()
  const {identity}=useAuth()
  const {claimServiceRequests}=useProfile()
  useEffect(()=>{if(identity)claimServiceRequests(identity)},[identity,claimServiceRequests])
  return (
    <div
      className="app-shell"
      data-style-check={usesApprovedStyles || undefined}
      data-approved-chrome="true"
    >
      {usesApprovedStyles && <ApprovedHomepageStyles />}
      <link rel="stylesheet" href="/garage/style-check/approved-chrome.css?v=20261113-palette" />
      <link rel="stylesheet" href="/garage/style-check/interface-palette.css?v=20261113-client-demo" />
      <link rel="stylesheet" href="/garage/style-check/interaction-feedback.css?v=20261113-client-demo" />
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
  const content = <CookiePreferenceProvider><RegionProvider><CommerceProvider><AuthProvider><ProfileWithIdentity><AppContent /></ProfileWithIdentity></AuthProvider></CommerceProvider></RegionProvider></CookiePreferenceProvider>
  return useInRouterContext() ? content : <BrowserRouter basename={routerBasename(import.meta.env.BASE_URL)}>{content}</BrowserRouter>
}

function ProfileWithIdentity({ children }: { children: ReactNode }) {
  const { identity } = useAuth()
  return <ProfileProvider ownerPhone={identity?.phone}>{children}</ProfileProvider>
}
