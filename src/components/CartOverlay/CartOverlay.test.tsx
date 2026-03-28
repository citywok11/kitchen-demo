import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartOverlay } from './CartOverlay'
import type { CartItem } from '../../context/CartContext'

const mockItems: CartItem[] = [
  {
    product: {
      id: 'knife-set',
      name: 'Knife Set',
      price: 89.99,
      description: 'A knife set',
      specs: {},
      meshName: 'KnifeSet',
      imagePath: '/images/knife-set.jpg',
    },
    quantity: 1,
  },
  {
    product: {
      id: 'toaster',
      name: 'Toaster',
      price: 59.99,
      description: 'A toaster',
      specs: {},
      meshName: 'Toaster',
      imagePath: '/images/toaster.jpg',
    },
    quantity: 2,
  },
]

describe('CartOverlay', () => {
  it('renders nothing when not open', () => {
    const { container } = render(
      <CartOverlay
        isOpen={false}
        items={[]}
        totalPrice={0}
        onClose={vi.fn()}
        onUpdateQuantity={vi.fn()}
        onRemoveItem={vi.fn()}
      />
    )
    expect(container.querySelector('.cart-overlay')).not.toBeInTheDocument()
  })

  it('shows empty state when cart is empty', () => {
    render(
      <CartOverlay
        isOpen={true}
        items={[]}
        totalPrice={0}
        onClose={vi.fn()}
        onUpdateQuantity={vi.fn()}
        onRemoveItem={vi.fn()}
      />
    )
    expect(screen.getByText(/cart is empty/i)).toBeInTheDocument()
  })

  it('renders cart items with names and prices', () => {
    render(
      <CartOverlay
        isOpen={true}
        items={mockItems}
        totalPrice={209.97}
        onClose={vi.fn()}
        onUpdateQuantity={vi.fn()}
        onRemoveItem={vi.fn()}
      />
    )
    expect(screen.getByText('Knife Set')).toBeInTheDocument()
    expect(screen.getByText('Toaster')).toBeInTheDocument()
    expect(screen.getByText('$209.97')).toBeInTheDocument()
  })

  it('shows item count in header', () => {
    render(
      <CartOverlay
        isOpen={true}
        items={mockItems}
        totalPrice={209.97}
        onClose={vi.fn()}
        onUpdateQuantity={vi.fn()}
        onRemoveItem={vi.fn()}
      />
    )
    expect(screen.getByText(/cart \(2\)/i)).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn()
    render(
      <CartOverlay
        isOpen={true}
        items={mockItems}
        totalPrice={209.97}
        onClose={onClose}
        onUpdateQuantity={vi.fn()}
        onRemoveItem={vi.fn()}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
