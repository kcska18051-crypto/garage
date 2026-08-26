import { BrowserRouter, useInRouterContext } from 'react-router-dom'
import { AppRoutes } from './routes'

function AppContent() {
  return (
    <div className="app-shell">
      <header className="prototype-bar">
        <span className="prototype-mark" aria-hidden="true" />
        <span>Интерактивный прототип</span>
      </header>
      <AppRoutes />
      <footer className="prototype-footer">Прототип интернет-магазина</footer>
    </div>
  )
}

export function App() {
  return useInRouterContext() ? <AppContent /> : <BrowserRouter><AppContent /></BrowserRouter>
}
