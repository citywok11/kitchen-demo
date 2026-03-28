import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { BottomNav } from './components/BottomNav/BottomNav'
import { CartOverlay } from './components/CartOverlay/CartOverlay'
import { useCart } from './context/CartContext'

export function AppLayout() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } =
    useCart()
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <>
      <Outlet />
      <BottomNav
        cartItemCount={totalItems}
        onCartClick={() => setCartOpen(true)}
      />
      <CartOverlay
        isOpen={cartOpen}
        items={items}
        totalPrice={totalPrice}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </>
  )
}
