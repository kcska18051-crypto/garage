import { useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

const defaultPlaceholder = 'Товары, бренды, артикулы'
const examples = ['Компрессоры', 'Краскопульты', 'Подъёмники', 'Инструмент для мастерской']

export function useSearchPlaceholder(enabled: boolean) {
  const [text, setText] = useState(defaultPlaceholder)
  const reduced = useReducedMotion()
  useEffect(() => {
    setText(defaultPlaceholder)
    if (!enabled || reduced) return
    let word = 0
    let letters = 0
    let deleting = false
    let timer: ReturnType<typeof setTimeout>
    const step = () => {
      letters += deleting ? -1 : 1
      setText(examples[word].slice(0, letters))
      let delay = deleting ? 45 : 95
      if (letters === examples[word].length) { deleting = true; delay = 2000 }
      else if (letters === 0) { deleting = false; word = (word + 1) % examples.length; delay = 250 }
      timer = setTimeout(step, delay)
    }
    timer = setTimeout(step, 1500)
    return () => clearTimeout(timer)
  }, [enabled, reduced])
  return enabled && !reduced ? text : defaultPlaceholder
}
