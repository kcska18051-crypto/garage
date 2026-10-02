import { BrowserRouter, useInRouterContext } from 'react-router-dom'
import { Header } from '../features/header/Header'
import { CommerceProvider, useCommerce } from '../state/CommerceState'
import { Footer } from '../features/footer/Footer'
import { AppRoutes } from './routes'
import { RegionProvider } from '../state/RegionState'
import { ProfileProvider } from '../state/ProfileState'
import { AuthProvider } from '../state/AuthState'

function AppContent() {
  const commerce = useCommerce()
  return (
    <div className="app-shell">
      <Header counts={{ favorites: commerce.favoriteIds.size, compare: commerce.compareIds.size, cart: commerce.cartCount }} />
      <AppRoutes />
      <Footer />
    </div>
  )
}

export function routerBasename(baseUrl: string) {
  return baseUrl === '/' ? '/' : `/${baseUrl.replace(/^\/+|\/+$/g, '')}`
}

export function App() {
  const content = <RegionProvider><CommerceProvider><ProfileProvider><AuthProvider><AppContent /></AuthProvider></ProfileProvider></CommerceProvider></RegionProvider>
  return useInRouterContext() ? content : <BrowserRouter basename={routerBasename(import.meta.env.BASE_URL)}>{content}</BrowserRouter>
}
