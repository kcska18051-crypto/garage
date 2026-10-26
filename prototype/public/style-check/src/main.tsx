import { createRoot } from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { CommerceProvider, useCommerce } from '../../../src/state/CommerceState'
import { RegionProvider } from '../../../src/state/RegionState'
import { ProfileProvider, useProfile } from '../../../src/state/ProfileState'
import { AuthProvider, useAuth } from '../../../src/state/AuthState'
import { CookiePreferenceProvider } from '../../../src/state/CookiePreferenceState'
import { CookieBanner } from '../../../src/features/cookie/CookieBanner'
import { Footer } from '../../../src/features/footer/Footer'
import { AppRoutes } from '../../../src/app/routes'
import { Header } from './Header'
import { Home } from './Home'
import '../../../src/styles/tokens.css'
import '../../../src/styles/global.css'
import '../../../src/features/home/NavigationSections.css'
import '../../../src/features/home/LowerSections.css'
import './style.css'

function Content() {
  const commerce = useCommerce()
  const location = useLocation()
  const { identity } = useAuth()
  const { claimServiceRequests } = useProfile()
  useEffect(() => { if (identity) claimServiceRequests(identity) }, [identity, claimServiceRequests])
  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])
  const home = ['/', '/style-check', '/style-check/'].includes(location.pathname)
  return <div className="app-shell sc-app" data-style-check><Header counts={{ favorites: commerce.favoriteIds.size, compare: commerce.compareIds.size, cart: commerce.cartCount }} />{home ? <Home /> : <AppRoutes />}<Footer /><CookieBanner /></div>
}
const basename = window.location.pathname.startsWith('/garage/') ? '/garage' : '/'
createRoot(document.getElementById('root')!).render(<BrowserRouter basename={basename}><CookiePreferenceProvider><RegionProvider><CommerceProvider><ProfileProvider><AuthProvider><Content /></AuthProvider></ProfileProvider></CommerceProvider></RegionProvider></CookiePreferenceProvider></BrowserRouter>)
