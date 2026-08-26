import { BrowserRouter, useInRouterContext } from 'react-router-dom'
import { Header } from '../features/header/Header'
import { AppRoutes } from './routes'

function AppContent() {
  return (
    <div className="app-shell">
      <Header counts={{ favorites: 2, compare: 1, cart: 3 }} />
      <AppRoutes />
      <footer className="prototype-footer">Прототип интернет-магазина</footer>
    </div>
  )
}

export function App() {
  return useInRouterContext() ? <AppContent /> : <BrowserRouter><AppContent /></BrowserRouter>
}
