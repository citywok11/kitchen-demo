import { useState, useEffect, useRef } from 'react'
import type { Product } from '../../data/products'
import './ProductBottomSheet.css'

interface ProductBottomSheetProps {
  product: Product | null
  onClose: () => void
  onAddToCart: (product: Product) => void
}

export function ProductBottomSheet({
  product,
  onClose,
  onAddToCart,
}: ProductBottomSheetProps) {
  // Track the product to display (persists during close animation)
  const [displayProduct, setDisplayProduct] = useState<Product | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const closingTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (product) {
      // Opening: show immediately
      setDisplayProduct(product)
      setIsClosing(false)
      if (closingTimeout.current) clearTimeout(closingTimeout.current)
    } else if (displayProduct) {
      // Closing: start animation, then unmount
      setIsClosing(true)
      closingTimeout.current = setTimeout(() => {
        setDisplayProduct(null)
        setIsClosing(false)
      }, 280) // match CSS animation duration
    }
  }, [product]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!displayProduct) return null

  const containerClass = `bottom-sheet-container${isClosing ? ' bottom-sheet-container--closing' : ''}`

  return (
    <div className={containerClass}>
      <div
        className="bottom-sheet-backdrop"
        data-testid="bottom-sheet-backdrop"
        onClick={onClose}
      />
      <div className={`bottom-sheet${isClosing ? ' bottom-sheet--closing' : ''}`}>
        <div className="bottom-sheet__handle" />
        <div className="bottom-sheet__header">
          <h2 className="bottom-sheet__title">{displayProduct.name}</h2>
          <span className="bottom-sheet__price">
            ${displayProduct.price.toFixed(2)}
          </span>
        </div>
        <div className="bottom-sheet__specs">
          {Object.entries(displayProduct.specs).map(([key, value]) => (
            <div key={key} className="bottom-sheet__spec-row">
              <span className="bottom-sheet__spec-label">{key}</span>
              <span className="bottom-sheet__spec-value">{value}</span>
            </div>
          ))}
        </div>
        <p className="bottom-sheet__description">{displayProduct.description}</p>
        <button
          className="bottom-sheet__cta"
          onClick={() => onAddToCart(displayProduct)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
