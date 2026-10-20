import { demoSessionKey } from '../state/AuthState'

// Explicit fixture for tests whose subject is an already signed-in demo account.
export const seedDemoSession = () => sessionStorage.setItem(demoSessionKey,'active')
