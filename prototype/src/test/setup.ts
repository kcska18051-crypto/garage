import '@testing-library/jest-dom/vitest'
beforeEach(() => { localStorage.removeItem('garage-cart-v2'); localStorage.removeItem('garage-checkout-v2'); localStorage.removeItem('garage-favorites-v1'); localStorage.removeItem('garage-service-requests-v1'); sessionStorage.removeItem('garage-auth-demo-session-v1');sessionStorage.removeItem('garage-auth-demo-identity-v1') })
