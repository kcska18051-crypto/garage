import { createContext, useContext, useState, type ReactNode } from 'react'

export type CookieChoice = 'all' | 'necessary'

type CookiePreferenceValue = {
  choice: CookieChoice | null
  isOpen: boolean
  choose(choice: CookieChoice): void
  openSettings(): void
}

const storageKey = 'garage-cookie-preference'
const storageVersion = 1

function readChoice(): CookieChoice | null {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? 'null') as { version?: number; choice?: string } | null
    return stored?.version === storageVersion && (stored.choice === 'all' || stored.choice === 'necessary') ? stored.choice : null
  } catch {
    return null
  }
}

const CookiePreferenceContext = createContext<CookiePreferenceValue>({
  choice: null,
  isOpen: false,
  choose: () => undefined,
  openSettings: () => undefined,
})

export function CookiePreferenceProvider({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<CookieChoice | null>(readChoice)
  const [isOpen, setIsOpen] = useState(() => choice === null)

  const choose = (nextChoice: CookieChoice) => {
    setChoice(nextChoice)
    setIsOpen(false)
    try {
      localStorage.setItem(storageKey, JSON.stringify({ version: storageVersion, choice: nextChoice }))
    } catch {
      // Storage can be unavailable. The in-memory choice still keeps the prototype usable.
    }
  }

  return <CookiePreferenceContext.Provider value={{ choice, isOpen, choose, openSettings: () => setIsOpen(true) }}>{children}</CookiePreferenceContext.Provider>
}

export function useCookiePreference() {
  return useContext(CookiePreferenceContext)
}
