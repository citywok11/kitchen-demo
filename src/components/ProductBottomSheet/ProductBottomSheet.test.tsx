import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductBottomSheet } from './ProductBottomSheet'
import type { Product } from '../../data/products'

const mockProduct: Product = {
  id: 'knife-set',
  name: 'Knife Set',
  price: 89.99,
  description: 'A premium knife set',
  specs: { Material: 'Steel', Weight: '1.2 kg' },
  meshName: 'KnifeSet',
  imagePath: '/images/knife-set.jpg',
}

describe('ProductBottomSheet', () => {
  it('renders nothing when no product is provided', () => {
    const { container } = render(
      <ProductBottomSheet product={null} onClose={vi.fn()} onAddToCart={vi.fn()} />
    )
    expect(container.querySelector('.bottom-sheet')).not.toBeInTheDocument()
  })

  it('renders product details when product is provided', () => {
    render(
      <ProductBottomSheet
        product={mockProduct}
        onClose={vi.fn()}
        onAddToCart={vi.fn()}
      />
    )
    expect(screen.getByText('Knife Set')).toBeInTheDocument()
    expect(screen.getByText('$89.99')).toBeInTheDocument()
    expect(screen.getByText('A premium knife set')).toBeInTheDocument()
    expect(screen.getByText('Steel')).toBeInTheDocument()
    expect(screen.getByText('1.2 kg')).toBeInTheDocument()
  })

  it('calls onAddToCart when Add to Cart is clicked', async () => {
    const onAddToCart = vi.fn()
    render(
      <ProductBottomSheet
        product={mockProduct}
        onClose={vi.fn()}
        onAddToCart={onAddToCart}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: /add to cart/i }))
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct)
  })

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn()
    render(
      <ProductBottomSheet
        product={mockProduct}
        onClose={onClose}
        onAddToCart={vi.fn()}
      />
    )
    await userEvent.click(screen.getByTestId('bottom-sheet-backdrop'))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
