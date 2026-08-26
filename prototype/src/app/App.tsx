import { BrowserRouter, useInRouterContext } from 'react-router-dom'
import { Header } from '../features/header/Header'
import { CommerceProvider, useCommerce } from '../state/CommerceState'
import { AppRoutes } from './routes'

function AppContent() {
  const commerce = useCommerce()
  return (
    <div className="app-shell">
      <Header counts={{ favorites: commerce.favoriteIds.size, compare: commerce.compareIds.size, cart: commerce.cartIds.size }} />
      <AppRoutes />
      <footer className="prototype-footer">Прототип интернет-магазина</footer>
    </div>
  )
}

export function App() {
  const content = <CommerceProvider><AppContent /></CommerceProvider>
  return useInRouterContext() ? content : <BrowserRouter>{content}</BrowserRouter>
}
