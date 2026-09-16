import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { catalogCategories } from '../../data/catalogData'
import { CatalogRootCard } from './CatalogRootCard'

describe('CatalogRootCard', () => {
  it('shows five links and exposes the remaining links with an accessible button', async () => {
    render(<MemoryRouter><CatalogRootCard category={catalogCategories[0]} /></MemoryRouter>)

    const button = screen.getByRole('button', { name: /Ещё \d+ категорий/ })
    const extraLink = screen.getByRole('link', { name: catalogCategories[0].subcategories[5].name, hidden: true })
    const extraListId = button.getAttribute('aria-controls')

    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(extraListId).toBeTruthy()
    expect(document.getElementById(extraListId!)).toHaveAttribute('hidden')
    expect(extraLink).not.toBeVisible()

    await userEvent.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(extraLink).toBeVisible()
    expect(button).toHaveTextContent('Свернуть')
  })

  it('keeps another card collapsed when one card expands', async () => {
    render(
      <MemoryRouter>
        <CatalogRootCard category={catalogCategories[0]} />
        <CatalogRootCard category={catalogCategories[1]} />
      </MemoryRouter>,
    )

    const buttons = screen.getAllByRole('button', { name: /Ещё \d+ категорий/ })
    await userEvent.click(buttons[0])

    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true')
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'false')
  })
})
