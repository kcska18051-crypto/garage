import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthDialog } from '../features/auth/AuthDialog'

export type AuthIntent = 'login' | 'register' | 'recovery'
type AuthContextValue = {
  isOpen: boolean
  isAuthenticated: boolean
  status: string
  openAuth(intent?: AuthIntent, options?: { returnTo?: string }): void
  closeAuth(): void
  completeAuth(message: string): void
  logout(): void
}

const AuthContext = createContext<AuthContextValue | null>(null)
export const demoSessionKey = 'garage-auth-demo-session-v1'
const readDemoSession = () => { try { return sessionStorage.getItem(demoSessionKey) === 'active' } catch { return false } }

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [request, setRequest] = useState<{ intent: AuthIntent; revision: number; returnTo?: string } | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(readDemoSession)
  const [status, setStatus] = useState('')
  const openerRef = useRef<HTMLElement | null>(null)
  const closeAuth = useCallback(() => {
    setRequest(null)
    window.setTimeout(() => openerRef.current?.isConnected && openerRef.current.focus(), 0)
  }, [])
  const openAuth = useCallback((intent: AuthIntent = 'login', options?: { returnTo?: string }) => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setStatus('')
    setRequest((current) => ({ intent, returnTo: options?.returnTo, revision: (current?.revision ?? 0) + 1 }))
  }, [])
  const completeAuth = useCallback((message: string) => {
    const returnTo = request?.returnTo
    setIsAuthenticated(true)
    try { sessionStorage.setItem(demoSessionKey,'active') } catch { /* In-memory session when storage is unavailable. */ }
    setStatus(message)
    setRequest(null)
    if (returnTo) navigate(returnTo)
  }, [navigate, request])
  const logout = useCallback(() => {
    try { sessionStorage.removeItem(demoSessionKey) } catch { /* In-memory logout still works. */ }
    setRequest(null); setIsAuthenticated(false); setStatus('Вы вышли из демонстрационного профиля')
  }, [])

  return <AuthContext.Provider value={{ isOpen: Boolean(request), isAuthenticated, status, openAuth, closeAuth, completeAuth, logout }}>
    {children}
    {status && <p className="auth-toast" role="status">{status}</p>}
    {request && <AuthDialog key={request.revision} intent={request.intent} onClose={closeAuth} onComplete={completeAuth} />}
  </AuthContext.Provider>
}

export function AuthRouteBridge({ intent }: { intent: AuthIntent }) {
  const navigate = useNavigate()
  const { openAuth } = useAuth()
  useEffect(() => { openAuth(intent, { returnTo: '/profile' }); navigate('/', { replace: true }) }, [intent, navigate, openAuth])
  return null
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
