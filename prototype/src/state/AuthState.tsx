import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthDialog } from '../features/auth/AuthDialog'
import { normalizePhoneIdentity } from '../utils/phoneIdentity'

export type AuthIntent = 'login' | 'register' | 'recovery'
export type AuthIdentity = { phone: string; phoneConfirmed: boolean }
type AuthOptions = { returnTo?: string; requirePhoneConfirmation?: boolean }
type AuthContextValue = {
  isOpen: boolean
  isAuthenticated: boolean
  identity: AuthIdentity | null
  status: string
  openAuth(intent?: AuthIntent, options?: AuthOptions): void
  closeAuth(): void
  completeAuth(message: string, identity?: AuthIdentity): void
  logout(): void
}

const AuthContext = createContext<AuthContextValue | null>(null)
export const demoSessionKey = 'garage-auth-demo-session-v1'
export const demoIdentityKey = 'garage-auth-demo-identity-v1'
const defaultIdentity: AuthIdentity = { phone: '79000000000', phoneConfirmed: false }
function validIdentity(value: unknown): AuthIdentity | null {
  if (!value || typeof value !== 'object') return null
  const candidate = value as Partial<AuthIdentity>
  if (typeof candidate.phone !== 'string' || typeof candidate.phoneConfirmed !== 'boolean') return null
  const phone = normalizePhoneIdentity(candidate.phone)
  return phone ? { phone, phoneConfirmed: candidate.phoneConfirmed } : null
}
function readDemoIdentity(): AuthIdentity | null {
  try {
    if (sessionStorage.getItem(demoSessionKey) !== 'active') return null
    const raw = sessionStorage.getItem(demoIdentityKey)
    if (!raw || raw.length > 256) return defaultIdentity
    try { return validIdentity(JSON.parse(raw)) ?? defaultIdentity } catch { return defaultIdentity }
  } catch { return null }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [request, setRequest] = useState<({ intent: AuthIntent; revision: number } & AuthOptions) | null>(null)
  const [identity, setIdentity] = useState<AuthIdentity | null>(readDemoIdentity)
  const isAuthenticated = identity !== null
  const [status, setStatus] = useState('')
  const openerRef = useRef<HTMLElement | null>(null)
  const closeAuth = useCallback(() => {
    setRequest(null)
    window.setTimeout(() => openerRef.current?.isConnected && openerRef.current.focus(), 0)
  }, [])
  const openAuth = useCallback((intent: AuthIntent = 'login', options?: AuthOptions) => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setStatus('')
    setRequest((current) => ({ intent, returnTo: options?.returnTo, requirePhoneConfirmation: options?.requirePhoneConfirmation, revision: (current?.revision ?? 0) + 1 }))
  }, [])
  const completeAuth = useCallback((message: string, confirmedIdentity?: AuthIdentity) => {
    const nextIdentity = validIdentity(confirmedIdentity) ?? defaultIdentity
    if (request?.requirePhoneConfirmation && !nextIdentity.phoneConfirmed) return
    const returnTo = request?.returnTo
    setIdentity(nextIdentity)
    try {
      sessionStorage.removeItem(demoIdentityKey)
      sessionStorage.setItem(demoIdentityKey, JSON.stringify(nextIdentity))
      sessionStorage.setItem(demoSessionKey, 'active')
    } catch { /* In-memory session when storage is unavailable. */ }
    setStatus(message)
    setRequest(null)
    if (returnTo) navigate(returnTo)
  }, [navigate, request])
  const logout = useCallback(() => {
    try { sessionStorage.removeItem(demoSessionKey) } catch { /* In-memory logout still works. */ }
    try { sessionStorage.removeItem(demoIdentityKey) } catch { /* In-memory logout still works. */ }
    setRequest(null); setIdentity(null); setStatus('Вы вышли из демонстрационного профиля')
  }, [])

  return <AuthContext.Provider value={{ isOpen: Boolean(request), isAuthenticated, identity, status, openAuth, closeAuth, completeAuth, logout }}>
    {children}
    {status && <p className="auth-toast" role="status">{status}</p>}
    {request && <AuthDialog key={request.revision} intent={request.intent} requirePhoneConfirmation={request.requirePhoneConfirmation} onClose={closeAuth} onComplete={completeAuth} />}
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
