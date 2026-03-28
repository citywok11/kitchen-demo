import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { BottomNav } from './BottomNav'

function renderWithRouter(activeRoute: string, cartCount = 0, onCartClick = vi.fn()) {
  return render(
    <MemoryRouter initialEntries={[activeRoute]}>
      <BottomNav cartItemCount={cartCount} onCartClick={onCartClick} />
    </MemoryRouter>
  )
}

describe('BottomNav', () => {
  it('renders 3 nav items', () => {
    renderWithRouter('/')
    const buttons = screen.getAllByRole('link')
    // 2 links (3D view, catalog) + 1 button (cart)
    expect(buttons).toHaveLength(2)
    expect(screen.getByRole('button', { name: /cart/i })).toBeInTheDocument()
  })

  it('shows cart badge when items exist', () => {
    renderWithRouter('/', 3)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('does not show badge when cart is empty', () => {
    renderWithRouter('/', 0)
    expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument()
  })

  it('calls onCartClick when cart button is pressed', async () => {
    const onCartClick = vi.fn()
    renderWithRouter('/', 1, onCartClick)
    await userEvent.click(screen.getByRole('button', { name: /cart/i }))
    expect(onCartClick).toHaveBeenCalledOnce()
  })
})
