import { useState, useCallback, useEffect } from 'react'
import { KitchenScene } from '../three/KitchenScene'
import { ProductBottomSheet } from '../components/ProductBottomSheet/ProductBottomSheet'
import { useCart } from '../context/CartContext'
import { getProductById, hotspots, productMeshNames } from '../data/products'
import type { Product } from '../data/products'

export function ViewerPage() {
  const { addItem } = useCart()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [focusTarget, setFocusTarget] = useState<{
    position: [number, number, number]
    lookAt: [number, number, number]
  } | null>(null)
  const [resetKey, setResetKey] = useState(0)

  // Listen for "3D View" nav button clicks to reset camera
  useEffect(() => {
    const handleReset = () => {
      setResetKey((k) => k + 1)
      setFocusTarget(null)
      setSelectedProduct(null)
    }
    window.addEventListener('reset-3d-view', handleReset)
    return () => window.removeEventListener('reset-3d-view', handleReset)
  }, [])

  // Hotspot click → pan camera to the product
  const handleHotspotClick = useCallback(
    (hotspotId: string, _productId: string) => {
      const hs = hotspots.find((h) => h.id === hotspotId)
      if (!hs) return
      setFocusTarget({
        position: hs.cameraLookFrom,
        lookAt: hs.cameraTarget,
      })
    },
    []
  )

  // Mesh click → just open the bottom sheet, no camera movement
  const handleMeshClick = useCallback((meshName: string) => {
    const productId = productMeshNames[meshName]
    if (productId) {
      const product = getProductById(productId)
      if (product) {
        setSelectedProduct(product)
      }
    }
  }, [])

  const handleFocusComplete = useCallback(() => {
    setFocusTarget(null)
  }, [])

  const handleAddToCart = useCallback(
    (product: Product) => {
      addItem(product)
      setSelectedProduct(null)
    },
    [addItem]
  )

  return (
    <>
      <KitchenScene
        focusTarget={focusTarget}
        onFocusComplete={handleFocusComplete}
        onHotspotClick={handleHotspotClick}
        onMeshClick={handleMeshClick}
        resetKey={resetKey}
      />

      <ProductBottomSheet
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </>
  )
}
