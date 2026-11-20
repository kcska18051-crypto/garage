import { useCallback, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { useOptionalAuth } from '../state/AuthState'
import { useOptionalProfile } from '../state/ProfileState'

/** Defaults are available only to the signed-in customer, never to guests. */
export function useCustomerFormDefaults() {
  const auth = useOptionalAuth()
  const profile = useOptionalProfile()
  if (!auth?.isAuthenticated) return { name: '', email: '', phone: '' }
  return {
    name: profile?.user.firstName ?? '',
    email: profile?.user.email ?? '',
    phone: auth.identity?.phone ? `+${auth.identity.phone}` : profile?.user.phone ?? '',
  }
}

/** Follow account defaults until this field is edited; even a manual clear is preserved. */
export function useCustomerField(defaultValue: string, initialValue?: string, preserveEmptyInitial = false): [string, Dispatch<SetStateAction<string>>] {
  const edited = useRef(initialValue !== undefined && (preserveEmptyInitial || initialValue !== ''))
  const [value, setValue] = useState(initialValue ?? '')
  const setField = useCallback<Dispatch<SetStateAction<string>>>(next => {
    const wasEdited = edited.current
    edited.current = true
    setValue(current => typeof next === 'function' ? next(wasEdited ? current : defaultValue) : next)
  }, [defaultValue])
  return [edited.current ? value : defaultValue, setField]
}
