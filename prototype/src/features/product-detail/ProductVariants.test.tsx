import { render, screen } from '@testing-library/react'
import { ProductVariants } from './ProductVariants'

describe('ProductVariants', () => {
  it('does not leave an empty wrapper when a product has no variants', () => {
    const { container } = render(<ProductVariants groups={[]} selections={{}} offers={[]} onChange={() => undefined} />)
    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByRole('group', { name: 'Варианты товара' })).not.toBeInTheDocument()
  })
})
