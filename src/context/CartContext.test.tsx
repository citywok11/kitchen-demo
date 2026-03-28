import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { CartProvider, useCart } from './CartContext'
import type { Product } from '../data/products'

const mockProduct: Product = {
  id: 'knife-set',
  name: 'Knife Set',
  price: 89.99,
  description: 'A knife set',
  specs: { Material: 'Steel' },
  meshName: 'KnifeSet',
  imagePath: '/images/knife-set.jpg',
}

const mockProduct2: Product = {
  id: 'toaster',
  name: 'Toaster',
  price: 59.99,
  description: 'A toaster',
  specs: { Material: 'Steel' },
  meshName: 'Toaster',
  imagePath: '/images/toaster.jpg',
}

function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}

describe('CartContext', () => {
  it('starts with an empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    expect(result.current.items).toEqual([])
    expect(result.current.totalItems).toBe(0)
    expect(result.current.totalPrice).toBe(0)
  })

  it('adds an item with quantity 1', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(mockProduct))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].product.id).toBe('knife-set')
    expect(result.current.items[0].quantity).toBe(1)
  })

  it('increments quantity when adding the same item again', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(mockProduct))
    act(() => result.current.addItem(mockProduct))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
  })

  it('removes an item', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(mockProduct))
    act(() => result.current.removeItem('knife-set'))
    expect(result.current.items).toEqual([])
  })

  it('updates quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(mockProduct))
    act(() => result.current.updateQuantity('knife-set', 5))
    expect(result.current.items[0].quantity).toBe(5)
  })

  it('removes item when quantity is updated to 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(mockProduct))
    act(() => result.current.updateQuantity('knife-set', 0))
    expect(result.current.items).toEqual([])
  })

  it('calculates totalItems as sum of quantities', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(mockProduct))
    act(() => result.current.addItem(mockProduct))
    act(() => result.current.addItem(mockProduct2))
    expect(result.current.totalItems).toBe(3)
  })

  it('calculates totalPrice correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(mockProduct))
    act(() => result.current.addItem(mockProduct2))
    expect(result.current.totalPrice).toBeCloseTo(149.98)
  })

  it('clears the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(mockProduct))
    act(() => result.current.addItem(mockProduct2))
    act(() => result.current.clearCart())
    expect(result.current.items).toEqual([])
    expect(result.current.totalItems).toBe(0)
    expect(result.current.totalPrice).toBe(0)
  })
})
