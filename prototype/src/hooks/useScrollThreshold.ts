import { useEffect, useState } from 'react'

export function useScrollThreshold(threshold: number) {
  const [passed, setPassed] = useState(false)
  useEffect(() => {
    const update = () => setPassed(window.scrollY > threshold)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [threshold])
  return passed
}
